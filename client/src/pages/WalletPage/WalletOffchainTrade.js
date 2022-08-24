import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import WalletCustomButton from '../../components/walletComponents/WalletCustomButton';
import {useToast} from '../../utils/hooks/useToast';
import WalletOffchainRecieve from './WalletOffchainRecieve';
import WalletOffchainTransfer from './WalletOffchainTransfer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useUser from '../../utils/hooks/UseUser';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const WalletOffchainTrade = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recieveSelected, setRecieveSelected] = useState(true);
  const [transferSelected, setTransferSelected] = useState(false);
  const {showToast} = useToast();
  const {top} = useSafeAreaInsets();
  const user = useUser();
  const handleRecieveSelect = () => {
    setRecieveSelected(true);
    setTransferSelected(false);
  };

  const handleTransferSelect = () => {
    setRecieveSelected(false);
    setTransferSelected(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.view} behavior={'padding'}>
        <StatusBar barStyle="dark-content" />

        <View style={{backgroundColor: '#AAD1C1', height: top}} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
          {/* <Text style={styles.buttonText}>Back</Text> */}
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.padddingBottom}>
          <View style={styles.accountWrapper}>
            {/* <Image
            source={require('../../assets/icons/lovechain.png')}
            style={styles.icon}
          /> */}
            <View style={styles.accountTextWrapper}>
              <Text style={styles.balanceText}>{user.tokenAmount}</Text>
              <Text style={styles.lcnText}> TING</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <WalletCustomButton
                style={styles.buttonWrapper}
                width={140}
                height={38}
                textSize={17}
                margin={[5, 0, 5, 5]}
                text="가져오기"
                hasMarginBottom
                onPress={handleRecieveSelect}
                selected={recieveSelected}
              />
              <WalletCustomButton
                style={styles.buttonWrapper}
                width={140}
                height={38}
                textSize={17}
                margin={[5, 5, 5, 0]}
                text="내보내기"
                hasMarginBottom
                onPress={handleTransferSelect}
                selected={transferSelected}
              />
            </View>
            {recieveSelected ? (
              <WalletOffchainRecieve />
            ) : (
              <WalletOffchainTransfer />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#AAD1C1',
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 60,
  },
  accountWrapper: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountTextWrapper: {flexDirection: 'row', alignItems: 'center'},
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 30,
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    backgroundColor: '#3C3D43',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  balanceText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  lcnText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: -0.5,
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
  padddingBottom: {
    paddingBottom: 30,
  },
});
export default WalletOffchainTrade;
