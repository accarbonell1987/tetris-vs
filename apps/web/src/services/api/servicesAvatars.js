import axios from 'axios';

import { GetRandomWordFromArrayAndLength } from '../../utils/random';
import { ConvertToBase64 } from '../../utils/images';
import { Chars } from '../../common/constants';

const api = 'https://api.multiavatar.com/';

export const fetchRandomAvatars = async ({ amount }) => {
  try {
    const avatars = [];

    for (let index = 0; index < amount; index++) {
      const avatarName = GetRandomWordFromArrayAndLength(Chars, amount);
      const endpoint = `${api}${avatarName}`;
      const { data } = await axios.get(endpoint, { timeout: 2000 });

      const image = ConvertToBase64(data);
      avatars[index] = image;
    }

    console.log('🚀 ~ fetchRandomAvatars ~ avatars:', avatars);
    return avatars;
  } catch (error) {
    console.log(error);
    return error;
  }
};
