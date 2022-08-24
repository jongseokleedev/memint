import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import WalletCustomButton from '../../components/walletComponents/WalletCustomButton';
import TotalAccountButton from '../../components/walletComponents/TotalAccountButton';
import HistoryButton from '../../components/walletComponents/HistoryButton';
import WalletOffchainHistory from './WalletOffchainHistory';
import WalletOnchainMain from './WalletOnchainMain';
import {subscribeAuth, signOut} from '../../lib/Auth';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useUser from '../../utils/hooks/UseUser';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
function WalletOffchainMain({navigation}) {
  const [walletSelected, setWalletSelected] = useState(false);
  const [spendingSelected, setSpendingSelected] = useState(true);
  const user = useUser();
  const {logout} = useAuthActions();
  const {top} = useSafeAreaInsets();

  const handleWalletSelect = () => {
    setWalletSelected(true);
    setSpendingSelected(false);
  };

  const handleSpendingSelect = () => {
    setWalletSelected(false);
    setSpendingSelected(true);
  };

  const goToOffchainRecieve = () => {
    navigation.navigate('WalletOffchainRecieve');
  };
  const handleSignOut = useCallback(async () => {
    try {
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigation.navigate('SignIn');
    }
  }, [navigation, logout]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={{backgroundColor: '#AAD1C1', height: top}} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.pop()}>
        <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
        {/* <Text style={styles.buttonText}>Back</Text> */}
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.buttonWrapper}>
          <WalletCustomButton
            style={styles.buttonWrapper}
            width={140}
            height={38}
            textSize={18}
            margin={[5, 0, 5, 5]}
            text="SPENDING"
            hasMarginBottom
            onPress={handleSpendingSelect}
            selected={spendingSelected}
          />
          <WalletCustomButton
            style={styles.buttonWrapper}
            width={140}
            height={38}
            textSize={18}
            margin={[5, 5, 5, 0]}
            text="WALLET"
            hasMarginBottom
            onPress={handleWalletSelect}
            selected={walletSelected}
          />
        </View>
        {spendingSelected ? (
          <WalletOffchainHistory navigation={navigation} />
        ) : (
          <WalletOnchainMain navigation={navigation} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AAD1C1',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    backgroundColor: '#3C3D43',
    borderRadius: 999,
    height: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
});

export default WalletOffchainMain;
