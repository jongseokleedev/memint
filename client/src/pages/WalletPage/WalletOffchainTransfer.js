import React, {useState} from 'react';
import {View, Text, SafeAreaView, Image, StyleSheet} from 'react-native';
import BackButton from '../../components/common/BackButton';
import WalletCustomButton from '../../components/walletComponents/WalletCustomButton';
import LargeLcnButton from '../../components/walletComponents/LargeLcnButton';
import SmallLcnButton from '../../components/walletComponents/SmallLcnButton';
import BasicButton from '../../components/common/BasicButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DoubleModal from '../../components/common/DoubleModal';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {toOnChain} from '../../lib/api/wallet';
import {getUser} from '../../lib/Users';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainTokenLog} from '../../lib/OnchainTokenLog';
import {getOffchainTokenLog} from '../../lib/OffchianTokenLog';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';
import useOffchainActions from '../../utils/hooks/UseOffchainActions';
import {createSpendOffTxLg} from '../../lib/OffchianTokenLog';
const WalletOffchainTransfer = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recieveSelected, setRecieveSelected] = useState(false);
  const [transferSelected, setTransferSelected] = useState(true);
  const {showToast} = useToast();
  const userInfo = useUser();
  const {addLcnLog} = useOnchainActions();
  const {addLog} = useOffchainActions();
  const [amount, setAmount] = useState();
  const {updateTokenInfo} = useAuthActions();

  const sendToOnChain = async () => {
    const body = {
      id: userInfo.id,
      tokenAmount: Number(amount),
      currentTokenAmount: Number(userInfo.tokenAmount),
    };
    try {
      return await toOnChain(body);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRecieveSelect = () => {
    setRecieveSelected(true);
    setTransferSelected(false);
  };

  const handleTransferSelect = () => {
    setRecieveSelected(false);
    setTransferSelected(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SmallLcnButton
          text={'To'}
          width={330}
          height={100}
          margin={[10, 0, 10, 0]}
          backgroundColor={'lightblue'}
          amount={amount}
        />
        <Icon name="arrow-upward" size={50} />
        <LargeLcnButton
          balance={userInfo.tokenAmount}
          width={330}
          height={100}
          margin={[10, 0, 0, 0]}
          text={'From'}
          amount={amount}
          setAmount={setAmount}
        />
        <BasicButton
          margin={[40, 0, 0, 0]}
          width={330}
          height={45}
          text={'내보내기'}
          textSize={18}
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
      <DoubleModal
        text="LCN을 외부 지갑으로 내보내시겠습니까?"
        //body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        nFunction={() => {
          setModalVisible(false);
        }}
        pFunction={() => {
          sendToOnChain().then(result => {
            if (result.data.message === 'success') {
              showToast('success', 'LCN을 보냈습니다!');
              getUser(userInfo.id).then(userDetail => {
                console.log(userDetail);
                updateTokenInfo({
                  tokenAmount: Number(userDetail.tokenAmount),
                  ethAmount: userInfo.ethAmount,
                  onChainTokenAmount: Number(result.data.LCNBalance),
                });
                // createSpendOffTxLg(
                //   userInfo.id,
                //   amount,
                //   '온체인 지갑 전송',
                //   userDetail.tokenAmount,
                // ).then(
                //   getOffchainTokenLog(userInfo.id).then(res => {
                //     // console.log({res});
                //     const logs = res.docs.map(el => {
                //       return {...el.data()};
                //     });
                //     addLog(logs);
                //   }),
                // );
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
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginTop: 30,
  },
  accountWrapper: {
    backgroundColor: 'white',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountTextWrapper: {flexDirection: 'row', alignItems: 'flex-end'},
  contentContainer: {
    // flex: 1,
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
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  balanceText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 20,
    marginBottom: 10,
  },
  lcnText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
});
export default WalletOffchainTransfer;
