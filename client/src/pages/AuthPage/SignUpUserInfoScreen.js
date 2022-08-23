import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import CameraButton from '../../components/AuthComponents/CameraButton';
import {signUp} from '../../lib/Auth';
import {createUser, getUser} from '../../lib/Users';
import storage from '@react-native-firebase/storage';
import {getImgUrl} from '../../lib/NFT';

import {createWallet} from '../../lib/api/wallet';
import SafeStatusBar from '../../components/common/SafeStatusBar';
// const reference = storage().ref('/directory/filename.png');
// await reference.putFile(uri);
// const url = await reference.getDownloadURL();

const SignUpUserInfoScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState({
    nickName: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
  });

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };
  const onSubmit = async () => {
    try {
      if (
        response === null ||
        form.nickName === '' ||
        form.birthYear === '' ||
        form.birthMonth === '' ||
        form.birthMonth === '' ||
        form.gender === ''
      ) {
        Alert.alert('실패', '회원 정보를 올바르게 입력해주세요');
      } else {
        Keyboard.dismiss();
        setLoading(true);
        userInfo = {
          ...userInfo,
          photoRes: response,
          nickName: form.nickName,
          birthYear: form.birthYear,
          birthMonth: form.birthMonth,
          birthDay: form.birthMonth,
          gender: form.gender,
        };
        // let photoURL = null;
        // if (response) {
        //   const asset = response.assets[0];
        //   const extension = asset.fileName.split('.').pop(); //확장자 추출
        //   const reference = storage().ref(`/profile/${uid}.${extension}`);

        //   if (Platform.OS === 'android') {
        //     await reference.putString(asset.base64, 'base64', {
        //       contentType: asset.type,
        //     });
        //   } else {
        //     await reference.putFile(asset.uri);
        //   }

        //   photoURL = response ? await reference.getDownloadURL() : null;
        // }

        // createUser({
        //   userId: uid,
        //   email: email,
        //   nickName: form.nickName,
        //   gender: form.gender,
        //   birth: `${form.birthYear}년 ${form.birthMonth}월 ${form.birthDay}일`,
        //   picture: photoURL,
        // });
        // //create Wallet
        // const body = {
        //   id: uid,
        // };
        // console.log(body);
        // await createWallet(body);
        navigation.push('VerifyMobile', {userInfo});
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.fullscreenSub}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#FAC3E9" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <SafeStatusBar />
        <BackButton />
        <View style={styles.fullscreen}>
          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.cameraArea}>
              <CameraButton response={response} setResponse={setResponse} />
            </View>
            <View style={styles.form}>
              <Text style={styles.infoText}>닉네임</Text>
              <BorderedInput
                size="wide"
                placeholder="닉네임"
                value={form.nickName}
                onChangeText={createChangeTextHandler('nickName')}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={'next'}
              />
            </View>
            <View style={styles.form}>
              <Text style={styles.infoText}>생년월일</Text>
              <View style={styles.birthform}>
                <SelectDropdown
                  data={[
                    '1992',
                    '1993',
                    '1994',
                    '1995',
                    '1996',
                    '1997',
                    '1998',
                    '1999',
                    '2000',
                    '2001',
                    '2002',
                    '2003',
                  ]}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setForm({...form, birthYear: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={styles.dropdown}
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                />
                <Text style={styles.infoText}> 년 </Text>
                <SelectDropdown
                  data={[
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                  ]}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setForm({...form, birthMonth: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={styles.dropdownSmall}
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                />
                <Text style={styles.infoText}> 월 </Text>
                <SelectDropdown
                  data={[
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30',
                    '31',
                  ]}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setForm({...form, birthDay: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={styles.dropdownSmall}
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                />
                <Text style={styles.infoText}> 일 </Text>
              </View>
            </View>
            <View style={styles.form}>
              <Text style={styles.infoText}>성별</Text>
              <SelectDropdown
                data={['남자', '여자']}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setForm({...form, gender: selectedItem});
                }}
                defaultButtonText=" "
                buttonStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownTextStyle}
                buttonTextStyle={styles.buttonTextStyle}
              />
            </View>
            <View style={styles.alertTextArea}>
              <Text style={styles.alertText}>
                닉네임, 생년월일, 성별 등 개인을 식별할 수 있는 정보는{'\n'}
                추후 수정이 불가능합니다.
              </Text>
            </View>

            {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 5, 5]}
            text="다음 단계"
            hasMarginBottom
            onPress={onSubmit}
          /> */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fullscreenSub: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  alertTextArea: {
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 60,
  },
  alertText: {
    marginVertical: 30,
    fontSize: 14,
    letterSpacing: -0.5,
    color: '#ffffff',
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
    letterSpacing: -0.5,

    // fontWeight: 'bold',
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 20,
    letterSpacing: -0.5,

    // fontWeight: 'bold',
  },
  cameraArea: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  form: {
    marginBottom: 26,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  birthform: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  genderForm: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdown: {
    width: 120,
    borderColor: '#EAFFEF',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 40,
    backgroundColor: 'transparent',
  },
  dropdownSmall: {
    width: 70,
    borderWidth: 1,
    borderColor: '#EAFFEF',
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#3C3D43',
    borderRadius: 5,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownStyle: {
    backgroundColor: '#3C3D43',
    borderRadius: 10,
  },
  dropdownTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  buttonTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,

    position: 'absolute',
    bottom: 20,
    marginHorizontal: 15,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
});

export default SignUpUserInfoScreen;
