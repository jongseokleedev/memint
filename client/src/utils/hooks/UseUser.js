import {useSelector} from 'react-redux';

export default function useUser() {
  return useSelector(state => state.auth.user); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}
