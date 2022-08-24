import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import BasicButton from './BasicButton';

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [modalVisible, setModalVisible] = useState(false);

  <SingleModal
    text="미팅을 생성하시겠습니까?"
    //body={<Text>정말로?</Text>}
    buttonText="네"
    modalVisible={modalVisible}
    setModalVisible={setModalVisible}
    pFunction={}
  />

  필요시,pFunction 함수를 넣어줄 때 Modal이 닫히도록 해주어야함.
 */

function SingleModal({
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
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={[styles.centeredView, styles.backgroudDim]}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{text}</Text>
              {body}
              <BasicButton
                text={buttonText}
                textSize={16}
                width={100}
                height={45}
                backgroundColor="#AEFFC1"
                textColor="black"
                onPress={pFunction}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -100,
  },
  modalView: {
    width: 290,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    zIndex: -1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 17,
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
export default SingleModal;
