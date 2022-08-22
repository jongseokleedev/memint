import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useToast} from '../../utils/hooks/useToast';
import TagElement from '../../components/meetingComponents/TagElement';
import DoubleModal from '../../components/common/DoubleModal';
import {createMeeting, getMeeting} from '../../lib/Meeting';
import {getMeetingTags} from '../../lib/MeetingTag';
import useUser from '../../utils/hooks/UseUser';
import {updateUserMeetingIn} from '../../lib/Users';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import useMeetingActions from '../../utils/hooks/UseMeetingActions';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import SpendingModal from '../../components/common/UserInfoModal/SpendingModal';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';

function MeetingCreate({route}) {
  const userInfo = useUser();
  const {saveInfo} = useAuthActions();
  const {saveMeeting} = useMeetingActions();
  const {rooms} = useMeeting();

  const [submittable, setSubmittable] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({
    title: '',
    description: '',
    meetDate: new Date(),
    region: undefined,
    peopleNum: undefined,
    friends: [],
    meetingTags: [],
  });
  const [friendsNames, setFriendsName] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [inviteSpendingModalVisible, setInviteSpendingModalVisible] =
    useState(false);
  const [createSpendingModalVisible, setCreateSpendingModalVisible] =
    useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [tagData, setTagData] = useState({mood: [], topic: [], alcohol: []});
  const navigation = useNavigation();
  const {showToast} = useToast();
  const RegionDropDownData = [
    {label: '서울 전체', value: '서울 전체'},
    {label: '강남', value: '강남'},
    {label: '신사', value: '신사'},
    {label: '홍대', value: '홍대'},
    {label: '신촌', value: '신촌'},
    {label: '여의도', value: '여의도'},
    {label: '구로', value: '구로'},
    {label: '신도림', value: '신도림'},
    {label: '혜화', value: '혜화'},
    {label: '안암', value: '안암'},
    {label: '종로', value: '종로'},
    {label: '동대문', value: '동대문'},
    {label: '성수', value: '성수'},
    {label: '이태원', value: '이태원'},
  ];
  const PeopleDropDownData = [
    {label: '1:1', value: 1},
    {label: '2:2', value: 2},
    {label: '3:3', value: 3},
    {label: '4:4', value: 4},
  ];

  useEffect(() => {
    const {title, description, region, peopleNum} = meetingInfo;
    if (title && description && region && peopleNum) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
    getTags();
    handleInvitedFriends();
  }, [meetingInfo, route, handleInvitedFriends]);

  const handleInvitedFriends = useCallback(() => {
    if (route.params?.friendId === undefined) {
      return;
    }
    if (meetingInfo.friends.indexOf(route.params.friendId) !== -1) {
      showToast('error', '이미 추가된 친구입니다');
      route.params.friendId = undefined;
      route.params.friendNickname = undefined;
      return;
    }
    setMeetingInfo({
      ...meetingInfo,
      friends: [...meetingInfo.friends, route.params.friendId],
    });
    setFriendsName([...friendsNames, route.params.friendNickname]);
    route.params.friendId = undefined;
    route.params.friendNickname = undefined;
  }, [meetingInfo, route, showToast, friendsNames]);

  const getTags = async () => {
    try {
      const res = await getMeetingTags();
      const data = res.docs.reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur.data().type]: acc[cur.data().type].concat(cur.data().content),
          };
        },
        {mood: [], topic: [], alcohol: []},
      );
      setTagData(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = () => {
    if (!submittable) {
      showToast('error', '필수 항목들을 작성해주세요');
      return;
    } else {
      setConfirmModalVisible(true);
    }
  };

  //생성 요청
  const handleCreateMeeting = async () => {
    const data = {
      ...meetingInfo,
      hostId: userInfo.id,
    };
    try {
      const res = await createMeeting(data); //Meeting 추가
      updateUserMeetingIn(
        //User에 room 추가
        userInfo.id,
        'createdroomId',
        res._documentPath._parts[1],
      );
      // const newMeeting = await getMeeting(res._documentPath._parts[1]);
      // saveInfo({
      //   ...userInfo,
      //   createdroomId: [...userInfo.createdroomId, res._documentPath._parts[1]],
      // });
      // saveMeeting({
      //   ...rooms,
      //   createdrooms: [
      //     {id: newMeeting.id, ...newMeeting.data()},
      //     ...rooms.createdrooms,
      //   ],
      // });
      setConfirmModalVisible(false);
      showToast('success', '미팅이 생성되었습니다');
      navigation.navigate('MeetingMarket');
    } catch (e) {
      setConfirmModalVisible(false);
      showToast('error', '미팅 생성에 실패했습니다');
      console.log(e);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('InviteFriend');
  };

  return (
    <View style={styles.view}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 0.3, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.headerBar}>
          <View style={styles.flexRow}>
            <BackButton />
          </View>

          <Pressable onPress={handleSubmit}>
            <Text
              style={
                submittable ? styles.completeButton : styles.incompleteButton
              }>
              완료
            </Text>
          </Pressable>
        </View>
        <DoubleModal
          text="미팅 생성 시 LCN이 차감됩니다.    미팅을 생성하시겠습니까?"
          buttonText="네"
          modalVisible={confirmModalVisible}
          setModalVisible={setConfirmModalVisible}
          nFunction={() => {
            setConfirmModalVisible(!confirmModalVisible);
          }}
          pFunction={() => {
            setConfirmModalVisible(!confirmModalVisible);
            setCreateSpendingModalVisible(true);
          }}
        />
        <SpendingModal
          spendingModalVisible={createSpendingModalVisible}
          setSpendingModalVisible={setCreateSpendingModalVisible}
          pFunction={handleCreateMeeting}
          amount={1}
          txType="미팅 생성"
        />
        <ScrollView style={styles.createContainer}>
          <Text style={styles.title}>미팅 생성</Text>

          <TextInput
            style={styles.textInputTitle}
            placeholder="제목"
            placeholderTextColor="#EAFFEF"
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, title: text});
            }}
            autoComplete={false}
            autoCorrect={false}
            maxLength={30}
          />
          <View
            style={[
              styles.line,
              meetingInfo.title.length > 0 ? styles.activeLine : null,
            ]}
          />
          <TextInput
            style={styles.textInputDes}
            placeholder="설명"
            placeholderTextColor="#EAFFEF"
            multiline={true}
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, description: text});
            }}
            autoComplete={false}
            autoCorrect={false}
          />
          <View
            style={[
              styles.line,
              meetingInfo.description.length > 0 ? styles.activeLine : null,
            ]}
          />
          <View style={[styles.createElement, styles.flexRow]}>
            <Text style={styles.text}>날짜</Text>
            <RNDateTimePicker
              value={meetingInfo.meetDate}
              mode="datetime"
              textColor="#EAFFEF"
              themeVariant="dark"
              style={styles.datepicker}
              onChange={(event, date) =>
                setMeetingInfo({...meetingInfo, meetDate: date})
              }
            />
          </View>
          <View style={[styles.createElement, styles.flexRow]}>
            <Pressable style={styles.selectButton}>
              <RNPickerSelect
                placeholder={{label: '지역'}}
                onValueChange={value => {
                  setMeetingInfo({...meetingInfo, region: value});
                }}
                items={RegionDropDownData}
                value={meetingInfo.region}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                  },
                  placeholder: {
                    fontSize: 16,
                    color: '#EAFFEF',
                    letterSpacing: -0.5,
                  },
                }}
                Icon={() => {
                  return (
                    <Icon
                      name="arrow-drop-down"
                      size={19}
                      color={'#EAFFEF'}
                      style={styles.icon}
                    />
                  );
                }}
              />
            </Pressable>
          </View>
          <View
            style={[styles.line, meetingInfo.region ? styles.activeLine : null]}
          />
          <View style={[styles.createElement, styles.flexRow]}>
            <Pressable style={[styles.selectButton, styles.rightMargin]}>
              <RNPickerSelect
                placeholder={{label: '인원'}}
                onValueChange={value => {
                  setMeetingInfo({...meetingInfo, peopleNum: value});
                }}
                items={PeopleDropDownData}
                value={meetingInfo.peopleNum}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                  },
                  placeholder: {
                    fontSize: 16,
                    color: '#EAFFEF',
                    letterSpacing: -0.5,
                  },
                }}
                Icon={() => {
                  return (
                    <Icon
                      name="arrow-drop-down"
                      size={19}
                      color={'#EAFFEF'}
                      style={styles.icon}
                    />
                  );
                }}
              />
            </Pressable>
            <ScrollView style={styles.invitedFriends} horizontal={true}>
              {friendsNames.map((el, idx) => (
                <View key={idx}>
                  <Text style={styles.invitedFriend}>{el}</Text>
                </View>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => {
                if (meetingInfo.friends.length + 1 >= meetingInfo.peopleNum) {
                  showToast(
                    'error',
                    '설정한 인원의 과반수 이상 초대할 수 없습니다',
                  );
                  return;
                }
                handleNavigate();
              }}>
              <Text style={[styles.text, styles.leftMargin]}>
                친구 초대하기
              </Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.line,
              meetingInfo.peopleNum ? styles.activeLine : null,
            ]}
          />
          {/* <DoubleModal
            text="친구 초대 시 LCN이 차감됩니다.    초대하시겠습니까?"
            nButtonText="아니요"
            pButtonText="네"
            modalVisible={inviteModalVisible}
            setModalVisible={setInviteModalVisible}
            pFunction={() => {
              setInviteModalVisible(!inviteModalVisible);
              setInviteSpendingModalVisible(true);
            }}
            nFunction={() => {
              setInviteModalVisible(!inviteModalVisible);
            }}
          />
          <SpendingModal
            spendingModalVisible={inviteSpendingModalVisible}
            setSpendingModalVisible={setInviteSpendingModalVisible}
            pFunction={handleNavigate}
            amount={1}
            txType="친구 초대"
          /> */}
          <View style={styles.tagElement}>
            <Text style={[styles.text, styles.tagTitle]}>태그</Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tagCategory}>
                <Icon
                  name="circle"
                  size={8}
                  color={'#EAFFEF'}
                  style={styles.tagIcon}
                />
                <View style={styles.tags}>
                  {tagData.mood.map((tag, idx) => (
                    <TagElement
                      key={idx}
                      tag={tag}
                      meetingInfo={meetingInfo}
                      setMeetingInfo={setMeetingInfo}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.tagCategory}>
                <Icon
                  name="circle"
                  size={8}
                  color={'#EAFFEF'}
                  style={styles.tagIcon}
                />
                <View style={styles.tags} horizontal={true}>
                  {tagData.topic.map((tag, idx) => (
                    <TagElement
                      key={idx}
                      tag={tag}
                      meetingInfo={meetingInfo}
                      setMeetingInfo={setMeetingInfo}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.tagCategory}>
                <Icon
                  name="circle"
                  size={8}
                  color={'#EAFFEF'}
                  style={styles.tagIcon}
                />
                <View style={styles.tags} horizontal={true}>
                  {tagData.alcohol.map((tag, idx) => (
                    <TagElement
                      key={idx}
                      tag={tag}
                      meetingInfo={meetingInfo}
                      setMeetingInfo={setMeetingInfo}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  createContainer: {
    paddingHorizontal: 15,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
    height: 35,
    // borderBottomColor: 'gray',
    // borderBottomWidth: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginVertical: 20,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  completeButton: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  incompleteButton: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'gray',
    letterSpacing: -0.5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createElement: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 60,
  },
  tagElement: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#EAFFEF',
    letterSpacing: -0.5,
  },
  datepicker: {
    width: 240,
  },
  textInputTitle: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    // borderBottomColor: '#EAFFEF',
    // borderBottomWidth: 1,
    height: 60,
    padding: 10,
    fontSize: 16,
    letterSpacing: -0.5,
  },
  textInputDes: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    minHeight: 60,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 10,
    fontSize: 16,
    letterSpacing: -0.5,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagTitle: {
    marginTop: 10,
  },
  tagsContainer: {
    marginBottom: 70,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  tagCategory: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-start',
  },
  invitedFriends: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  leftMargin: {
    marginLeft: 5,
  },
  rightMargin: {
    marginRight: 5,
  },
  icon: {
    position: 'absolute',
  },
  tagIcon: {
    marginTop: 15,
    marginRight: 3,
  },
  line: {
    height: 1,
    backgroundColor: '#EAFFEF',
  },
  activeLine: {
    backgroundColor: '#AEFFC1',
  },
  invitedFriend: {
    color: '#ffffff',
  },
});

export default MeetingCreate;
