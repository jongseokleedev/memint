import {useDispatch} from 'react-redux';
import {useMemo} from 'react';
import {bindActionCreators} from 'redux';
import {saveMeeting} from '../../slices/Meeting';

export default function useMeetingActions() {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators({saveMeeting}, dispatch), //authorize, logout자리에 action이름 선언
    [dispatch],
  );
}
