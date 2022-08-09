import React, {useState} from 'react';
import {View, Modal, Text, StyleSheet, Image} from 'react-native';
import BasicButton from '../../common/BasicButton';
import {useNavigation} from '@react-navigation/native';

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

  <CompleteModal
    buttonText="다른 후기 작성하러 가기"
    completeModalVisible={completeModalVisible}
    setCompleteModalVisible={setCompleteModalVisible}
    setChoiceModalVisible={setChoiceModalVisible}
  />

  필요시,pFunction 함수를 넣어줄 때 Modal이 닫히도록 해주어야함.
 */

function CompleteModal({
  buttonText,
  completeModalVisible,
  setCompleteModalVisible,
  data,
  name,
}) {
  const navigation = useNavigation();
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={completeModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <Text style={{margin: 10}}>{name} 님에 대한 후기 작성이</Text>
            <Text style={{marginBottom: 10}}>완료되었어요</Text>
            <BasicButton
              text={buttonText}
              width={200}
              variant="basic"
              onPress={() => {
                setCompleteModalVisible(false);
                navigation.navigate('FeedbackChoicePage', {data});
              }}
            />
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

export default CompleteModal;
