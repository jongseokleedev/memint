import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('User');

export function createUser({userId, nickName, gender, birth, picture}) {
  // return usersCollection.doc(id).get();
  // console.log(usersCollection);
  const newNickName = nickName ? nickName : '';
  const newGender = gender ? gender : '';
  const newBirth = birth ? birth : '';
  const newPicture = picture ? picture : '';
  return usersCollection.doc(userId).set({
    userId,
    nickName: newNickName,
    gender: newGender,
    birth: newBirth,
    createdAt: firestore.FieldValue.serverTimestamp(),
    picture: newPicture,
    nftProfile: null,
    nftIds: [],
    address: null,
    privateKey: null,
    tokenAmount: 10,
    ethAmount: 0,
    onChainTokenAmount: 0,
    visibleUser: [],
    createdroomId: [],
    joinedroomId: [],
  });
}

export async function getUser(id) {
  const doc = await usersCollection.doc(id).get();
  return doc.data();
}

export async function getOtherUser(id) {
  const doc = await usersCollection.doc(id).get();
  const userDetail = doc.data();

  const userProperty = await getUserProperty(id);

  const otherUser = userDetail && {
    nickName: userDetail.nickName,
    birth: userDetail.birth,
    gender: userDetail.gender,
    nftProfile: userDetail.nftProfile,
    picture: userDetail.picture,
    alcoholType: userProperty[0].alcoholType,
    drinkStyle: userProperty[0].drinkStyle,
    drinkCapa: userProperty[0].drinkCapa,
  };
  return otherUser;
}

export async function getUserProperty(id) {
  const doc = await usersCollection.doc(id).collection('Property').get();
  const property = doc.docs.map(doc => doc.data());

  return property;
}

export function createProperty({userId, drinkCapa, drinkStyle, alcoholType}) {
  return usersCollection.doc(userId).collection('Property').add({
    drinkCapa,
    drinkStyle,
    alcoholType,
  });
}

export function createUserNFT({userId, nftProfile, nftId}) {
  return usersCollection.doc(userId).update({
    nftProfile: nftProfile,
    nftIds: firestore.FieldValue.arrayUnion(nftId),
  });
}
export function updateTokenAmount(userId, balance) {
  return usersCollection.doc(userId).update({
    tokenAmount: balance,
  });
}

//Update cretedroomId, joinedroomId
//userId, 'createdroomId', meetingId
//userId, 'joinedroomId', meetingId
export function updateUserMeetingIn(id, field, value) {
  return usersCollection
    .doc(id)
    .update({[field]: firestore.FieldValue.arrayUnion(value)});
}

export function updateUserMeetingOut(id, field, value) {
  return usersCollection
    .doc(id)
    .update({[field]: firestore.FieldValue.arrayRemove(value)});
}

//nickname으로 User 검색
export async function getUserByNickname(str, loginUser) {
  const strlength = str.length;
  const strFrontCode = str.slice(0, strlength - 1);
  const strEndCode = str.slice(strlength - 1, str.length);
  const endCode =
    strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
  const res = await usersCollection
    .where('nickName', '>=', str)
    .where('nickName', '<', endCode)
    .get();
  const data = res.docs.map(el => {
    if (el.id !== loginUser) {
      return {...el.data(), id: el.id};
    }
  });
  return data.filter(el => el !== undefined);
}

export async function addVisibleUser(id, value) {
  return usersCollection
    .doc(id)
    .update({visibleUser: firestore.FieldValue.arrayUnion(value)});
}
