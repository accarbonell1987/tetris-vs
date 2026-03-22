import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchRandomAvatars } from '../../src/services/api/servicesAvatars.js';
import axios from 'axios';
import { GetRandomWordFromArrayAndLength, GetRandomElementFromList } from '../../src/utils/random.js';
import { ConvertToBase64, GetImage } from '../../src/utils/images.js';


// Mock axios
vi.mock('axios');
// Mock utility modules (hoisted)
vi.mock('../../src/utils/random.js', () => ({
  GetRandomWordFromArrayAndLength: vi.fn(() => 'abcd'),
  GetRandomElementFromList: vi.fn(list => list[0]),
}));
vi.mock('../../src/utils/images.js', () => ({
  ConvertToBase64: vi.fn(() => 'base64string'),
  GetImage: vi.fn(() => 'imageObject'),
}));
vi.mock('../../src/common/constants.js', () => ({
  Chars: ['a', 'b', 'c', 'd'],
}));
vi.mock('../../src/config/constants.js', () => ({
  AVATAR_RETRY_LIMIT: 10,
}));

// Mock static avatar imports (default exports)
vi.mock('../../src/assets/avatars/bxon.svg', () => ({ default: 'bxon.svg' }));
vi.mock('../../src/assets/avatars/cxml.svg', () => ({ default: 'cxml.svg' }));
vi.mock('../../src/assets/avatars/nqto.svg', () => ({ default: 'nqto.svg' }));
vi.mock('../../src/assets/avatars/quvm.svg', () => ({ default: 'quvm.svg' }));
vi.mock('../../src/assets/avatars/spyq.svg', () => ({ default: 'spyq.svg' }));
vi.mock('../../src/assets/avatars/xevc.svg', () => ({ default: 'xevc.svg' }));
vi.mock('../../src/assets/avatars/enfp.svg', () => ({ default: 'enfp.svg' }));
vi.mock('../../src/assets/avatars/geve.svg', () => ({ default: 'geve.svg' }));

describe('fetchRandomAvatars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocked functions
    GetRandomWordFromArrayAndLength.mockReturnValue('abcd');
    ConvertToBase64.mockReturnValue('base64string');
    GetImage.mockReturnValue('imageObject');
    // Mock GetRandomElementFromList to return distinct elements each call
    let callCount = 0;
    GetRandomElementFromList.mockImplementation((list) => {
      const index = callCount % list.length;
      callCount++;
      return list[index];
    });
  });

  test('returns requested amount when all API calls succeed', async () => {
    // Mock axios.get to return success
    vi.mocked(axios.get).mockResolvedValue({ status: 200, data: '<svg>avatar</svg>' });

    const avatars = await fetchRandomAvatars(3);
    expect(avatars).toHaveLength(3);
    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(GetRandomElementFromList).not.toHaveBeenCalled(); // no fallback
  });

  test('retries on API failure and succeeds before limit', async () => {
    // Simulate 2 failures then success for each of 2 avatars
    vi.mocked(axios.get)
      .mockResolvedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ status: 200, data: '<svg>1</svg>' })
      .mockResolvedValueOnce({ status: 200, data: '<svg>2</svg>' });

    const avatars = await fetchRandomAvatars(2);
    expect(avatars).toHaveLength(2);
    expect(axios.get).toHaveBeenCalledTimes(4); // 2 failures, 2 successes
    expect(GetRandomElementFromList).not.toHaveBeenCalled();
  });

  test('uses fallback avatars when retry limit reached', async () => {
    // Mock all API calls to fail (status not 200)
    vi.mocked(axios.get).mockResolvedValue({ status: 404 });

    const avatars = await fetchRandomAvatars(5);
    // Should have returned 5 static avatars after 10 retries (limit)
    expect(avatars).toHaveLength(5);
    // axios.get called exactly AVATAR_RETRY_LIMIT times (10)
    expect(axios.get).toHaveBeenCalledTimes(10);
    // GetRandomElementFromList called for each fallback slot (5 times)
    expect(GetRandomElementFromList).toHaveBeenCalledTimes(5);
  });

  test('returns dense array (no undefined holes)', async () => {
    vi.mocked(axios.get).mockResolvedValue({ status: 200, data: '<svg>ok</svg>' });
    const avatars = await fetchRandomAvatars(4);
    expect(avatars).toHaveLength(4);
    avatars.forEach(avatar => {
      expect(avatar).toBeDefined();
      expect(avatar).not.toBeNull();
    });
  });

  test('handles error in outer try-catch', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const avatars = await fetchRandomAvatars(2);
    // Should log error and return undefined? Actually function returns undefined when catch block runs.
    expect(avatars).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('Error fetch Randoms Avatars');
    consoleSpy.mockRestore();
  });
});