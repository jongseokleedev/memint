import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
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
import {ETHToLCN, LCNToETH} from '../../lib/api/wallet';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainEthLog} from '../../lib/OnchainEthLog';
import {getOnchainTokenLog} from '../../lib/OnchainTokenLog';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';

const WalletOnchainTrade = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {showToast} = useToast();
  const [fromEth, setFromEth] = useState(true);
  const userInfo = useUser();
  const {addEthLog, addLcnLog} = useOnchainActions();
  const {updateTokenInfo} = useAuthActions();
  const [amount, setAmount] = useState({
    fromAmount: '',
    toAmount: '',
  });
  // const animiation = useRef(new Animated.Value(1)).current;
  const createChangeAmountHandler = name => value => {
    setAmount({
      ...amount,
      [name]: Number(value),
      toAmount: fromEth ? Number(value) * 1000 : Number(value) / 1000,
    });
  };
  const transferETHToLCN = async () => {
    const body = {
      id: userInfo.id,
      ethAmount: amount.fromAmount,
    };
    try {
      return await ETHToLCN(body);
    } catch (e) {
      console.log(e);
    }
  };

  const transferLCNToETH = async () => {
    const body = {
      id: userInfo.id,
      tokenAmount: amount.fromAmount,
    };
    try {
      return await LCNToETH(body);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <SafeAreaView style={styles.view}>
      <BackButton />
      <Text style={styles.tradeText}>Trade</Text>
      <View style={styles.buttonContainer}>
        <LargeLcnButton
          amount={amount.fromAmount}
          setAmount={createChangeAmountHandler('fromAmount')}
          balance={fromEth ? userInfo.ethAmount : userInfo.onChainTokenAmount}
          width={330}
          height={110}
          margin={[30, 0, 30, 0]}
          text="From"
          content={fromEth ? 'ETH' : 'LCN'}
          //   backgroundColor={'lightblue'}
        />
        <TouchableOpacity onPress={() => setFromEth(!fromEth)}>
          <Icon name="autorenew" size={50} />
        </TouchableOpacity>
        <SmallLcnButton
          amount={amount.toAmount}
          width={330}
          height={110}
          margin={[30, 0, 0, 0]}
          text="To (Estimated)"
          content={fromEth ? 'LCN' : 'ETH'}
        />
        <BasicButton
          margin={[80, 0, 0, 0]}
          width={330}
          height={50}
          text={'교환하기'}
          textSize={18}
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
          fromEth
            ? transferETHToLCN().then(result => {
                console.log(result.data);
                if (result.data.message === 'success') {
                  showToast('success', '토큰 교환이 완료되었습니다!');
                  getUser(userInfo.id).then(userDetail => {
                    updateTokenInfo({
                      tokenAmount: Number(userDetail.tokenAmount),
                      ethAmount: Number(result.data.ETHBalance),
                      onChainTokenAmount: Number(result.data.LCNBalance),
                    });
                    getOnchainEthLog(userInfo.id).then(res => {
                      console.log({res});
                      const logs = res.docs.map(el => {
                        return {...el.data()};
                      });
                      addEthLog(logs);
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
            : transferLCNToETH().then(result => {
                console.log(result.data);
                if (result.data.message === 'success') {
                  showToast('success', '토큰 교환이 완료되었습니다!');
                  getUser(userInfo.id).then(userDetail => {
                    updateTokenInfo({
                      tokenAmount: Number(userDetail.tokenAmount),
                      ethAmount: Number(result.data.ETHBalance),
                      onChainTokenAmount: Number(result.data.LCNBalance),
                    });
                    getOnchainEthLog(userInfo.id).then(res => {
                      console.log({res});
                      const logs = res.docs.map(el => {
                        return {...el.data()};
                      });
                      addEthLog(logs);
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
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
});
export default WalletOnchainTrade;
