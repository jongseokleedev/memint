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
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import DoubleModal from '../../components/common/DoubleModal';
import {useToast} from '../../utils/hooks/useToast';
import lcnIcon from '../../assets/icons/lovechain.png';
import {transferLCN} from '../../lib/api/wallet';
import {getUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainTokenLog} from '../../lib/OnchainTokenLog';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';

const WalletLcnTransfer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {showToast} = useToast();
  const userInfo = useUser();
  const {addLcnLog} = useOnchainActions();
  const {updateTokenInfo} = useAuthActions();
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
  const sendLCN = async () => {
    const body = {
      id: userInfo.id,
      tokenAmount: form.amount,
      toAddress: form.address,
    };
    try {
      return await transferLCN(body);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <BackButton />
        <View style={styles.container}>
          <Text style={styles.transferText}>Transfer</Text>
          <View style={styles.imageContainer}>
            <Image source={lcnIcon} style={styles.icon} />
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
            placeholder="LCN"
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
              sendLCN().then(result => {
                if (result.data.message === 'success') {
                  showToast('success', 'LCN 전송이 완료되었습니다!');
                  getUser(userInfo.id).then(userDetail => {
                    updateTokenInfo({
                      tokenAmount: Number(userDetail.tokenAmount),
                      ethAmount: userInfo.ethAmount,
                      onChainTokenAmount: Number(result.data.balance),
                    });
                    getOnchainTokenLog(userInfo.id).then(res => {
                      console.log({res});
                      const logs = res.docs.map(el => {
                        return {...el.data()};
                      });
                      addLcnLog(logs);
                    });
                  });
                }
              });

              setModalVisible(false);
            }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreen: {
    flex: 1,
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
});
export default WalletLcnTransfer;
