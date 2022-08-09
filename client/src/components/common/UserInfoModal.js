import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import BasicButton from './BasicButton';
import SpendingModal from './UserInfoModal/SpendingModal';
import AskSpendingModal from './UserInfoModal/AskSpendingModal';
import MySingleModal from '../chattingComponents/MySingleModal';
import {ActivityIndicator} from 'react-native-paper';
import {getOtherUser} from '../../lib/Users';
import {addVisibleUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {handleBirth} from '../../utils/common/Functions';
import LinearGradient from 'react-native-linear-gradient';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

      <UserInfoModal
      userId= 
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
        pFunction={() => {}}
        visible=
      />
 */

function UserInfoModal({
  userId,
  userInfoModalVisible,
  setUserInfoModalVisible,
  visible,
}) {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const {saveInfo} = useAuthActions();
  const owner = useUser();
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const [askSpendingModalVisible, setAskSpendingModalVisible] = useState(false);
  const [user, setUser] = useState('');
  const [bigPicture, setBicPicture] = useState(false);

  useEffect(() => {
    getOtherUser(userId).then(result => {
      setUser(result);
    });
    console.log(visible);
    console.log(owner);
  }, [userId, visible]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={userInfoModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            {user ? (
              <View style={styles.userInfoWrapper}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.images}
                    onPress={() => {
                      visible === false
                        ? setAskSpendingModalVisible(true)
                        : null;
                    }}>
                    <View style={styles.imageLarge}>
                      <Image
                        style={styles.imageLarge}
                        source={{uri: user.nftProfile}}
                      />
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setBicPicture(true);
                        }}>
                        <Image
                          source={{uri: user.picture}}
                          style={
                            visible
                              ? styles.imageSmall
                              : {...styles.imageSmall, height: 0, width: 0}
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{marginLeft: 20, justifyContent: 'space-around'}}>
                    <View style={styles.userinfo}>
                      <Text style={styles.userinfoKey}>닉네임</Text>
                      <Text style={styles.userinfoValue}>{user.nickName}</Text>
                    </View>
                    <View style={styles.userinfo}>
                      <Text style={styles.userinfoKey}>나이</Text>
                      <Text style={styles.userinfoValue}>
                        {handleBirth(user.birth)}
                      </Text>
                    </View>
                    <View style={styles.userinfo}>
                      <Text style={styles.userinfoKey}>성별</Text>
                      <Text style={styles.userinfoValue}>{user.gender}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.usertag}>
                  <Text style={styles.hilightText}>주량</Text>
                  <View style={styles.tags}>
                    <LinearGradient
                      colors={['#A7BFEB', '#FBC2EA']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.tag}>
                      <Text style={styles.tagText}>{user.drinkCapa}</Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.hilightText}>선호 주류</Text>
                  <View style={styles.tags}>
                    {user ? (
                      user.alcoholType.map((ele, index) => {
                        return (
                          <LinearGradient
                            key={index}
                            colors={['#A7BFEB', '#FBC2EA']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={styles.tag}>
                            <Text style={styles.tagText}># {ele}</Text>
                          </LinearGradient>
                        );
                      })
                    ) : (
                      <ActivityIndicator size="large" color="black" />
                    )}
                  </View>
                  <Text style={styles.hilightText}>스타일</Text>
                  <View style={styles.tags}>
                    {user.drinkStyle.map((ele, index) => {
                      return (
                        <LinearGradient
                          key={index}
                          colors={['#A7BFEB', '#FBC2EA']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          style={styles.tag}>
                          <Text style={styles.tagText}># {ele}</Text>
                        </LinearGradient>
                      );
                    })}
                  </View>
                </View>
                {bigPicture && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 2,
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        setBicPicture(!bigPicture);
                      }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        width,
                        height,
                        flex: 1,
                        backgroundColor: 'black',
                      }}>
                      <Image
                        source={{uri: user.picture}}
                        style={{width: 400, height: 400}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.buttonRow}>
                  <BasicButton
                    text="닫기"
                    size="large"
                    variant="basic"
                    onPress={() =>
                      setUserInfoModalVisible(!userInfoModalVisible)
                    }
                  />
                </View>
              </View>
            ) : (
              <ActivityIndicator size="large" color="black" />
            )}
          </View>
        </View>
        <AskSpendingModal
          nButtonText="아니오"
          pButtonText="네"
          askSpendingModalVisible={askSpendingModalVisible}
          setAskSpendingModalVisible={setAskSpendingModalVisible}
          pFunction={() => {
            setAskSpendingModalVisible(false);
            setSpendingModalVisible(true);
          }}
        />
        <SpendingModal
          nButtonText="취소"
          pButtonText="확인"
          spendingModalVisible={spendingModalVisible}
          setSpendingModalVisible={setSpendingModalVisible}
          pFunction={() => {
            setSpendingModalVisible(false);
            addVisibleUser(owner.id, userId)
              .then(() => {
                saveInfo({
                  ...owner,
                  visibleUser: [...owner.visibleUser, userId],
                });
              })
              .then(() => {
                console.log(owner);
              });
          }}
          amount={1}
          txType="프로필 조회"
        />
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: 300,
    height: 550,
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
    position: 'absolute',
  },
  userInfoWrapper: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  buttonRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingTop: 45,
  },
  images: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  imageLarge: {
    position: 'absolute',
    height: 80,
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 40,
  },
  imageSmall: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  hilightText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'lightgray',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 7,
    marginRight: 10,
  },
  userinfo: {
    flexDirection: 'row',
  },
  userinfoKey: {
    color: '#787878',
    width: 55,
  },
  usertag: {
    marginTop: 20,
  },
  tagText: {
    color: 'white',
    fontWeight: '500',
  },
});
export default UserInfoModal;
