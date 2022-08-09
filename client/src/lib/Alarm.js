import firestore from '@react-native-firebase/firestore';

const alarmCollection = firestore().collection('Alarm');

//userId로 모든 알림 조회
export const getAlarmsById = async userId => {
  return await alarmCollection.where('receiver', '==', userId).get();
};

//alarmId로 알림 조회
export const getAlarm = async alarmId => {
  return await alarmCollection.doc(alarmId).get();
};

//미팅 신청 알림 생성
//sender, receiver, meetingId, message
export const createMeetingProposal = ({...data}) => {
  return alarmCollection.add({
    type: 'proposal',
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
    complete: false,
  });
};

//미팅 수락 알림 생성
//sender, receiver, meetingId
export const createMeetingAccept = ({...data}) => {
  return alarmCollection.add({
    type: 'accept',
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

//미팅 수락 시 신청 알림에 대해 완료 상태로 update
export const updateMeetingProposal = alarmId => {
  return alarmCollection.doc(alarmId).update({complete: true});
};

//delete
// export const deleteAlarm = alarmId => {
//   return alarmCollection.doc(alarmId).delete();
// };
