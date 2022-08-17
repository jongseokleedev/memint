import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {authApp} from '../firebase'

export const signin = (input) => {
  return signInWithEmailAndPassword(authApp, input.email, input.password)
    .then((userConfidential) => {
      return userConfidential.user;
    })
    .catch((err) => {
      if (err.message === "Firebase: Error (auth/invalid-email).") {
        alert("유효하지 않은 이메일입니다.");
      } else if (err.message === "Firebase: Error (auth/wrong-password).") {
        alert("잘못된 비밀번호입니다.");
      } else if (err.message === "Firebase: Error (auth/user-not-found).") {
        alert("존재하지 않는 사용자입니다.");
      }
    });
};

export const signout = () => {
  return signOut(authApp);
};
