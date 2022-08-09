import firestore from '@react-native-firebase/firestore';

const meetingCollection = firestore().collection('Meeting');

// userId를 받아 본인의 status를 fixed로 바꿔주는 함수
// 통째로 바꿔주는 것 밖에는 답이 없는것인가..
export const changeJoinerState = async (meetingId, user, setModalVisible) => {
  const userId = user.id;
  return await meetingCollection
    .doc(meetingId)
    .get()
    .then(result => {
      return result.data().members.map(el => {
        return el[userId] ? {[userId]: 'fixed'} : el;
      });
    })
    .then(result => {
      meetingCollection.doc(meetingId).update({
        members: result,
      }),
        setModalVisible(false);
      return 'runModal';
    });
};

// meeintgId를 받아 Meeting의 status를 fixed로 바꿔주는 함수
// spendingModal에서 토큰 차감이 완료된 후에 실행되어야한다.
export const changeMeetingState = async meetingId => {
  return await meetingCollection.doc(meetingId).update({
    status: 'fixed',
  });
};
