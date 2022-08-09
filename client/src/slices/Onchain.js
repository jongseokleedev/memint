import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  onETHtxlog: null,
  onLCNtxlog: null,
};

const onchainSlice = createSlice({
  name: 'onchain', // slice 이름 설정. 이 이름을 slices/index.js파일에 추가해 줘야함.
  initialState,
  reducers: {
    // state 변화할 action 이름 선언

    addEthLog(state, action) {
      state.onETHtxlog = action.payload;
    },
    addLcnLog(state, action) {
      state.onLCNtxlog = action.payload;
    },
  },
});

export default onchainSlice.reducer;
export const {addEthLog, addLcnLog} = onchainSlice.actions;
