import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import {createMeetingAccept, updateMeetingProposal} from '../../lib/Alarm';
import {
  updateMeeting,
  updateMembersIn,
  updateWaitingOut,
} from '../../lib/Meeting';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {updateUserMeetingIn} from '../../lib/Users';
import {handleBirth, handleDateInFormat} from '../../utils/common/Functions';
import DoubleModal from '../../components/common/DoubleModal';
import UserInfoModal from '../../components/common/UserInfoModal';
import knowmore from '../../assets/icons/knowmore.png';
import befriend from '../../assets/icons/befriend.png';
import fallinlove from '../../assets/icons/fallinlove.png';
import soso from '../../assets/icons/soso.png';
import notgood from '../../assets/icons/notgood.png';
import terrible from '../../assets/icons/terrible.png';

function AlarmDetail({route}) {
  const userInfo = useUser();
  const {alarm} = route.params;
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const visibleList = userInfo.visibleUser;

  const [userId, setUserId] = useState('');

  const checkIsVisible = user => {
    // console.log({userInfo})
    // console.log(visibleList)
    if (!visibleList) return false;
    if (visibleList.indexOf(user) !== -1) {
      return true;
    }
    return false;
  };
  const handleAccept = () => {
    const data = {
      sender: userInfo.id, //로그인된 유저,
      receiver: alarm.sender, //(신청 메시지의 sender)
      meetingId: alarm.meetingId,
    };
    createMeetingAccept(data);
    //waiting에서 제거, member에 추가
    updateWaitingOut(alarm.meetingId, alarm.sender); //신청 메시지의 sender
    updateMembersIn(alarm.meetingId, alarm.sender); //신청 메시지의 sender
    // updateMeetingProposal(alarm.id); //신청 알림 완료로 update
    updateUserMeetingIn(
      alarm.sender,
      'joinedroomId',
      alarm.meetingId,
      alarm.senderInfo.nickName,
      'in',
    ); //User에 room 추가하기
    if (
      alarm.meetingInfo.peopleNum * 2 - 1 ===
      alarm.meetingInfo.members.length
    ) {
      //미팅의 상태도 손수 수정해줍니다.(임시로)
      updateMeeting(alarm.meetingId, {status: 'full'});
    }
    showToast('basic', '신청이 수락되었습니다');
    navigation.navigate('AlarmPage');
  };
  // const handleDeny = () => {
  //   showToast('basic', '신청이 거절되었습니다');
  //   navigation.pop();
  // };

  const renderAcceptedStatus = () => {
    if (alarm.meetingInfo.waiting.indexOf(alarm.sender) !== -1) {
      return (
        <>
          <Text style={styles.acceptText}>신청을 수락하시겠습니까?</Text>
          <View style={styles.buttonArea}>
            {/* <BasicButton
                text="거절하기"
                width={120}
                height={50}
                textSize={17}
                margin={[5, 20, 5, 20]}
                backgroundColor="gray"
                onPress={handleDeny}
              /> */}
            <BasicButton
              text="수락하기"
              width={120}
              height={50}
              textSize={17}
              margin={[5, 20, 5, 20]}
              onPress={() => setModalVisible(true)}
            />
          </View>
        </>
      );
    } else if (
      alarm.meetingInfo.members.filter(
        el =>
          el === {[alarm.sender]: 'accepted'} ||
          el === {[alarm.sender]: 'fixed'},
      )
    ) {
      return <Text style={styles.acceptText}>신청을 수락했습니다</Text>;
    } else {
      return <></>;
    }
  };
  const renderEmotion = () => {
    let emotionText = '';
    let image = null;
    if (alarm.emotion === 'knowmore') {
      image = knowmore;
      emotionText = '좀 더 알고싶어요';
    } else if (alarm.emotion === 'befriend') {
      image = befriend;
      emotionText = '친구가 되고싶어요';
    } else if (alarm.emotion === 'fallinlove') {
      image = fallinlove;
      emotionText = '사랑에 빠졌어요';
    } else if (alarm.emotion === 'soso') {
      image = soso;
      emotionText = '그저 그랬어요';
    } else if (alarm.emotion === 'notgood') {
      image = notgood;
      emotionText = '다시는 안 보고 싶어요';
    } else if (alarm.emotion === 'terrible') {
      image = terrible;
      emotionText = '불쾌했어요';
    }

    return (
      <View style={styles.emotionArea}>
        <Image source={image} style={styles.emotionIcon} />
        <Text style={styles.emotionText}>"{emotionText}"</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <BackButton />
      <View style={styles.container}>
        <View style={styles.profileArea}>
          <TouchableOpacity
            onPress={() => {
              setUserId(alarm.sender);

              setUserInfoModalVisible(true);
            }}>
            <Image
              source={{uri: alarm.senderInfo.nftProfile}}
              style={styles.userImage}
            />
          </TouchableOpacity>

          <UserInfoModal
            userId={userId}
            userInfoModalVisible={userInfoModalVisible}
            visible={checkIsVisible(alarm.sender)}
            setUserInfoModalVisible={setUserInfoModalVisible}
            pFunction={() => {}}
          />

          <View style={styles.userInfo}>
            <View style={styles.userInfoElement}>
              <Text style={styles.key}>닉네임</Text>
              <Text style={styles.value}>{alarm.senderInfo.nickName}</Text>
            </View>
            <View style={styles.userInfoElement}>
              <Text style={styles.key}>나이</Text>
              <Text style={styles.value}>
                {handleBirth(alarm.senderInfo.birth)}
              </Text>
            </View>
            <View style={styles.userInfoElement}>
              <Text style={styles.key}>성별</Text>
              <Text style={styles.value}>{alarm.senderInfo.gender}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.key}>
          {alarm.type === 'feedback' ? '후기 내용' : '메시지'}
        </Text>
        {alarm.type === 'feedback' ? renderEmotion() : null}
        <Text style={styles.message}>{alarm.message}</Text>
        <View>
          <Text style={styles.key}>미팅 정보</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MeetingDetail', {data: alarm.meetingInfo})
            }>
            <Text style={styles.meetingTitle}>{alarm.meetingInfo.title}</Text>
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingElement}>
                {alarm.meetingInfo.region}
              </Text>
              <View style={styles.bar} />
              <Text style={styles.meetingElement}>
                {alarm.meetingInfo.peopleNum +
                  ':' +
                  alarm.meetingInfo.peopleNum}
              </Text>
              <View style={styles.bar} />
              <Text style={styles.meetingElement}>
                {handleDateInFormat(alarm.meetingInfo.meetDate)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*
        {alarm.meetingInfo.members.filter(
          el =>
            el === {[alarm.sender]: 'accepted'} ||
            el === {[alarm.sender]: 'fixed'},
        ) ? (
          <Text></Text>
        ) : (
          <>
            <Text style={styles.acceptText}>신청을 수락하시겠습니까?</Text>
            <View style={styles.buttonArea}>

              <BasicButton
                text="수락하기"
                width={120}
                height={50}
                textSize={17}
                margin={[5, 20, 5, 20]}
                onPress={() => setModalVisible(true)}
              />
            </View>
          </>
        )} */}
        {alarm.type === 'proposal' ? renderAcceptedStatus() : null}
      </View>
      <DoubleModal
        text="수락하시겠습니까?"
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {
          handleAccept();
          setModalVisible(!modalVisible);
        }}
        nFunction={() => {
          setModalVisible(!modalVisible);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    marginVertical: 50,
    paddingVertical: 40,
    paddingHorizontal: 30,
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  userImage: {
    borderRadius: 100,
    width: 80,
    height: 80,
    // borderColor: 'black',
    // borderWidth: 1,
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  acceptText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 10,
    width: 190,
  },
  userInfoElement: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  meetingInfo: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 10,
  },
  meetingElement: {
    fontSize: 11,
  },
  bar: {
    width: 1,
    backgroundColor: 'gray',
    marginVertical: 1,
    marginHorizontal: 5,
  },
  key: {
    color: 'gray',
    width: 60,
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    width: 130,
    justifyContent: 'flex-end',
    fontSize: 15,
    fontWeight: '500',
  },
  message: {
    marginTop: 10,
    marginBottom: 25,
    fontSize: 18,
    fontWeight: 'bold',
  },
  meetingTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  emotionIcon: {
    height: 30,
    width: 30,
    color: 'black',
    marginRight: 10,
  },
  emotionArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  emotionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AlarmDetail;
