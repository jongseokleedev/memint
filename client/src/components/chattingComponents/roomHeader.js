import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Keyboard} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

function RoomHeader({title, roomInfo, setRoomInfo, setRoomInfoExist}) {
  const navigation = useNavigation();
  return (
    <View style={styles.headerRapper}>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => navigation.pop()}>
        <Icon
          name="arrow-back-ios"
          size={20}
          color={'#ffffff'}
          style={{marginLeft: 5}}
        />
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
      {/* <Text style={{fontWeight: 'bold', fontSize: 18}}>{title}</Text> */}

      {title === '채팅목록' && (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setRoomInfo(!roomInfo);
            setRoomInfoExist(true);
          }}>
          <Icon
            name="menu"
            size={25}
            color="#ffffff"
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});

export default RoomHeader;
