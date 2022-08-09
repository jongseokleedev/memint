import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {handleBirth, handleDateInFormat} from '../../utils/common/Functions';

function MeetingElement({item}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MeetingDetail', {data: item})}>
      <View style={styles.container}>
        <View style={styles.imageArea}>
          <Image
            source={{uri: item.hostInfo.nftProfile}}
            style={styles.userImage}
          />
        </View>
        <View style={styles.info}>
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
          <View style={styles.userInfo}>
            <View style={styles.meetingTags}>
              {item.meetingTags?.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{'# ' + tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.username}>{'@' + item.hostInfo.nickName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 27,
    paddingVertical: 20,
    paddingRight: 50,
    height: 110,
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  imageArea: {
    flex: 0,
  },
  info: {
    flex: 0,
    marginLeft: 15,
    height: 80,
    width: 215,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    height: 42,
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
  userImage: {
    borderRadius: 100,
    width: 60,
    height: 60,
    // borderColor: 'black',
    // borderWidth:1
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 10,
    fontWeight: '500',
  },
});

export default MeetingElement;
