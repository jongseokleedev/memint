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
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import logo from '../../assets/icons/logo.png';
import {signUp} from '../../lib/Auth';
import GradientButton from '../../components/common/GradientButton';

const SignUpScreen = ({navigation}) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  // const {isSignup} = route.params || {};
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };
  const onSubmitSignUp = async () => {
    Keyboard.dismiss();
    const {email, password, confirmPassword} = form;
    const info = {email, password};
    if (password !== confirmPassword) {
      Alert.alert('실패', '비밀번호가 일치하지 않습니다.');
    } else {
      try {
        const {user} = await signUp(info);
        console.log(user);
        // navigation.navigate('SignUpUserInfo');
        navigation.push('SignUpUserInfo', {uid: user.uid});
      } catch (e) {
        const messages = {
          'auth/email-already-in-use': '이미 가입된 이메일입니다.',
          'auth/wrong-password': '잘못된 비밀번호입니다.',
          'auth/user-not-found': '존재하지 않는 계정입니다.',
          'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
        };
        const msg = messages[e.code];
        Alert.alert('실패', msg);
        console.log(e);
      } finally {
      }
    }
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
            아이디와 비밀번호를 입력해주세요
          </Text>
          <View style={styles.form}>
            <Text style={styles.infoText}>이메일</Text>
            <BorderedInput
              size="large"
              placeholder="이메일"
              value={form.email}
              onChangeText={createChangeTextHandler('email')}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              keyboardType="email-address"
              returnKeyType={'next'}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.infoText}>비밀번호</Text>
            <BorderedInput
              size="large"
              placeholder="비밀번호"
              value={form.password}
              onChangeText={createChangeTextHandler('password')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType={'next'}
              secureTextEntry
              ref={passwordRef}
              onSubmitEditing={() => confirmPasswordRef.current.focus()}
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.infoText}>비밀번호 확인 </Text>
            <BorderedInput
              size="large"
              placeholder="비밀번호 확인"
              value={form.confirmPassword}
              onChangeText={createChangeTextHandler('confirmPassword')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType={'done'}
              secureTextEntry
              ref={confirmPasswordRef}
            />
          </View>
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[30, 5, 5, 5]}
            text="다음 단계"
            onPress={onSubmitSignUp}
          />
          {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[30, 5, 5, 5]}
            text="다음 단계"
            hasMarginBottom
            onPress={onSubmitSignUp}
          /> */}
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
  },
  logo: {
    width: 290,
    height: 200,
    marginTop: 70,
  },
  infoText: {
    fontSize: 16,
  },
  contentText: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 20,
  },

  form: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginTop: 100,
  },
});

export default SignUpScreen;
