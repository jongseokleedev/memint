import axios from '.';

export const createWallet = async body => {
  axios.post('/auth/register', body);
};

export const ETHToLCN = async body => {
  return axios.post('/wallet/ETHToLCN', body).then(result => {
    return result;
  });
};

export const LCNToETH = async body => {
  return axios.post('wallet/LCNToETH', body).then(result => {
    return result;
  });
};

export const toOffChain = async body => {
  return axios.post('wallet/toOffChain', body).then(result => {
    return result;
  });
};
export const toOnChain = async body => {
  return axios.post('wallet/toOnChain', body).then(result => {
    return result;
  });
};

export const transferETH = async body => {
  return axios.post('wallet/transferETH', body).then(result => {
    return result;
  });
};

export const transferLCN = async body => {
  return axios.post('wallet/transferLCN', body).then(result => {
    return result;
  });
};

export const getBalance = async body => {
  return axios.post('wallet/getBalance', body).then(result => {
    return result.data;
  });
};
