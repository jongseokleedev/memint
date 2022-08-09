import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/*
  props 필요 없음
  Ex)
  <BackButton />
*/

function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.pop()}>
      <Icon name="arrow-back-ios" size={20} color={'black'} />
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 5,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});

export default BackButton;
