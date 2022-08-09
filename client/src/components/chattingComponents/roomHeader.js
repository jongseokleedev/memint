import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

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
          color={'black'}
          style={{marginLeft: 5}}
        />
        {/* <Text style={styles.buttonText}>목록</Text> */}
      </TouchableOpacity>
      {/* <Text style={{fontWeight: 'bold', fontSize: 18}}>{title}</Text> */}
      <TouchableOpacity
        onPress={() => {
          setRoomInfo(!roomInfo);
          setRoomInfoExist(true);
        }}>
        <Icon name="menu" size={30} color="black" style={{marginRight: 10}} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});

export default RoomHeader;
