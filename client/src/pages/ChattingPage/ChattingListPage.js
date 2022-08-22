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
import {useIsFocused} from '@react-navigation/native';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import {handleDate, handleDateInFormat} from '../../utils/common/Functions';

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
              hostInfo: hostImage.data().nftProfile,
            };
          } else {
            return {
              ...meetingInfo.data(),
              id: meetingId,
              lastMsg: lastMsg.docs[0].data().text,
              lastTime: lastMsg.docs[0].data().createdAt,
              hostInfo: hostImage.data().nftProfile,
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
    <View style={styles.view}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 0.3, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.header}>
          <Text style={styles.title}>채팅</Text>
        </View>
        {chatLog.length === 0 ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={{color: 'lightgray'}}>채팅이 없습니다</Text>
          </View>
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            data={chatLog}
            renderItem={({item}) => (
              <MetaData item={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.chattingContainer}
          />
        )}
      </LinearGradient>
      <WalletButton />
    </View>
  );
}

function MetaData({item, navigation}) {
  const [lastMsg, setLastMsg] = useState('');
  const [lastTime, setLastTime] = useState('');
  const MessageRef = useMemo(
    () => firestore().collection('Meeting').doc(item.id).collection('Messages'),
    [item.id],
  );
  useEffect(() => {
    console.log(item);
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
              setLastTime(result.docs[0].data().createdAt);
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
        <Image style={styles.image} source={{uri: item.hostInfo}} />
        <View style={styles.chatInfo}>
          <View>
            <Text style={styles.titleText}>
              {item.title.slice(0, 13) +
                `${item.title.length > 13 ? '...' : ''}`}
            </Text>
            <Text style={styles.plainText}>
              {lastMsg ? lastMsg : '채팅을 시작해보세요!'}
            </Text>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateText}>
              {lastTime ? handleDate(lastTime) : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
  },
  container: {
    flexDirection: 'row',
    height: 60,
    // paddingLeft: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 8,
    // justifyContent: 'space-between',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#58FF7D',
    borderWidth: 1,
  },
  chatInfo: {
    flexDirection: 'row',
    height: '100%',
    width: '80%',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingTop: 6,
    flexWrap: 'wrap',
  },
  separator: {
    backgroundColor: '#AEFFC1',
    height: 1,
  },
  titleText: {
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  chattingContainer: {
    paddingBottom: 70,
  },
  plainText: {
    fontSize: 15,
    color: '#ffffff',
  },
  dateText: {
    fontSize: 12,
    color: '#ffffff',
  },
  date: {alignItems: 'flex-start'},
});

export default ChattingListPage;
