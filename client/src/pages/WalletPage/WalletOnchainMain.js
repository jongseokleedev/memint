import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import WalletAccountElement from '../../components/walletComponents/WalletAccountElement';
import WalletKlayHistory from '../../components/walletComponents/WalletKlayHistory';
import WalletLcnHistory from '../../components/walletComponents/WalletLcnHistory';
import SingleModal from '../../components/common/SingleModal';
import WalletCustomModal from '../../components/walletComponents/WalletCustomModal';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import lovechainIcon from '../../assets/icons/lovechain.png';
const WalletOnchainMain = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('account');
  const {showToast} = useToast();
  const userInfo = useUser();
  // const slicedAddress = userInfo.address
  //   ? `${userInfo.address.substr(0, 15)}....${userInfo.address.substr(30)}`
  //   : null;
  console.log({userInfo});
  const slicedAddress = `${userInfo.address.substr(
    0,
    15,
  )}....${userInfo.address.substr(30)}`;
  const goToOnchainTrade = () => {
    navigation.navigate('WalletOnchainTrade');
  };
  const imgSrc =
    currentTab === 'KLAY'
      ? klayIcon
      : currentTab === 'LCN'
      ? lovechainIcon
      : klayIcon;
  const ticker =
    currentTab === 'KLAY' ? 'KLAY' : currentTab === 'LCN' ? 'LCN' : 'KLAY';
  const currentBalance =
    currentTab === 'KLAY'
      ? Math.round((userInfo.klayAmount + Number.EPSILON) * 10000) / 10000
      : currentTab === 'LCN'
      ? Math.round((userInfo.onChainTokenAmount + Number.EPSILON) * 10000) /
        10000
      : Math.round((userInfo.klayAmount + Number.EPSILON) * 10000) / 10000;
  const copyToClipboard = text => {
    Clipboard.setString(text);
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('pressed');
        setModalVisible(false);
        setTransferModalVisible(false);
      }}>
      <View>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Image source={imgSrc} style={styles.icon} />
            <Text style={styles.balanceText}>
              {currentBalance} {ticker}
            </Text>
          </View>
          <View style={styles.address}>
            <Text style={styles.addressText}>{slicedAddress}</Text>
          </View>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/icons/receive.png')}
                />
              </TouchableOpacity>
              <Text>Receive</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => {
                  setTransferModalVisible(true);
                }}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/icons/money-transfer.png')}
                />
              </TouchableOpacity>
              <Text>Transfer</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={goToOnchainTrade}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/icons/transfer.png')}
                />
              </TouchableOpacity>
              <Text>Trade</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentTab('account')}>
            <Text style={styles.walletText}>Wallet Account</Text>
          </TouchableOpacity>
          {currentTab === 'KLAY' ? (
            <View style={styles.contentContainer}>
              <WalletKlayHistory />
            </View>
          ) : currentTab === 'TING' ? (
            <WalletLcnHistory />
          ) : (
            <View style={styles.contentContainer}>
              <WalletAccountElement
                content="KLAY"
                balance={
                  Math.round((userInfo.klayAmount + Number.EPSILON) * 10000) /
                  10000
                }
                onPress={setCurrentTab}
              />
              <WalletAccountElement
                content="TING"
                balance={
                  Math.round(
                    (userInfo.onChainTokenAmount + Number.EPSILON) * 10000,
                  ) / 10000
                }
                onPress={setCurrentTab}
              />
            </View>
          )}
        </View>

        <SingleModal
          text="Recieve KLAY"
          buttonText="주소 복사하기"
          body={
            <View style={styles.address}>
              <Text style={styles.addressText}>{slicedAddress}</Text>
            </View>
          }
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pFunction={() => {
            setModalVisible(false);
            copyToClipboard(userInfo.address);
            showToast('success', '주소가 복사되었습니다!');
          }}
        />
        <WalletCustomModal
          modalVisible={transferModalVisible}
          setModalVisible={setTransferModalVisible}
          nFunction={() => {
            setTransferModalVisible(false);
            navigation.navigate('WalletKlayTransfer');
          }}
          pFunction={() => {
            setTransferModalVisible(false);
            navigation.navigate('WalletLcnTransfer');
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    // marginTop: 80,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    // flex: 1,
    // marginTop: 50,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'green',
  },
  iconContainer: {
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    justifyContent: 'center',
    borderColor: 'black',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 999,
    margin: 5,
    width: 122,
    height: 38,
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  address: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 270,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  iconCircle: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 10,
  },
  icon: {
    width: 35,
    height: 35,
    paddingTop: 20,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  walletText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});

export default WalletOnchainMain;
