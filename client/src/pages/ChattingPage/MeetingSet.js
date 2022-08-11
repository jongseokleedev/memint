import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/common/BackButton';
import DoubleModal from '../../components/common/DoubleModal';
import {
  deleteMeeting,
  updateMeeting,
  updateMembersOut,
} from '../../lib/Meeting';
import {updateUserMeetingOut} from '../../lib/Users';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';

function MeetingSet({route}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // useEffect(() => {
  //   console.log({meetingInfo: route.params.meetingInfo});
  //   console.log({userInfo: route.params.userInfo});
  // }, []);
  const meetingInfo = route.params.meetingInfo;
  const userInfo = useUser();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const handleNavigateToEdit = () => {
    navigation.navigate('EditMeetingInfo', {
      item: {
        ...route.params.meetingInfo,
        meetDate: route.params.meetingInfo.meetDate.toDate().toISOString(),
      },
    });
  };
  const handleNavigateToMemberOut = () => {
    //meetingInfo 필요함!
    // navigation.navigate('MeetingMemberOut',{item: item});
    navigation.navigate('MeetingMemberOut', {data: route.params.userInfo});
  };
  const handleNavigateToReport = () => {
    navigation.navigate('Report');
  };

  const handleDelete = () => {
    //미팅이 full, open 일때만 삭제 가능
    if (meetingInfo.status !== 'full' && meetingInfo.status !== 'open') {
      showToast('error', '미팅 확정 이후에는 삭제할 수 없습니다');
      return;
    }

    updateUserMeetingOut(userInfo.id, 'createdroomId', meetingInfo.id)
      .then(() => {
        route.params.userInfo.map(el => {
          if (el[2] !== meetingInfo.hostId) {
            updateUserMeetingOut(el[2], 'joinedroomId', meetingInfo.id);
          }
        });
      })
      .then(() => {
        deleteMeeting(meetingInfo.id);
      })
      .then(() => {
        showToast('success', '미팅이 삭제되었습니다.');
        setDeleteModalVisible(!deleteModalVisible);
        navigation.navigate('ChattingListPage');
        // navigation.reset({routes: [{name: 'MeetingMarket'}]});
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleMeetingOut = () => {
    //미팅이 확정상태라면 나가지 못함
    if (
      (meetingInfo.status !== 'full' && meetingInfo.status !== 'open') ||
      meetingInfo.members[userInfo.id] !== 'accepted'
    ) {
      showToast('error', '미팅 확정 이후에는 나갈 수 없습니다');
      return;
    }
    updateMembersOut(meetingInfo.id, userInfo.id)
      .then(() => {
        updateUserMeetingOut(userInfo.id, 'joinedroomId', meetingInfo.id);
      })
      .then(() => {
        if (meetingInfo.status === 'full') {
          updateMeeting(meetingInfo.id, {status: 'open'});
        }
      })
      .then(() => {
        showToast('success', '미팅에서 나왔습니다');
        navigation.navigate('ChattingListPage');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const renderByUser = () => {
    if (route.params.meetingInfo.hostId === userInfo.id) {
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
          <TouchableOpacity
            style={styles.li}
            onPress={() => {
              setDeleteModalVisible(true);
            }}>
            <Text style={[styles.liText, styles.deleteText]}>
              미팅 삭제하기
            </Text>
          </TouchableOpacity>
          <DoubleModal
            text="미팅룸 삭제 후 복구가 불가합니다. 삭제하시겠습니까?"
            nButtonText="네"
            pButtonText="아니오"
            modalVisible={deleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            pFunction={() => {
              setDeleteModalVisible(false);
            }}
            nFunction={handleDelete}
          />
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
