import firestore from '@react-native-firebase/firestore';

export async function getOnchainTokenLog(userId) {
  const onchainTokenLog = await firestore()
    .collection('User')
    .doc(userId)
    .collection('OnchainTokenLog')
    .orderBy('createdAt', 'desc')
    .get();

  return onchainTokenLog;
}
