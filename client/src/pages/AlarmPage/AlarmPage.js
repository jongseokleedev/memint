import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import AlarmElement from '../../components/alarmComponents/AlarmElement';
import DoubleModal from '../../components/common/DoubleModal';
import {getAlarmsById} from '../../lib/Alarm';
import {getMeeting} from '../../lib/Meeting';
import {filterProfile} from '../../lib/NFT';
import {getUser} from '../../lib/Users';
import {
  handleDateFromNow,
  handleDateInFormat,
} from '../../utils/common/Functions';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import useUser from '../../utils/hooks/UseUser';
import WalletButton from '../../components/common/WalletButton';

function AlarmPage({navigation}) {
  const userInfo = useUser();
  // const meetingData = useMeeting();
  const [chattingConfirmModal, setChattingConfirmModal] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getAlarmPage();
  }, [getAlarmPage, isFocused]);
  const getAlarmPage = useCallback(async () => {
    try {
      //알림 데이터
      const res = await getAlarmsById(userInfo.id);
      const data = res.docs.map(el => {
        return {
          ...el.data(),
          id: el.id,
        };
      });
      //sender데이터
      const dataWithSenderInfo = await Promise.all(
        data
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map(async el => {
            const info = await getUser(el.sender);
            return {
              ...el,
              senderInfo: info,
            };
          }),
      );
      //미팅 데이터
      const dataWithMeetingInfo = await Promise.all(
        dataWithSenderInfo.map(async el => {
          const meet = await getMeeting(el.meetingId);
          const host = await getUser(meet.data().hostId);
          if (meet.data()) {
            return {
              ...el,
              meetingInfo: {
                id: meet.id,
                ...meet.data(),
                hostInfo: {...host},
              },
            };
          } else {
            return {
              ...el,
            };
          }
        }),
      );
      setAlarms(dataWithMeetingInfo);

      // const dataWithMeeting = dataWithSenderInfo.map(el => {
      //   const meet = meetingData.filter(meeting => {
      //     return meeting.id === el.meetingId;
      //   });
      //   return {...el, meetingInfo: meet[0]};
      // });
      // setAlarms(dataWithMeetingInfo);
    } catch (e) {
      console.log(e);
    }
  }, [userInfo]);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.header}>
        <Text style={styles.title}>알림</Text>
      </View>
      {alarms.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{color: 'lightgray'}}>알림이 없습니다</Text>
        </View>
      ) : (
        <ScrollView>
          <View>
            {alarms.map((alarm, idx) => (
              <AlarmElement key={idx} alarm={alarm} />
            ))}
          </View>
        </ScrollView>
      )}

      <WalletButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 31,
    fontWeight: '500',
    marginLeft: 20,
  },
});

export default AlarmPage;
