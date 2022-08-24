import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {handleBirth, handleDateInFormat} from '../../utils/common/Functions';
import MeetingLikes from '../meetingComponents/MeetingLikes';

function MyLikesElement({item}) {
  const navigation = useNavigation();
  const handleNavigate = () => {
    navigation.navigate('MeetingDetail', {data: item});
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.container}>
        <View style={styles.meetingArea}>
          <View style={styles.meetingInfo}>
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
            <View>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
          <MeetingLikes meetingId={item.id} />
        </View>

        <View style={styles.userInfo}>
          <View style={styles.meetingTags}>
            {item.meetingTags?.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{'# ' + tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.imageNickname}>
            <Image
              source={{uri: item.hostInfo.nftProfile}}
              style={styles.userImage}
            />
            <Text style={styles.username}> {item.hostInfo.nickName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 35,
    paddingRight: 30,
    paddingVertical: 20,
    height: 115,
    borderRadius: 30,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 5,
  },
  meetingArea: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  meetingInfo: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    height: 42,
    width: 250,
  },
  meetingTags: {
    flexDirection: 'row',
  },
  tag: {
    marginHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#767676',
  },
  infoList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoEl: {
    fontSize: 10,
    color: 'black',
    fontWeight: '500',
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: 'black',
  },
  imageNickname: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    borderRadius: 100,
    width: 21,
    height: 21,
    // borderColor: 'black',
    // borderWidth:1
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  username: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default MyLikesElement;
