import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActionSheetIOS,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import useUser from '../../utils/hooks/UseUser';
import storage, {deleteObject} from '@react-native-firebase/storage';
import {getMeeting, updateMeeting} from '../../lib/Meeting';
import BasicButton from '../../components/common/BasicButton';

function MeetingConfirm({route}) {
  const [meetingInfo, setMeetingInfo] = useState({});
  const [refreshing, setRefreshing] = useState(true);
  const [image, setImage] = useState(null);
  const userInfo = useUser();
  // const {meetingInfo} = route.params;

  useEffect(() => {
    getMeetingInfo();
  }, []);

  const getMeetingInfo = async () => {
    const res = await getMeeting(route.params.meetingInfo.id);
    setMeetingInfo(res.data());
    setRefreshing(false);
  };
  const imagePickerOption = {
    mediaType: 'photo',
    maxWidth: 768,
    maxHeight: 768,
    includeBase64: Platform.OS === 'android',
  };

  const onPickImage = res => {
    if (res.didCancel || !res) {
      return;
    }
    setImage(res);
  };

  const handleCamera = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: '사진 업로드',
        //사진 선택하기는 이후 삭제될 수 있음
        options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          launchCamera(imagePickerOption, onPickImage);
        } else if (buttonIndex === 1) {
          launchImageLibrary(imagePickerOption, onPickImage);
        }
      },
    );
  };

  const handleSubmit = async () => {
    let photoURL = null;
    if (image) {
      const asset = image.assets[0];
      const extension = asset.fileName.split('.').pop(); //확장자 추출
      const reference = storage().ref(
        `/meeting/${meetingInfo.id}.${extension}`,
      );

      if (Platform.OS === 'android') {
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }

      photoURL = image ? await reference.getDownloadURL() : null;
      updateMeeting(meetingInfo.id, {
        confirmImage: photoURL,
        confirmStatus: 'pending',
      });
    }
  };

  const handleSecondSubmit = async () => {
    const existedReference = storage().refFromURL(meetingInfo.confirmImage);
    await existedReference.delete();
    let photoURL = null;
    const asset = image.assets[0];
    const extension = asset.fileName.split('.').pop(); //확장자 추출
    const reference = storage().ref(`/meeting/${meetingInfo.id}.${extension}`);

    if (Platform.OS === 'android') {
      await reference.putString(asset.base64, 'base64', {
        contentType: asset.type,
      });
    } else {
      await reference.putFile(asset.uri);
    }

    photoURL = image ? await reference.getDownloadURL() : null;
    updateMeeting(meetingInfo.id, {
      confirmImage: photoURL,
      confirmStatus: 'pending',
    });
  };

  const renderStatus = () => {
    if (meetingInfo.confirmStatus === 'pending') {
      return <Text style={styles.subText}>인증 대기중</Text>;
    } else if (meetingInfo.confirmStatus === 'confirmed') {
      return (
        <>
          <Text style={styles.plainText}>인증 완료</Text>
          <Icon
            name="check-circle"
            size={15}
            color="#00BA00"
            style={styles.statusIcon}
          />
        </>
      );
    } else if (meetingInfo.confirmStatus === 'denied') {
      return (
        <>
          <Text style={styles.plainText}>인증 반려</Text>
          <Icon
            name="warning"
            size={15}
            color="#EE404C"
            style={styles.statusIcon}
          />
        </>
      );
    }
  };

  const renderMessage = () => {
    if (meetingInfo.confirmMessage) {
      if (meetingInfo.confirmStatus === 'confirmed') {
        return (
          <View style={styles.messageArea}>
            <Icon name="face" size={20} style={styles.messageIcon} />
            <Text style={styles.plainText}>{meetingInfo.confirmMessage}</Text>
          </View>
        );
      } else if (meetingInfo.confirmStatus === 'denied') {
        return (
          <View style={styles.messageArea}>
            <Icon
              name="warning"
              size={15}
              style={styles.messageIcon}
              color="#EE404C"
            />
            <Text style={styles.warningText}>
              반려 사유: {meetingInfo.confirmMessage}
            </Text>
          </View>
        );
      }
    }
  };

  const renderDenied = () => {
    if (meetingInfo.confirmStatus === 'denied') {
      return (
        <>
          {image ? (
            <View style={styles.imageView}>
              <Image
                source={{uri: image?.assets[0]?.uri}}
                style={styles.image}
              />
              <BasicButton text="인증보내기" onPress={handleSecondSubmit} />
            </View>
          ) : (
            <View style={styles.deniedArea}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handleCamera}>
                <Icon name="photo-camera" size={19} style={styles.photoIcon} />
                <Text style={styles.boldText}>다시 인증하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      );
    }
  };

  const renderByUser = () => {
    if (meetingInfo.hostId === userInfo.id) {
      return (
        <>
          {meetingInfo.confirmImage ? (
            <View style={styles.imageView}>
              <Image
                source={{uri: meetingInfo.confirmImage}}
                style={styles.image}
              />
              {renderMessage()}
              {renderDenied()}
            </View>
          ) : (
            <>
              {image ? (
                <View style={styles.imageView}>
                  <Image
                    source={{uri: image?.assets[0]?.uri}}
                    style={styles.image}
                  />
                  <BasicButton text="인증보내기" onPress={handleSubmit} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleCamera}>
                  <Icon
                    name="photo-camera"
                    size={19}
                    style={styles.photoIcon}
                  />
                  <Text style={styles.boldText}>미팅 참여 인증하기</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </>
      );
    } else {
      return (
        <View>
          {meetingInfo.confirmImage ? (
            <View style={styles.imageView}>
              <Image
                source={{uri: meetingInfo.confirmImage}}
                style={styles.image}
              />
              {renderMessage()}
            </View>
          ) : (
            <Text>호스트가 이미지를 업로드하지 않았습니다.</Text>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>미팅 참여 인증하기</Text>
      </View>
      <ScrollView style={styles.wrapper} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getMeetingInfo}/>}>
        <View style={styles.section}>
          <View style={styles.confirmTitleArea}>
            <Text style={styles.sectionTitle}>미팅 인증샷</Text>
            <View style={styles.statusArea}>{renderStatus()}</View>
          </View>

          {renderByUser()}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인증방법 및 주의사항</Text>
          <View style={styles.warningBox}>
            <Text style={styles.boldText}>
              미팅 참여자 전원의 얼굴이 보이게 사진을 찍어주세요!
            </Text>
          </View>
          <View style={styles.guideSection}>
            <Text style={styles.plainText}>
              1. 호스트도 사진에 반드시 포함되어야 합니다.
            </Text>
            <Text style={styles.plainText}>
              2. 다음의 경우에는 스탭의 판단에 따라 인증이 반려됩니다.
            </Text>
            <Text style={styles.subText}>
              • 미팅 구성원 전원이 참석하지 않은 경우
            </Text>
            <Text style={styles.subText}>
              • 음식점이 아닌 것 같다고 판단되는 경우
            </Text>
          </View>
        </View>
      </ScrollView>
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
  wrapper: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  warningBox: {
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 15,
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13,
  },
  plainText: {
    fontSize: 13,
    marginVertical: 5,
  },
  bigText: {
    fontSize: 12.5,
    marginTop: 10,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  guideSection: {
    marginHorizontal: 25,
  },
  subText: {
    color: '#646464',
    fontSize: 13,
    marginHorizontal: 10,
    marginTop: 5,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 13,
    alignContent: 'flex-start',
    marginTop: 10,
    width: '100%',
  },
  photoIcon: {
    marginRight: 7,
  },
  imageView: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  image: {
    height: 280,
    width: 350,
    borderRadius: 20,
  },
  deniedArea: {
    width: '100%',
  },
  confirmTitleArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  statusArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 3,
  },
  messageArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 5,
  },
  messageIcon: {
    marginRight: 5,
  },
  warningText: {
    fontSize: 13,
    color: '#EE404C',
  },
});

export default MeetingConfirm;
