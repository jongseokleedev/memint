import React, {useRef, useState} from 'react';

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
import logo from '../../assets/icons/logo.png';
import GradientButton from '../../components/common/GradientButton';

const FindPWVerifyScreen = ({navigation}) => {
  const [form, setForm] = useState({
    mobileNumber: '',
    verficationCode: '',
    email: '',
  });
  // const {isSignup} = route.params || {};
  const verificationCodeRef = useRef();

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    console.log(form);
  };
  const goToNextPage = () => {
    navigation.navigate('SetNewPW');
  };

  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <BackButton />
        <View style={styles.fullscreenSub}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.contentText}>
            회원가입 시 사용하신 전화번호를 입력해주세요.
          </Text>
          {/* <Text style={styles.contentTextSub}>
            안전한 미팅주선을 위해 사용됩니다
          </Text> */}
          <View style={styles.form}>
            <BorderedInput
              size="large"
              placeholder="핸드폰 번호를 입력해주세요"
              hasMarginBottom
              value={form.mobileNumber}
              onChangeText={createChangeTextHandler('mobileNumber')}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              returnKeyType={'done'}
              onSubmitEditing={() => verificationCodeRef.current.focus()}
            />
            {/* <BasicButton
              style={styles.button}
              width={70}
              height={35}
              textSize={13}
              margin={[5, 5, 5, 5]}
              text="인증번호받기"
              hasMarginBottom
              onPress={onSubmit}
            /> */}
            <GradientButton
              style={styles.button}
              width={80}
              height={35}
              textSize={13}
              margin={[5, 5, 5, 5]}
              text="인증번호받기"
              hasMarginBottom
              onPress={onSubmit}
            />
          </View>
          <Text style={styles.contentTextVerify}>인증번호</Text>
          <View style={styles.secondForm} hasMarginBottom>
            <BorderedInput
              size="large"
              placeholder="인증번호를 입력해주세요"
              value={form.verificationCode}
              onChangeText={createChangeTextHandler('verficationCode')}
              secureTextEntry
              ref={verificationCodeRef}
              returnKeyType={'done'}
              onSubmitEditing={() => {
                onSubmit();
              }}
            />
            {/* <BasicButton
              style={styles.button}
              width={70}
              height={35}
              textSize={13}
              margin={[5, 5, 5, 5]}
              text="인증"
              hasMarginBottom
              onPress={onSubmit}
            /> */}
            <GradientButton
              style={styles.button}
              width={80}
              height={35}
              textSize={13}
              margin={[5, 5, 5, 5]}
              text="인증"
              hasMarginBottom
              onPress={onSubmit}
            />
          </View>
          <Text style={styles.contentTextVerify}>이메일을 입력해주세요</Text>
          <View style={styles.secondForm} hasMarginBottom>
            <BorderedInput
              size="wide"
              placeholder="이메일을 입력해주세요"
              value={form.email}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              keyboardType="email-address"
              onChangeText={createChangeTextHandler('email')}
              returnKeyType={'done'}
              onSubmitEditing={() => {
                onSubmit();
              }}
            />
          </View>
          {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[0, 5, 5, 5]}
            text="다음 단계"
            hasMarginBottom
            onPress={goToNextPage}
          /> */}
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[0, 5, 5, 5]}
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
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 18,
    marginTop: 64,
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
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondForm: {
    marginTop: 10,
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    margin: 50,
  },
});

export default FindPWVerifyScreen;
