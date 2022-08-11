import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import BackButton from '../../components/common/BackButton';

function MeetingConfirm() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>미팅 참여 인증하기</Text>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>미팅 인증샷</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인증방법 및 주의사항</Text>
          <View style={styles.warningBox}>
            <Text style={styles.boldText}>
              미팅 참여자 전원의 얼굴이 보이게 사진을 찍어주세요!
            </Text>
          </View>
          <View style={styles.section}>
            <Text>1. 호스트도 사진에 반드시 포함되어야 합니다.</Text>
            <Text>
              2. 다음의 경우에는 스탭의 판단에 따라 인증이 반려됩니다.
            </Text>
            <Text>• 미팅 구성원 전원이 참석하지 않은 경우</Text>
            <Text>• 음식점이 아닌 것 같다고 판단되는 경우</Text>
          </View>
        </View>
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
    paddingVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13,
  },
  plainText: {
    fontSize: 13,
    marginVertical: 0.5,
  },
  bigText: {
    fontSize: 12.5,
    marginTop: 10,
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
});

export default MeetingConfirm;
