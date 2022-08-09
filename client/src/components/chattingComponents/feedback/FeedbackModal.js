import React, {useState} from 'react';
import {View, Modal, Text, StyleSheet, Image} from 'react-native';
import BasicButton from '../../common/BasicButton';
const good = require('../../../pages/ChattingPage/dummydata/images/good.png');
const soso = require('../../../pages/ChattingPage/dummydata/images/soso.png');
const bad = require('../../../pages/ChattingPage/dummydata/images/bad.png');
const terrible = require('../../../pages/ChattingPage/dummydata/images/terrible.png');

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  <FeedbackModal
    buttonText="후기 작성 완료"
    feedbackModalVisible={feedbackModalVisible}
    setFeedbackModalVisible={setFeedbackModalVisible}
    pFunction={}
  />

  필요시,pFunction 함수를 넣어줄 때 Modal이 닫히도록 해주어야함.
 */

function FeedbackModal({
  text,
  body,
  buttonText,
  feedbackModalVisible,
  setFeedbackModalVisible,
  setConfirmModalVisible,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={feedbackModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <View style={{alignItems: 'center', marginBottom: 15}}>
              <Text>미팅에서 김개똥씨는 어땠나요?</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 270,
              }}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={good}
                  style={{width: 50, height: 50, marginBottom: 9}}
                />
                <View
                  style={{
                    backgroundColor: 'lightgray',
                    padding: 3,
                    borderRadius: 5,
                  }}>
                  <Text style={{fontSize: 10}}>좀 더 알고싶어요!</Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={soso}
                  style={{width: 50, height: 50, marginBottom: 9}}
                />
                <View
                  style={{
                    backgroundColor: 'lightgray',
                    padding: 3,
                    borderRadius: 5,
                  }}>
                  <Text style={{fontSize: 10}}>그저 그랬어요</Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={bad}
                  style={{width: 50, height: 50, marginBottom: 9}}
                />
                <View
                  style={{
                    backgroundColor: 'lightgray',
                    padding: 3,
                    borderRadius: 5,
                  }}>
                  <Text style={{fontSize: 10}}>인연이 아닌 것 같아요</Text>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 13, marginTop: 1}}>
                미팅 중에 불쾌한 경험을 했나요?
              </Text>
              <Text style={{fontSize: 13, marginTop: 7}}>
                이 사용자를 다른 분께 추천하고 싶지 않다면
              </Text>
              <Text style={{fontSize: 13, marginTop: 7, marginBottom: 10}}>
                선택해주세요.
              </Text>
              <Image source={terrible} style={{width: 50, height: 50}} />
            </View>
            <BasicButton
              text={buttonText}
              size="large"
              variant="basic"
              onPress={() => {
                setFeedbackModalVisible(false);
                setConfirmModalVisible(true);
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
    width: 350,
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

export default FeedbackModal;
