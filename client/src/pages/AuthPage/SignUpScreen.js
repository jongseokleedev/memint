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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import logo from '../../assets/icons/logo.png';
import {signUp, checkUniqueEmail} from '../../lib/Auth';
import GradientButton from '../../components/common/GradientButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
      <SafeAreaView style={styles.fullscreenSub}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#FAC3E9" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView style={styles.KeyboardAvoidingView}>
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
      </KeyboardAwareScrollView>
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
    // flex: 1,
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
  spinnerWrapper: {
    marginTop: 254,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpScreen;
