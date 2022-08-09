import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {handleBirth} from '../../utils/common/Functions';
import useUser from '../../utils/hooks/UseUser';
import UserInfoModal from '../common/UserInfoModal';

function DetailMembers({membersInfo, peopleNum, hostId}) {
  const userInfo = useUser();
  const visibleList = userInfo.visibleUser;
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [userId, setUserId] = useState('');

  const currentPeopleNum = () => {
    //2 ->2:2 현재 1:0
    if (membersInfo.length > peopleNum) {
      return peopleNum + ':' + (membersInfo.length - peopleNum);
    } else {
      return membersInfo.length + ':' + 0;
    }
  };
  const checkIsVisible = userId => {
    // console.log(visibleList)
    if (!visibleList) return false;
    if (visibleList.indexOf(userId) !== -1) {
      return true;
    }
    return false;
  };

  return (
    // <LinearGradient colors={['#A7BFEB', '#FBC2EA']} style={styles.box}>
    <View style={styles.memberBox}>
      <View style={styles.memberBoxInfo}>
        <Text style={styles.title}>현재 모인 멤버</Text>
        <View style={styles.memberBoxInfopeopleNum}>
          <Text style={styles.currentPeopleNum}>{currentPeopleNum()}</Text>
          <Text style={styles.peopleNum}>{`(${peopleNum}:${peopleNum})`}</Text>
        </View>
      </View>
      <View style={styles.memberList}>
        {membersInfo.map((member, idx) => (
          <View key={idx} style={styles.memberInfo}>
            <View style={styles.memberInfoProfile}>
              <TouchableOpacity
                onPress={() => {
                  setUserId(member.id);
                  setUserInfoModalVisible(true);
                }}>
                <Image
                  source={{uri: member.nftProfile}}
                  style={styles.userImage}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.memberInfoNickName}>{member.nickName}</Text>
              <View style={styles.memberGenderAge}>
                <Text style={styles.memberInfoContentEl}>
                  {handleBirth(member.birth)}
                </Text>
                <Text
                  style={styles.memberInfoContentEl}>{`(${member.gender?.slice(
                  0,
                  1,
                )})`}</Text>
              </View>
            </View>
          </View>
        ))}
        {membersInfo.peopleNum * 2 > membersInfo.length ? '' : ''}
      </View>
      <UserInfoModal
        userId={userId}
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
        pFunction={() => {}}
        visible={checkIsVisible(userId)}
      />
    </View>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  memberBox: {
    backgroundColor: 'white',
    paddingVertical: 23,
    paddingHorizontal: 30,
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  memberBoxInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memberList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberBoxInfopeopleNum: {
    flexDirection: 'row',
  },
  memberInfo: {
    width: 132,
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  memberGenderAge: {
    flexDirection: 'row',
  },
  memberInfoContentEl: {
    margin: 5,
  },
  memberInfoNickName: {
    margin: 5,
    fontWeight: '700',
  },
  title: {
    fontWeight: '700',
    color: 'black',
  },
  currentPeopleNum: {
    fontWeight: '500',
  },
  peopleNum: {
    fontWeight: '500',
    color: 'black',
  },
  image: {
    width: 40,
    height: 40,
  },
  userImage: {
    borderRadius: 100,
    width: 40,
    height: 40,
    marginRight: 3,
    // borderColor: 'black',
    // borderWidth:1
  },
});

export default DetailMembers;
