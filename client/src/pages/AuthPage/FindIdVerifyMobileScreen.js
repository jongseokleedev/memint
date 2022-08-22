import React, {useRef, useState} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import memintLogo from '../../assets/icons/logo.png';
import GradientButton from '../../components/common/GradientButton';
import {getUserByPhoneNumber} from '../../lib/Users';

const FindIdVerifyMobileScreen = ({navigation}) => {
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
  const [email, setEmail] = useState(null);
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
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setFiexedPhoneNumber(form.mobileNumber);
    setConfirm(confirmation);
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
      getUserByPhoneNumber(fixedPhoneNumber).then(result => {
        console.log(result);
        if (result) {
          setEmail(result);
        } else {
          setEmail('NA');
        }
      });
    } catch (error) {
      console.log(error);
      console.log('Invalid code.');
      setVerified(false);
      setVerifyTextColor('red');
    }
  }

  const goToNextPage = () => {
    navigation.push('SignIn');
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <SafeAreaView style={styles.fullscreen}>
          <BackButton />
          <View style={styles.fullscreenSub}>
            <Image source={memintLogo} style={styles.logo} />
            <Text style={styles.contentText}>이메일 찾기</Text>
            <Text style={styles.contentTextSub}>
              회원가입시 사용한 전화번호를 입력해주세요
            </Text>
            <View style={styles.form}>
              <BorderedInput
                size="large"
                placeholder="전화번호를 입력해주세요"
                hasMarginBottom
                value={form.mobileNumber}
                onChangeText={createChangeTextHandler('mobileNumber')}
                autoCapitalize="none"
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
            <Text style={styles.text}>
              {email === 'NA'
                ? '전화번호와 일치하는 회원정보가 없습니다'
                : email
                ? `회원님이 가입하신 이메일은 ${email} 입니다`
                : null}
            </Text>
            {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[50, 5, 5, 5]}
            border={false}
            // disabled={!verified}
            // backgroundColor={verified ? 'black' : 'lightgray'}
            text="로그인 하러 가기"
            hasMarginBottom
            onPress={goToNextPage}
          /> */}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  invalidNumber: {
    fontSize: 14,
    // marginBottom: 20,
    // marginRight: 100,
  },
  text: {
    marginTop: 50,
    fontSize: 20,
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

export default FindIdVerifyMobileScreen;
