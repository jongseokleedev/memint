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
  const imgSrc = content === 'KLAY' ? klayIcon : lovechainIcon;
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
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <View style={styles.leftWrapper}>
          <Text style={styles.textFromTo}>{text}</Text>
          <Text style={[styles.textLight]}>
            Balance : {Math.round((balance + Number.EPSILON) * 10000) / 10000}
          </Text>
        </View>
        <View style={[styles.leftWrapper, {alignItems: 'flex-start'}]}>
          <TextInput
            style={styles.textInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text>{content}</Text>
        </View>
      </View>

      {/* <View style={styles.rightWrapper}>
        <View style={styles.lcnWrapper}>
          <Image source={imgSrc} style={styles.icon} />
          <Text style={styles.textLcn}>{content}</Text>
        </View>
      </View> */}
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
    fontWeight: 'bold',
    fontSize: 25,
    width: 200,
  },
  leftWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    alignItems: 'flex-start',
    borderColor: 'black',
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  textFromTo: {fontSize: 15, fontWeight: '600'},
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
