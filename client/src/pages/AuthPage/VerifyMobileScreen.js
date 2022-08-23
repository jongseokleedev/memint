import React, {useRef, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import memintLogo from '../../assets/icons/logo.png';
import {createPhoneNumber, getUserByPhoneNumber} from '../../lib/Users';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeStatusBar from '../../components/common/SafeStatusBar';
const VerifyMobileScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const [buttonReady, setButtonReady] = useState(false);
  const [validNumber, setValidNumber] = useState(
    '11자리 숫자 전화번호를 입력해주세요',
  );
  const [textColor, setTextColor] = useState('gray');
  const [verified, setVerified] = useState(null);
  const [verifyTextColor, setVerifyTextColor] = useState('gray');
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({
    mobileNumber: '',
    code: '',
  });
  const [fixedPhoneNumber, setFiexedPhoneNumber] = useState('');

  // const {isSignup} = route.params || {};
  const passwordRef = useRef();

  const createChangeTextHandler = name => value => {
    console.log({value}, value.length);
    setForm({...form, [name]: value});
    if (name === 'mobileNumber') {
      if (value.length === 0) {
        setValidNumber('전화번호를 입력해주세요 (11자리 숫자)');
        setTextColor('#EAFFEF');
      } else if (value.length !== 11 || value.slice(0, 3) !== '010') {
        setButtonReady(false);
        setValidNumber('전화번호가 유효하지 않습니다');
        setTextColor('#FF5029');
      } else if (value.length === 11) {
        setButtonReady(true);
        setValidNumber('유효한 전화번호 입니다.');
        setTextColor('#58FF7D');
      }
    }
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    console.log(form);
  };

  async function verifyPhoneNumber(phoneNumber) {
    try {
      const userEmail = await getUserByPhoneNumber(form.mobileNumber);
      console.log({userEmail});
      if (userEmail === 'NA') {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setFiexedPhoneNumber(form.mobileNumber);
        setConfirm(confirmation);
      } else {
        setValidNumber('이미 해당 전화번호로 가입한 회원이 있습니다');
        setTextColor('#FF5029');
      }
    } catch (e) {
      const messages = {
        'auth/too-many-requests': `인증 번호 요청을 너무 많이했습니다. ${'\n'} 잠시 후 다시 시도해주세요.`,
      };
      const msg = messages[e.code];
      Alert.alert('실패', msg);
      console.log(e);
    }
  }

  // Handle confirm code button press
  async function confirmCode() {
    try {
      console.log(form.code);
      console.log(confirm);
      await confirm.confirm(form.code).then(console.log);
      setVerified(true);
      setVerifyTextColor('#58FF7D');
      auth().signOut();
    } catch (error) {
      console.log(error);
      console.log('Invalid code.');
      setVerified(false);
      setVerifyTextColor('#FF5029');
    }
  }

  const goToNextPage = () => {
    // createPhoneNumber({userId: uid, phoneNumber: fixedPhoneNumber});
    userInfo = {...userInfo, phoneNumber: fixedPhoneNumber};
    navigation.push('SignUpUserDetail', {userInfo});
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}> */}
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior="padding">
        <SafeStatusBar />
        <BackButton />
        <View style={styles.fullscreen}>
          <Text style={styles.title}>휴대폰 인증</Text>
          <Text style={styles.contentText}>
            안전한 MEMINT를 위해 휴대폰 번호를 인증해주세요!
          </Text>

          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.contentText}>휴대폰</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="전화번호를 입력해주세요"
                    value={form.mobileNumber}
                    onChangeText={createChangeTextHandler('mobileNumber')}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    autoCorrect={false}
                    returnKeyType={'done'}
                    // onSubmitEditing={() => passwordRef.current.focus()}
                  />
                </View>

                <BasicButton
                  style={styles.button}
                  textColor={buttonReady ? '#1D1E1E' : '#ffffff'}
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  disabled={!buttonReady}
                  border={true}
                  backgroundColor={buttonReady ? '#AEFFC1' : 'transparent'}
                  text="인증번호받기"
                  hasMarginBottom
                  onPress={async () =>
                    verifyPhoneNumber(
                      `+82 ${form.mobileNumber.slice(
                        0,
                        3,
                      )}-${form.mobileNumber.slice(
                        3,
                        7,
                      )}-${form.mobileNumber.slice(7, 11)}`,
                    ).then(setValidNumber('인증번호가 발송되었습니다'))
                  }
                />
              </View>
              <Text style={[styles.invalidNumber, {color: textColor}]}>
                {validNumber}
              </Text>
            </View>

            <View style={styles.form} hasMarginBottom>
              <Text style={styles.contentText}>인증번호</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="인증번호를 입력해주세요"
                    value={form.code}
                    onChangeText={createChangeTextHandler('code')}
                    // secureTextEntry
                    // ref={passwordRef}
                    keyboardType="numeric"
                    // returnKeyType={'done'}
                    onSubmitEditing={() => {
                      onSubmit();
                    }}
                  />
                </View>

                <BasicButton
                  style={styles.button}
                  textColor={buttonReady ? '#1D1E1E' : '#ffffff'}
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  disabled={!buttonReady}
                  border={true}
                  backgroundColor={buttonReady ? '#AEFFC1' : 'transparent'}
                  text="인증하기"
                  hasMarginBottom
                  onPress={() => confirmCode()}
                />
              </View>
              <Text
                style={[
                  styles.invalidNumber,
                  {color: verifyTextColor, marginBottom: 90},
                ]}>
                {verified === null
                  ? ''
                  : verified
                  ? '성공적으로 인증되었습니다'
                  : '인증번호가 유효하지 않습니다.'}
              </Text>
            </View>

            {/* <BasicButton
              style={styles.button}
              width={300}
              height={40}
              textSize={17}
              margin={[50, 5, 5, 5]}
              border={false}
              disabled={!verified}
              backgroundColor={verified ? 'black' : 'lightgray'}
              text="다음 단계"
              hasMarginBottom
              onPress={goToNextPage}
            /> */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={goToNextPage}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  fullscreen: {
    paddingHorizontal: 15,
    flex: 1,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 15,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  invalidNumber: {
    fontSize: 14,
    marginVertical: 10,
    letterSpacing: -0.5,
    // marginBottom: 20,
    // marginRight: 100,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  contentText: {
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,

    // fontWeight: 'bold',
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
    letterSpacing: -0.5,

    // fontWeight: 'bold',
  },
  form: {
    marginTop: 32,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
    marginHorizontal: 15,
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
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
  inputWrap: {
    flex: 1,
  },
});

export default VerifyMobileScreen;
