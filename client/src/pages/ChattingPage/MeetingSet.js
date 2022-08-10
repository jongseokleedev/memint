import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/common/BackButton';
import useUser from '../../utils/hooks/UseUser';

function MeetingSet({route}) {
  //dummy
  const isHost = true;
  const userInfo = useUser();
  const navigation = useNavigation();
  const handleNavigateToEdit = () => {
    //meetingInfo 필요함!
    // navigation.navigate('EditMeetingInfo',{item: item});
  };
  const handleNavigateToMemberOut = () => {
    //meetingInfo 필요함!
    // navigation.navigate('MeetingMemberOut',{item: item});
    navigation.navigate('MeetingMemberOut')
  };
  const handleNavigateToReport = () => {
    navigation.navigate('Report');
  };
  const handleDelete = () => {
    //meetingId, userId 필요
    // deleteMeeting(item.id);
    //   updateUserMeetingOut(userInfo.id, 'createdroomId', item.id);
    //   showToast('success', '미팅이 삭제되었습니다.');
    //   navigation.pop();
  };
  const handleMeetingOut = () => {
    //미팅이 확정상태라면 나가지 못함
    //나간 후에 full -> open 이 되는지 확인
    //meetingId, userId 필요
    //updateMemberOut(item.id, userInfo.id)
    //updateUserMeetingOut(userInfo.id, 'joinedroomId', item.id)
    //navigate
  };
  const renderByUser = () => {
    //if(userInfo.id === hostId)
    if (isHost) {
      return (
        <>
          <TouchableOpacity style={styles.li} onPress={handleNavigateToEdit}>
            <Text style={styles.liText}>미팅 정보 변경하기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.li} onPress={handleNavigateToReport}>
            <Text style={styles.liText}>신고하기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.li}
            onPress={handleNavigateToMemberOut}>
            <Text style={styles.liText}>미팅 멤버 내보내기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.li} onPress={handleDelete}>
            <Text style={[styles.liText, styles.deleteText]}>
              미팅 삭제하기
            </Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity style={styles.li} onPress={handleNavigateToReport}>
            <Text style={styles.liText}>신고하기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.li} onPress={handleMeetingOut}>
            <Text style={[styles.liText, styles.deleteText]}>미팅 나가기</Text>
          </TouchableOpacity>
        </>
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>채팅방 설정</Text>
      </View>
      <View style={styles.ul}>{renderByUser()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  ul: {
    marginTop: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  liText: {
    fontSize: 16,
  },
  deleteText: {
    color: '#f87171',
  },
});

export default MeetingSet;
