import React, {useRef, useState} from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import {passwordReset} from '../../lib/Auth';
import {useToast} from '../../utils/hooks/useToast';
import SafeStatusBar from '../../components/common/SafeStatusBar';
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <SafeStatusBar />
        <BackButton />
        <View style={styles.fullscreen}>
          <Text style={styles.title}>내 정보 찾기</Text>
          <Text style={styles.contentText}>
            회원가입 시 사용한 이메일을 입력해 주세요.
          </Text>
          <View style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.contentText}>이메일</Text>

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
            <TouchableOpacity style={styles.button} onPress={goToNextPage}>
              <Text style={styles.buttonText}>이메일 보내기</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 15,
    flex: 1,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
  text: {
    fontSize: 32,
    fontWeight: 'bold',
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 'auto',
    marginBottom: 30,
    backgroundColor: '#AEFFC1',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',

    // position: 'absolute',
    // bottom: 20,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
});

export default FindPWVerifyScreen;
