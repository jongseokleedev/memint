import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import SelectDropdown from 'react-native-select-dropdown';
import TagElement from '../../components/AuthComponents/TagElement';
import {createProperty} from '../../lib/Users';
import GradientButton from '../../components/common/GradientButton';

const SignUpUserDetailScreen = ({navigation: {navigate}, route}) => {
  const {uid} = route.params || {};
  const [drinkInfo, setDrinkInfo] = useState({
    drinkCapa: '',
    drinkStyle: [],
    alcoholType: [],
  });
  console.log(drinkInfo);

  const goToNextPage = () => {
    createProperty({
      userId: uid,
      drinkCapa: drinkInfo.drinkCapa,
      drinkStyle: drinkInfo.drinkStyle,
      alcoholType: drinkInfo.alcoholType,
    });
    navigate('SignUpServeNFT', route.params);
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
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <BackButton />
        <View style={styles.fullscreenSub}>
          <View style={styles.form}>
            <Text style={styles.text}>주량을 선택해주세요</Text>
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
            />
          </View>
          <Text style={styles.contentText}>
            미팅 매칭 필요 정보로 활용합니다.
          </Text>
          <Text style={styles.text}>
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
          <Text style={styles.text}>
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
          <GradientButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[30, 5, 5, 5]}
            text="다음 단계"
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
    justifyContent: 'center',
  },
  form: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 6,
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  contentText: {
    fontSize: 16,
    marginTop: 30,
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

export default SignUpUserDetailScreen;
