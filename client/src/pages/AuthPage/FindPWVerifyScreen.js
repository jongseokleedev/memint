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
import {passwordReset} from '../../lib/Auth';
import {useToast} from '../../utils/hooks/useToast';
const FindPWVerifyScreen = ({navigation}) => {
  const {showToast} = useToast();
  const [form, setForm] = useState({
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
    passwordReset(form.email).then(() => {
      showToast('success', '이메일 전송이 완료되었습니다!');
    });
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <BackButton />
        <View style={styles.fullscreenSub}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.contentTextVerify}>
            회원가입시 사용한 이메일을 입력해주세요
          </Text>
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
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[0, 5, 5, 5]}
            text="이메일 보내기"
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
    marginTop: 30,
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
