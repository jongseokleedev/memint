import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
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
  return (
    <ScrollView contentContainerStyle={styles.marginBottom}>
      {/* <View>
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

        <MyMeMin myMeMin={myMemin} />
      </View> */}
      <View style={styles.imageWrapper}>
        <Image
          style={styles.profileImage}
          source={{
            uri: User.picture,
          }}
        />
      </View>

      <View style={styles.userInfos}>
        <Text style={styles.userNickName}>Lv.3 {User.nickName}</Text>
        <Text style={styles.userBirth}>{User.birth}</Text>
      </View>
      <View style={styles.userTags}>
        <Text style={styles.plainText}>{User.nickName}님의 미팅 스타일은?</Text>
        <View style={styles.userTag}>
          {/* <Text style={styles.tagText}>주량은 </Text> */}
          <Icon name="circle" size={9} color={'#3C3D43'} />
          <View style={styles.tag}>
            <Text style={styles.tagFont}>{User.property.drinkCapa}</Text>
          </View>
        </View>
        <View style={styles.userTag}>
          {/* <Text style={styles.tagText}>선호하는 주종은 </Text> */}
          <Icon name="circle" size={9} color={'#3C3D43'} />
          {User.property.alcoholType.map((el, index) => (
            <View style={styles.tag} key={index}>
              <Text style={styles.tagFont}>{el}</Text>
            </View>
          ))}
        </View>
        <View style={styles.userTag}>
          <Icon name="circle" size={9} color={'#3C3D43'} />
          {User.property.drinkStyle.map((el, index) => (
            <View style={styles.tag} key={index}>
              <Text style={styles.tagFont}>{el}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* <MyNFT User={User} /> */}
    </ScrollView>
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
    width: 232,
    height: 232,
    borderRadius: 999,
    borderColor: '#ffffff',
    borderWidth: 3,
    // bottom: 0,
    // left: 20,
    // position: 'absolute',
    // zIndex: 2,
  },
  imageWrapper: {
    marginTop: 50,
    marginBottom: 15,
    alignItems: 'center',
  },

  userInfos: {
    marginVertical: 20,
    marginHorizontal: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNickName: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.5,
    fontFamily: 'NeoDunggeunmoPro-Regular',
    color: '#1D1E1E',
  },
  userBirth: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3D43',
    marginTop: 15,
    letterSpacing: -0.5,
  },
  userTags: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
  userTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
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

  tag: {
    backgroundColor: '#3C3D43',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  tagFont: {
    fontSize: 15,
    fontWeight: '400',
    color: '#AEFFC0',
  },

  badge: {
    width: 35,
    height: 35,
    marginRight: -20,
    top: 28,
    left: 15,
    position: 'absolute',
  },
  plainText: {
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: '500',
    marginBottom: 8,
  },
  marginBottom: {
    paddingBottom: 140,
  },
});

export default MyProfile;
