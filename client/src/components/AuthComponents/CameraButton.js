import React, {useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
// const reference = storage().ref('/directory/filename.png');
// await reference.putFile(uri);
// const url = await reference.getDownloadURL();
const imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  inculdeBase64: Platform.OS === 'android',
};

const CameraButton = ({response, setResponse, uid}) => {
  const insets = useSafeAreaInsets();

  const onPickImage = res => {
    if (res.didCancel || !res) {
      return;
    }
    console.log(res);
    setResponse(res);
  };
  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };
  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: '사진 업로드',
        options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onLaunchCamera();
          console.log('카메라 촬영');
        } else if (buttonIndex === 1) {
          onLaunchImageLibrary();
          console.log('사진 선택');
        }
      },
    );
  };

  return (
    <>
      <View style={[styles.wrapper]}>
        <Pressable style={styles.circle} onPress={onPress}>
          {response ? (
            <Image
              style={styles.circle}
              source={{uri: response?.assets[0]?.uri}}
            />
          ) : (
            <Icon name="person-add" color="black" size={48} />
          )}
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 54,
    height: 108,
    width: 108,

    ...Platform.select({
      ios: {
        shadowColor: '#4d4d4d',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  circle: {
    // backgroundColor: '#6200ee',
    backgroundColor: 'white',
    borderRadius: 54,
    height: 108,
    width: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraButton;
