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
import RoomHeader from '../../components/chattingComponents/roomHeader';
const person = require('./dummydata/images/person.png');

function FeedbackChoicePage({route}) {
  const owner = useUser();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [users, setUsers] = useState('');
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const navigation = useNavigation();
  const {showToast} = useToast();

  useEffect(() => {
    // setUsers(
    //   route.params.data.members
    //     // .slice(1)
    //     .map(el => {
    //       return Object.keys(el);
    //     })
    //     .flat(),
    // );
    const {userInfo} = route.params;

    console.log(route.params.userInfo);
  }, [route]);

  const people =
    users &&
    users.map((el, idx) => {
      return <Human id={el} data={route.params.data} key={idx} />;
    });

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: 'yellow'}}>
        <RoomHeader title="돌아가기" />
      </SafeAreaView>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 60}}>
            {owner.nickName}님,{'\n'}오늘의 미팅은 어떠셨나요?
          </Text>
          <View>
            <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 20}}>
              후기를 남길 미팅 상대를 선택하세요.
            </Text>
            <Text style={{fontWeight: '200'}}>
              최소 한 명 이상 후기를 작성해주세요.
            </Text>
          </View>
        </View>
      </View>
    </View>
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: 'pink',
    borderTopWidth: 0.3,
  },
  wrapper: {
    height: '87%',
    width: '90%',
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
