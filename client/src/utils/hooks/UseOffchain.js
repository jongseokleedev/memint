import {useSelector} from 'react-redux';

export function useOfftxlog() {
  return useSelector(state => state.offchain.offtxlog); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}
