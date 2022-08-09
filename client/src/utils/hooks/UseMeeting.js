import {useSelector} from 'react-redux';

export function useMeeting() {
  return useSelector(state => state.meeting.rooms); //state.auth.user자리에 slice에서 선언한 state를 채워줌
}
