import React, {useState} from 'react';
import {View, Modal, Text, StyleSheet, Image, SafeAreaView} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import {useNavigation} from '@react-navigation/native';
import CompleteModal from '../../components/chattingComponents/feedback/CompleteModal';
import BackButton from '../../components/common/BackButton';
import useUser from '../../utils/hooks/UseUser';
const good = require('./dummydata/images/good.png');
const soso = require('./dummydata/images/soso.png');
const bad = require('./dummydata/images/bad.png');
const terrible = require('./dummydata/images/terrible.png');

function FeedbackSendPage({route}) {
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const owner = useUser();

  return (
    <SafeAreaView style={styles.view}>
      <BackButton />
      <View style={[styles.centeredView, styles.backgroudDim]}>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 20}}>
          {owner.nickName}님! 오늘의 미팅은 어떠셨나요?
        </Text>
        <View style={styles.modalView}>
          <View style={{alignItems: 'center', marginBottom: 15}}>
            <Text>미팅에서 {route.params.name} 님은 어땠나요?</Text>
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
                style={{width: 50, height: 50, marginVertical: 20}}
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
                style={{width: 50, height: 50, marginVertical: 20}}
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
                style={{width: 50, height: 50, marginVertical: 20}}
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
            <Text style={{fontSize: 13, marginTop: 20}}>
              미팅 중에 불쾌한 경험을 했나요?
            </Text>
            <Text style={{fontSize: 13, marginTop: 7}}>
              이 사용자를 다른 분께 추천하고 싶지 않다면
            </Text>
            <Text style={{fontSize: 13, marginTop: 7, marginBottom: 10}}>
              선택해주세요.
            </Text>
            <Image
              source={terrible}
              style={{width: 50, height: 50, marginVertical: 20}}
            />
          </View>
          <BasicButton
            text="후기 작성 완료"
            size="large"
            variant="basic"
            onPress={() => {
              setCompleteModalVisible(true);
            }}
          />
          <CompleteModal
            buttonText="다른 후기 작성하러 가기"
            name={route.params.name}
            completeModalVisible={completeModalVisible}
            setCompleteModalVisible={setCompleteModalVisible}
            data={route.params.data}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
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
    height: 470,
    justifyContent: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  backgroudDim: {
    flex: 1,
    // backgroundColor: 'lightgray',
  },
});

export default FeedbackSendPage;
