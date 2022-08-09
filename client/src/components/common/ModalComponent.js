import React, {useState} from 'react';
import {Modal, Button, View, Text, Pressable, StyleSheet} from 'react-native';

//모달 생성 시 참고할 컴포넌트입니다. 추후 삭제 예정.
//SingleModal, DoubleModal을 최대한 활용해주세요.
function ModalComponent(props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button title={props.buttonOpen} onPress={() => setModalVisible(true)} />
      <View style={styles.centeredView}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={[styles.centeredView, styles.backgroudDim]}>
            <View style={styles.modalView}>
              {props.children}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
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
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
export default ModalComponent;
