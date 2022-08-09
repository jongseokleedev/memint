import React, {useRef, useState} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BackButton from '../../components/common/BackButton';
import logo from '../../assets/icons/logo.png';
import GradientButton from '../../components/common/GradientButton';

const FindIdShowIdScreen = ({navigation}) => {
  const goToSignInPage = () => {
    navigation.navigate('SignIn');
  };
  const goToFindPWPage = () => {
    navigation.navigate('FindPWVerify');
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
            가입하신 이메일은 {'\n'} "abcdefu@gmail.com" 입니다.
          </Text>
          {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 20, 5]}
            text="로그인 하러 가기"
            hasMarginBottom
            onPress={goToSignInPage}
          /> */}
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 20, 5]}
            text="로그인 하러 가기"
            hasMarginBottom
            onPress={goToSignInPage}
          />

          {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[20, 5, 5, 5]}
            text="비밀번호 변경하러 가기"
            hasMarginBottom
            onPress={goToFindPWPage}
          /> */}
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[20, 5, 5, 5]}
            text="비밀번호 변경하러 가기"
            hasMarginBottom
            onPress={goToFindPWPage}
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
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 64,
    marginBottom: 64,
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

export default FindIdShowIdScreen;
