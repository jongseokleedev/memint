import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';

function ChattingRoomTopTab({data}) {
  const meetingRef = useMemo(() => {
    return firestore().collection('Meeting').doc(data.id);
  }, [data]);

  const [roomData, setRoomData] = useState('');
  const navigation = useNavigation();
  const [roomStatus, setRoomStatus] = useState('');

  useEffect(() => {
    meetingRef.onSnapshot(result => {
      setRoomData(result.data());
      setRoomStatus(result.data().status);
    });
  }, [meetingRef]);

  useEffect(() => {
    if (roomData.status === 'open') setRoomStatus('모집중');
    else if (roomData.status === 'full') setRoomStatus('모집완료');
    else if (roomData.status === 'fixed') setRoomStatus('확정');
    else if (roomData.status === 'confirmed') setRoomStatus('현장확인');
    else if (roomData.status === 'end') setRoomStatus('미팅종료');
  }, [roomData]);

  // console.log(data);

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{paddingRight: 7, fontSize: 16, fontWeight: '700'}}>
              {roomData.title}
            </Text>
            <View style={styles.status}>
              <Text style={{color: 'white', fontWeight: '500'}}>
                {roomStatus}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MeetingDetail', {data: data})}>
          <Text style={{marginTop: 20}}>미팅 정보 보러가기 ></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    borderTopWidth: 0.3,
    padding: 20,
    flexDirection: 'row',

    alignItems: 'center',

    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    // position: 'absolute',
    // backgroundColor: '',
  },
  status: {
    height: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
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
