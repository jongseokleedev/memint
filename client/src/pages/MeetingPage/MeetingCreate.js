import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import {TextInput} from 'react-native-paper';
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

function MeetingCreate({route}) {
  const userInfo = useUser();
  const {saveInfo} = useAuthActions();
  // const {saveMeeting} = useMeetingActions();
  // const rooms = useMeeting();

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
    {label: '?????? ??????', value: '?????? ??????'},
    {label: '??????', value: '??????'},
    {label: '??????', value: '??????'},
    {label: '??????', value: '??????'},
    {label: '??????', value: '??????'},
    {label: '?????????', value: '?????????'},
    {label: '??????', value: '??????'},
    {label: '?????????', value: '?????????'},
    {label: '??????', value: '??????'},
    {label: '??????', value: '??????'},
    {label: '??????', value: '??????'},
    {label: '?????????', value: '?????????'},
    {label: '??????', value: '??????'},
    {label: '?????????', value: '?????????'},
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
      showToast('error', '?????? ????????? ???????????????');
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
      showToast('error', '?????? ???????????? ??????????????????');
      return;
    } else {
      setConfirmModalVisible(true);
    }
  };
  //?????? ??????
  const handleCreateMeeting = async () => {
    const data = {
      ...meetingInfo,
      hostId: userInfo.id,
    };
    try {
      const res = await createMeeting(data); //Meeting ??????
      updateUserMeetingIn(
        //User??? room ??????
        userInfo.id,
        'createdroomId',
        res._documentPath._parts[1],
      );
      // const newMeeting = await getMeeting(res._documentPath._parts[1]);
      // saveInfo({
      //   ...userInfo,
      //   createdroomId: [...userInfo.createdroomId, res._documentPath._parts[1]],
      // });
      // saveMeeting([
      //   ...rooms,
      //   {
      //     id: newMeeting.id,
      //     ...newMeeting.data(),
      //   },
      // ]);
      setConfirmModalVisible(false);
      showToast('success', '????????? ?????????????????????');
      navigation.navigate('MeetingMarket');
    } catch (e) {
      setConfirmModalVisible(false);
      showToast('error', '?????? ????????? ??????????????????');
      console.log(e);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('InviteFriend');
  };

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.headerBar}>
        <View style={styles.flexRow}>
          <BackButton />
          <Text style={styles.title}>?????? ?????????</Text>
        </View>

        <Pressable onPress={handleSubmit}>
          <Text style={submittable ? styles.title : styles.grayButton}>
            ??????
          </Text>
        </Pressable>
      </View>
      <DoubleModal
        text="?????? ?????? ??? LCN??? ???????????????.    ????????? ?????????????????????????"
        buttonText="???"
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
        txType="?????? ??????"
      />
      <View style={styles.createContainer}>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder="??????"
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, title: text});
            }}
            autoComplete={false}
            autoCorrect={false}
          />
        </View>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder="??????"
            multiline={true}
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, description: text});
            }}
            autoComplete={false}
            autoCorrect={false}
          />
        </View>
        <View style={[styles.createElement, styles.flexRow]}>
          <Text style={styles.text}>??????</Text>
          <RNDateTimePicker
            value={meetingInfo.meetDate}
            mode="datetime"
            locale="ko"
            style={styles.datepicker}
            onChange={(event, date) =>
              setMeetingInfo({...meetingInfo, meetDate: date})
            }
          />
        </View>
        <View style={[styles.createElement, styles.flexRow]}>
          <Pressable style={styles.selectButton}>
            <RNPickerSelect
              placeholder={{label: '??????'}}
              onValueChange={value => {
                setMeetingInfo({...meetingInfo, region: value});
              }}
              items={RegionDropDownData}
              value={meetingInfo.region}
              style={{
                inputIOS: {
                  fontSize: 16,
                  color: 'black',
                },
                placeholder: {
                  fontSize: 16,
                  color: 'gray',
                },
              }}
            />
            <Icon name="arrow-drop-down" size={19} color={'gray'} />
          </Pressable>
        </View>
        <View style={[styles.createElement, styles.flexRow]}>
          <Pressable style={[styles.selectButton, styles.rightMargin]}>
            <RNPickerSelect
              placeholder={{label: '??????'}}
              onValueChange={value => {
                setMeetingInfo({...meetingInfo, peopleNum: value});
              }}
              items={PeopleDropDownData}
              value={meetingInfo.peopleNum}
              style={{
                inputIOS: {
                  fontSize: 16,
                  color: 'black',
                },
                placeholder: {
                  fontSize: 16,
                  color: 'gray',
                },
              }}
            />
            <Icon name="arrow-drop-down" size={19} color={'gray'} />
          </Pressable>
          <ScrollView style={styles.invitedFriends} horizontal={true}>
            {friendsNames.map((el, idx) => (
              <View key={idx} style={styles.invitedFriend}>
                <Text>{el}</Text>
              </View>
            ))}
          </ScrollView>

          <Pressable
            onPress={() => {
              if (meetingInfo.friends.length + 1 >= meetingInfo.peopleNum) {
                showToast(
                  'error',
                  '????????? ????????? ????????? ?????? ????????? ??? ????????????',
                );
                return;
              }
              setInviteModalVisible(true);
            }}>
            <Text style={[styles.text, styles.leftMargin]}>?????? ????????????</Text>
          </Pressable>
        </View>
        <DoubleModal
          text="?????? ?????? ??? LCN??? ???????????????.    ?????????????????????????"
          nButtonText="?????????"
          pButtonText="???"
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
          txType="?????? ??????"
        />
        <View style={styles.tagElement}>
          <Text style={[styles.text, styles.tagTitle]}>??????</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.tagCategory}>
              <Text style={styles.tagCategoryTitle}>?????????</Text>
              <ScrollView style={styles.tags} horizontal={true}>
                {tagData.mood.map((tag, idx) => (
                  <TagElement
                    key={idx}
                    tag={tag}
                    meetingInfo={meetingInfo}
                    setMeetingInfo={setMeetingInfo}
                  />
                ))}
              </ScrollView>
            </View>
            <View style={styles.tagCategory}>
              <Text style={styles.tagCategoryTitle}>??????</Text>
              <ScrollView style={styles.tags} horizontal={true}>
                {tagData.topic.map((tag, idx) => (
                  <TagElement
                    key={idx}
                    tag={tag}
                    meetingInfo={meetingInfo}
                    setMeetingInfo={setMeetingInfo}
                  />
                ))}
              </ScrollView>
            </View>
            <View style={styles.tagCategory}>
              <Text style={styles.tagCategoryTitle}>???</Text>
              <ScrollView style={styles.tags} horizontal={true}>
                {tagData.alcohol.map((tag, idx) => (
                  <TagElement
                    key={idx}
                    tag={tag}
                    meetingInfo={meetingInfo}
                    setMeetingInfo={setMeetingInfo}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
    height: 60,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    marginLeft: 10,
  },
  grayButton: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    marginLeft: 10,
    color: 'gray',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createElement: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
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
    color: 'gray',
  },
  datepicker: {
    width: 240,
  },
  textInput: {
    backgroundColor: 'white',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagTitle: {
    marginTop: 10,
  },
  tagsContainer: {
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
  },
  tagCategoryTitle: {
    marginTop: 5,
    marginBottom: 10,
    color: 'gray',
  },
  tagCategory: {
    marginVertical: 5,
  },
  invitedFriends: {
    flexDirection: 'row',
  },
  invitedFriend: {
    borderRadius: 10,
    backgroundColor: 'lightgray',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 8,
  },
  leftMargin: {
    marginLeft: 5,
  },
  rightMargin: {
    marginRight: 5,
  },
});

export default MeetingCreate;
