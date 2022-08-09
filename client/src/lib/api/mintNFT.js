import axios from '.';

export const mintNFT = async body => {
  return axios.post('/mintNFT', body).then(result => {
    return result;
  });
};
