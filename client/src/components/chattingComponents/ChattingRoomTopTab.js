import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';

function ChattingRoomTopTab({data}) {
  const meetingRef = useMemo(() => {
    return firestore().collection('Meeting').doc(data.id);
  }, [data]);
  const user = useUser();
  const [roomData, setRoomData] = useState('');
  const navigation = useNavigation();
  const [roomStatus, setRoomStatus] = useState('');

  useEffect(() => {
    return meetingRef.onSnapshot(result => {
      if (result.data() === undefined) {
        navigation.navigate('MeetingMarket');
      } else {
        setRoomData(result.data());
        setRoomStatus(result.data().status);
      }
    });
  }, [meetingRef]);

  useEffect(() => {
    if (roomStatus === 'open') setRoomStatus('모집중');
    else if (roomStatus === 'full') setRoomStatus('모집완료');
    else if (roomStatus === 'fixed') setRoomStatus('확정');
    else if (roomStatus === 'confirmed') setRoomStatus('현장확인');
    else if (roomStatus === 'end') setRoomStatus('미팅종료');
  }, [roomStatus]);

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: 270,
            }}>
            <Text
              style={{
                paddingRight: 7,
                fontSize: 15,
                fontWeight: '600',
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              {roomData &&
                roomData.title.slice(0, 20) +
                  `${roomData.title.length > 20 ? '...' : ''}`}
            </Text>
            <View style={styles.status}>
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  letterSpacing: -0.5,
                }}>
                {roomStatus && roomStatus}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MeetingDetail', {data: data})}>
          <Text
            style={{
              marginTop: 13,
              color: '#ffffff',
              fontSize: 14,
              letterSpacing: -0.5,
            }}>
            미팅 정보 보러가기 >
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 57,
    // borderTopWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },
  status: {
    paddingVertical: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#58FF7D',
  },
  button: {
    width: 90,
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default ChattingRoomTopTab;
