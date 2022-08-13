import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
const crown = require('../../pages/ChattingPage/dummydata/images/crown.png');

function RoomInfo({chatInfo, userDetail, setModalVisible}) {
  const [states, setStates] = useState('');
  const [people, setPeople] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const navigation = useNavigation();
  const {showToast} = useToast();
  const getIsFixed = useMemo(
    () =>
      firestore()
        .collection('Meeting')
        .doc(chatInfo.id)
        .onSnapshot(result => {
          if (result.data() === undefined) {
            navigation.navigate('MeetingMarket');
          } else {
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
        <View style={{width: '90%'}}>
          <Pressable
            style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              navigation.navigate('MeetingConfirm', {meetingInfo: chatInfo});
            }}>
            <Icon name="photo-camera" size={25} color="black" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              미팅참여 인증하기
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              console.log(chatInfo);
              if (chatInfo.status === 'end') {
                navigation.navigate('FeedbackChoicePage', {
                  data: chatInfo,
                  userInfo,
                });
              } else {
                showToast('error', '미팅이 끝난 후 후기 작성이 가능합니다.');
              }
            }}
            style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="email" size={25} color="black" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              미팅 후기 보내기
            </Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          height: '100%',
          width: '90%',
          // backgroundColor: 'yellow',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          position: 'absolute',
          zIndex: -1,
        }}>
        <Pressable
          onPress={() => {
            navigation.navigate('MeetingSet', {
              meetingInfo: chatInfo,
              userInfo,
            });
          }}>
          <Icon name="settings" size={35} color="black" />
        </Pressable>
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
          <View style={{position: 'absolute', height: 95}}>
            <Image
              source={crown}
              style={{width: 40, height: 40}}
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
                backgroundColor: '#609afa',
              }
        }
        onPress={
          id === user.id && chatInfo.status === 'full'
            ? () => {
                state === 'accepted' ? setModalVisible(true) : null;
              }
            : null
        }>
        <Text style={{color: 'white'}}>확정</Text>
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
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
  },
  person: {
    flexDirection: 'row',
    borderColor: 'lightgray',
    borderTopWidth: 0.1,
    borderBottomWidth: 1,

    marginLeft: 20,
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personImage: {
    height: 60,
    width: 60,
    borderRadius: 30,

    marginLeft: 10,
  },
  personName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  isConfirmed: {
    marginRight: 30,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 40,
    borderRadius: 5,
  },
});

export default RoomInfo;
