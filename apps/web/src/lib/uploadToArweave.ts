import { METADATA_WORKER_URL } from '@lensshare/data/constants';
import { Errors } from '@lensshare/data/errors';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Uploads the given data to Arweave.
 *
 * @param data The data to upload.
 * @returns The Arweave transaction ID.
 * @throws An error if the upload fails.
 */
const uploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios.post(METADATA_WORKER_URL, { ...data });
    const { id }: { id: string } = upload?.data;

    return id;
  } catch {
    toast.error(Errors.SomethingWentWrong);
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default uploadToArweave;
