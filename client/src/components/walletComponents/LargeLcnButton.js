import React from 'react';
import {View, StyleSheet, Text, Image, TextInput} from 'react-native';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import ethIcon from '../../assets/icons/ethereum.png';
import lovechainIcon from '../../assets/icons/lovechain.png';
function LargeLcnButton({
  width,
  height,
  text,
  margin,
  amount,
  setAmount,
  onPress,
  backgroundColor,
  balance,
  content,
}) {
  const imgSrc = content === 'ETH' ? ethIcon : lovechainIcon;
  const [marginTop, marginRight, marginBottom, marginLeft] = margin;
  return (
    <View
      style={[
        styles.button,
        {
          width: width,
          height: height,
          backgroundColor: backgroundColor,
          marginTop: marginTop,
          marginRight: marginRight,
          marginBottom: marginBottom,
          marginLeft: marginLeft,
        },
      ]}>
      <View style={styles.leftWrapper}>
        <Text style={styles.textFromTo}>{text}</Text>
        <TextInput
          style={styles.textInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.rightWrapper}>
        <Text style={[styles.textLight]}>
          Balance : {Math.round((balance + Number.EPSILON) * 10000) / 10000}
        </Text>
        <View style={styles.lcnWrapper}>
          <Image source={imgSrc} style={styles.icon} />
          <Text style={styles.textLcn}>{content}</Text>
        </View>
      </View>
    </View>
  );
}

LargeLcnButton.defaultProps = {
  width: 330,
  height: 60,
  borderColor: '#bdbddd',
  backgroundColor: 'white',
  text: 'To',
  margin: [5, 5, 5, 5],
  amount: 0,
  balance: 0,
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 30,
    width: 35,
    height: 35,
  },
  textInput: {
    width: 150,
    height: 30,
    fontWeight: 'bold',
    fontSize: 25,
  },
  leftWrapper: {
    marginLeft: 20,
    flexDirection: 'column',
  },
  rightWrapper: {
    marginRight: 20,
    flexDirection: 'column',
  },
  lcnWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 30,
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 330,
    height: 130,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
  },
  textFromTo: {fontSize: 18, fontWeight: 'bold', marginBottom: 15},
  textLight: {fontSize: 15, fontWeight: '200', marginBottom: 0},
  textLcn: {
    marginLeft: 5,
    fontSzie: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAmount: {
    // justifyContent: 'flex-end',
    // marginLeft: 150,
    fontSize: 20,
    color: 'black',
    // textAlign: 'center',
  },
});

export default LargeLcnButton;
