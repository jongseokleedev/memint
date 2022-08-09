import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  offtxlog: null,
};

const offchainSlice = createSlice({
  name: 'offchain', // slice 이름 설정. 이 이름을 slices/index.js파일에 추가해 줘야함.
  initialState,
  reducers: {
    // state 변화할 action 이름 선언

    addLog(state, action) {
      state.offtxlog = action.payload;
    },
  },
});

export default offchainSlice.reducer;
export const {addLog} = offchainSlice.actions;
