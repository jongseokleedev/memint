import React from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';

function MeetingMemberOut() {
  const [checked, setChecked] = React.useState('first');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>미팅 멤버 내보내기</Text>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.warningBox}>
          <Icon name="error-outline" size={30} color="red" />
          <Text style={styles.boldText}>
            멤버 퇴출은 다음의 경우에만 진행해 주세요.
          </Text>
          <View>
            <Text style={styles.plainText}>• 채팅방 내 타인을 모욕, 비방</Text>
            <Text style={styles.plainText}>
              • 음란물, 불법 사행성 도박 사이트 홍보 메시지 발송
            </Text>
            <Text style={styles.plainText}>
              • 불법촬영물, 허위영상물, 아동 ・ 청소년 성착취물 공유
            </Text>
            <Text style={styles.plainText}>
              • 타인의 개인정보 유출 및 권리침해
            </Text>
            <Text style={styles.plainText}>• 장기간 미응답</Text>
            <Text style={styles.plainText}>• 기타 특이사항</Text>
          </View>
          <Text style={styles.bigText}>
            ※ 잦은 멤버 퇴출은 이용제한조치 사유가 될 수 있습니다.
          </Text>
        </View>
        <View style={styles.selectSection}>
          <Text style={styles.sectionTitle}>
            내보내고 싶은 멤버를 선택해주세요
          </Text>
          <View style={styles.userElement}>
            <Text>알콜스레기 성현</Text>
            <Icon name="check-circle-outline" size={30} />
          </View>
          <View style={styles.userElement}>
            <Text>알콜스레기 성현</Text>
            <Icon name="check-circle-outline" size={30} />
          </View>
          <View style={styles.userElement}>
            <Text>알콜스레기 성현</Text>
            <Icon name="check-circle-outline" size={30} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>퇴출 사유</Text>
          <TextInput
            style={styles.textInput}
            placeholder="퇴출 사유를 구체적으로 적어주세요"
            multiline={true}
          />
        </View>
        <BasicButton
          text="내보내기"
          width={332}
          height={50}
          textSize={18}
          backgroundColor="#000000"
          textColor="#ffffff"
          margin={[30, 3, 3, 3]}
          borderRadius={10}
          onPress={() => {}}
          border={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  warningBox: {
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 23,
    flexDirection: 'column',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 15,
    marginVertical: 15,
  },
  plainText: {
    fontSize: 12.2,
    marginVertical: 0.5,
  },
  bigText: {
    fontSize: 12.5,
    marginTop: 10,
  },
  selectSection: {
    width: '100%',
    marginVertical: 30,
    paddingHorizontal: 10,
  },
  section: {
    width: '100%',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  userElement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  textInput: {
    borderRadius: 10,
    borderColor: '#8D8D8D',
    borderWidth: 1,
    marginVertical: 10,
    height: 80,
    padding: 10,
  },
});

export default MeetingMemberOut;
