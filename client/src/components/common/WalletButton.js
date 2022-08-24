import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Text} from 'react-native';
import wallet from '../../assets/icons/wallet.png';
import useUser from '../../utils/hooks/UseUser';

/*
props 필요 없음.
<WalletButton />
*/

function WalletButton() {
  const navigation = useNavigation();
  const userInfo = useUser();
  return (
    <TouchableOpacity
      // style={styles.walletButton}
      onPress={() => navigation.navigate('Wallet')}>
      {/* <Text style={styles.buttonText}>Wallet</Text> */}
      <View style={styles.walletButton}>
        <Image source={wallet} style={styles.image} />
        <Text style={styles.buttonText}>{userInfo?.tokenAmount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  walletButton: {
    position: 'absolute',
    width: 103,
    height: 55,
    right: 20,
    bottom: 90,
    backgroundColor: '#3C3D43',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#58FF7D',
    borderWidth: 1,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#58FF7D',
    fontSize: 20,
    marginLeft: 8,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default WalletButton;
