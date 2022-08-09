import {useSelector} from 'react-redux';

export function useNft() {
  return useSelector(state => state.nft.NFT); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}

export function useNftProfile() {
  return useSelector(state => state.nft.profileImgUrl); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}

export function useMemin() {
  return useSelector(state => state.nft.meminImgUrl); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}
