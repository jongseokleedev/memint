import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null, //관리할 state 초기값 설정
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authorize(state, action) {
      state.auth = action.payload;
    },
    logout(state) {
      state.auth = null;
    },
  },
});

export default authSlice.reducer;
export const { authorize, logout } = authSlice.actions;
