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
      const memberStatusCount = result.data().members?.filter(el => {
        return Object.values(el)[0] === 'accepted';
      }).length;
      setCount(memberStatusCount);
    });
  }, [meetingRef]);

  return user === data.hostId ? (
    <Host
      meetingInfo={data}
      data={roomData}
      count={count}
      setProposeModalVisible={setProposeModalVisible}
      setModalVisible={setModalVisible}
    />
  ) : (
    <Joiner
      meetingInfo={data}
      data={roomData}
      setProposeModalVisible={setProposeModalVisible}
      setModalVisible={setModalVisible}
      user={user}
    />
  );
}

const Host = ({data, count, meetingInfo, setModalVisible}) => {
  const {showToast} = useToast();
  const navigation = useNavigation();

  // console.log(data);

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{paddingRight: 7, fontSize: 16, fontWeight: '700'}}>
              {data.title}
            </Text>
            {data.status === 'open' ? null : (
              <View
                style={
                  // status가 fixed이면
                  data.status === 'full'
                    ? {...styles.status, backgroundColor: 'lightgray'} // 아니면 회색 view 렌더링
                    : styles.status // 검정색 view 렌더링
                }>
                <Text style={{color: 'white', fontWeight: '500'}}>확정</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MeetingDetail', {data: meetingInfo})
          }>
          <Text style={{marginTop: 20}}>미팅 정보 보러가기 ></Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
        {
          //status가 end이면
          data.status === 'open' ? null : data.status === 'end' ? (
            <TouchableOpacity
              onPress={() => {
                // proposeModal이 왜 렌더링이 안되는지 모르겠다. 파일 변경이 있었던 것 같다.
                // setProposeModalVisible(true);
                navigation.navigate('FeedbackChoicePage', {data: meetingInfo});
              }}>
              <View style={styles.button}>
                <Text style={{color: 'white', fontWeight: '500'}}>
                  후기 작성
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={
                data.status === 'fixed'
                  ? () => {
                      showToast(
                        'error',
                        '후기 작성은 미팅 완료 후 가능합니다.',
                      );
                    }
                  : () => {
                      count === 1 ? setModalVisible(true) : null;
                    }
              }>
              <View
                style={
                  //'나를 제외한 모든 사람이 fixed가 아니면?'
                  count !== 1
                    ? {...styles.button, backgroundColor: 'lightgray'}
                    : // 나를 제외한 모든 사람이 fixed인데 status가 full이면?
                    data.status === 'full'
                    ? styles.button
                    : // 나를 제외한 모든 사람이 fixed이고 status가 fixed이면?
                      {...styles.button, backgroundColor: 'lightgray'}
                }>
                <Text style={{color: 'white', fontWeight: '500'}}>
                  {
                    //'status가 full이면'
                    data.status === 'full' ? '확정하기' : '후기 작성하기'
                  }
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
};

const Joiner = ({data, user, setModalVisible, meetingInfo}) => {
  const {showToast} = useToast();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{paddingRight: 7, fontSize: 16, fontWeight: '700'}}>
              {data.title}
            </Text>
            {data.status === 'open' ? null : (
              <View
                style={
                  // status가 fixed이면
                  data.status === 'full'
                    ? {...styles.status, backgroundColor: 'lightgray'} // 아니면 회색 view 렌더링
                    : styles.status // 파란색 view 렌더링
                }>
                <Text style={{color: 'white', fontWeight: '500'}}>확정</Text>
              </View>
            )}
          </View>
        </View>
        {/* 미팅 상세페이지로 라우팅 설정해놓기 */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MeetingDetail', {data: meetingInfo})
          }>
          <Text style={{marginTop: 20}}>미팅 정보 보러가기 ></Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
        {
          //status가 end이면
          data.status === 'open' ? null : data.status === 'end' ? (
            <TouchableOpacity
              onPress={() => {
                // proposeModal이 왜 렌더링이 안되는지 모르겠다. 파일 변경이 있었던 것 같다.
                // setProposeModalVisible(true);
                navigation.navigate('FeedbackChoicePage', {data: meetingInfo});
              }}>
              <View style={styles.button}>
                <Text style={{color: 'white', fontWeight: '500'}}>
                  후기 작성
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={
                data.status === 'full'
                  ? () => {
                      data.members &&
                      data.members.filter(el => {
                        return el[user] === 'fixed';
                      }).length === 1
                        ? showToast(
                            'error',
                            '후기 작성은 미팅 완료 후 가능합니다.',
                          )
                        : setModalVisible(true);
                    }
                  : () => {
                      showToast(
                        'error',
                        '후기 작성은 미팅 완료 후 가능합니다.',
                      );
                    }
              }>
              <View
                style={
                  data.members &&
                  data.members.filter(el => {
                    return el[user] === 'fixed' || el[user] === 'confirmed';
                  }).length === 1
                    ? {...styles.button, backgroundColor: 'lightgray'}
                    : styles.button
                }>
                <Text style={{color: 'white', fontWeight: '500'}}>
                  {data.members &&
                  data.members.filter(el => {
                    return el[user] === 'fixed' || el[user] === 'confirmed';
                  }).length === 1
                    ? '후기 작성하기'
                    : '확정하기'}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
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
    justifyContent: 'space-between',
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
