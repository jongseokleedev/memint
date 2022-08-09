import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import BasicButton from '../BasicButton';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [askSpendingModalVisible, setAskSpendingModalVisible] = useState(false);

      <AskSpendingModal
        nButtonText="아니오"
        pButtonText="네"
        askSpendingModalVisible={askSpendingModalVisible}
        setAskSpendingModalVisible={setAskSpendingModalVisible}
        pFunction={() => {}}
      />
 */

function AskSpendingModal({
  pButtonText,
  nButtonText,
  askSpendingModalVisible,
  setAskSpendingModalVisible,
  pFunction,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={askSpendingModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <View style={{alignItems: 'center'}}>
              <Text>프로필 사진을 확인하시겠어요?</Text>
              <Text style={{fontWeight: 'bold', margin: 10}}>
                1LCN이 소모됩니다.
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <BasicButton
                text={nButtonText}
                size="small"
                variant="disable"
                onPress={() =>
                  setAskSpendingModalVisible(!askSpendingModalVisible)
                }
              />
              <BasicButton
                text={pButtonText}
                size="small"
                onPress={pFunction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
  },
  modalText: {
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  buttonRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});
export default AskSpendingModal;
