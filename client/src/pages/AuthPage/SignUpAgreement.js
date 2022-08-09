import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import CheckElement from '../../components/AuthComponents/CheckElement';
import CheckBox from '@react-native-community/checkbox';
import {signUp} from '../../lib/Auth';
import GradientButton from '../../components/common/GradientButton';

const SignUpAgreementScreen = ({navigation: {navigate}, route}) => {
  const [checkInfo, setCheckInfo] = useState({
    service: '',
    privacy: '',
    age: '',
    event: '',
    all: '',
  });
  const [loading, setLoading] = useState();

  const onSubmitSignUp = async () => {
    // const {email, password} = route.params;
    // const info = {email, password};
    // setLoading(true);
    try {
      // const {user} = await signUp(info);
      // console.log(user);
    } catch (e) {
      Alert.alert('실패');
      console.log(e);
    } finally {
      setLoading(false);
      navigate('SignUpAlarm');
    }
  };

  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  const [useCheck, setUseCheck] = useState(false);
  const [marketingCheck, setMarketingCheck] = useState(false);

  const allBtnEvent = () => {
    if (allCheck === false) {
      setAllCheck(true);
      setServiceCheck(true);
      setAgeCheck(true);
      setUseCheck(true);
      setMarketingCheck(true);
    } else {
      setAllCheck(false);
      setServiceCheck(false);
      setAgeCheck(false);
      setUseCheck(false);
      setMarketingCheck(false);
    }
  };

  const ageBtnEvent = () => {
    if (ageCheck === false) {
      setAgeCheck(true);
    } else {
      setAgeCheck(false);
    }
  };

  const serviceBtnEvent = () => {
    if (serviceCheck === false) {
      setServiceCheck(true);
    } else {
      setServiceCheck(false);
    }
  };

  const useBtnEvent = () => {
    if (useCheck === false) {
      setUseCheck(true);
    } else {
      setUseCheck(false);
    }
  };

  const marketingBtnEvent = () => {
    if (marketingCheck === false) {
      setMarketingCheck(true);
    } else {
      setMarketingCheck(false);
    }
  };

  useEffect(() => {
    if (
      ageCheck === true &&
      serviceCheck === true &&
      useCheck === true &&
      marketingCheck === true
    ) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [ageCheck, serviceCheck, useCheck, marketingCheck]);

  const goToNextPage = () => {
    navigate('SignUpAlarm');
  };

  return (
    <SafeAreaView style={styles.fullscreen}>
      <BackButton />
      <View style={styles.fullscreenSub}>
        <Text style={styles.textMain}>서비스 약관에 동의해주세요</Text>
        <View style={styles.form}>
          <CheckBox
            value={serviceCheck}
            onChange={serviceBtnEvent}
            onCheckColor="#B4C0EB"
            onTintColor="#B4C0EB"
          />
          <Text style={styles.text}>서비스 약관에 동의</Text>
          <Text style={styles.textSub}>(필수)</Text>
        </View>
        <View style={styles.form}>
          <CheckBox
            value={useCheck}
            onChange={useBtnEvent}
            onCheckColor="#B4C0EB"
            onTintColor="#B4C0EB"
          />
          <Text style={styles.text}>개인정보 수집 및 이용동의</Text>
          <Text style={styles.textSub}>(필수)</Text>
        </View>
        <View style={styles.form}>
          <CheckBox
            value={ageCheck}
            onChange={ageBtnEvent}
            onCheckColor="#B4C0EB"
            onTintColor="#B4C0EB"
          />
          <Text style={styles.text}>만 19세 이상</Text>
          <Text style={styles.textSub}>(필수)</Text>
        </View>
        <View style={styles.form}>
          <CheckBox
            value={marketingCheck}
            onChange={marketingBtnEvent}
            onCheckColor="#B4C0EB"
            onTintColor="#B4C0EB"
          />
          <Text style={styles.text}>혜택 및 이벤트 알림 수신 동의</Text>
          <Text style={styles.textSub}>(선택)</Text>
        </View>
        <Text style={styles.contentText}>
          마케팅 수신 동의를 체크하지 않으면, 추천 모임 알림, 이벤트 소식 등 앱
          사용 멤버만을 위한 특별한 혜택 정보를 받을 수 없어요.
        </Text>
        <View style={styles.formAllAgree}>
          <CheckBox
            value={allCheck}
            onChange={allBtnEvent}
            onCheckColor="#B4C0EB"
            onTintColor="#B4C0EB"
          />
          <Text style={styles.text}>모두 동의합니다</Text>
        </View>
        {/* <BasicButton
          style={styles.button}
          width={300}
          height={40}
          textSize={17}
          margin={[5, 5, 5, 5]}
          text="회원가입 완료"
          hasMarginBottom
          onPress={onSubmitSignUp}
        /> */}
        <GradientButton
          style={styles.button}
          width={300}
          height={40}
          textSize={17}
          margin={[5, 5, 5, 5]}
          text="회원가입 완료"
          hasMarginBottom
          onPress={onSubmitSignUp}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    // height: '50',
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
  },
  formAllAgree: {
    marginTop: 20,
    marginBottom: 32,
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formText: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 20,
  },
  textAllAgree: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  textMain: {
    marginBottom: 20,
    paddingHorizontal: 6,
    fontSize: 30,
    fontWeight: 'bold',
  },
  textSub: {
    paddingHorizontal: 6,
    fontSize: 14,
    // fontWeight: 'bold',
    // margin: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  contentText: {
    fontSize: 12,
    marginHorizontal: 50,
    paddingHorizontal: 30,
    // marginTop: 30,
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 20,
  },
  tagsContainer: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  secondForm: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    margin: 50,
  },
  dropdown: {
    fontSize: 10,
    width: 130,
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 30,
  },
});

export default SignUpAgreementScreen;
