import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyMeetingList from '../../components/myPageComponent/MyMeetingList';
import ParticipatedMeetingList from '../../components/myPageComponent/ParticipatedMeetingList';
import WalletButton from '../../components/common/WalletButton';
import * as Progress from 'react-native-progress';
import dinoegg from '../../assets/icons/dinoegg.png';
import dummyDino from '../../assets/icons/dummyCharater.png';
import BasicButton from '../../components/common/BasicButton';
import likesActive from '../../assets/icons/likesActive.png';
import eggS from '../../assets/icons/eggS.png';
import eggD from '../../assets/icons/eggD.png';
import eggB from '../../assets/icons/eggB.png';
import MyEggModal from './MyEggModal';
import useUser from '../../utils/hooks/UseUser';

function MyMainPage({navigation}) {
  // const user = useUser();
  const userInfo = useUser();
  const {top} = useSafeAreaInsets();
  const animation = useRef(new Animated.Value(1)).current;
  const [meetingRoom, setMeetingRoom] = useState(0);
  const [tabActive, setTabActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const room = [{name: '내가 만든 방'}, {name: '참여 중인 방'}];
  const selecteMenuHandler = index => {
    setMeetingRoom(index);
  };
  const handleNavigate = () => {
    navigation.navigate('MyPage');
  };
  const handleLikesNavigate = () => {
    navigation.navigate('MyLikesRooms');
  };

  const handleMyEgg = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" />

      <View style={{backgroundColor: '#82EFC1', height: top}} />
      <ScrollView
        style={styles.myCharacterView}
        contentContainerStyle={styles.paddingBottom}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleNavigate}>
            <Image
              source={{uri: userInfo?.picture}}
              style={styles.pictureImage}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMyEgg}>
            <Image source={dinoegg} style={styles.bigEggImage} />
          </TouchableOpacity>
          <MyEggModal
            buttonText="네"
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </View>
        <View style={styles.character}>
          <View style={styles.characterWrap}>
            <Progress.Circle
              size={240}
              progress={0.2}
              color={'#2ACFC2'}
              unfilledColor={'#ffffff'}
              borderWidth={0}
            />
            <Image source={dummyDino} style={styles.characterImage} />
          </View>
          <Text style={styles.nickName}>Lv.3 {userInfo?.nickName}</Text>
          <View style={styles.characterDes}>
            <Image source={likesActive} style={styles.footImage} />
            <Text style={styles.characterText}>티라노 80 / 100 A</Text>
          </View>
          <View style={styles.characterStatus}>
            <View style={styles.status}>
              <Image source={eggS} style={styles.eggImage} />
              <View style={styles.statusBackground}>
                <View style={styles.statusBar}>
                  <Text style={styles.statusText}>72.8 / 100</Text>
                </View>
              </View>
            </View>
            <View style={styles.status}>
              <Image source={eggD} style={styles.eggImage} />
              <View style={styles.statusBackground}>
                <View
                  style={[
                    styles.statusBar,
                    {
                      backgroundColor: '#4E00F5',
                      width: '51.8%',
                      borderColor: '#4E00F5',
                    },
                  ]}>
                  <Text style={[styles.statusText, {color: '#ffffff'}]}>
                    51.8 / 100
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.status}>
              <Image source={eggB} style={styles.eggImage} />
              <View style={styles.statusBackground}>
                <View
                  style={[
                    styles.statusBar,
                    {
                      backgroundColor: '#CFAB2A',
                      width: '68.3%',
                      borderColor: '#CFAB2A',
                    },
                  ]}>
                  <Text style={styles.statusText}>68.3 / 100</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Animated.View
        style={[
          {
            backgroundColor: '#3C3D43',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '18%',
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          },
          tabActive ? {height: '80%'} : null,
          {transform: [{translateY: animation}]},
        ]}>
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <Pressable
            onPress={() => {
              setTabActive(!tabActive);
            }}>
            <View style={styles.bar}></View>
          </Pressable>
        </View>
        {/* 찜한 미팅방 */}
        <View style={styles.mylikes}>
          <TouchableOpacity
            style={styles.mylikesButton}
            onPress={handleLikesNavigate}>
            <Text style={styles.mylikesText}>내가 찜한 미팅</Text>
            <Image source={likesActive} style={styles.likesfootImage} />
          </TouchableOpacity>
        </View>
        {!tabActive ? (
          <></>
        ) : (
          <>
            {/* 탭 선택 버튼 */}
            <View style={styles.meetingButton}>
              {room.map((ele, index, key) => {
                return (
                  <BasicButton
                    text={ele.name}
                    width={160}
                    height={40}
                    textSize={16}
                    backgroundColor={
                      meetingRoom === index ? '#AEFFC0' : 'transparent'
                    }
                    textColor={meetingRoom === index ? 'black' : 'white'}
                    borderRadius={30}
                    border={meetingRoom === index ? true : false}
                    margin={[10, 3, 3, 3]}
                    onPress={() => selecteMenuHandler(index)}
                    key={index}
                  />
                );
              })}
            </View>
            {/* 탭 선택에 따른 미팅 리스트 */}

            {meetingRoom === 0 ? (
              <MyMeetingList navigation={navigation} user={userInfo} />
            ) : (
              <ParticipatedMeetingList user={userInfo} />
            )}
          </>
        )}
      </Animated.View>
      <WalletButton />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#82EFC1',
  },
  myCharacterView: {
    flex: 1,
    paddingHorizontal: 15,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  character: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  characterWrap: {
    marginTop: 32,
    marginBottom: 16,
  },
  characterImage: {
    position: 'absolute',
    top: '15%',
    left: '13%',
    width: 161,
    height: 172,
  },
  characterDes: {
    marginTop: 5,
    flexDirection: 'row',
  },
  characterText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  characterStatus: {
    paddingHorizontal: 15,
    marginTop: 42,
  },
  nickName: {
    fontFamily: 'NeoDunggeunmoPro-Regular',
    fontSize: 24,
    color: '#1D1E1E',
    letterSpacing: -0.5,
    marginBottom: 5,
  },
  mymeetingTab: {
    backgroundColor: '#3C3D43',
    width: '100%',
    height: '20%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  pictureImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  footImage: {
    width: 24.46,
    height: 21.75,
    marginRight: 8,
    tintColor: '#2ACFC2',
  },
  bigEggImage: {
    width: 30.25,
    height: 40,
    borderRadius: 999,
  },
  eggImage: {
    width: 21.09,
    height: 27,
    marginRight: 13,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 6,
  },
  statusBackground: {
    backgroundColor: '#EDEEF6',
    width: '100%',
    height: 20,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#B9C5D1',
    zIndex: -1,
  },
  statusBar: {
    width: '72.8%',
    height: 20,
    backgroundColor: '#2ACFC2',
    borderWidth: 1.5,
    borderColor: '#2ACFC2',

    paddingLeft: 11,
    borderRadius: 3,
    zIndex: 1,
    position: 'absolute',
    top: -0.5,
    left: -0.5,
    justifyContent: 'center',
  },
  statusText: {
    color: '#1D1E1E',
    fontSize: 12,
    letterSpacing: -0.5,
  },
  paddingBottom: {
    paddingBottom: 150,
  },
  centeredView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  tabView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 25,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  bar: {
    backgroundColor: '#33ED96',
    width: 100,
    height: 5,
    borderRadius: 999,
    marginTop: 3,
    marginBottom: 5,
    marginHorizontal: 3,
  },
  mylikesButton: {
    flexDirection: 'row',
    width: 118,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mylikesText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: '#ffffff',
  },
  mylikes: {
    marginTop: 23,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  meetingButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesfootImage: {
    width: 30,
    height: 30,
    tintColor: '#33ED96',
    marginLeft: 5,
  },
});

export default MyMainPage;
