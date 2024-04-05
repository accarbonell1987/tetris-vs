import axios from 'axios';

import { GetRandomWordFromArrayAndLength } from '../../utils/random';
import { ConvertToBase64 } from '../../utils/images';
import { Chars } from '../../common/constants';

const api = 'https://api.multiavatar.com/';

export const fetchAvatar = async code => {
  const endpoint = `${api}${code}`;
  try {
    const response = await axios.get(endpoint, { timeout: 2000 });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchRandomAvatars = async amount => {
  try {
    const responses = [];

    const request = {
      retry: 0,
      limits: 10
    };

    let index = 0;
    while (index < amount && request.retry <= request.limits) {
      const code = GetRandomWordFromArrayAndLength(Chars, amount);
      const response = await fetchAvatar(code);
      if (response.status === 200) {
        const image = ConvertToBase64(response?.data);
        responses[index++] = image;
      } else request.retry++;
    }

    return responses;
  } catch (error) {
    throw Error('Error fetch Randoms Avatars');
  }
};
