import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import {handleDateInFormat} from '../../utils/common/Functions';

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
  let {rooms} = useMeeting(); //redux crete, join에 있는 모든 미팅 정보들
  const {createdrooms} = rooms;
  // const getCreatedRoom = useCallback(async () => {
  //   const userData = await getUser(user.id);

  //   const data = await Promise.all(
  //     userData.createdroomId.map(async el => {
  //       const res = await getMeeting(el);
  //       const host = await getUser(res.data().hostId);
  //       return {
  //         id: res.id,
  //         ...res.data(),
  //         hostInfo: host,
  //       };
  //     }),
  //   );
  //   setCreatedRoom(data);
  // }, [user]);

  return (
    <>
      {createdrooms.length !== 0 ? (
        createdrooms.map((el, index) => (
          <MyMeetings
            item={el}
            navigation={navigation}
            key={index}
            // getCreatedRoom={getCreatedRoom}
          />
        ))
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>생성한 미팅이 없습니다.</Text>
        </View>
      )}
    </>
  );
}

function MyMeetings({item, navigation}) {
  // const meetings = useMeeting();
  // const {saveMeeting} = useMeetingActions();
  const renderButton = () => {
    if (item?.status === 'end') {
      return <Text style={styles.finishText}>종료된 미팅</Text>;
    }
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

          <View style={styles.spaceBetween}>
            <View style={styles.meetingInfo}>
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
            {renderButton()}
          </View>
        </View>

        {/* <DoubleModal
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
        /> */}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  tagcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    height: 10,
  },
  meetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
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
    borderRadius: 30,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 5,
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
    justifyContent: 'space-between',
  },
  bar: {
    width: 1,
    height: 8,
    marginHorizontal: 4,
    backgroundColor: 'black',
  },

  finishText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  emptyText: {color: 'lightgray'},
});

export default MyMeetingList;
