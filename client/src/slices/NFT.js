import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  NFT: null,
  profileImgUrl: null,
  meminImgUrl: null,
};

const nftSlice = createSlice({
  name: 'nft', // slice 이름 설정. 이 이름을 slices/index.js파일에 추가해 줘야함.
  initialState,
  reducers: {
    // state 변화할 action 이름 선언

    saveNFT(state, action) {
      state.NFT = action.payload;
    },
    setNftProfile(state, action) {
      state.profileImgUrl = action.payload;
    },
    setMemin(state, action) {
      state.meminImgUrl = action.payload;
    },
  },
});

export default nftSlice.reducer;
export const {saveNFT, setNftProfile, setMemin} = nftSlice.actions;
