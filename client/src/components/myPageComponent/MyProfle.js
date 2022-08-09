import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useMemin, useNftProfile} from '../../utils/hooks/UseNft';
import {useToast} from '../../utils/hooks/useToast';
import BasicButton from '../common/BasicButton';
import SingleModal from '../common/SingleModal';
import SpendingModal from '../common/UserInfoModal/SpendingModal';
import MyMeMin from './MyMeMin';

// <Image
//   source={require('../../assets/icons/nftBadge.png')}
//   style={styles.badge}
// />

function MyProfile({User, navigation}) {
  const window = useWindowDimensions();
  const myMemin = useMemin();

  return (
    <>
      <View>
        <View style={{position: 'absolute', top: 0, right: 0, zIndex: 2}}>
          <Icon
            name="edit"
            size={30}
            style={styles.edit}
            onPress={() => navigation.navigate('EditMyInfo')}
          />
        </View>
        <Image
          style={{width: window.width, height: 300}}
          source={{
            uri: User.nftProfile,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            width: window.width,
            height: 300,
            // borderWidth: 1,
            // borderColor: 'black'
          }}>
          <View
            style={{backgroundColor: 'white', width: window.width, height: 50}}
          />
          <View
            style={{
              backgroundColor: 'white',
              opacity: 0.5,
              width: window.width,
              height: 200,
            }}
          />
          <View
            style={{backgroundColor: 'white', width: window.width, height: 50}}
          />
        </View>
        <Image
          style={styles.profileImage}
          source={{
            uri: User.picture,
          }}
        />
        <MyMeMin myMeMin={myMemin} />
      </View>

      <View style={styles.userInfos}>
        <Text style={styles.userNickName}>{User.nickName}</Text>
        <Text style={styles.userBirth}>{User.birth}</Text>
      </View>
      <View style={styles.userTags}>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>주량은 </Text>
          {<Text style={styles.tagFont}>#{User.drinkCapa}</Text>}
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>선호하는 주종은 </Text>
          {User.alcoholType.map((el, index) => (
            <Text style={styles.tagFont} key={index}>
              #{el}{' '}
            </Text>
          ))}
        </View>
        {User.drinkStyle.map((el, index) => (
          <Text style={styles.tagFont} key={index}>
            #{el}
          </Text>
        ))}
      </View>

      {/* <MyNFT User={User} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  edit: {
    marginRight: 10,
    marginTop: 5,
  },
  container: {
    flexDirection: 'row',
  },
  layer: {
    backgroundColor: 'white',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  images: {
    flex: 0.4,
    marginHorizontal: 30,
    marginVertical: '0%',
  },
  nftImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    top: 35,
    left: 15,
    position: 'relative',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
    bottom: 0,
    left: 20,
    position: 'absolute',
    zIndex: 2,
  },

  userInfos: {
    marginVertical: 20,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userNickName: {
    fontSize: 24,
    fontWeight: '700',
  },
  userBirth: {
    fontSize: 15,
    fontWeight: '500',
    color: '#787878',
  },
  userTags: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
  userTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontWeight: '500',
    fontSize: 15,
    marginVertical: 3,
    color: '#787878',
  },

  mintButton: {
    top: -30,
    left: 60,
    paddingBottom: 0,
  },

  tagFont: {
    fontWeight: '500',
    fontSize: 15,
    marginVertical: 3,
  },
  badge: {
    width: 35,
    height: 35,
    marginRight: -20,
    top: 28,
    left: 15,
    position: 'absolute',
  },
});

export default MyProfile;
