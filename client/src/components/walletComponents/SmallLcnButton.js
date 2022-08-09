import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import ethIcon from '../../assets/icons/ethereum.png';
import lovechainIcon from '../../assets/icons/lovechain.png';
function SmallLcnButton({
  width,
  height,
  text,
  margin,
  amount,
  onPress,
  backgroundColor,
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
        <Text style={styles.text}>{amount}</Text>
      </View>
      <View style={styles.rightWrapper}>
        <View style={styles.lcnWrapper}>
          <Image source={imgSrc} style={styles.icon} />
          <Text style={styles.textLcn}>{content}</Text>
        </View>
      </View>
    </View>
  );
}

SmallLcnButton.defaultProps = {
  width: 330,
  height: 60,
  borderColor: '#bdbddd',
  backgroundColor: 'white',
  text: 'From',
  margin: [5, 5, 5, 5],
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
    width: 35,
    height: 35,
  },
  text: {
    // marginTop: 5,
    width: 150,
    height: 30,
    fontWeight: 'bold',
    fontSize: 25,
  },
  leftWrapper: {
    marginLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightWrapper: {
    marginRight: 20,
    flexDirection: 'column',
  },
  lcnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 330,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
  },
  textFromTo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  textLcn: {
    marginLeft: 5,
    fontSzie: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SmallLcnButton;
