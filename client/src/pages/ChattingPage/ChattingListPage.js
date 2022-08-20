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
import WalletButton from '../../components/common/WalletButton';

function ChattingListPage({navigation}) {
  const [chatLog, setChatLog] = useState('');
  const [refresh, setRefresh] = useState(false);
  const user = useUser();

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
        meetingList.map(async (meetingId, idx) => {
          const meetingInfo = await firestore()
            .collection('Meeting')
            .doc(meetingId)
            .get();

          const lastMsg = await firestore()
            .collection('Meeting')
            .doc(meetingId)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

          const hostImage = await firestore()
            .collection('User')
            .doc(meetingInfo.data().hostId)
            .get();

          return {
            ...meetingInfo.data(),
            id: meetingId,
            hostInfo: hostImage.data().nftProfile,
            lastMsg: lastMsg.docs[0] && lastMsg.docs[0].data(),
          };
        }),
      );

      setChatLog(meetingInfos);
    };

    console.log('hi');
    getChatLogs();
  }, [user, refresh]);

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
          data={chatLog.sort((a, b) => {
            let lastA;
            let lastB;
            a.lastMsg ? (lastA = a.lastMsg.createdAt) : (lastA = a.createdAt);
            b.lastMsg ? (lastB = b.lastMsg.createdAt) : (lastB = b.createdAt);
            return lastB - lastA;
          })}
          renderItem={({item}) => (
            <MetaData
              item={item}
              navigation={navigation}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
        />
      )}

      <WalletButton />
    </SafeAreaView>
  );
}

function MetaData({item, navigation, refresh, setRefresh}) {
  const [lastMsg, setLastMsg] = useState('');
  const [lastTime, setLastTime] = useState('');
  // const MessageRef = useMemo(
  //   () => ,
  //   [item.id],
  // );
  useEffect(() => {
    const getContent = async () => {
      firestore()
        .collection('Meeting')
        .doc(item.id)
        .collection('Messages')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(result => {
          if (result.docs.length === 0) {
            return;
          } else if (
            result.docChanges()[result.docChanges().length - 1].doc._data
              .createdAt
          ) {
            if (result.docs[0].data().status) {
              return;
            }
            console.log('hihi');

            setLastMsg(result.docs[0].data().text);
            setLastTime(
              result.docs[0]
                .data()
                .createdAt.toDate()
                .toLocaleString()
                .slice(6, 20),
            );
          }
        });
    };
    console.log('re-rendering');
    setRefresh(!refresh);
    getContent();
    return () => getContent();
  }, [lastMsg]);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChattingRoom', {data: item})}>
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: item.hostInfo}} />
        <View style={styles.chatInfo}>
          <View>
            <Text style={styles.titleText} numberOfLines={1}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={{width: 180}}>
              {lastMsg ? lastMsg : '채팅을 시작해보세요!'}
            </Text>
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
    width: 150,
  },
});

export default ChattingListPage;
