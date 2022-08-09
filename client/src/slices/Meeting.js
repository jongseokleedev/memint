import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rooms: null,
};

const meetingSlice = createSlice({
  name: 'meeting', // slice 이름 설정. 이 이름을 slices/index.js파일에 추가해 줘야함.
  initialState,
  reducers: {
    // state 변화할 action 이름 선언
    saveMeeting(state, action) {
      state.rooms = action.payload;
    },
  },
});

export default meetingSlice.reducer;
export const {saveMeeting} = meetingSlice.actions;
