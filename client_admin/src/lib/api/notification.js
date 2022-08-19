import axios from '.';

export const notification = async body => {
  return axios.post('/notification', body).then(result => {
    return result;
  });
};
