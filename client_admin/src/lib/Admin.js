import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function createEarnOffTxLg(userId, amount, txType) {
  const userRef = doc(db, "User", userId);
  const userData = await getDoc(userRef);
  const tokenLogRef = collection(db, "User", userId, "OffchainTokenLog");
  await addDoc(tokenLogRef, {
    amount,
    txType,
    createdAt: Timestamp.now(),
    from: "serverId",
    to: userId,
    balance: userData.data().tokenAmount,
  });
  await updateDoc(userRef, {
    tokenAmount: userData.data().tokenAmount + amount,
  });
}
