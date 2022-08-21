import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('User');

export function createUser({userId, email, nickName, gender, birth, picture}) {
  // return usersCollection.doc(id).get();
  // console.log(usersCollection);
  const newNickName = nickName ? nickName : '';
  const newGender = gender ? gender : '';
  const newBirth = birth ? birth : '';
  const newPicture = picture ? picture : '';
  return usersCollection.doc(userId).set({
    userId,
    email: email,
    nickName: newNickName,
    gender: newGender,
    birth: newBirth,
    createdAt: firestore.FieldValue.serverTimestamp(),
    picture: newPicture,
    nftProfile: null,
    phoneNumber: '',
    nftIds: [],
    address: null,
    privateKey: null,
    tokenAmount: 10,
    klayAmount: 0,
    onChainTokenAmount: 0,
    visibleUser: [],
    createdroomId: [],
    joinedroomId: [],
    likesroomId: [],
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

export function createPhoneNumber({userId, phoneNumber}) {
  return usersCollection.doc(userId).update({
    phoneNumber: phoneNumber,
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

//Update cretedroomId, joinedroomId, likesroomId
//userId, 'createdroomId', meetingId
//userId, 'joinedroomId', meetingId
//userId, 'likesroomId', meetingId
export async function updateUserMeetingIn(id, field, value, nickName, status) {
  if (nickName && status) {
    const obj = {
      createdAt: firestore.FieldValue.serverTimestamp(),
      status,
      nickName,
    };
    await firestore()
      .collection('Meeting')
      .doc(value)
      .collection('Messages')
      .add(obj);
  }
  return usersCollection
    .doc(id)
    .update({[field]: firestore.FieldValue.arrayUnion(value)});
}

export async function updateUserMeetingOut(id, field, value, nickName, status) {
  // 나가기 전에 메시지 보내고 나가기
  if (nickName && status) {
    const obj = {
      createdAt: firestore.FieldValue.serverTimestamp(),
      status,
      nickName,
    };
    await firestore()
      .collection('Meeting')
      .doc(value)
      .collection('Messages')
      .add(obj);
  }
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

export async function getUserByPhoneNumber(phoneNumber) {
  console.log({phoneNumber});
  const res = await usersCollection
    .where('phoneNumber', '==', phoneNumber)
    .get();
  console.log({res});
  if (res.docs.length === 0) {
    return 'NA';
  } else {
    return res.docs[0]._data.email;
  }
}

export async function addVisibleUser(id, value) {
  return usersCollection
    .doc(id)
    .update({visibleUser: firestore.FieldValue.arrayUnion(value)});
}

export const saveTokenToDatabase = async (token, userId) => {
  await firestore()
    .collection('User')
    .doc(userId)
    .update({
      deviceTokens: firestore.FieldValue.arrayUnion(token),
    });
};

export const deleteTokenFromDatabase = async (token, userId) => {
  await firestore()
    .collection('User')
    .doc(userId)
    .update({
      deviceTokens: firestore.FieldValue.arrayRemove(token),
    });
};
