import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {handleBirth, handleDateInFormat} from '../../utils/common/Functions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MeetingLikes from './MeetingLikes';

function MeetingElement({item}) {
  const navigation = useNavigation();
  const handleNavigate = () => {
    navigation.navigate('MeetingDetail', {data: item});
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.usernamelikes}>
          <View style={styles.imageNickname}>
            <Image
              source={{uri: item.hostInfo.nftProfile}}
              style={styles.userImage}
            />
            <Text style={styles.username}>{item.hostInfo.nickName}</Text>
          </View>
          <MeetingLikes meetingId={item.id} />
        </View>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.infoList}>
          <Text style={[styles.infoEl]}>{item.region}</Text>
          <View style={styles.bar} />
          <Text style={[styles.infoEl]}>
            {item.peopleNum + ':' + item.peopleNum}
          </Text>
          <View style={styles.bar} />
          <Text style={[styles.infoEl]}>
            {handleBirth(item.hostInfo.birth)}
          </Text>
          <View style={styles.bar} />
          <Text style={[styles.infoEl]}>
            {handleDateInFormat(item.meetDate)}
          </Text>
        </View>
        <View style={styles.meetingTags}>
          <Text style={styles.tagText}>
            {item.meetingTags?.reduce((acc, cur) => {
              if (acc.length > 24) {
                return acc;
              }
              return acc + '#' + cur + ' ';
            }, '')}
          </Text>
          {/* {item.meetingTags?.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{'#' + tag}</Text>
            </View>
          ))} */}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNavigate}>
        <Text style={styles.buttonText}> 함께하기 </Text>
        <Icon name="play-arrow" size={20} color={'#58FF7D'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    height: 220,
  },
  container: {
    backgroundColor: 'rgba(234, 255, 239, 0.8)',
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 30,
    paddingVertical: 25,
    height: 185,
    borderRadius: 30,
    marginVertical: 8,
  },
  usernamelikes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleArea: {
    marginTop: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    height: 43,
    width: '100%',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  meetingTags: {
    flexDirection: 'row',
    width: '100%',
  },
  tag: {
    marginRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3C3D43',
    letterSpacing: -0.5,
  },
  infoList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoEl: {
    fontSize: 13,
    color: '#3C3D43',
    letterSpacing: -0.5,
    fontWeight: '500',
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: '#3C3D43',
  },
  imageNickname: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    borderRadius: 100,
    width: 30,
    height: 30,
    marginRight: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#ffffff',
    width: 120,
    height: 50,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 30,
    bottom: 0,
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  buttonText: {
    fontSize: 18,
    letterSpacing: -0.5,
    fontWeight: '600',
  },
});

export default MeetingElement;
