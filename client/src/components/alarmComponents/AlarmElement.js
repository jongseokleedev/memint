import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  handleBirth,
  handleDateFromNow,
  handleDateInFormat,
} from '../../utils/common/Functions';
import DoubleModal from '../common/DoubleModal';

function AlarmElement({alarm}) {
  const navigation = useNavigation();
  const [chattingConfirmModal, setChattingConfirmModal] = useState(false);
  const handleClick = () => {
    if (alarm.type === 'proposal') {
      navigation.navigate('AlarmDetail', {
        alarm,
      });
    } else {
      setChattingConfirmModal(!chattingConfirmModal);
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <DoubleModal
        text="채팅창으로 이동하시겠습니까?"
        //body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={chattingConfirmModal}
        setModalVisible={setChattingConfirmModal}
        pFunction={() => {
          setChattingConfirmModal(!chattingConfirmModal);
          navigation.navigate('ChattingRoom', {data: alarm.meetingInfo});
        }}
        nFunction={() => {
          setChattingConfirmModal(!chattingConfirmModal);
        }}
      />
      <Icon name="notifications" size={30} style={styles.icon} />
      <View style={styles.content}>
        <View style={styles.messageHead}>
          <Text style={styles.message}>
            {alarm.type === 'proposal'
              ? `${alarm.senderInfo?.nickName}님의 신청이 도착했습니다!`
              : `${alarm.senderInfo?.nickName}님이 신청을 수락했습니다!`}
          </Text>
          <Text style={styles.createdAt}>
            {handleDateFromNow(alarm.createdAt)}
          </Text>
        </View>
        <View style={styles.meetingArea}>
          {alarm.meetingInfo ? (
            <>
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
                  {handleBirth(alarm.senderInfo.birth)}
                </Text>
                <View style={styles.bar} />
                <Text style={styles.meetingElement}>
                  {handleDateInFormat(alarm.meetingInfo.meetDate)}
                </Text>
              </View>
            </>
          ) : (
            <Text>삭제된 미팅입니다</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 110,
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  icon: {
    marginRight: 13,
  },
  content: {
    flex: 1,
  },
  messageHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 35,
    marginTop: 5,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
  createdAt: {
    fontSize: 10,
    color: '#767676',
  },
  meetingArea: {
    height: 40,
  },
  meetingInfo: {
    flexDirection: 'row',
    marginTop: 5,
  },
  bar: {
    width: 1,
    backgroundColor: 'gray',
    marginVertical: 1,
    marginHorizontal: 5,
  },
  meetingElement: {
    fontSize: 11,
    fontWeight: '500',
  },
  meetingTitle: {
    fontWeight: '500',
  },
});

export default AlarmElement;
