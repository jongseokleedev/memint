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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import memintLogo from '../../assets/icons/logo.png';
import {createPhoneNumber, getUserByPhoneNumber} from '../../lib/Users';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
        setTextColor('gray');
      } else if (value.length !== 11 || value.slice(0, 3) !== '010') {
        setButtonReady(false);
        setValidNumber('전화번호가 유효하지 않습니다');
        setTextColor('red');
      } else if (value.length === 11) {
        setButtonReady(true);
        setValidNumber('유효한 전화번호 입니다.');
        setTextColor('green');
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
        setTextColor('red');
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
      setVerifyTextColor('green');
      auth().signOut();
    } catch (error) {
      console.log(error);
      console.log('Invalid code.');
      setVerified(false);
      setVerifyTextColor('red');
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
      <KeyboardAwareScrollView style={styles.KeyboardAvoidingView}>
        <SafeAreaView style={styles.fullscreen}>
          <BackButton />
          <View style={styles.fullscreenSub}>
            <Image source={memintLogo} style={styles.logo} />
            <Text style={styles.contentText}>전화번호를 인증해주세요</Text>
            <Text style={styles.contentTextSub}>
              안전한 미팅주선을 위해 사용됩니다
            </Text>
            <View style={styles.form}>
              <BorderedInput
                size="large"
                placeholder="전화번호를 입력해주세요"
                hasMarginBottom
                value={form.mobileNumber}
                onChangeText={createChangeTextHandler('mobileNumber')}
                autoCapitalize="none"
                keyboardType="numeric"
                autoCorrect={false}
                returnKeyType={'done'}
                // onSubmitEditing={() => passwordRef.current.focus()}
              />
              <BasicButton
                style={styles.button}
                width={70}
                height={35}
                textSize={13}
                margin={[5, 5, 5, 5]}
                disabled={!buttonReady}
                border={false}
                backgroundColor={buttonReady ? 'black' : 'lightgray'}
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
            <Text style={styles.contentTextVerify}>인증번호</Text>
            <View style={styles.secondForm} hasMarginBottom>
              <BorderedInput
                size="large"
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
              <BasicButton
                style={styles.button}
                width={70}
                height={35}
                textSize={13}
                margin={[5, 5, 5, 5]}
                border={false}
                text="인증"
                hasMarginBottom
                onPress={() => confirmCode()}
              />
            </View>
            <Text style={[styles.invalidNumber, {color: verifyTextColor}]}>
              {verified === null
                ? ''
                : verified
                ? '성공적으로 인증되었습니다'
                : '인증번호가 유효하지 않습니다.'}
            </Text>
            <BasicButton
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
            />
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreen: {
    flex: 1,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 160,
    marginTop: 70,
  },
  invalidNumber: {
    fontSize: 14,
    // marginBottom: 20,
    // marginRight: 100,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 24,
    marginTop: 2,
    // fontWeight: 'bold',
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
    // fontWeight: 'bold',
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 50,
    marginBottom: 10,
    // fontWeight: 'bold',
  },
  form: {
    marginTop: 32,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondForm: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    margin: 50,
  },
});

export default VerifyMobileScreen;
