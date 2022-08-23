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
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import {signUp, checkUniqueEmail} from '../../lib/Auth';
import GradientButton from '../../components/common/GradientButton';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeStatusBar from '../../components/common/SafeStatusBar';

const SignUpScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
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
    try {
      Keyboard.dismiss();
      setLoading(true);
      const {email, password, confirmPassword} = form;
      let userInfo = {email: email, password: password};
      let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
      const checkEmail = await checkUniqueEmail(email);
      if (password !== confirmPassword) {
        Alert.alert('실패', '비밀번호가 일치하지 않습니다.');
      } else if (password.length < 6) {
        let msg = '유효하지 않은 비밀번호입니다.';
        Alert.alert('실패', msg);
      } else if (!regex.test(email)) {
        let msg = '유효하지 않은 이메일입니다.';
        Alert.alert('실패', msg);
      } else if (!checkEmail) {
        let msg = '이미 가입된 이메일입니다.';
        Alert.alert('실패', msg);
      } else {
        navigation.push('SignUpUserInfo', {userInfo});
      }
    } catch (e) {
      const messages = {
        'auth/invalid-email': '회원 정보를 올바르게 입력해주세요',
      };
      const msg = messages[e.code];
      Alert.alert('실패', msg);
      console.log(e);
    } finally {
      setLoading(false);
    }
    // try {
    //   const {user} = await signUp(info);
    //   console.log(user);
    //   // navigation.navigate('SignUpUserInfo');
    //   navigation.push('SignUpUserInfo', {uid: user.uid, info});
    // } catch (e) {
    //   const messages = {
    //     'auth/email-already-in-use': '이미 가입된 이메일입니다.',
    //     'auth/wrong-password': '잘못된 비밀번호입니다.',
    //     'auth/user-not-found': '존재하지 않는 계정입니다.',
    //     'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
    //   };
    //   const msg = messages[e.code];
    //   Alert.alert('실패', msg);
    //   console.log(e);
    // } finally {
    //   setLoading(false);
    // }
  };

  if (loading) {
    return (
      <View style={styles.fullscreenSub}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#FAC3E9" />
        </View>
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={'padding'}>
        <SafeStatusBar />

        <BackButton />
        <View style={styles.fullscreen}>
          <Text style={styles.title}>회원가입</Text>

          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.infoText}>이메일</Text>
              <BorderedInput
                size="wide"
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
                size="wide"
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
            <View style={[styles.form, styles.padding]}>
              <Text style={styles.infoText}>비밀번호 확인 </Text>
              <BorderedInput
                size="wide"
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
            {/* <BasicButton
              style={styles.button}
              width={200}
              height={40}
              textSize={17}
              margin={[30, 5, 5, 5]}
              text="다음 단계"
              hasMarginBottom
              onPress={onSubmitSignUp}
            /> */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onSubmitSignUp}>
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
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#3C3D43',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 15,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginVertical: 20,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  infoText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  form: {
    marginTop: 16,
    marginBottom: 10,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  spinnerWrapper: {
    marginTop: 254,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding: {
    marginBottom: 90,
  },
});

export default SignUpScreen;
