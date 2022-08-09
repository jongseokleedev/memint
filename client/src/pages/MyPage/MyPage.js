import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Alert} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import MyMeetingList from '../../components/myPageComponent/MyMeetingList';
import ParticipatedMeetingList from '../../components/myPageComponent/ParticipatedMeetingList';
import MyProfile from '../../components/myPageComponent/MyProfle';
import useUser from '../../utils/hooks/UseUser';
import WalletButton from '../../components/common/WalletButton';

function MyPage({navigation}) {
  const user = useUser();

  const [meetingRoom, setMeetingRoom] = useState(0);
  const room = [{name: '내가 만든 방'}, {name: '참여 중인 방'}];
  const selecteMenuHandler = index => {
    setMeetingRoom(index);
  };
  return (
    <SafeAreaView style={styles.view}>
      <ScrollView>
        {/* 유저 프로필 */}
        <MyProfile User={user} navigation={navigation} />
        <View style={styles.mymeetings}>
          {/* 탭 선택 버튼 */}
          <View style={styles.meetingButton}>
            {room.map((ele, index, key) => {
              return (
                <BasicButton
                  text={ele.name}
                  width={160}
                  height={40}
                  textSize={14}
                  backgroundColor={meetingRoom === index ? 'black' : 'white'}
                  textColor={meetingRoom === index ? 'white' : 'black'}
                  borderRadius={30}
                  margin={[10, 3, 3, 3]}
                  onPress={() => selecteMenuHandler(index)}
                  key={index}
                />
              );
            })}
          </View>
          {/* 탭 선택에 따른 미팅 리스트 */}

          {meetingRoom === 0 ? (
            <MyMeetingList navigation={navigation} user={user} />
          ) : (
            <ParticipatedMeetingList user={user} />
          )}
        </View>
      </ScrollView>
      <WalletButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  meetingButton: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mymeetings: {
    marginBottom: 50,
    marginTop: 20,
  },
});
export default MyPage;
