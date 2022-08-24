import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

function TotalAccountButton({amount, onPress, backgroundColor}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button]}>
        <View style={styles.coinwrap}>
          {/* <Image
            source={require('../../assets/icons/lovechain.png')}
            style={styles.icon}
          /> */}
          <Text style={[styles.text]}>TING</Text>
        </View>

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
    justifyContent: 'space-between',
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
    fontSize: 15,
    color: 'black',
    // textAlign: 'center',
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  textAmount: {
    justifyContent: 'flex-end',
    textSize: 20,
    fontSize: 15,
    color: 'black',
    // textAlign: 'center',
    fontWeight: '600',
    letterSpacing: -0.5,
    marginRight: 20,
  },
  coinwrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TotalAccountButton;
