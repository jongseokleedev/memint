import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const NFTCollection = firestore().collection('NFT');

export async function getImgUrl() {
  const randNum1 = Math.floor(Math.random() * 3 + 3);
  const randNum2 = Math.floor(Math.random() * 10);
  try {
    const imgUrl = await storage()
      .ref(`/NFTs/dinosaur_nft_0${randNum1}${randNum2}.png`)
      .getDownloadURL();
    return imgUrl;
  } catch (e) {
    console.log(e);
  }
}

//NFT 스키마에 넣을 doc을 create
export function createNFT({userId, nftImg}) {
  return NFTCollection.add({
    userId,
    nftImg,
    isProfile: true,
    isMemin: true,
  });
}

//프로필 렌더링
export async function filterProfile(userId) {
  let query = NFTCollection.where('userId', '==', userId).where(
    'isProfile',
    '==',
    true,
  );
  const profile = await query.get();
  const profileImg = profile.docs.map(doc => doc.data().nftImg);
  return profileImg.toString();
}

//미민이 렌더링
export async function filterMemin(userId) {
  let query = NFTCollection.where('userId', '==', userId).where(
    'isMemin',
    '==',
    true,
  );
  const doc = await query.get();
  const memin = doc.docs.map(doc => doc.data());
  return memin;
}

// 모든 NFT 렌더링
export async function getNFTs(userId) {
  return await NFTCollection.where('userId', '==', userId).get();
}

export function getProfile(nfts) {
  const profile = nfts.filter(el => {
    return el.isProfile === true;
  });

  return profile;
}
export function getMemin(nfts) {
  const memin = nfts.filter(el => {
    return el.isMemin === true;
  });

  return memin;
}
