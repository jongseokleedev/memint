import firestore from '@react-native-firebase/firestore';

export async function getOnchainKlayLog(userId) {
  const onchainKlayLog = await firestore()
    .collection('User')
    .doc(userId)
    .collection('OnchainKlayLog')
    .orderBy('createdAt', 'desc')
    .get();

  return onchainKlayLog;
}
