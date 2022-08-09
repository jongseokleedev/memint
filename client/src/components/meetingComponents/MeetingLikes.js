import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useUser from '../../utils/hooks/UseUser';
import {TouchableOpacity} from 'react-native';
import {updateUserMeetingIn, updateUserMeetingOut} from '../../lib/Users';
import useAuthActions from '../../utils/hooks/UseAuthActions';

function MeetingLikes({meetingId}) {
  const [likes, setLikes] = useState(false);
  const {saveInfo} = useAuthActions();
  const userInfo = useUser();
  useEffect(() => {
    if (
      userInfo?.likesroomId &&
      userInfo?.likesroomId.indexOf(meetingId) !== -1
    ) {
      setLikes(true);
    } else {
      setLikes(false);
    }
  }, [userInfo?.likesroomId, meetingId]);
  const handleLikes = () => {
    if (likes) {
      //likes에서 빼는 쿼리 + 리덕스
      updateUserMeetingOut(userInfo.id, 'likesroomId', meetingId)
        .then(() => {
          setLikes(false);
          saveInfo({
            ...userInfo,
            likesroomId: userInfo.likesroomId.filter(el => el !== meetingId),
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      //likes에 추가하는 쿼리 + 리덕스
      updateUserMeetingIn(userInfo.id, 'likesroomId', meetingId)
        .then(() => {
          setLikes(true);
          saveInfo({
            ...userInfo,
            likesroomId: [...userInfo.likesroomId, meetingId],
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  return (
    <TouchableOpacity onPress={handleLikes}>
      {likes ? (
        <Icon name="star" size={20} />
      ) : (
        <Icon name="star-border" size={20} />
      )}
    </TouchableOpacity>
  );
}

export default MeetingLikes;
