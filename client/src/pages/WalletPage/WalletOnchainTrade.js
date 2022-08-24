import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import LargeLcnButton from '../../components/walletComponents/LargeLcnButton';
import SmallLcnButton from '../../components/walletComponents/SmallLcnButton';
import BasicButton from '../../components/common/BasicButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DoubleModal from '../../components/common/DoubleModal';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {getUser} from '../../lib/Users';
import {KlayToLCN, LCNToKlay} from '../../lib/api/wallet';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainKlayLog} from '../../lib/OnchainKlayLog';
import {getOnchainTokenLog} from '../../lib/OnchainTokenLog';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';
import {useNavigation} from '@react-navigation/native';
import trade from '../../assets/icons/trade.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const WalletOnchainTrade = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {showToast} = useToast();
  const [fromKlay, setFromKlay] = useState(true);
  const userInfo = useUser();
  const {addKlayLog, addLcnLog} = useOnchainActions();
  const {updateTokenInfo} = useAuthActions();
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [amount, setAmount] = useState({
    fromAmount: '',
    toAmount: '',
  });
  // const animiation = useRef(new Animated.Value(1)).current;
  const createChangeAmountHandler = name => value => {
    setAmount({
      ...amount,
      [name]: Number(value),
      toAmount: fromKlay ? Number(value) * 10 : Number(value) / 10,
    });
  };
  const transferKlayToLCN = async () => {
    const body = {
      id: userInfo.id,
      klayAmount: amount.fromAmount,
    };
    try {
      return await KlayToLCN(body);
    } catch (e) {
      console.log(e);
    }
  };

  const transferLCNToKlay = async () => {
    const body = {
      id: userInfo.id,
      tokenAmount: amount.fromAmount,
    };
    try {
      return await LCNToKlay(body);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.view}>
        <StatusBar barStyle="dark-content" />

        <View style={{backgroundColor: '#AAD1C1', height: top}} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
          {/* <Text style={styles.buttonText}>Back</Text> */}
        </TouchableOpacity>

        <Text style={styles.tradeText}>Trade</Text>
        <View style={styles.buttonContainer}>
          <LargeLcnButton
            amount={amount.fromAmount}
            setAmount={createChangeAmountHandler('fromAmount')}
            balance={
              fromKlay ? userInfo.klayAmount : userInfo.onChainTokenAmount
            }
            width={330}
            height={110}
            margin={[30, 0, 30, 0]}
            text="From"
            content={fromKlay ? 'KLAY' : 'LCN'}
            //   backgroundColor={'lightblue'}
          />
          <TouchableOpacity onPress={() => setFromKlay(!fromKlay)}>
            {/* <Icon name="autorenew" size={50} /> */}
            <Image source={trade} style={styles.tradeImage} />
          </TouchableOpacity>
          <SmallLcnButton
            amount={amount.toAmount}
            width={330}
            height={110}
            margin={[30, 0, 0, 0]}
            text="To (Estimated)"
            content={fromKlay ? 'LCN' : 'KLAY'}
          />
          <BasicButton
            margin={[80, 0, 0, 0]}
            width={330}
            height={50}
            text={'교환하기'}
            textSize={18}
            backgroundColor="#ffffff"
            border={false}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
        <DoubleModal
          text="교환하시겠습니까?"
          nButtonText="아니요"
          pButtonText="네"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          nFunction={() => {
            setModalVisible(false);
          }}
          pFunction={() => {
            fromKlay
              ? transferKlayToLCN().then(result => {
                  console.log(result.data);
                  if (result.data.message === 'success') {
                    showToast('success', '토큰 교환이 완료되었습니다!');
                    getUser(userInfo.id).then(userDetail => {
                      updateTokenInfo({
                        tokenAmount: Number(userDetail.tokenAmount),
                        klayAmount: Number(result.data.KlayBalance),
                        onChainTokenAmount: Number(result.data.LCNBalance),
                      });
                      getOnchainKlayLog(userInfo.id).then(res => {
                        console.log({res});
                        const logs = res.docs.map(el => {
                          return {...el.data()};
                        });
                        addKlayLog(logs);
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
                })
              : transferLCNToKlay().then(result => {
                  console.log(result.data);
                  if (result.data.message === 'success') {
                    showToast('success', '토큰 교환이 완료되었습니다!');
                    getUser(userInfo.id).then(userDetail => {
                      updateTokenInfo({
                        tokenAmount: Number(userDetail.tokenAmount),
                        klayAmount: Number(result.data.KlayBalance),
                        onChainTokenAmount: Number(result.data.LCNBalance),
                      });
                      getOnchainKlayLog(userInfo.id).then(res => {
                        console.log({res});
                        const logs = res.docs.map(el => {
                          return {...el.data()};
                        });
                        addKlayLog(logs);
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
        {/* </TouchableWithoutFeedback> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#AAD1C1',
  },
  container: {
    flex: 1,
    marginTop: 60,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 50,
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tradeText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 40,
    marginBottom: 50,
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
  tradeImage: {
    width: 30,
    height: 30,
  },
});
export default WalletOnchainTrade;
