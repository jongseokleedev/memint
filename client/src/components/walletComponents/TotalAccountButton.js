import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

function TotalAccountButton({amount, onPress, backgroundColor}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button]}>
        <Image
          source={require('../../assets/icons/lovechain.png')}
          style={styles.icon}
        />
        <Text style={[styles.text]}>LCN</Text>
        <Text style={[styles.textAmount]}>{amount}</Text>
      </View>
    </TouchableOpacity>
  );
}

TotalAccountButton.defaultProps = {
  width: 200,
  height: 40,
  borderColor: '#bdbddd',
  amount: 0,
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
    width: 35,
    height: 35,
  },
  button: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 330,
    height: 60,
    // justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    margin: 5,
  },
  text: {
    marginHorizontal: 20,
    textSize: 20,
    fontSize: 20,
    color: 'black',
    // textAlign: 'center',
    fontWeight: 'bold',
  },
  textAmount: {
    justifyContent: 'flex-end',
    marginLeft: 150,
    textSize: 20,
    fontSize: 20,
    color: 'black',
    // textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TotalAccountButton;
