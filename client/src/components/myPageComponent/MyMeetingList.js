import React, {useEffect, useState, useCallback} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import DoubleModal from '../../components/common/DoubleModal';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import {handleDateInFormat} from '../../utils/common/Functions';
import {
  changeJoinerToConfirmed,
  getMeeting,
  updateMeeting,
} from '../../lib/Meeting';
import useMeetingActions from '../../utils/hooks/UseMeetingActions';
import EarnModal from '../common/UserInfoModal/EarnModal';
import {getUser} from '../../lib/Users';
import {useIsFocused} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';

// function MyMeetingList({List, navigation}) {
//   return (
//     <>
//       <FlatList
//         data={List}
//         renderItem={({item}) => (
//           <MyMeetings item={item} navigation={navigation} />
//         )}
//       />
//     </>
//   );
// }

function MyMeetingList({navigation, user}) {
  // const meetingData = useMeeting(); //redux crete, join에 있는 모든 미팅 정보들
  const [createdRoom, setCreatedRoom] = useState([]);

  const getCreatedRoom = useCallback(async () => {
    const userData = await getUser(user.id);

    const data = await Promise.all(
      userData.createdroomId.map(async el => {
        const res = await getMeeting(el);
        const host = await getUser(res.data().hostId);
        return {
          id: res.id,
          ...res.data(),
          hostInfo: host,
        };
      }),
    );
    setCreatedRoom(data);
  }, [user]);

  const isFocused = useIsFocused();

  useEffect(() => {
    getCreatedRoom();
    //   setCreatedRoom(
    //     user.createdroomId?.map(el => {
    //       //내가 가지고 있는 아이디
    //       const meetingInfo = meetingData.filter(meeting => {
    //         return meeting.id === el;
    //       });
    //       return meetingInfo[0];
    //     }),
    //   );
  }, [getCreatedRoom, isFocused]);
  return (
    <>
      {createdRoom.length !== 0 ? (
        createdRoom
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map((el, index) => (
            <MyMeetings
              item={el}
              navigation={navigation}
              key={index}
              getCreatedRoom={getCreatedRoom}
            />
          ))
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 30,
          }}>
          <Text style={{color: 'lightgray'}}>생성한 미팅이 없습니다.</Text>
        </View>
      )}
    </>
  );
}

function MyMeetings({item, navigation, getCreatedRoom}) {
  const user = useUser();
  const [editModal, setEditModal] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const {showToast} = useToast();
  // const meetings = useMeeting();
  // const {saveMeeting} = useMeetingActions();
  const renderButton = () => {
    if (item?.status === 'fixed') {
      return (
        <TouchableOpacity
          style={{
            ...styles.deleteButton,
            ...styles.backgroundColorBlue,
          }}
          onPress={() => setStartModal(true)}>
          <Text style={styles.buttonText}>미팅 시작하기</Text>
        </TouchableOpacity>
      );
    } else if (item?.status === 'confirmed') {
      return (
        <TouchableOpacity
          style={{
            ...styles.deleteButton,
            ...styles.backgroundColorBlue,
          }}
          onPress={() => setEndModal(true)}>
          <Text style={styles.buttonText}>미팅 끝내기</Text>
        </TouchableOpacity>
      );
    } else if (item?.status === 'end') {
      return <Text style={styles.finishText}>종료된 미팅</Text>;
    }
  };

  const handleMeetingStart = () => {
    //서버에 요청
    updateMeeting(item.id, {status: 'confirmed'});
    changeJoinerToConfirmed(item.id, user.id);
    getCreatedRoom();
    //redux
    // const updateData = meetings.map(el => {
    //   if (el.id !== item.id) {
    //     return el;
    //   } else {
    //     return {...el, status: 'confirmed'};
    //   }
    // });
    // saveMeeting(updateData);
  };
  const handleMeetingEnd = () => {
    //서버에 요청
    updateMeeting(item.id, {status: 'end'});
    getCreatedRoom();
    // const updateData = meetings.map(el => {
    //   if (el.id !== item.id) {
    //     return el;
    //   } else {
    //     return {...el, status: 'end'};
    //   }
    // });
    // saveMeeting(updateData);
  };
  return (
    <>
      <TouchableOpacity
        style={styles.meetingCard}
        onPress={() => {
          navigation.navigate('ChattingRoom', {data: item});
        }}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item?.title}</Text>
          </View>

          <View style={styles.tagcontainer}>
            {item?.meetingTags.map((type, index) => {
              return (
                <View style={styles.tag} key={index}>
                  <Text style={styles.tagFont}># {type}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.container}>
            <Text style={styles.details}>{item?.region}</Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {item ? handleDateInFormat(item.meetDate) : ''}
            </Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {item?.peopleNum + ':' + item?.peopleNum}
            </Text>
          </View>

          <View style={styles.spaceBetween}>
            <TouchableOpacity
              style={styles.edit}
              onPress={() => setEditModal(true)}>
              <Text style={styles.editText}>미팅 정보 수정</Text>
            </TouchableOpacity>
            {renderButton()}
          </View>
        </View>

        <DoubleModal
          text="미팅 정보를 수정하시겠어요?"
          nButtonText="아니오"
          pButtonText="네"
          modalVisible={editModal}
          setModalVisible={setEditModal}
          pFunction={() => {
            setEditModal(false);
            navigation.navigate('EditMeetingInfo', {
              item: {
                ...item,
                meetDate: item.meetDate.toDate().toISOString(),
              },
            });
          }}
          nFunction={() => {
            setEditModal(false);
          }}
        />
        <DoubleModal
          text="미팅이 시작되었나요?"
          nButtonText="아니오"
          pButtonText="네"
          modalVisible={startModal}
          setModalVisible={setStartModal}
          pFunction={() => {
            setStartModal(false);
            //earnModal 띄우기
            //earnModal 후에는 status 변경
            setEarnModalVisible(true);
          }}
          nFunction={() => {
            setStartModal(false);
          }}
        />
        <DoubleModal
          text="미팅을 종료하시겠습니까?"
          nButtonText="아니오"
          pButtonText="네"
          modalVisible={endModal}
          setModalVisible={setEndModal}
          pFunction={() => {
            setEndModal(false);
            //earnModal 띄우기
            handleMeetingEnd();
          }}
          nFunction={() => {
            setEndModal(false);
          }}
        />
        <EarnModal
          EarnModalVisible={earnModalVisible}
          setEarnModalVisible={setEarnModalVisible}
          pFunction={() => {
            handleMeetingStart();
            showToast('success', '1LCN이 지급되었습니다!');
          }}
          amount={1}
          txType="미팅 참여"
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingVertical: 20,
    height: 130,
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

  deleteButton: {
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
    alignItems: 'center',
    marginTop: 3,
    justifyContent: 'space-between',
    height: 23,
  },
  bar: {
    width: 1,
    height: 8,
    marginHorizontal: 4,
    backgroundColor: 'black',
  },
  editText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#787878',
  },
  finishText: {
    fontSize: 12,
    fontWeight: '500',
  },
  edit: {
    // marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MyMeetingList;
