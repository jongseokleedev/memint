import {useDispatch} from 'react-redux';
import {addLog} from '../../slices/Offchain';
import {useMemo} from 'react';
import {bindActionCreators} from 'redux';

export default function useOffchainActions() {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators({addLog}, dispatch), //authorize, logout자리에 action이름 선언
    [dispatch],
  );
}
