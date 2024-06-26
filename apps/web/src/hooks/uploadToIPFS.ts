import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import {
  EVER_ENDPOINT,
  EVER_REGION,
  S3_BUCKET,
  STS_GENERATOR_WORKER_URL
} from '@lensshare/data/constants';
import logger from '@lensshare/lib/logger';

import axios from 'axios';
import type { IPFSUploadResult } from 'src/types/custom-types';
import { v4 as uuidv4 } from 'uuid';

const everland = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const token = await axios.get(`${STS_GENERATOR_WORKER_URL}/token`);
    const client = new S3({
      endpoint: EVER_ENDPOINT,
      region: EVER_REGION,
      credentials: {
        accessKeyId: token.data?.accessKeyId,
        secretAccessKey: token.data?.secretAccessKey,
        sessionToken: token.data?.sessionToken
      },
      maxAttempts: 10
    });
    client.middlewareStack.addRelativeTo(
      (next: Function) => async (args: any) => {
        const { response } = await next(args);
        if (response.body == null) {
          response.body = new Uint8Array();
        }
        return {
          response
        };
      },
      {
        name: 'nullFetchResponseBodyMiddleware',
        toMiddleware: 'deserializerMiddleware',
        relation: 'after',
        override: true
      }
    );
    const fileKey = uuidv4();
    const params = {
      Bucket: S3_BUCKET.LENSSHARE,
      Key: fileKey,
      Body: file,
      ContentType: file.type
    };
    const task = new Upload({
      client,
      params
    });
    task.on('httpUploadProgress', (e) => {
      const loaded = e.loaded ?? 0;
      const total = e.total ?? 0;
      const progress = (loaded / total) * 100;
      onProgress?.(Math.round(progress));
    });
    await task.done();
    const result = await client.headObject(params);
    const metadata = result.Metadata;
    return {
      url: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type
    };
  } catch (error) {
    logger.error('[Error IPFS3 Media Upload]');
    return {
      url: '',
      type: file.type
    };
  }
};

export const uploadToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<IPFSUploadResult> => {
  const { url, type } = await everland(file, onProgress);
  return { url, type };
};
