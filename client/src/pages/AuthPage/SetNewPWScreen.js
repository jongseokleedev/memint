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

const SetNewPWScreen = ({navigation}) => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  // const {isSignup} = route.params || {};
  const confirmPasswordRef = useRef();

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    console.log(form);
  };
  const goToNextPage = () => {
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
          <Text style={styles.contentText}>
            새로운 비밀번호를 입력해주세요.
          </Text>
          <View style={styles.form}>
            <BorderedInput
              size="wide"
              placeholder="새로운 비밀번호"
              hasMarginBottom
              value={form.email}
              onChangeText={createChangeTextHandler('password')}
              autoCapitalize="none"
              secureTextEntry
              autoCorrect={false}
              returnKeyType={'done'}
              onSubmitEditing={() => confirmPasswordRef.current.focus()}
            />
          </View>
          <Text style={styles.contentTextVerify}>비밀번호 확인</Text>
          <View style={styles.secondForm} hasMarginBottom>
            <BorderedInput
              size="wide"
              placeholder="비밀번호 확인"
              value={form.confirmPassword}
              onChangeText={createChangeTextHandler('confirmPassword')}
              secureTextEntry
              ref={confirmPasswordRef}
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
            margin={[5, 5, 5, 5]}
            text="비밀번호 재설정하기"
            hasMarginBottom
            onPress={goToNextPage}
          /> */}
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 5, 5]}
            text="비밀번호 재설정하기"
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

export default SetNewPWScreen;
