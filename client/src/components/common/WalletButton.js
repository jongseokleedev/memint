import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

/*
props 필요 없음.
<WalletButton />
*/

function WalletButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      // style={styles.walletButton}
      onPress={() => navigation.navigate('Wallet')}>
      {/* <Text style={styles.buttonText}>Wallet</Text> */}
      <LinearGradient
        colors={['#A7BFEB', '#FBC2EA']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.walletButton}>
        <Icon name="account-balance-wallet" size={27} color={'white'} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  walletButton: {
    position: 'absolute',
    width: 70,
    height: 45,
    right: 20,
    bottom: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WalletButton;
