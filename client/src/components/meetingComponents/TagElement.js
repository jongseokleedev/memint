import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        <LinearGradient
          colors={['#A7BFEB', '#FBC2EA']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.tag}>
          <Text style={styles.coloredtext}>{tag}</Text>
        </LinearGradient>
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
    backgroundColor: 'lightgray',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  coloredTag: {
    backgroundColor: 'blue',
  },
  coloredtext: {
    color: 'white',
    fontWeight: '700',
  },
  text: {
    fontWeight: '500',
  },
});

export default TagElement;
