import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import WalletButton from '../common/WalletButton';
import {useIsFocused} from '@react-navigation/native';

function ChattingListPage({navigation}) {
  const [chatLog, setChatLog] = useState('');
  const user = useUser();

  const isFocused = useIsFocused();

  useEffect(() => {
    const getChatLogs = async () => {
      const meetingList = [];

      const rawUserInfo = await firestore()
        .collection('User')
        .doc(user.id)
        .get();

      const userInfo = rawUserInfo.data();

      userInfo.createdroomId && meetingList.push(...userInfo.createdroomId);
      userInfo.joinedroomId && meetingList.push(...userInfo.joinedroomId);

      const meetingInfos = await Promise.all(
        meetingList.map(async meetingId => {
          const meetingInfo = await firestore()
            .collection('Meeting')
            .doc(meetingId)
            .get();

          const lastMsg = await firestore()
            .collection('Meeting')
            .doc(meetingId)
            .collection('Messages')
            .orderBy('createdAt')
            .limit(1)
            .get();

          const hostImage = await firestore()
            .collection('User')
            .doc(meetingInfo.data().hostId)
            .get();

          if (lastMsg.docs.length === 0) {
            return {
              ...meetingInfo.data(),
              id: meetingId,
              hostInfo: hostImage.data(),
            };
          } else {
            return {
              ...meetingInfo.data(),
              id: meetingId,
              lastMsg: lastMsg.docs[0].data().text,
              lastTime: lastMsg.docs[0]
                .data()
                .createdAt.toDate()
                .toLocaleString()
                .slice(6),
              hostInfo: hostImage.data(),
            };
          }
        }),
      );

      setChatLog(meetingInfos);

      // return isFocused;
    };
    getChatLogs();
  }, [user, isFocused]);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
      </View>
      {chatLog.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{color: 'lightgray'}}>채팅이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={chatLog}
          renderItem={({item}) => (
            <MetaData item={item} navigation={navigation} />
          )}
        />
      )}

      <WalletButton />
    </SafeAreaView>
  );
}

function MetaData({item, navigation}) {
  const [lastMsg, setLastMsg] = useState('');
  const [lastTime, setLastTime] = useState('');
  // 추후 NFT 이미지로 바꿀 것

  const MessageRef = useMemo(
    () => firestore().collection('Meeting').doc(item.id).collection('Messages'),
    [item.id],
  );
  useEffect(() => {
    const getContent = async () => {
      MessageRef.orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(
          result => {
            if (result.docs.length === 0) {
              return;
            } else if (
              result.docChanges()[result.docChanges().length - 1].doc._data
                .createdAt
            ) {
              setLastMsg(result.docs[0].data().text);
              setLastTime(
                result.docs[0]
                  .data()
                  .createdAt.toDate()
                  .toLocaleString()
                  .slice(6),
              );
            }
          },
          [MessageRef],
        );
    };

    getContent();
  }, [MessageRef]);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChattingRoom', {data: item})}>
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: item.hostInfo.nftProfile}} />
        <View style={styles.chatInfo}>
          <View>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text>{lastMsg ? lastMsg : '채팅을 시작해보세요!'}</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text>{lastTime ? lastTime : ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 31,
    fontWeight: '500',
    marginLeft: 20,
  },
  container: {
    flexDirection: 'row',
    height: 70,
    // paddingLeft: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 7,
  },
  chatInfo: {
    flexDirection: 'row',
    height: '100%',
    width: '80%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    flexWrap: 'wrap',
  },
  separator: {
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  titleText: {
    marginTop: 10,
    paddingBottom: 12,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ChattingListPage;
