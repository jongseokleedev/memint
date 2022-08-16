import {useDispatch} from 'react-redux';
import {addKlayLog, addLcnLog} from '../../slices/Onchain';
import {useMemo} from 'react';
import {bindActionCreators} from 'redux';

export default function useOnchainActions() {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators({addKlayLog, addLcnLog}, dispatch), //authorize, logout자리에 action이름 선언
    [dispatch],
  );
}
