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
import LinearGradient from 'react-native-linear-gradient';
import UserInfoModal from '../common/UserInfoModal';

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
      <LinearGradient
        colors={['#A7BFEB', '#FBC2EA']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={roomInfo ? {flex: 1, opacity: 0.8} : {flex: 1}}>
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
            item.data().sender === user ? (
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
      </LinearGradient>
      <AddChat chatId={data.id} />
    </View>
  );
}

function NotMyChat({item, userDetail, setUserInfoModalVisible, setUserId}) {
  return (
    <View style={styles.messageWrapper}>
      {/* 클릭할 시 유저 정보를 열겠냐고 물어보는 모달 창 띄우는 값 true로 설정 */}
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
      {/* <InquireUserProfile
        width={60}
        height={60}
        margin={[10, 3, 3, 3]}
        userId={item.data().sender}
      /> */}

      <View style={styles.textWrapper}>
        <Text style={styles.senderName}>
          {userDetail && userDetail[item.data().sender].nickName}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.messageBody}>
            <Text style={{padding: 3}}>{item.data().text}</Text>
          </View>
          <View style={styles.date}>
            <Text style={{marginBottom: 5, fontSize: 10, color: 'gray'}}>
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

function MyChat({item, userDetail, user}) {
  return (
    <View style={styles.MymessageWrapper}>
      {/* <Image source={{uri: user.picture}} style={styles.image} /> */}
      <View style={[styles.textWrapper, {alignItems: 'flex-end'}]}>
        <Text style={styles.senderName}>{user.nickName}</Text>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={styles.date}>
            <Text style={{marginBottom: 5, fontSize: 10, color: 'gray'}}>
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
          <View style={[styles.messageBody, {backgroundColor: 'white'}]}>
            <Text style={{padding: 3}}>{item.data().text}</Text>
          </View>
        </View>
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
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: 'gray',
    marginRight: 7,
    marginLeft: 7,
  },
  textWrapper: {
    flex: 0,
    justifyContent: 'center',
  },
  senderName: {
    marginTop: 10,
    paddingBottom: 6,
    fontSize: 15,
    fontWeight: 'bold',
  },
  messageBody: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 3,
  },
  mymessageBody: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 3,
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
    right: 10,
  },
});

export default ChatText;
