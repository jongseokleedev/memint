import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {getOtherUser} from '../../lib/Users';
import UserInfoModal from './UserInfoModal';

function InquireUserProfile({width, height, margin, userId}) {
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

  const [marginTop, marginRight, marginBottom, marginLeft] = margin;

  const [userDetail, setUserDetail] = useState('');
  useEffect(() => {
    getUserInfo(userId);
  }, [userId]);
  const getUserInfo = async userId => {
    try {
      const user = await getOtherUser(userId);
      console.log(user);
      setUserDetail(user);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setUserInfoModalVisible(true)}>
        <Image
          style={{
            width: width,
            height: height,
            borderRadius: 100,
            marginTop: marginTop,
            marginRight: marginRight,
            marginBottom: marginBottom,
            marginLeft: marginLeft,
          }}
          source={{uri: userDetail.nftProfile}}
        />
      </TouchableOpacity>
      <UserInfoModal
        user={userDetail}
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
      />
    </>
  );
}

InquireUserProfile.defaultProps = {
  width: 100,
  height: 40,
  backgroundColor: 'black',
  textColor: 'white',
  text: '버튼',
  textSize: 14,
  margin: [5, 5, 5, 5],
  onPress: () => {},
  borderRadius: 13,
  border: true,
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  border: {
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default InquireUserProfile;
