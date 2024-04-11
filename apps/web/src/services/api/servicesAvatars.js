import axios from 'axios';

import { GetRandomElementFromList, GetRandomWordFromArrayAndLength } from '../../utils/random';
import { ConvertToBase64, GetImage } from '../../utils/images';
import { Chars } from '../../common/constants';

import bxon from '../../assets/avatars/bxon.svg';
import cxml from '../../assets/avatars/cxml.svg';
import nqto from '../../assets/avatars/nqto.svg';
import quvm from '../../assets/avatars/quvm.svg';
import spyq from '../../assets/avatars/spyq.svg';
import xevc from '../../assets/avatars/xevc.svg';

const api = 'https://api.multiavatar.com/';
const avatars = [bxon, cxml, nqto, quvm, spyq, xevc];

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
        const base64 = ConvertToBase64(response?.data);
        const image = GetImage(base64);

        responses[index++] = image;
      } else {
        request.retry++;
      }
    }

    if (responses.length < 4) {
      for (let index = responses.length; index < amount; index++) {
        const any = GetRandomElementFromList(avatars);
        responses.push(any);
      }
    }

    return responses;
  } catch (error) {
    throw Error('Error fetch Randoms Avatars');
  }
};
