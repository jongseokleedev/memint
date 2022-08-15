import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import useUser from '../../utils/hooks/UseUser';
import {useToast} from '../../utils/hooks/useToast';
import RoomHeader from '../../components/chattingComponents/roomHeader';
import knowmore from '../../assets/icons/knowmore.png';
import befriend from '../../assets/icons/befriend.png';
import fallinlove from '../../assets/icons/fallinlove.png';
import soso from '../../assets/icons/soso.png';
import notgood from '../../assets/icons/notgood.png';
import terrible from '../../assets/icons/terrible.png';
import DoubleModal from '../../components/common/DoubleModal';
import {sendFeedback} from '../../lib/Meeting';

function FeedbackSendPage({route}) {
  const owner = useUser();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const {person, data, userInfo} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    sender: owner.id,
    receiver: person[2],
    emotion: '',
    message: '',
  });

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: 'yellow'}}>
        <RoomHeader title="돌아가기" />
      </SafeAreaView>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 30}}>
            {`${person[0]}님께 후기를 작성해주세요.`}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Image
              source={{uri: person[1]}}
              style={{width: 79, height: 79, borderRadius: 35}}
            />
            <Text style={styles.name}>{person[0]}</Text>
          </View>
          <View style={styles.emotions}>
            <Emotion
              uri={knowmore}
              state="knowmore"
              text="좀 더 알고싶어요"
              form={form}
              setForm={setForm}
            />
            <Emotion
              uri={befriend}
              state="befriend"
              text="친구가 되고싶어요"
              form={form}
              setForm={setForm}
            />
            <Emotion
              uri={fallinlove}
              state="fallinlove"
              text="사랑에 빠졌어요"
              form={form}
              setForm={setForm}
            />
          </View>
          <View style={{...styles.emotions}}>
            <Emotion
              uri={soso}
              state="soso"
              text="그저 그랬어요"
              form={form}
              setForm={setForm}
            />
            <Emotion
              uri={notgood}
              state="notgood"
              text="다시는 안 보고 싶어요"
              form={form}
              setForm={setForm}
            />
            <Emotion
              uri={terrible}
              state="terrible"
              text="불쾌했어요"
              form={form}
              setForm={setForm}
            />
          </View>
          <View style={styles.message}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {person[0]}님께 보내는 메세지
            </Text>
            <TextInput
              multiline={true}
              style={styles.textInput}
              placeholder="여기에 적어주세요(선택사항)"
              textAlignVertical="top"
              value={form.message}
              maxLength={100}
              onChangeText={text => {
                setForm({...form, message: text});
              }}></TextInput>
            <Text
              style={{
                fontWeight: '500',
                position: 'absolute',
                right: 10,
                bottom: 10,
                color: '#EAEAEA',
              }}>
              {form.message.length} / 100
            </Text>
          </View>
          <Pressable
            style={styles.confirmButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              후기 보내기
            </Text>
          </Pressable>
        </View>
        <DoubleModal
          text={`${person[0]}님의\n후기를 보내시겠습니까?`}
          nButtonText="아니요"
          pButtonText="네"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pFunction={() => {
            sendFeedback(data.id, person[2], owner.id).then(() => {
              showToast('success', '후기를 전송하였습니다.');
              navigation.navigate('FeedbackChoicePage', {data, userInfo});
            });
          }}
          nFunction={() => {
            setModalVisible(!modalVisible);
          }}
        />
      </View>
    </View>
  );
}

function Emotion({uri, text, state, form, setForm}) {
  return (
    <Pressable
      style={styles.emotion}
      onPress={() => {
        setForm({
          ...form,
          emotion: state,
        });
      }}>
      <Image
        source={uri}
        style={
          form.emotion === state
            ? styles.image
            : {...styles.image, tintColor: 'black'}
        }
      />
      <Text
        style={[
          {marginTop: 5},
          {color: form.emotion === state ? '#AEC0EB' : 'black'},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    borderTopWidth: 0.3,
  },
  wrapper: {
    height: '87%',
    width: '90%',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
  },
  emotions: {
    width: '100%',
    height: 80,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emotion: {
    alignItems: 'center',
    minWidth: 91,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
    resizeMode: 'center',
    overflow: 'visible',
    tintColor: '#AEC0EB',
  },
  message: {
    marginTop: 45,
    width: '100%',
    height: 150,
  },
  textInput: {
    backgroundColor: 'white',
    width: '100%',
    height: 120,
    borderWidth: 0.3,
    borderRadius: 7,
    fontSize: 15,
    marginVertical: 13,
    padding: 5,
  },
  confirmButton: {
    backgroundColor: '#040404',
    width: '100%',
    height: 57,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
});

export default FeedbackSendPage;
