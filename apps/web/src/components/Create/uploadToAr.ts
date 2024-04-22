import type {
  AudioMetadata,
  LinkMetadata,
  LiveStreamMetadata,
  ProfileMetadata,
  TextOnlyMetadata,
  VideoMetadata
} from '@lens-protocol/metadata'

import axios from 'axios'


import { METADATA_WORKER_URL } from '@lensshare/data/constants'
import logger from '@lensshare/lib/logger'

export const uploadToAr = async (
  data:
    | VideoMetadata
    | AudioMetadata
    | ProfileMetadata
    | TextOnlyMetadata
    | LinkMetadata
    | LiveStreamMetadata
): Promise<string> => {
  try {
    const response = await axios.post(METADATA_WORKER_URL, data)
    const { id } = response.data
    return `ar://${id}`
  } catch (error) {
    logger.error('[Error AR Metadata Upload]')
    throw new Error('[Error AR Metadata Upload]')
  }
}
