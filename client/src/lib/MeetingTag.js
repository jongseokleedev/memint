import firestore from '@react-native-firebase/firestore';

const meetingTagCollection = firestore().collection('MeetingTag');

//모든 MeetingTag 조회
export const getMeetingTags = async () => {
  return await meetingTagCollection.get();
};

//특정 meetingTag 내용 조회
export const getMeetingTag = async tagId => {
  return await meetingTagCollection.doc(tagId).get();
};

//admin
//meetingTag add/update/delete
