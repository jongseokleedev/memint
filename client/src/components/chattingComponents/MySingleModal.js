import React from 'react';
import {View, Modal, Text, StyleSheet} from 'react-native';
import BasicButton from '../common/BasicButton';

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [mySingleModalVisible, setMySingleModalVisible] = useState(false);

  <MySingleModal
    text="LCN이 차감되었습니다!"

    buttonText="네"
    modalVisible={mySingleModalVisible}
    setModalVisible={setMySingleModalVisible}
    pFunction={}
  />

  필요시,pFunction 함수를 넣어줄 때 Modal이 닫히도록 해주어야함.
 */

function MySingleModal({
  text,
  body,
  buttonText,
  modalVisible,
  setModalVisible,
  pFunction,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{text}</Text>
            {body}
            <BasicButton text={buttonText} size="medium" onPress={pFunction} />
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
});
export default MySingleModal;
