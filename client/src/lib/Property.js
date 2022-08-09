import firestore from '@react-native-firebase/firestore';

export const propertyCollection = firestore().collection('Property');

export function createUser({userId, nickName, gender, birth, picture}) {
  // return usersCollection.doc(id).get();
  // console.log(usersCollection);
  return propertyCollection.doc(userId).set({
    userId,
    nickName,
    gender,
    birth,
    createdAt: firestore.FieldValue.serverTimestamp(),
    picture,
  });
}

export async function getProperty(id) {
  const doc = await propertyCollection.doc(id).get();
  return doc.data();
}
