import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

function TagElement({tag, meetingInfo, setMeetingInfo}) {
  const [colored, setColored] = useState(
    meetingInfo.meetingTags.indexOf(tag) !== -1 ? true : false,
  );
  const handleClick = () => {
    if (colored) {
      setColored(false);
      setMeetingInfo({
        ...meetingInfo,
        meetingTags: meetingInfo.meetingTags.filter(el => el !== tag),
      });
    } else {
      setColored(true);
      setMeetingInfo({
        ...meetingInfo,
        meetingTags: meetingInfo.meetingTags.concat(tag),
      });
    }
  };
  return (
    <TouchableOpacity
      // style={[styles.tag, colored ? styles.coloredTag : '']
      onPress={handleClick}>
      {colored ? (
        <View style={[styles.tag, styles.coloredTag]}>
          <Text style={styles.coloredtext}>{tag}</Text>
        </View>
      ) : (
        <View style={styles.tag}>
          <Text style={styles.text}>{tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  coloredTag: {
    borderColor: '#AEFFC1',
    borderWidth: 1,
  },
  coloredtext: {
    fontSize: 15,
    color: '#AEFFC1',
    fontWeight: '400',
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: '#EAFFEF',
  },
});

export default TagElement;
