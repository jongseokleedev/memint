import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import {useNavigation} from '@react-navigation/native';
import ConfirmModal from '../../components/chattingComponents/feedback/ConfirmModal';
import BackButton from '../../components/common/BackButton';
import {getUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import EarnModal from '../../components/common/UserInfoModal/EarnModal';
import {useToast} from '../../utils/hooks/useToast';
const person = require('./dummydata/images/person.png');

function FeedbackChoicePage({route}) {
  const owner = useUser();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [users, setUsers] = useState('');
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const navigation = useNavigation();
  const {showToast} = useToast();

  useEffect(() => {
    setUsers(
      route.params.data.members
        // .slice(1)
        .map(el => {
          return Object.keys(el);
        })
        .flat(),
    );
  }, [route]);

  const people =
    users &&
    users.map((el, idx) => {
      return <Human id={el} data={route.params.data} key={idx} />;
    });

  return (
    <SafeAreaView style={styles.view}>
      <BackButton />
      <View style={[styles.centeredView, styles.backgroudDim]}>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 20}}>
          {owner.nickName}님! 오늘의 미팅은 어떠셨나요?
        </Text>
        <View style={styles.modalView}>
          <Text>후기를 남길 미팅 상대를 선택해 주세요.</Text>
          {people}
          <BasicButton
            text="후기 보내기"
            size="large"
            onPress={() => {
              setConfirmModalVisible(true);
            }}
          />
          <ConfirmModal
            confirmModalVisible={confirmModalVisible}
            setConfirmModalVisible={setConfirmModalVisible}
            setEarnModalVisible={setEarnModalVisible}
          />
          <EarnModal
            EarnModalVisible={earnModalVisible}
            setEarnModalVisible={setEarnModalVisible}
            txType="후기 작성"
            pFunction={() => {
              setEarnModalVisible(false);
              showToast('basic', 'LCN + 1');
              navigation.navigate('채팅 목록');
            }}
            amount={1}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Human({id, data}) {
  const navigation = useNavigation();
  const [nickName, setNickName] = useState('');
  const [img, setImg] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const owner = useUser();

  useEffect(() => {
    getUser(id).then(result => {
      setNickName(result.nickName);
      return setImg(result.nftProfile);
    });
  }, [id]);

  return id === owner.id ? null : (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        width: 300,
      }}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={img ? {uri: img} : person}
          style={{width: 60, height: 60, borderRadius: 30}}
        />
        <Text>{nickName && nickName}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setConfirmed(true);
          navigation.navigate('FeedbackSendPage', {data, name: nickName});
        }}>
        <View
          style={
            confirmed
              ? styles.button
              : [styles.button, {backgroundColor: '#609afa'}]
          }>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            {confirmed ? '완료' : '선택'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    flex: 1,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
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
    // position: 'absolute',
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
  button: {
    height: 40,
    width: 100,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedbackChoicePage;
