import React, {useState, useCallback} from 'react';

import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import SelectDropdown from 'react-native-select-dropdown';
import TagElement from '../../components/AuthComponents/TagElement';
import CameraButton from '../../components/AuthComponents/CameraButton';
import SingleModal from '../../components/common/SingleModal';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
import {signOut} from '../../lib/Auth';
import useAuthActions from '../../utils/hooks/UseAuthActions';

const EditMyInfo = ({route}) => {
  const [drinkInfo, setDrinkInfo] = useState({
    drink: [],
    drinkStyle: [],
  });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const tagData = {
    drink: ['소주', '맥주', '보드카', '칵테일', '고량주', '막걸리', '와인'],
    drinkStyle: [
      '진지한 분위기를 좋아해요. 함께 이야기 나눠요!',
      '신나는 분위기를 좋아해요. 친해져요!',
      '일단 마시고 생각하자구요. 부어라 마셔라!',
      '안주보다 술이 좋아요',
      '술보다 안주가 좋아요.',
    ],
  };
  const handleSubmit = () => {
    setConfirmModalVisible(true);
  };
  const {logout} = useAuthActions();
  const handleSignOut = useCallback(async () => {
    try {
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigation.reset({routes: [{name: 'SignIn'}]});
      // navigation.navigate('SignIn');
    }
  }, [navigation, logout]);

  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.headerBar}>
          <View style={styles.flexRow}>
            <BackButton />
            <Text style={styles.title}>나의 정보 수정</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submit}>저장</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fullscreenSub}>
          <View style={styles.cameraButton}>
            <CameraButton />
          </View>
          <View style={styles.form}>
            <Text style={styles.text}>나의 주량</Text>
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
              }}
              defaultButtonText=" "
              buttonStyle={styles.dropdown}
            />
          </View>

          <Text style={styles.text}>내가 선호하는 주류</Text>
          <View style={styles.tagsContainer}>
            {tagData.drink.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                drinkInfo={drinkInfo}
                setDrinkInfo={setDrinkInfo}
              />
            ))}
          </View>
          <Text style={styles.text}>나의 음주 스타일</Text>
          <View style={styles.tagsContainer}>
            {tagData.drinkStyle.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                drinkInfo={drinkInfo}
                setDrinkInfo={setDrinkInfo}
              />
            ))}
          </View>
          <SingleModal
            text="나의 정보를 수정하시겠까습니?"
            buttonText="네"
            modalVisible={confirmModalVisible}
            setModalVisible={setConfirmModalVisible}
            pFunction={() => {
              setConfirmModalVisible(false);
              showToast('success', '수정되었습니다');
              navigation.pop();
            }}
          />
        </View>
        <View style={styles.signoutButton}>
          <Button title="로그아웃 하기" color="red" onPress={handleSignOut} />
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
  submit: {
    fontSize: 15,
    fontWeight: '700',
  },
  fullscreen: {
    flex: 1,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
    height: 60,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    marginLeft: 10,
  },
  grayButton: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    marginLeft: 10,
    color: 'gray',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dropdown: {
    fontSize: 10,
    width: 130,
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 30,
  },
  signoutButton: {
    marginTop: 80,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  cameraButton: {
    marginTop: 50,
  },
});

export default EditMyInfo;
