import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';

function ChattingRoomTopTab({setProposeModalVisible, setModalVisible, data}) {
  const user = useUser().id;
  const meetingRef = useMemo(() => {
    return firestore().collection('Meeting').doc(data.id);
  }, [data]);

  const [roomData, setRoomData] = useState('');
  const [count, setCount] = useState('');

  useEffect(() => {
    meetingRef.onSnapshot(result => {
      setRoomData(result.data());
    });
  }, [meetingRef]);

  return <Host meetingInfo={data} data={roomData} />;
}

const Host = ({data, meetingInfo}) => {
  const navigation = useNavigation();
  const [roomStatus, setRoomStatus] = useState('');
  useEffect(() => {
    // 상황에 따른 텍스트 추가
    if (data.status === 'open') setRoomStatus('모집중');
    else if (data.status === 'full') setRoomStatus('모집완료');
    else if (data.status === 'fixed') setRoomStatus('확정');
    else if (data.status === 'confirmed') setRoomStatus('현장확인');
    else if (data.status === 'end') setRoomStatus('미팅종료');
  }, [data]);

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
              {data.title}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MeetingDetail', {data: meetingInfo})
          }>
          <Text style={{marginTop: 20}}>미팅 정보 보러가기 ></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.status}>
        <Text style={{color: 'white', fontWeight: '500', fontSize: 16}}>
          {roomStatus}
        </Text>
      </View>
    </View>
  );
};

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
    height: 40,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 20,
    marginLeft: 40,
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
