import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';

function Report() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>신고하기</Text>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Text style={styles.bigText}>불편한 점이 있으신가요?</Text>
          <Text style={styles.bigText}>
            문의사항에 대해 친절히 답변해 드리겠습니다.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldText}>카카오톡 문의</Text>
          <Text>평일 10:00 ~ 19:00 (토, 일, 공휴일 휴무)</Text>
        </View>
        <BasicButton
          text="카카오톡으로 문의하기"
          width={332}
          height={50}
          textSize={18}
          backgroundColor="#F2DD1C"
          textColor="#000000"
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
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  bigText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    marginVertical: 2,
  },
  boldText: {
    fontWeight: '700',
    marginBottom: 3,
  },
});
export default Report;
