import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import ChatText from '../../components/chattingComponents/chatText';
import RoomHeader from '../../components/chattingComponents/roomHeader';
import RoomInfo from '../../components/chattingComponents/roomInfo';
import MyDoubleModal from '../../components/chattingComponents/myDoubleModal';
import ChattingRoomTopTab from '../../components/chattingComponents/ChattingRoomTopTab';
import SpendingModal from '../../components/common/UserInfoModal/SpendingModal';
import firestore from '@react-native-firebase/firestore';
import {useToast} from '../../utils/hooks/useToast';
import {changeMeetingState} from '../../lib/Chatting';
import useUser from '../../utils/hooks/UseUser';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

function ChattingRoom({route}) {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(1)).current;
  const [roomInfo, setRoomInfo] = useState(false);
  // 처음에 렌더링을 하면 가운데 있던 userinfo 화면이 우측으로 들어가는 것이 보인다.
  // 이를 없애기 위해 우측 상단 햄버거를 클릭하면 그 때 true 값을 주어 컴포넌트 자체가 생성되도록 만들었다.
  // 그런데 이렇게 하면 햄버거를 누를 때마다 setRoomInfoExist에 true 값을 주게 되어 리소스 낭비가 생긴다.
  // 이를 효율적으로 방지할 수 있는 방법은 없을까?

  // roomInfo라는 사이드바 컴포넌트 존재여부
  const [roomInfoExist, setRoomInfoExist] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [proposeModalVisible, setProposeModalVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [meetingEnd, setMeetingEnd] = useState(false);
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const {showToast} = useToast();

  // 추후 추가해야할 data

  const userRef = useMemo(() => firestore().collection('User'), []);
  const [userDetail, setUserDetail] = useState('');
  const ex = useUser();
  const user = useUser().id;

  const memberId = useMemo(() => {
    return [];
  }, []);

  const results = useMemo(() => {
    return [];
  }, []);

  const users = useMemo(
    () =>
      Promise.all(
        route.params.data.members.map(async el => {
          memberId.push(Object.keys(el)[0]);

          const result = await userRef.doc(Object.keys(el)[0]).get();

          results.push(result.data());

          Promise.all(
            memberId.map(async el => {
              return (await userRef.doc(el).get()).data();
            }),
          ).then(result => {
            setUserDetail(
              result.reduce((acc, cur) => {
                return {...acc, [cur.userId]: cur};
              }, 0),
            );
          });
          if (results.length === memberId.length) {
            setUserDetail(
              results.reduce((acc, cur) => {
                return {...acc, [cur.userId]: cur};
              }, 0),
            );
          }
          return;
        }),
      ),
    [],
  );

  useEffect(() => {
    if (
      route.params.data.members.filter(el => {
        return Object.keys(el)[0] === user;
      }).length === 0
    ) {
      navigation.pop();
      return showToast('error', '접근권한이 없습니다.');
    }
    Animated.spring(animation, {
      toValue: roomInfo ? windowWidth / 5 : windowWidth,
      useNativeDriver: true,
      speed: 13,
      bounciness: 0,
    }).start();

    users;

    // console.log(userDetail);

    setIsHost(route.params.data.hostId === user);
  }, [animation, roomInfo, route.params, userRef, users, user, ex]);
  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{flex: 1, backgroundColor: 'white'}}
      // 키보드가 올라온 상태에서 추가적으로 적용할 +값
      // keyboardVerticalOffset={80}
    >
      <SafeAreaView>
        <RoomHeader
          title="채팅목록"
          roomInfo={roomInfo}
          setRoomInfo={setRoomInfo}
          setRoomInfoExist={setRoomInfoExist}
        />
      </SafeAreaView>
      <View style={{flex: 1}}>
        <ChattingRoomTopTab
          isConfirmed={isConfirmed}
          meetingEnd={meetingEnd}
          setProposeModalVisible={setProposeModalVisible}
          setModalVisible={setModalVisible}
          data={route.params.data}
        />
        <ChatText
          data={route.params.data}
          roomINfo={roomInfo}
          userDetail={userDetail}
        />

        {roomInfoExist ? (
          <Animated.View
            style={[styles.roomInfo, {transform: [{translateX: animation}]}]}>
            <RoomInfo
              chatInfo={route.params.data}
              setModalVisible={setModalVisible}
              setMeetingEnd={setMeetingEnd}
              userDetail={userDetail}
            />
          </Animated.View>
        ) : null}

        <MyDoubleModal
          body={
            <>
              <Text style={{marginTop: 7}}>
                '미팅 참가를 확정하시겠습니까?'
              </Text>
              <View style={{alignItems: 'flex-start'}}>
                {/* 리덕스에서 받아오는 meeting 정보로 업데이트할 것  */}
                <Text style={{marginTop: 7}}>
                  🗓 날짜:{' '}
                  {route.params.data.meetDate
                    .toDate()
                    .toLocaleString()
                    .slice(0, 11)}
                </Text>
                <Text style={{marginTop: 7}}>
                  ⏰ 시간:{' '}
                  {route.params.data.meetDate
                    .toDate()
                    .toLocaleString()
                    .slice(12, 19)}
                </Text>
                <Text style={{marginTop: 7}}>
                  🏖 장소: {route.params.data.region}
                </Text>
              </View>
            </>
          }
          nButtonText="아니요"
          pButtonText="네"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setIsConfirmed={setIsConfirmed}
          meetingStatus={route.params.data.status}
          isHost={isHost}
          id={route.params.data.id}
        />
        {/* <SpendingModal
          spendingModalVisible={spendingModalVisible}
          setSpendingModalVisible={setSpendingModalVisible}
          txType="미팅 확정"
          amount={1}
          pFunction={() => {
            changeMeetingState(route.params.data.id);
            setSpendingModalVisible(false);

            showToast('basic', '미팅이 확정되었습니다.');
          }}
        /> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  roomInfo: {
    backgroundColor: 'white',
    position: 'absolute',
    width: (windowWidth / 5) * 4,
    height: '100%',
  },
  headerRapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginBottom: 15,
  },
  tabView: {
    container: {
      height: 90,
      borderTopWidth: 0.3,
      padding: 15,
      flexDirection: 'row',
    },
    status: {
      height: 20,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blue',
    },
    button: {
      width: 70,
      height: 40,
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});

export default ChattingRoom;
