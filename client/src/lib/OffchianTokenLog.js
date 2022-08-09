import firestore from '@react-native-firebase/firestore';

export const NFTCollection = firestore().collection('NFT');

export async function getOffchainTokenLog(userId) {
  const offchainTokenLog = await firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .orderBy('createdAt', 'desc')
    .get();

  return offchainTokenLog;
}

export function createSpendOffTxLg(userId, amount, txType, balance) {
  firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .add({
      amount,
      txType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      from: userId,
      to: 'serverId',
      balance: balance - amount,
    });

  firestore()
    .collection('User')
    .doc(userId)
    .update({
      tokenAmount: balance - amount,
    });
}

export function createEarnOffTxLg(userId, amount, txType, balance) {
  firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .add({
      amount,
      txType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      from: 'serverId',
      to: userId,
      balance,
    });
  firestore()
    .collection('User')
    .doc(userId)
    .update({
      tokenAmount: balance + amount,
    });
}
