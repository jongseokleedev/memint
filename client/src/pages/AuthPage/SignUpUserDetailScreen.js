import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import SelectDropdown from 'react-native-select-dropdown';
import TagElement from '../../components/AuthComponents/TagElement';
import {createProperty} from '../../lib/Users';
import LinearGradient from 'react-native-linear-gradient';
import SafeStatusBar from '../../components/common/SafeStatusBar';

const SignUpUserDetailScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const [drinkInfo, setDrinkInfo] = useState({
    drinkCapa: '',
    drinkStyle: [],
    alcoholType: [],
  });
  console.log(drinkInfo);

  const goToNextPage = () => {
    if (
      drinkInfo.drinkCapa === '' ||
      drinkInfo.drinkStyle.length === 0 ||
      drinkInfo.alcoholType.length === 0
    ) {
      Alert.alert('실패', '회원 정보를 올바르게 입력해주세요');
    } else {
      userInfo = {
        ...userInfo,
        drinkCapa: drinkInfo.drinkCapa,
        drinkStyle: drinkInfo.drinkStyle,
        alcoholType: drinkInfo.alcoholType,
      };
      // createProperty({
      //   userId: uid,
      //   drinkCapa: drinkInfo.drinkCapa,
      //   drinkStyle: drinkInfo.drinkStyle,
      //   alcoholType: drinkInfo.alcoholType,
      // });
      navigation.push('SignUpServeNFT', {userInfo});
      // navigate('SignUpServeNFT', route.params);
    }
  };

  const tagData = {
    alcoholType: [
      '소주',
      '맥주',
      '보드카',
      '칵테일',
      '고량주',
      '막걸리',
      '와인',
    ],
    drinkStyle: [
      '진지한 분위기를 좋아해요. 함께 이야기 나눠요!',
      '신나는 분위기를 좋아해요. 친해져요!',
      '일단 마시고 생각하자구요. 부어라 마셔라!',
      '안주보다 술이 좋아요',
      '술보다 안주가 좋아요.',
    ],
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <SafeStatusBar />
        <BackButton />
        <LinearGradient
          colors={['#3D3E44', '#5A7064']}
          start={{x: 0.3, y: 0.3}}
          end={{x: 1, y: 1}}
          style={styles.gradientBackground}>
          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.text}>나의 주량은?</Text>
              <View style={styles.selectWrap}>
                <SelectDropdown
                  data={[
                    '한 잔만',
                    '반 병 이하',
                    '한 병 이하',
                    '두 병 이하',
                    '세 병 이하',
                    '세 병 이상',
                  ]}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setDrinkInfo({...drinkInfo, drinkCapa: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={styles.dropdown}
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                />
              </View>
            </View>
            <View>
              <Text style={styles.contentText}>
                선호하는 주류를 선택해주세요.(중복가능)
              </Text>
              <View style={styles.tagsContainer}>
                {tagData.alcoholType.map((tag, idx) => (
                  <TagElement
                    key={idx}
                    tag={tag}
                    drinkInfo={drinkInfo}
                    setDrinkInfo={setDrinkInfo}
                    type="alcoholType"
                  />
                ))}
              </View>
            </View>
            <View style={styles.marginBottom}>
              <Text style={styles.contentText}>
                당신의 음주 스타일을 알려주세요.(중복 가능)
              </Text>
              <View style={styles.tagsContainer}>
                {tagData.drinkStyle.map((tag, idx) => (
                  <TagElement
                    key={idx}
                    tag={tag}
                    drinkInfo={drinkInfo}
                    setDrinkInfo={setDrinkInfo}
                    type="drinkStyle"
                  />
                ))}
              </View>
            </View>

            {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 5, 5]}
            text="다음 단계"
            hasMarginBottom
            onPress={goToNextPage}
          /> */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={goToNextPage}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fullscreenSub: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  form: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontWeight: '400',
    fontSize: 24,
    marginVertical: 20,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    marginRight: 15,
  },
  contentText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 30,
    marginBottom: 15,
  },

  tagsContainer: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flexDirection: 'row',
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdown: {
    width: '100%',
    borderColor: '#EAFFEF',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 99,
    height: 36,
    backgroundColor: '#EAFFEF',
  },
  dropdownStyle: {
    backgroundColor: '#3C3D43',
    borderRadius: 10,
  },
  dropdownTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  buttonTextStyle: {
    color: '#1D1E1E',
    fontSize: 16,
  },
  selectWrap: {
    flex: 1,
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
  marginBottom: {
    marginBottom: 90,
  },
});

export default SignUpUserDetailScreen;
