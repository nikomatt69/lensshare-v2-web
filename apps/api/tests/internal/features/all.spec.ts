import getAuthApiHeadersForTest from '@lensshare/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/all', () => {
  test('should return all features', async () => {
    const response = await axios.get(`${TEST_URL}/internal/features/all`, {
      headers: await getAuthApiHeadersForTest()
    });

    expect(response.data.features).toBeInstanceOf(Array);
  });
});
