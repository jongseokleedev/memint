import firestore from '@react-native-firebase/firestore';

const meetingCollection = firestore().collection('Meeting');
const userCollection = firestore().collection('User');
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

//미팅 멤버 삭제 - accepted 일 때만
export const updateMembersOut = (meetingId, userId) => {
  return meetingCollection.doc(meetingId).update({
    members: firestore.FieldValue.arrayRemove({[userId]: 'accepted'}), //accept가 아니라면 삭제하지 못하도록 해야함
  });
};

//미팅 멤버 삭제 - merber의 status가 accepted, fixed일 때
export const memberOut = async (meetingId, members, userId, status) => {
  const theRestMember = members.filter(el => {
    return Object.keys(el)[0] !== userId;
  });
  if (status === 'full') {
    await meetingCollection.doc(meetingId).update({
      members: theRestMember,
      status: 'open',
    });
  } else {
    await meetingCollection.doc(meetingId).update({
      members: theRestMember,
    });
  }

  return await userCollection
    .doc(userId)
    .get()
    .then(async result => {
      const theRestRoom = result.data().joinedroomId.filter(el => {
        return el !== meetingId;
      });
      if (theRestRoom.length === 0) {
        await userCollection.doc(userId).update({
          joinedroomId: [],
        });
      } else {
        await userCollection.doc(userId).update({
          joinedroomId: theRestRoom,
        });
      }
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

// Feedback collection에 관련 정보를 추가하는 함수
export const addFeedbackDoc = async (userId, meetingId, member) => {
  return await firestore()
    .collection('User')
    .doc(userId)
    .collection('Feedback')
    .doc(meetingId)
    .get()
    .then(async result => {
      const others = member
        .filter(el => {
          return el[2] !== userId;
        })
        .reduce((acc, cur) => {
          return {...acc, [cur[2]]: false};
        }, 0);
      // user의 Feedback collection에 meetingId와 같은 Id를 가진 document가 있는지 확인한다.

      // 없다면, 아직 feedback 페이지에 들어가지 않았다는 의미이므로, document를 만들어준다.
      // 그 형식은 {
      //    completed : false
      //    (나를 제외한) user1Id : false
      //    (나를 제외한) user2Id : false
      //    ...
      // } 으로 구성된다.
      // 이후 각각의 user에게 feedback을 전송하면 userId : true 가 되고, 최종 완료를 누르면 meetingId : true가 된다.
      if (result.data() === undefined) {
        return await firestore()
          .collection('User')
          .doc(userId)
          .collection('Feedback')
          .doc(meetingId)
          .set({
            completed: false,
            ...others,
          })
          .then(() => {
            return 'qualified';
          });
      }

      // 있다면, completed : true / false 인지 확인하고 false이면 qualified, true이면 unqulified를 리턴한다.
      else {
        if (result.data().completed === false) {
          return 'qualified';
        } else {
          return 'unqulified';
        }
      }
    });
};

export const sendFeedback = async (meetingId, receiver, owner, form) => {
  if (form.visible === true) {
    console.log('good');
    await userCollection.doc(receiver).collection('Alarm').add({
      type: 'feedback',
      sender: owner,
      message: form.message,
      createdAt: firestore.Timestamp.now(),
      meetingId,
      emotion: form.emotion,
    });
  }

  await userCollection.doc(receiver).collection('Receivedfeedback').add({
    sender: form.sender,
    emotion: form.emotion,
    message: form.message,
  });

  // receiver에게 보내는 로직 추가
  return userCollection
    .doc(owner)
    .collection('Feedback')
    .doc(meetingId)
    .update({
      [receiver]: true,
    });
};

export const setFeedbackEnd = (meetingId, owner) => {
  return userCollection
    .doc(owner)
    .collection('Feedback')
    .doc(meetingId)
    .update({completed: true});
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
