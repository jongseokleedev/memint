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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import memintLogo from '../../assets/icons/logo.png';

const VerifyMobileScreen = ({navigation}) => {
  const [buttonReady, setButtonReady] = useState(false);
  const [validNumber, setValidNumber] = useState(
    '11자리 숫자 전화번호를 입력해주세요',
  );
  const [textColor, setTextColor] = useState('gray');
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({
    mobileNumber: '',
    code: '',
  });
  // const {isSignup} = route.params || {};
  const passwordRef = useRef();

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
    if (value.length === 0) {
      setValidNumber('11자리 숫자 전화번호를 입력해주세요');
      setTextColor('gray');
    }
    if (value.length !== 11) {
      setButtonReady(false);
      setValidNumber('전화번호가 유효하지 않습니다');
      setTextColor('red');
    } else if (value.length === 11) {
      setButtonReady(true);
      setValidNumber('유효한 전화번호 입니다.');
      setTextColor('green');
    }
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    console.log(form);
  };

  async function verifyPhoneNumber(phoneNumber) {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  // Handle confirm code button press
  async function confirmCode() {
    try {
      await confirm.confirm(form.code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  const goToNextPage = () => {
    navigation.navigate('SignUpUserInfo');
  };
  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
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
              onPress={() =>
                verifyPhoneNumber(
                  `+82 ${form.mobileNumber.slice(
                    0,
                    3,
                  )}-${form.mobileNumber.slice(3, 7)}-${form.mobileNumber.slice(
                    7,
                    11,
                  )}`,
                )
              }
            />
          </View>
          <Text style={styles.invalidNumber}>{validNumber}</Text>
          <Text style={styles.contentTextVerify}>인증번호</Text>
          <View style={styles.secondForm} hasMarginBottom>
            <BorderedInput
              size="large"
              placeholder="인증번호를 입력해주세요"
              value={form.code}
              onChangeText={createChangeTextHandler('code')}
              secureTextEntry
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
              text="인증"
              hasMarginBottom
              onPress={() => confirmCode()}
            />
          </View>
          <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 5, 5]}
            text="다음 단계"
            hasMarginBottom
            onPress={goToNextPage}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
    marginRight: 50,
    // justifyContent: 'flex-start',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 24,
    marginTop: 32,
    // fontWeight: 'bold',
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
    // fontWeight: 'bold',
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 20,
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
    marginBottom: 50,
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
