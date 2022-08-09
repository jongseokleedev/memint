import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import DoubleModal from '../../components/common/DoubleModal';
import DetailMembers from '../../components/meetingComponents/DetailMembers';
import {createMeetingProposal} from '../../lib/Alarm';
import {updateWaitingIn} from '../../lib/Meeting';
import {getUser} from '../../lib/Users';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseAuth';
import {
  handleDateInFormat,
  handleISOtoLocale,
} from '../../utils/common/Functions';
import crown from '../../assets/icons/crown.png';
import GradientButton from '../../components/common/GradientButton';
import WalletButton from '../../components/common/WalletButton';
import LinearGradient from 'react-native-linear-gradient';

function MeetingDetail({route}) {
  const userInfo = useUser();
  const loginUser = userInfo.id;
  const {data} = route.params;
  const [modalVisible_1, setModalVisible_1] = useState(false);
  const [modalVisible_2, setModalVisible_2] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [membersInfo, setMembersInfo] = useState([]);
  const {showToast} = useToast();
  const navigation = useNavigation();
  const renderByUser = () => {
    if (
      data.members.reduce((acc, cur) => {
        if (cur[loginUser]) {
          return true || acc;
        } else {
          return acc;
        }
      }, false)
    ) {
      return (
        <BasicButton
          width={340}
          height={50}
          textSize={17}
          backgroundColor={'white'}
          textColor={'black'}
          text="채팅창으로 이동"
          onPress={() => {
            navigation.navigate('ChattingRoom', {data});
          }}
        />
      );
    } else if (data.waiting && data.waiting.indexOf(loginUser) !== -1) {
      return (
        <BasicButton
          width={340}
          height={50}
          textSize={17}
          border={false}
          backgroundColor={'lightgray'}
          text="신청 수락 대기 중"
          onPress={() => {}}
        />
      );
    } else {
      return (
        // <GradientButton
        //   width={340}
        //   height={50}
        //   textSize={17}
        //   text="미팅 신청 보내기"
        //   onPress={() => {
        //     setModalVisible_1(true);
        //   }}
        // />
        <BasicButton
          width={340}
          height={50}
          textSize={17}
          text="미팅 신청 보내기"
          onPress={() => {
            setModalVisible_1(true);
          }}
        />
      );
    }
  };

  const handleCreateProposal = () => {
    try {
      const createData = {
        sender: loginUser, //로그인된 유저
        receiver: data.hostId,
        meetingId: data.id,
        message: textMessage,
      };
      createMeetingProposal(createData);
      //meeting waiting 추가
      updateWaitingIn(data.id, loginUser); //로그인된 유저
      setModalVisible_2(!modalVisible_2);
      setTextMessage('');
      showToast(
        'success',
        '미팅 신청을 보냈습니다\n주선자의 수락을 기다려주세요!',
      );
      navigation.navigate('MeetingMarket');
    } catch (e) {
      setModalVisible_2(!modalVisible_2);
      setTextMessage('');
      showToast('error', '미팅 신청에 실패했습니다.\n 다시 시도해주세요');
      console.log(e);
    }
  };

  const getMembersInfo = useCallback(async () => {
    try {
      const memberInfo = await Promise.all(
        data.members.map(async member => {
          const memberId = Object.keys(member)[0];
          const info = await getUser(memberId);
          return {id: memberId, ...info};
        }),
      );
      setMembersInfo(memberInfo);
    } catch (e) {
      console.log(e);
    }
  }, [data]);

  useEffect(() => {
    getMembersInfo();
  }, [getMembersInfo]);
  return (
    <SafeAreaView style={styles.view}>
      <BackButton />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.hostArea}>
            <View style={styles.titleRow}>
              <Text style={styles.titleFirstRow}>
                {data.title.slice(0, 11)}
              </Text>
              <Text style={styles.title}>
                {data.title.slice(11, 12) === ' '
                  ? data.title.slice(12)
                  : data.title.slice(11)}
              </Text>
            </View>
            <View style={styles.hostInfo}>
              <View style={styles.hostImageWithCrown}>
                <View style={styles.hostCrown}>
                  <Image
                    source={crown}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>

                <Image
                  source={{uri: data.hostInfo.nftProfile}}
                  style={styles.hostImage}
                />
              </View>
              <Text style={styles.hostnickName}>
                {'@' + data.hostInfo.nickName}
              </Text>
            </View>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.description}>{data.description}</Text>
          </View>
          <View style={styles.meetingTags}>
            {data.meetingTags.map((tag, idx) => {
              return (
                <LinearGradient
                  colors={['#A7BFEB', '#FBC2EA']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.tag}
                  key={idx}>
                  {/* <View key={idx} style={styles.tag}> */}
                  <Text style={styles.tagText}>{'#' + tag}</Text>
                  {/* </View> */}
                </LinearGradient>
              );
            })}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoEl}>{data.region}</Text>
            <View style={styles.bar} />
            <Text style={styles.infoEl}>
              {typeof data.meetDate === 'object'
                ? handleDateInFormat(data.meetDate)
                : handleISOtoLocale(data.meetDate)}
            </Text>
          </View>
          <View>
            <DetailMembers
              peopleNum={data.peopleNum}
              membersInfo={membersInfo}
              hostId={data.hostId}
            />
          </View>
          <View style={styles.buttonRow}>{renderByUser()}</View>
        </View>

        <DoubleModal
          text="미팅을 신청하시겠습니까?"
          nButtonText="아니요"
          pButtonText="신청하기"
          modalVisible={modalVisible_1}
          setModalVisible={setModalVisible_1}
          nFunction={() => setModalVisible_1(!modalVisible_1)}
          pFunction={() => {
            setModalVisible_1(false);
            setModalVisible_2(true);
          }}
        />
        <DoubleModal
          text="주선자에게 보낼 메시지를 작성해주세요"
          body={
            <View style={styles.inputBlock}>
              <TextInput
                placeholder="메시지를 작성하세요"
                multiline={true}
                style={styles.input}
                value={textMessage}
                onChangeText={setTextMessage}
                autoComplete={false}
                autoCorrect={false}
              />
            </View>
          }
          nButtonText="닫기"
          pButtonText="신청 보내기"
          modalVisible={modalVisible_2}
          setModalVisible={setModalVisible_2}
          nFunction={() => setModalVisible_2(!modalVisible_2)}
          pFunction={handleCreateProposal}
        />
      </ScrollView>
      <WalletButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  hostArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hostInfo: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  hostImageWithCrown: {
    width: 72,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 30,
    height: 30,
  },
  hostCrown: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  hostImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
    // position: 'absolute',
    // bottom: 0,
    // right: 0
  },
  hostnickName: {
    fontSize: 10,
    fontWeight: '500',
  },
  titleRow: {
    marginBottom: 25,
    marginTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
  },
  titleFirstRow: {
    fontSize: 30,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    width: 305,
  },
  meetingTags: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: 'black',
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionRow: {
    marginVertical: 20,
  },
  infoRow: {
    marginVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoEl: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 10,
  },
  bar: {
    backgroundColor: 'black',
    width: 3,
    height: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputBlock: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    width: 220,
    height: 80,
    marginBottom: 5,
    padding: 5,
  },
});

export default MeetingDetail;
