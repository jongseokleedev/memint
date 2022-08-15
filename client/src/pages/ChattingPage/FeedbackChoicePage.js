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
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import ConfirmModal from '../../components/chattingComponents/feedback/ConfirmModal';
import BackButton from '../../components/common/BackButton';
import {getUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import EarnModal from '../../components/common/UserInfoModal/EarnModal';
import {useToast} from '../../utils/hooks/useToast';
import RoomHeader from '../../components/chattingComponents/roomHeader';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import {setFeedbackEnd} from '../../lib/Meeting';
import DoubleModal from '../../components/common/DoubleModal';
const person = require('./dummydata/images/person.png');

function FeedbackChoicePage({route}) {
  const isFocused = useIsFocused();

  const owner = useUser();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [other, setOther] = useState('');
  const {data, userInfo} = route.params;

  useEffect(() => {
    firestore()
      .collection('User')
      .doc(owner.id)
      .collection('Feedback')
      .doc(data.id)
      .get()
      .then(result => {
        const other = userInfo
          .filter(el => {
            return el[2] !== owner.id;
          })
          .map(el => {
            return [...el, result.data()[el[2]]];
          });

        setOther(
          other.map((el, idx) => {
            return (
              <Human
                person={el}
                key={idx}
                meetingId={data.id}
                data={data}
                userInfo={userInfo}
              />
            );
          }),
        );
      });
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: 'yellow'}}>
        <RoomHeader title="돌아가기" />
      </SafeAreaView>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 60}}>
            {owner.nickName}님,{'\n'}
            {userInfo.length === 2
              ? `${
                  userInfo.filter(el => {
                    return el[2] !== owner.id;
                  })[0][0]
                } 님과의 미팅은 어떠셨나요?`
              : `${
                  userInfo.filter(el => {
                    return el[2] !== owner.id;
                  })[0][0]
                }님 외 ${userInfo.length - 2}명과의 미팅은 어떠셨나요?`}
          </Text>
          <View>
            <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 7}}>
              후기를 남길 미팅 상대를 선택하세요.
            </Text>
            <Text style={{fontWeight: '200'}}>
              최소 한 명 이상 후기를 작성해주세요.
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
            }}>
            {other && other}
            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                후기 작성 완료하기
              </Text>
            </Pressable>
          </View>
          <DoubleModal
            text="후기 작성을 완료하시겠습니까?"
            nButtonText="아니요"
            pButtonText="네"
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            pFunction={() => {
              setFeedbackEnd(data.id, owner.id).then(() => {
                showToast('success', '후기 보내기를 완료하였습니다.');
                // 토큰 보상 로직 추가
              });
            }}
            nFunction={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      </View>
    </View>
  );
}

function Human({person, meetingId, data, userInfo}) {
  const navigation = useNavigation();
  const {showToast} = useToast();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 10,
      }}>
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <Image
          source={{uri: person[1]}}
          style={{width: 50, height: 50, borderRadius: 25}}
        />
        <Text style={{fontSize: 16, marginLeft: 12}}>{person[0]}</Text>
      </View>
      <TouchableOpacity
        style={
          person[4]
            ? [styles.button, {backgroundColor: '#b7b7b7'}]
            : styles.button
        }
        onPress={() => {
          person[4]
            ? showToast('error', '이미 후기를 보내셨습니다.')
            : navigation.navigate('FeedbackSendPage', {
                person,
                data,
                userInfo,
              });
        }}>
        <Text style={{color: 'white', fontSize: 14, fontWeight: '700'}}>
          후기 작성하기
        </Text>
      </TouchableOpacity>
    </View>
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

  button: {
    height: 34,
    width: 100,
    backgroundColor: '#0D99FF',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
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

export default FeedbackChoicePage;
