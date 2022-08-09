import {useDispatch} from 'react-redux';
import {saveNFT, setNftProfile, setMemin} from '../../slices/NFT';
import {useMemo} from 'react';
import {bindActionCreators} from 'redux';

export default function useNftActions() {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators({saveNFT, setNftProfile, setMemin}, dispatch), //authorize, logout자리에 action이름 선언
    [dispatch],
  );
}
