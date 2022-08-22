import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
import {addFeedbackDoc} from '../../lib/Meeting';
const likesActive = require('../../assets/icons/likesActive.png');

function RoomInfo({chatInfo, userDetail, setModalVisible}) {
  const [states, setStates] = useState('');
  const [meetingStatus, setMeetingStatus] = useState('');
  const [people, setPeople] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const navigation = useNavigation();
  const {showToast} = useToast();
  const user = useUser();
  const getIsFixed = useMemo(
    () =>
      firestore()
        .collection('Meeting')
        .doc(chatInfo.id)
        .onSnapshot(result => {
          if (result.data() === undefined) {
            navigation.navigate('MeetingMarket');
          } else {
            setMeetingStatus(result.data().status);
            setStates(
              result
                .data()
                .members.map(el => {
                  return Object.values(el);
                })
                .reduce((acc, cur) => {
                  return [...acc, ...cur];
                }),
            );
          }
        }),
    [chatInfo],
  );

  const handleNavigateToConfirm = () => {
    if (meetingStatus === 'open' || meetingStatus === 'full') {
      showToast('error', '미팅 확정 후 인증이 가능합니다');
      return;
    } else {
      navigation.navigate('MeetingConfirm', {meetingInfo: chatInfo});
    }
  };

  useEffect(() => {
    getIsFixed;
    const ids = Object.keys(userDetail);

    const arr = [];

    ids.forEach(el => {
      arr.push([userDetail[el].nickName, userDetail[el].nftProfile, el]);
    });

    states &&
      states.forEach((el, idx) => {
        arr[idx].push(el);
      });

    setUserInfo(arr);

    setPeople(
      arr.map((el, idx) => {
        return (
          <Joiner
            state={el[3]}
            nickName={arr[idx][0]}
            img={arr[idx][1]}
            key={idx}
            isHost={el[2] === chatInfo.hostId}
            id={el[2]}
            chatInfo={chatInfo}
            setModalVisible={setModalVisible}
          />
        );
      }),
    );
  }, [chatInfo, states]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.hilightText}>미팅 참여자</Text>
        {people}
        <View style={styles.buttons}>
          <Pressable
            style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}
            onPress={handleNavigateToConfirm}>
            <Icon name="photo-camera" size={25} color="#ffffff" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#ffffff',
                marginLeft: 4,
                letterSpacing: -0.5,
              }}>
              {' '}
              미팅참여 인증하기
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (meetingStatus === 'end') {
                addFeedbackDoc(user.id, chatInfo.id, userInfo).then(result => {
                  if (result === 'qualified') {
                    navigation.navigate('FeedbackChoicePage', {
                      data: chatInfo,
                      userInfo,
                    });
                  } else {
                    showToast('error', '이미 후기를 작성하셨습니다.');
                  }
                });
              } else {
                showToast('error', '미팅이 끝난 후 후기 작성이 가능합니다.');
              }
            }}
            style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="email" size={25} color="#ffffff" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#ffffff',
                marginLeft: 4,
                letterSpacing: -0.5,
              }}>
              {' '}
              미팅 후기 보내기
            </Text>
          </Pressable>
          <Pressable
            style={styles.settingButton}
            onPress={() => {
              navigation.navigate('MeetingSet', {
                meetingInfo: chatInfo,
                userInfo,
                meetingStatus,
              });
            }}>
            <Icon name="settings" size={24} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Joiner({nickName, state, img, isHost, id, setModalVisible, chatInfo}) {
  const user = useUser();
  return (
    <View style={styles.person}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={styles.personImage} source={{uri: img}} />
        {isHost && (
          <View style={{height: 28}}>
            <Image
              source={likesActive}
              style={{width: 30, height: 30, tintColor: '#33ED96'}}
              resizeMode="contain"
            />
          </View>
        )}
        <Text style={styles.personName}>{nickName}</Text>
      </View>
      <Pressable
        style={
          state === 'accepted'
            ? {...styles.isConfirmed, backgroundColor: 'lightgray'}
            : {
                ...styles.isConfirmed,
                borderColor: '#58FF7D',
                borderWidth: 1,
              }
        }
        onPress={
          id === user.id && chatInfo.status === 'full'
            ? () => {
                state === 'accepted' ? setModalVisible(true) : null;
              }
            : null
        }>
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '500',
            letterSpacing: -0.5,
          }}>
          확정
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  wrapper: {
    width: '85%',
    height: '90%',
    alignItems: 'center',
  },
  hilightText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    color: '#ffffff',
    textAlign: 'left',
    width: '100%',
    letterSpacing: -0.5,
  },
  person: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  personImage: {
    height: 30,
    width: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#58FF7D',
  },
  personName: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 5,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  isConfirmed: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  buttons: {
    width: '100%',
  },
  settingButton: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 20,
  },
});

export default RoomInfo;
