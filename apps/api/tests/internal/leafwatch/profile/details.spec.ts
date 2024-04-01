import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/leafwatch/profile/details', () => {
  test('should return profile details', async () => {
    const response = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/details`,
      { params: { id: '0x0d' } }
    );

    expect(response.data.result.actor).toEqual('0x0d');
  });

  test('should not return profile details', async () => {
    const response = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/details`,
      { params: { id: '0x00' } }
    );

    expect(response.data.result).toBeNull();
  });
});
