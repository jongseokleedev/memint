import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

import DoubleModal from '../../components/common/DoubleModal';
import {
  changeJoinerToConfirmed,
  getMeeting,
  updateMembersOut,
} from '../../lib/Meeting';
import {getUser} from '../../lib/Users';
import {handleDateInFormat} from '../../utils/common/Functions';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import EarnModal from '../common/UserInfoModal/EarnModal';

// function ParticipatedMeetingList({List}) {
//   return (
//     <>1
//       <FlatList
//         data={List}
//         renderItem={({item}) => <ParticipatedMeetings item={item} />}
//       />
//     </>
//   );
// }
function ParticipatedMeetingList({user}) {
  const meetingData = useMeeting();
  const [joinedRoom, setJoinedRoom] = useState([]);
  useEffect(() => {
    getJoinedRoom();
    // setJoinedRoom(
    //   user.joinedroomId?.map(el => {
    //     //내가 가지고 있는 아이디
    //     const meetingInfo = meetingData.filter(meeting => {
    //       return meeting.id === el;
    //     });
    //     return meetingInfo[0];
    //   }),
    // );
  }, [getJoinedRoom, isFocused]);

  const isFocused = useIsFocused();

  const getJoinedRoom = useCallback(async () => {
    const userData = await getUser(user.id);

    const data = await Promise.all(
      userData.joinedroomId.map(async el => {
        const res = await getMeeting(el);
        const host = await getUser(res.data().hostId);
        return {
          id: res.id,
          ...res.data(),
          hostInfo: host,
        };
      }),
    );
    setJoinedRoom(data);
  }, [user]);

  return (
    <>
      {joinedRoom.length !== 0 ? (
        joinedRoom
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map((el, index) => (
            <ParticipatedMeetings
              item={el}
              key={index}
              getJoinedRoom={getJoinedRoom}
            />
          ))
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 30,
          }}>
          <Text style={{color: 'lightgray'}}>참여 중인 미팅이 없습니다.</Text>
        </View>
      )}
    </>
  );
}

function ParticipatedMeetings({item, getJoinedRoom}) {
  const user = useUser();
  const navigation = useNavigation();
  const [cancelModal, setCancelModal] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const {showToast} = useToast();

  const renderButton = () => {
    if (
      item?.status === 'confirmed' &&
      item.members.filter(el => {
        return Object.keys(el)[0] === user.id;
      })[0][user.id] === 'fixed'
    ) {
      return (
        <TouchableOpacity
          style={{
            ...styles.button,
            ...styles.backgroundColorBlue,
          }}
          onPress={() => setStartModalVisible(true)}>
          <Text style={styles.buttonText}>참여 보상받기</Text>
        </TouchableOpacity>
      );
    } else if (item?.status === 'end') {
      return <Text style={styles.finishText}>종료된 미팅</Text>;
    }
  };
  const handleStart = () => {
    try {
      changeJoinerToConfirmed(item.id, user.id);
      showToast('success', '1LCN이 지급되었습니다!');
      getJoinedRoom();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <TouchableOpacity
        style={styles.meetingCard}
        onPress={() => {
          // console.log(item);
          navigation.navigate('ChattingRoom', {data: item});
        }}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <View style={styles.tagcontainer}>
            {item.meetingTags.map((tag, index) => {
              return (
                <View style={styles.tag} key={index}>
                  <Text style={styles.tagFont}># {tag}</Text>
                </View>
              );
            })}
          </View>

          {/* <View style={styles.container}>
            <Image
              style={styles.hostImage}
              source={{
                uri: item.hostImage,
              }}
            />
            <Text style={styles.hostName}>{item.hostId}</Text>
          </View> */}
          <View style={styles.container}>
            <View style={styles.meetingInfo}>
              <Text style={styles.details}>{item.region}</Text>
              <View style={styles.bar} />

              <Text style={styles.details}>
                {handleDateInFormat(item.meetDate)}
              </Text>
              <View style={styles.bar} />

              {/* <Text
              style={[
                styles.details,
                item.peopleNum === item.hostSide.gathered.length
                  ? styles.title
                  : '',
              ]}>
              {item.peopleNum}({item.hostSide.sex}):
            </Text>
            <Text
              style={[
                styles.details,
                item.peopleNum === item.joinerSide.gathered.length
                  ? styles.title
                  : '',
              ]}>
              {item.joinerSide.gathered.length}({item.joinerSide.sex})
            </Text> */}
              <Text Text style={styles.details}>
                {item.peopleNum + ':' + item.peopleNum}
              </Text>
            </View>
            <View style={styles.spaceBetween}>{renderButton()}</View>
          </View>
          {/* <View
          style={{
            ...styles.container,
            ...styles.spaceBetween,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text>상태: </Text>
            <Text style={{fontWeight: 'bold', marginRight: 10}}>
              {item.status === 'pending' ? '대기 중' : '참여 완료'}
            </Text>

          </View>
          {item.status === 'pending' ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCancelModal(true)}>
              <Text style={styles.buttonText}>참가신청 취소하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                ...styles.cancelButton,
                ...styles.backgroundColorBlue,
              }}
              onPress={() => {
                navigation.navigate('ChattingRoom', {data: item});
              }}>
              <Text style={styles.buttonText}>채팅방 이동하기</Text>
            </TouchableOpacity>
          )}
        </View> */}
        </View>
        <DoubleModal
          text="미팅 참여 보상을 받으시겠습니까?"
          nButtonText="아니오"
          pButtonText="네"
          modalVisible={startModalVisible}
          setModalVisible={setStartModalVisible}
          pFunction={() => {
            setStartModalVisible(!startModalVisible);
            setEarnModalVisible(true);
          }}
        />
        <EarnModal
          EarnModalVisible={earnModalVisible}
          setEarnModalVisible={setEarnModalVisible}
          amount={1}
          txType="미팅 참여"
          pFunction={handleStart}
        />
        <DoubleModal
          text="미팅 참가신청을 취소하시겠어요?"
          nButtonText="네"
          pButtonText="아니오"
          modalVisible={cancelModal}
          setModalVisible={setCancelModal}
          nFunction={() => {
            setCancelModal(false);
            showToast('success', '취소되었습니다');
          }}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  tagcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    height: 10,
  },
  // meetingCard: {
  //   backgroundColor: 'white',
  //   marginVertical: '2%',
  //   paddingVertical: '3%',
  //   paddingHorizontal: '10%',
  // },
  meetingCard: {
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 5,
    paddingHorizontal: 27,
    paddingVertical: 22,
    height: 110,
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },

  details: {
    fontSize: 10,
  },

  button: {
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    backgroundColor: 'black',
    width: 80,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 10,
  },
  finishText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tag: {
    alignSelf: 'flex-start',
    marginRight: 5,
  },
  tagFont: {
    fontSize: 10,
    color: '#787878',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: 'black',
  },
});

export default ParticipatedMeetingList;
