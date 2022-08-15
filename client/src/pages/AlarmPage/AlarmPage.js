import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import AlarmElement from '../../components/alarmComponents/AlarmElement';
import {getAlarmsById} from '../../lib/Alarm';
import {getMeeting} from '../../lib/Meeting';
import {getUser} from '../../lib/Users';

import useUser from '../../utils/hooks/UseUser';
import WalletButton from '../../components/common/WalletButton';
import {useMeeting} from '../../utils/hooks/UseMeeting';

function AlarmPage({navigation}) {
  const userInfo = useUser();
  const {rooms} = useMeeting();
  const [alarms, setAlarms] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    getAlarmPage();
  }, [getAlarmPage, isFocused]);
  const getAlarmPage = useCallback(async () => {
    try {
      //알림 데이터
      const res = await getAlarmsById(userInfo.id);

      const dataWithSenderInfo = await Promise.all(
        res
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
          const host = await getUser(meet.data()?.hostId);
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
      setRefreshing(false);
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
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>알림이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return <AlarmElement alarm={item} />;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getAlarmPage} />
          }
        />
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
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {color: 'lightgray'},
});

export default AlarmPage;
