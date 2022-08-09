import React, {useState} from 'react';
import {View, Modal, Text, StyleSheet, Image} from 'react-native';
import BasicButton from '../../common/BasicButton';
const person = require('../../../pages/ChattingPage/dummydata/images/person.png');

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [choiceModalVisible, setChoiceModalVisible] = useState(false);

  <ChoiceModal
    buttonText="후기 보내기"
    modalVisible={modalVisible}
    setModalVisible={setModalVisible}
    pFunction={}
  />

  필요시,pFunction 함수를 넣어줄 때 Modal이 닫히도록 해주어야함.
 */

function ChoiceModal({
  text,
  body,
  buttonText,
  choiceModalVisible,
  setChoiceModalVisible,
  setFeedbackModalVisible,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={choiceModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <View>
              <Text>후기를 남길 미팅 상대를 선택해 주세요.</Text>
              <Human
                name="김개똥"
                setChoiceModalVisible={setChoiceModalVisible}
                setFeedbackModalVisible={setFeedbackModalVisible}
              />
              <Human
                name="김영희"
                setChoiceModalVisible={setChoiceModalVisible}
                setFeedbackModalVisible={setFeedbackModalVisible}
              />
              <Human
                name="서상훈"
                variant={'disable'}
                setChoiceModalVisible={setChoiceModalVisible}
                setFeedbackModalVisible={setFeedbackModalVisible}
              />
              <Human
                name="안젤리"
                setChoiceModalVisible={setChoiceModalVisible}
                setFeedbackModalVisible={setFeedbackModalVisible}
              />
              <BasicButton
                text={buttonText}
                size="large"
                variant="basic"
                onPress={() => {
                  setChoiceModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Human({
  name,
  variant,
  setChoiceModalVisible,
  setFeedbackModalVisible,
}) {
  const [state, setState] = useState(variant);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View>
        <Image source={person} style={{width: 40, height: 40}} />
        <Text>{name}</Text>
      </View>
      <BasicButton
        text="선택"
        variant={variant ? state : 'basic'}
        size="small"
        onPress={() => {
          setChoiceModalVisible(false);
          setFeedbackModalVisible(true);
          setState('disable');
        }}
      />
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

export default ChoiceModal;
