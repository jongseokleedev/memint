import firestore from '@react-native-firebase/firestore';

const meetingCollection = firestore().collection('Meeting');
//모든 모집중인 미팅 조회
export const getMeetings = async () => {
  return await meetingCollection.where('status', '==', 'open').get();
};

//meetingId로 미팅 조회
export const getMeeting = async meetingId => {
  return await meetingCollection.doc(meetingId).get();
};

//미팅 생성
//title, description, region, peopleNum, meetingTags, meetDate
export const createMeeting = ({hostId, friends, ...rest}) => {
  return meetingCollection.add({
    ...rest,
    hostId: hostId,
    members: [
      {[hostId]: 'accepted'},
      ...friends.map(friend => {
        return {[friend]: 'accepted'};
      }),
    ],
    status: 'open',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

//미팅 대기 추가 (신청)
export const updateWaitingIn = (meetingId, userId) => {
  return meetingCollection.doc(meetingId).update({
    waiting: firestore.FieldValue.arrayUnion(userId),
  });
};

//미팅 대기 삭제 (신청 수락 후 대기에서 빠지기)
export const updateWaitingOut = (meetingId, userId) => {
  return meetingCollection.doc(meetingId).update({
    waiting: firestore.FieldValue.arrayRemove(userId),
  });
};

//미팅 멤버 추가 (신청 수락)
export const updateMembersIn = (meetingId, userId) => {
  return meetingCollection.doc(meetingId).update({
    members: firestore.FieldValue.arrayUnion({[userId]: 'accepted'}),
  });
};

//미팅 멤버 삭제
export const updateMembersOut = (meetingId, userId) => {
  return meetingCollection.doc(meetingId).update({
    members: firestore.FieldValue.arrayRemove({[userId]: 'accepted'}), //accept가 아니라면 삭제하지 못하도록 해야함
  });
};

//미팅 정보 수정
//updateData = {title:..., description:..., ...}
//updateData = {status: 'end'}
export const updateMeeting = (meetingId, updateData) => {
  return meetingCollection.doc(meetingId).update(updateData);
};

//미팅 삭제
export const deleteMeeting = meetingId => {
  return meetingCollection.doc(meetingId).delete();
};

//보상받기
export const changeJoinerToConfirmed = async (meetingId, userId) => {
  return await meetingCollection
    .doc(meetingId)
    .get()
    .then(result => {
      return result.data().members.map(el => {
        return el[userId] ? {[userId]: 'confirmed'} : el;
      });
    })
    .then(result => {
      meetingCollection.doc(meetingId).update({
        members: result,
      });
    });
};

/*
//filter 조회 (peopleNum, meetDate, region)
export const getMeetingsFiltered = async (filterField, filterValue) => {
  return await meetingCollection
    .where('status', '==', 'open')
    .where(filterField, '==', filterValue)
    .get();
};

//filter 조회 (meetingTag)
export const getMeetingsTagsFiltered = async filterTag => {
  return await meetingCollection
    .where('status', '==', 'open')
    .where('meetingTag', 'array-contains', filterTag)
    .get();
};

//정렬 조회 (meetingDate)
export const getMeetingsOrdered = async filterTag => {
  return await meetingCollection
    .where('status', '==', 'open')
    .orderBy('meetingDate', 'desc')
    .get();
};
*/
