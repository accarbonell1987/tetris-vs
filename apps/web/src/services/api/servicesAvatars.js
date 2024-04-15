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
import enfp from '../../assets/avatars/enfp.svg';
import geve from '../../assets/avatars/geve.svg';

const api = 'https://api.multiavatar.com/';
const avatars = [
  { key: 'bxon', value: bxon },
  { key: 'cxml', value: cxml },
  { key: 'nqto', value: nqto },
  { key: 'quvm', value: quvm },
  { key: 'spyq', value: spyq },
  { key: 'xevc', value: xevc },
  { key: 'enfp', value: enfp },
  { key: 'geve', value: geve }
];

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
    const codes = [];

    const request = {
      retry: 0,
      limits: 10
    };

    // fetch a la api hasta que se alcance el retry
    let index = 0;
    while (index < amount && request.retry <= request.limits) {
      const code = GetRandomWordFromArrayAndLength(Chars, 4);
      const response = await fetchAvatar(code);

      if (response.status === 200) {
        const base64 = ConvertToBase64(response?.data);
        const image = GetImage(base64);

        responses[index++] = image;
        codes.push(code);
      } else {
        request.retry++;
      }
    }

    // escoger los avatares de la lista estatica
    while (index < amount) {
      const element = GetRandomElementFromList(avatars);

      if (!codes.some(p => p === element.key)) {
        responses.push(element.value);
        codes.push(element.key);
        index++;
      }
    }

    return responses;
  } catch (error) {
    console.log('Error fetch Randoms Avatars');
  }
};
