import firestore from '@react-native-firebase/firestore';

export async function getOnchainEthLog(userId) {
  const onchainEthLog = await firestore()
    .collection('User')
    .doc(userId)
    .collection('OnchainEthLog')
    .orderBy('createdAt', 'desc')
    .get();

  return onchainEthLog;
}
