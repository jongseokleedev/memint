import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import appleLogo from '../../assets/icons/apple.png';
import googleLogo from '../../assets/icons/google.png';

function OauthButton({text, variant, size, onPress, vendor, backgroundColor}) {
  const sizeStyle = SIZE[size];
  const sizeTextStyle = TEXTSIZE[size];
  const variantStyle = VARIANT[variant];
  const imgSrc =
    vendor === 'apple'
      ? appleLogo
      : vendor === 'google'
      ? googleLogo
      : googleLogo;
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View
        style={[styles.button, sizeStyle, {backgroundColor: backgroundColor}]}>
        <Image source={imgSrc} style={styles.logo} />
        <Text style={[styles.buttonText, sizeTextStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

OauthButton.defaultProps = {
  backgroundColor: '#007aff',
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 40,
    borderRadius: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  logo: {
    width: 30,
    height: 30,
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 50,
  },
});

const TEXTSIZE = {
  small: {
    fontSize: 13,
  },
  medium: {
    fontSize: 15,
  },
  large: {
    fontSize: 17,
  },
  wide: {
    fontSize: 17,
  },
};

const SIZE = StyleSheet.create({
  small: {
    width: 70,
    height: 35,
  },
  medium: {
    width: 100,
    height: 40,
  },
  large: {
    width: 200,
    height: 40,
  },
  wide: {
    width: 340,
    height: 50,
  },
});

const VARIANT = {
  basic: styles.basic,
  disable: {
    backgroundColor: '#d5d5d6',
  },
};

export default OauthButton;
