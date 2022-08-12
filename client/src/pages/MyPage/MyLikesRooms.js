import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import BackButton from '../../components/common/BackButton';
import MyLikesElement from '../../components/myPageComponent/MyLikesElement';
import {getMeeting} from '../../lib/Meeting';
import {getUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';

function MyLikesRooms() {
  const [likesRooms, setLikesRooms] = useState([]);
  useEffect(() => {
    getMyLikesRooms();
  }, [getMyLikesRooms]);
  const userInfo = useUser();
  const getMyLikesRooms = useCallback(async () => {
    const meetings = await Promise.all(
      userInfo.likesroomId.map(async meetingId => {
        const res = await getMeeting(meetingId);
        if (res.data() === undefined) {
          return;
        }
        return {id: res.id, ...res.data()};
      }),
    );
    const meetingsWithHost = await Promise.all(
      meetings
        .filter(el => el !== undefined)
        .map(async meeting => {
          const hostInfo = await getUser(meeting.hostId);
          return {
            ...meeting,
            hostInfo: {...hostInfo},
          };
        }),
    );
    setLikesRooms(meetingsWithHost);
  }, [userInfo.likesroomId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>찜한 미팅방</Text>
      </View>
      <View style={styles.meetingList}>
        {likesRooms.length === 0 ? (
          <Text style={styles.emptyText}>찜한 미팅방이 없습니다</Text>
        ) : (
          <ScrollView>
            {likesRooms.map((el, idx) => {
              return <MyLikesElement key={idx} item={el} />;
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
  },
  meetingList: {
    marginTop: 10,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#787878',
    marginTop: 80,
  },
});
export default MyLikesRooms;
