import {useSelector} from 'react-redux';

export function useMeeting() {
  return useSelector(state => state.meeting);
}
