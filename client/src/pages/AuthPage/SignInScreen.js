import React, {useRef, useState} from 'react';

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import OauthButton from '../../components/AuthComponents/OauthButton';
import SignForm from '../../components/AuthComponents/SignForm';
import SignButtons from '../../components/AuthComponents/SignButtons';
import memintLogo from '../../assets/icons/memint.png';
import logo from '../../assets/icons/logo.png';
import useAuth from '../../utils/hooks/UseAuth';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {signIn} from '../../lib/Auth';
import {getUser, getUserProperty} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import useNftActions from '../../utils/hooks/UseNftActions';
import {getNFTs, getProfile, getMemin} from '../../lib/NFT';
import GradientButton from '../../components/common/GradientButton';

const SignInScreen = ({navigation, route}) => {
  const userInfo = useUser();

  const {saveInfo} = useAuthActions();
  const {saveNFT, setNftProfile, setMemin} = useNftActions();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };
  const [loading, setLoading] = useState();
  const goToSignUp = () => {
    Keyboard.dismiss();
    navigation.navigate('SignUp');
    console.log(form);
  };

  const onSubmitSignIn = async () => {
    Keyboard.dismiss();
    const {email, password} = form;
    const info = {email, password};
    setLoading(true);
    try {
      const {user} = await signIn(info);
      const userDetail = await getUser(user.uid);
      const userProperty = await getUserProperty(user.uid);

      console.log(userDetail);
      const res = await getNFTs(user.uid);
      const nfts = res.docs.map(el => {
        return {...el.data()};
      });
      saveNFT(nfts);
      setNftProfile(...getProfile(nfts));
      setMemin(...getMemin(nfts));

      saveInfo({
        ...userInfo,
        id: user.uid,
        email: user.email,
        nickName: userDetail.nickName,
        gender: userDetail.gender,
        birth: userDetail.birth,
        nftIds: userDetail.nftIds,
        picture: userDetail.picture,
        address: userDetail.address,
        tokenAmount: userDetail.tokenAmount,
        ethAmount: userDetail.ethAmount,
        onChainTokenAmount: userDetail.onChainTokenAmount,
        nftProfile: userDetail.nftProfile.toString(),
        alcoholType: userProperty[0].alcoholType,
        drinkCapa: userProperty[0].drinkCapa,
        drinkStyle: userProperty[0].drinkStyle,
        visibleUser: userDetail.visibleUser,
      }),
        navigation.navigate('Main');
    } catch (e) {
      Alert.alert('실패');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const goToFindId = () => {
    navigation.navigate('FindIdVerifyMobile');
  };
  const goToFindPW = () => {
    navigation.navigate('FindPWVerify');
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#FAC3E9" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.form}>
          <SignForm
            onSubmit={onSubmitSignIn}
            form={form}
            createChangeTextHandler={createChangeTextHandler}
          />

          {/* <SignButtons onSubmitSignIn={goToMain} onSubmitSignUp={goToSignUp} /> */}
          <SignButtons
            onSubmitSignIn={onSubmitSignIn}
            onSubmitSignUp={goToSignUp}
          />
          <View style={styles.textContainer}>
            <Text style={styles.textAsk}>이미 회원이신가요?</Text>
            {/* <Text style={styles.textFind}>아이디 / 비밀번호 찾기</Text> */}
            <TouchableOpacity style={styles.textFind} onPress={goToFindId}>
              <Text> 아이디 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textFind} onPress={goToFindPW}>
              <Text> 비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.oauthbutton}>
            <OauthButton
              style={styles.oauthbutton}
              size="wide"
              text="Google 계정으로 로그인"
              vendor="google"
              backgroundColor="#6699ff"
              hasMarginBottom
            />
            <OauthButton
              style={styles.oauthbutton}
              size="wide"
              text="Apple 계정으로 로그인"
              backgroundColor="#666666"
              vendor="apple"
            />
          </View> */}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 290,
    height: 200,
    marginTop: 70,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 52,
    marginBottom: 60,
  },
  textAsk: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  textFind: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  form: {
    marginTop: 50,
    width: '100%',
    paddingHorizontal: 16,
  },

  oauthbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    // paddingHorizontal: 16,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
