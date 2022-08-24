import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import DoubleModal from '../../components/common/DoubleModal';
import {useToast} from '../../utils/hooks/useToast';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import {transferKlay} from '../../lib/api/wallet';
import useUser from '../../utils/hooks/UseUser';
import {getUser} from '../../lib/Users';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainKlayLog} from '../../lib/OnchainKlayLog';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const WalletKlayTransfer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {showToast} = useToast();
  const userInfo = useUser();
  const {updateTokenInfo} = useAuthActions();
  const {top} = useSafeAreaInsets();
  const {addKlayLog} = useOnchainActions();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    address: '',
    amount: '',
  });
  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };
  const onSubmit = () => {
    Keyboard.dismiss();
    console.log(form);
  };
  const sendKlay = async () => {
    const body = {
      id: userInfo.id,
      klayAmount: form.amount,
      toAddress: form.address,
    };
    try {
      return await transferKlay(body);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <View style={styles.fullscreen}>
          <StatusBar barStyle="dark-content" />

          <View style={{backgroundColor: '#AAD1C1', height: top}} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.pop()}>
            <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
            {/* <Text style={styles.buttonText}>Back</Text> */}
          </TouchableOpacity>

          <View style={{backgroundColor: '#AAD1C1', height: top}} />
          <View style={styles.container}>
            <Text style={styles.transferText}>Transfer</Text>
            <View style={styles.imageContainer}>
              <Image source={klayIcon} style={styles.icon} />
            </View>
            <Text style={styles.text}>To Address</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={createChangeTextHandler('address')}
              onPress={onSubmit}
            />
            <Text style={styles.text}>Amount</Text>
            <TextInput
              style={styles.input}
              value={form.amount}
              onChangeText={createChangeTextHandler('amount')}
              placeholder="KLAY"
              keyboardType="numeric"
              // returnKeyType={'done'}
              onPress={onSubmit}
            />
            <View style={styles.buttonContainer}>
              <BasicButton
                margin={[30, 0, 0, 0]}
                width={330}
                height={50}
                text={'보내기'}
                textSize={18}
                backgroundColor="#ffffff"
                border={false}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
            <DoubleModal
              text="보내시겠습니까?"
              nButtonText="아니요"
              pButtonText="네"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              nFunction={() => {
                setModalVisible(false);
              }}
              pFunction={() => {
                sendKlay().then(result => {
                  console.log('result.data is');
                  console.log(result.data);
                  if (result.data.message === 'success') {
                    showToast('success', 'KLAY 전송이 완료되었습니다!');
                    getUser(userInfo.id).then(userDetail => {
                      // console.log(userDetail);
                      updateTokenInfo({
                        tokenAmount: Number(userDetail.tokenAmount),
                        klayAmount: Number(result.data.balance),
                        onChainTokenAmount: userInfo.onChainTokenAmount,
                      });
                    });
                    getOnchainKlayLog(userInfo.id).then(res => {
                      console.log({res});
                      const logs = res.docs.map(el => {
                        return {...el.data()};
                      });
                      addKlayLog(logs);
                    });
                  }
                });

                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#AAD1C1',
  },
  container: {
    flex: 1,
    // marginTop: 60,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  icon: {
    // marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 50,
    height: 50,
  },
  input: {
    borderColor: '#bdbdbd',
    borderWidth: 3,
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 48,
    backgroundColor: 'white',
    marginHorizontal: 25,
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  transferText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 40,
    marginBottom: 10,
  },
  text: {fontWeight: 'bold', fontSize: 16, marginTop: 20, marginLeft: 25},
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
});
export default WalletKlayTransfer;
