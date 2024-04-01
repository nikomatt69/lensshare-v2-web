import getAuthApiHeadersForTest from '@lensshare/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('live/create', () => {
  test('should return created live stream', async () => {
    const response = await axios.post(
      `${TEST_URL}/live/create`,
      { record: true },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.result.createdByTokenName).toEqual('Hey Live');
  });
});
