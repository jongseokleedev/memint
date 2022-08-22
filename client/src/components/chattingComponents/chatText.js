import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AddChat from './addChat';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import UserInfoModal from '../common/UserInfoModal';
import person from '../../assets/icons/person.png';

function ChatText({data, roomInfo, userDetail}) {
  const [chattings, setChattings] = useState('');
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const userDesc = useUser();
  const user = userDesc.id;
  const visibleList = userDesc.visibleUser;
  const chatRef = useMemo(
    () => firestore().collection('Meeting').doc(data.id).collection('Messages'),
    [data.id],
  );
  const checkIsVisible = userId => {
    // console.log(visibleList)
    if (!visibleList) return false;
    if (visibleList.indexOf(userId) !== -1) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const getContent = async () => {
      chatRef.orderBy('createdAt').onSnapshot(result => {
        if (result.docs.length === 0) {
          return;
        } else if (
          result.docChanges()[result.docChanges().length - 1].doc._data
            .createdAt
        ) {
          setChattings(result.docs);
        }
      });
    };
    getContent();
  }, [chatRef]);

  return (
    <View style={roomInfo ? {flex: 1, opacity: 0.8} : {flex: 1}}>
      <FlatList
        // horizontal={true}
        // 플랫리스트에서 하단부터 렌더링을 해주는 설정
        inverted={true}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          flexDirection: 'column-reverse',
        }}
        style={styles.container}
        data={chattings}
        renderItem={({item}) =>
          item.data().status ? (
            <StatusMessage item={item} />
          ) : item.data().sender === user ? (
            <MyChat item={item} user={userDesc} userDetail={userDetail} />
          ) : (
            <NotMyChat
              item={item}
              userDetail={userDetail}
              setUserId={setUserId}
              setUserInfoModalVisible={setUserInfoModalVisible}
            />
          )
        }
      />
      <UserInfoModal
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
        userId={userId}
        visible={checkIsVisible(userId)}
      />
      <AddChat chatId={data.id} />
    </View>
  );
}

function NotMyChat({item, userDetail, setUserInfoModalVisible, setUserId}) {
  return (
    <View style={styles.messageWrapper}>
      {/* 클릭할 시 유저 정보를 열겠냐고 물어보는 모달 창 띄우는 값 true로 설정 */}
      {userDetail && userDetail[item.data().sender] ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setUserId(item.data().sender);
            setUserInfoModalVisible(true);
          }}>
          <Image
            source={
              userDetail && {
                uri: userDetail[item.data().sender].nftProfile,
              }
            }
            style={styles.image}
          />
        </TouchableOpacity>
      ) : (
        <Image source={person} style={styles.image} />
      )}
      {/* <InquireUserProfile
        width={60}
        height={60}
        margin={[10, 3, 3, 3]}
        userId={item.data().sender}
      /> */}

      <View style={styles.textWrapper}>
        <Text style={styles.senderName}>
          {userDetail && userDetail[item.data().sender]
            ? userDetail[item.data().sender].nickName
            : '(알수없음)'}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.messageBody}>
            <Text style={{color: '#3C3D43'}}>{item.data().text}</Text>
          </View>
          <View style={styles.date}>
            <Text
              style={{
                marginBottom: 5,
                fontSize: 11,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              {item
                .data()
                .createdAt.toDate()
                .toLocaleString()
                .slice(
                  6,
                  item.data().createdAt.toDate().toLocaleString().length - 3,
                )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function MyChat({item}) {
  return (
    <View style={{...styles.MymessageWrapper, paddingTop: 10}}>
      <View style={[styles.textWrapper, {alignItems: 'flex-end'}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.date}>
            <Text
              style={{
                marginBottom: 5,
                fontSize: 11,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              {item
                .data()
                .createdAt.toDate()
                .toLocaleString()
                .slice(
                  6,
                  item.data().createdAt.toDate().toLocaleString().length - 3,
                )}
            </Text>
          </View>
          <View
            style={[
              styles.messageBody,
              {backgroundColor: 'rgba(234, 255, 239, 0.8)', maxWidth: 300},
            ]}>
            <Text style={{color: '#3C3D43', fontSize: 15, letterSpacing: -0.5}}>
              {item.data().text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function StatusMessage({item}) {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
      }}>
      <View
        style={{
          minWidth: '77%',
          alignItems: 'center',
          // backgroundColor: 'lightgray',
          padding: 2,
          borderRadius: 10,
          opacity: 0.7,
        }}>
        <Text
          style={{
            color: 'rgba(234, 255, 239, 0.9)',
            fontSize: 13,
            letterSpacing: -0.5,
          }}>
          {item.data().nickName} 님이{' '}
          {item.data().status === 'out'
            ? '나가셨습니다.'
            : 'in'
            ? '입장하셨습니다.'
            : '퇴장당하셨습니다.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  messageWrapper: {
    flexDirection: 'row',
    width: '60%',
    marginBottom: 10,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 30,
    // backgroundColor: 'gray',
    marginRight: 7,
  },
  textWrapper: {
    flex: 0,
    justifyContent: 'center',
  },
  senderName: {
    marginTop: 10,
    paddingBottom: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  messageBody: {
    backgroundColor: 'rgba(234, 255, 239, 0.9)',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 10,
    maxWidth: 230,
  },
  date: {
    justifyContent: 'flex-end',
    marginRight: 7,
    marginLeft: 7,
  },
  MymessageWrapper: {
    flexDirection: 'row-reverse',
    width: '60%',
    marginLeft: 'auto',
    marginBottom: 10,
  },
});

export default ChatText;
