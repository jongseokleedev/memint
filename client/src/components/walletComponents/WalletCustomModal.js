import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import lcnIcon from '../../assets/icons/lovechain.png';
import ethIcon from '../../assets/icons/ethereum.png';
/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [modalVisible, setModalVisible] = useState(false);

      <WalletCustomModal
        text="미팅을 생성하시겠습니까?"
        //body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {}}
        nFunction={() => {setModalVisible(!modalVisible)}}
      />
 */

function WalletCustomModal({
  text,
  body,
  pButtonText,
  nButtonText,
  modalVisible,
  setModalVisible,
  pFunction,
  nFunction,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={[styles.centeredView, styles.backgroudDim]}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.tokenWrapper} onPress={nFunction}>
                {/* <Image source={klayIcon} style={styles.icon} /> */}
                <Text style={styles.contentText}>KLAY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tokenWrapper} onPress={pFunction}>
                {/* <Image source={lcnIcon} style={styles.icon} /> */}
                <Text style={styles.contentText}>LCN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

WalletCustomModal.defaultProps = {
  pFunction: () => {},
  nFunction: () => {},
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 30,
    borderColor: '#AEFFC1',
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: 20,
    // backgroundColor: 'green',
  },
  tokenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    width: 250,
    height: 52,
    marginTop: 10,
  },
  contentText: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
export default WalletCustomModal;
