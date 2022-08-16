import {useSelector} from 'react-redux';

export function useOnKlaytxlog() {
  return useSelector(state => state.onchain.onKlaytxlog); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}

export function useOnLCNtxlog() {
  return useSelector(state => state.onchain.onLCNtxlog); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}
