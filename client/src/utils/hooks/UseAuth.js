import {useSelector} from 'react-redux';

export default function useAuth() {
  return useSelector(state => state.auth.auth); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}
