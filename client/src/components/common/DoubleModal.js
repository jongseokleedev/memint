import React from 'react';
import {View, Modal, Text, StyleSheet} from 'react-native';
import BasicButton from './BasicButton';

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [modalVisible, setModalVisible] = useState(false);

      <DoubleModal
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

function DoubleModal({
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
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{text}</Text>
            {body}
            <View style={styles.buttonRow}>
              {nFunction !== undefined ? (
                <BasicButton
                  text={nButtonText}
                  width={80}
                  height={40}
                  backgroundColor="white"
                  textColor="black"
                  border={true}
                  onPress={nFunction}
                />
              ) : (
                <BasicButton
                  text={nButtonText}
                  width={80}
                  height={40}
                  backgroundColor="white"
                  textColor="black"
                  border={true}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              )}
              <BasicButton
                text={pButtonText}
                width={80}
                height={40}
                onPress={pFunction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

DoubleModal.defaultProps = {
  text: '모달?',
  //body={<Text>정말로?</Text>}
  nButtonText: '아니요',
  pButtonText: '네',
  pFunction: () => {},
  nFunction: () => {},
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
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
export default DoubleModal;
