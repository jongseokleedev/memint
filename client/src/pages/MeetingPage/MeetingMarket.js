import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MeetingElement from '../../components/meetingComponents/MeetingElement';
import WalletButton from '../../components/common/WalletButton';
import SingleModal from '../../components/common/SingleModal';
import {getMeetings} from '../../lib/Meeting';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import FilterModal from '../../components/meetingComponents/FilterModal';
import {getUser} from '../../lib/Users';
import {signOut} from '../../lib/Auth';
import useAuthActions from '../../utils/hooks/UseAuthActions';

function MeetingMarket({navigation}) {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [shownMeetings, setShownMeetings] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [sortSelect, setSortSelect] = useState(undefined);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState({
    region: '서울 전체',
    peopleNum: undefined,
    meetDate: new Date(),
    meetingTags: undefined,
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    setSortSelect(0);
    getMeetingMarket();
  }, [isFocused, getMeetingMarket]);

  useEffect(() => {
    setFilteredMeetings(handleFilter(meetings));
    handleSort();
  }, [handleFilter, meetings, filter, handleSort, sortSelect]);

  const getMeetingMarket = useCallback(async () => {
    try {
      const res = await getMeetings();
      const data = res.docs.map(el => {
        return {
          ...el.data(),
          id: el.id,
          // meetDate: handleDate(el.data().meetDate),
        };
      });

      const dataWithHostInfo = await Promise.all(
        data
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map(async el => {
            const hostInfo = await getUser(el.hostId);
            return {
              ...el,
              hostInfo: {...hostInfo},
            };
          }),
      );
      setMeetings(dataWithHostInfo);
      setFilteredMeetings(handleFilter(dataWithHostInfo));
      setShownMeetings(handleFilter(dataWithHostInfo));
      // setRegionMeetings(dataWithHostInfo);
      // setFilteredMeetings(dataWithHostInfo);
    } catch (e) {}
  }, [handleFilter]);

  const handleSort = useCallback(() => {
    if (sortSelect === undefined || sortSelect === 0) {
      setShownMeetings(filteredMeetings);
    } else if (sortSelect === 1) {
      setShownMeetings(
        filteredMeetings.sort((a, b) => {
          const x = a.meetDate.toDate() - new Date();
          const y = b.meetDate.toDate() - new Date();
          if (x < y) {
            return -1;
          } else {
            return 1;
          }
        }),
      );
    } else if (sortSelect === 2) {
      setShownMeetings(
        filteredMeetings.sort((a, b) => {
          const x = a.hostInfo.birth.slice(0, 4);
          const y = b.hostInfo.birth.slice(0, 4);
          if (x > y) {
            return -1;
          } else {
            return 1;
          }
        }),
      );
    }
  }, [sortSelect, filteredMeetings, filter]);

  const handleFilter = useCallback(
    value => {
      let res = handleRegion(value);
      res = handlePeopleNum(res);
      res = handleMeetDate(res);
      res = handleMeetingTags(res);
      return res;
    },
    [handleRegion, handlePeopleNum, handleMeetDate, handleMeetingTags, filter],
  );

  const handleRegion = useCallback(
    value => {
      const region = filter.region;
      if (region === undefined || region === '서울 전체') {
        return value;
      } else {
        return value.filter(meeting => meeting.region === region);
      }
    },
    [filter.region],
  );

  const handlePeopleNum = useCallback(
    value => {
      const peopleNum = filter.peopleNum;
      if (peopleNum === undefined || peopleNum === 0) {
        return value;
      } else {
        return value.filter(meeting => meeting.peopleNum === peopleNum);
      }
    },
    [filter.peopleNum],
  );

  const handleMeetDate = useCallback(
    value => {
      const meetDate = filter.meetDate;
      return value.filter(meeting => meeting.meetDate.toDate() >= meetDate);
    },
    [filter.meetDate],
  );

  const handleMeetingTags = useCallback(
    value => {
      const meetingTags = filter.meetingTags;
      if (meetingTags === undefined || meetingTags === 0) {
        return value;
      } else {
        return value.filter(
          meeting => meeting.meetingTags.indexOf(meetingTags) !== -1,
        );
      }
    },
    [filter.meetingTags],
  );
  const RegionDropDownData = [
    {label: '서울 전체', value: '서울 전체'},
    {label: '강남', value: '강남'},
    {label: '신사', value: '신사'},
    {label: '홍대', value: '홍대'},
    {label: '신촌', value: '신촌'},
    {label: '여의도', value: '여의도'},
    {label: '구로', value: '구로'},
    {label: '신도림', value: '신도림'},
    {label: '혜화', value: '혜화'},
    {label: '안암', value: '안암'},
    {label: '종로', value: '종로'},
    {label: '동대문', value: '동대문'},
    {label: '성수', value: '성수'},
    {label: '이태원', value: '이태원'},
  ];
  const SortDropDownData = [
    {label: '정렬', value: 0},
    {label: '시간 가까운 순', value: 1},
    {label: '나이 젊은 순', value: 2},
    {label: '위치 가까운 순', value: 3},
  ];
  const FilterPeopleDropDownData = [
    {label: '1:1', value: 1},
    {label: '2:2', value: 2},
    {label: '3:3', value: 3},
    {label: '4:4', value: 4},
  ];
  const {logout} = useAuthActions();
  const handleSignOut = useCallback(async () => {
    try {
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigation.navigate('SignIn');
    }
  }, [navigation, logout]);
  return (
    <SafeAreaView style={styles.container}>
      {/* <Button title="로그아웃 하기" color="red" onPress={handleSignOut} /> */}
      <ScrollView>
        <Pressable style={styles.areaEnd}>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={value => {
              setFilter({...filter, region: value});
            }}
            items={RegionDropDownData}
            value={filter.region}
          />

          <Icon name="check-circle" size={19} style={styles.checkicon} />
        </Pressable>
        <View style={styles.titleArea}>
          <Text style={styles.title}>새로운 친구들과 술 한잔 어때?</Text>
        </View>

        <View style={styles.areaEnd}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              setConfirmModalVisible(true);
            }}>
            <Icon name="add-box" size={35} />
          </TouchableOpacity>
        </View>

        <View style={styles.listfilterArea}>
          <Pressable
            style={styles.listfilter}
            onPress={() => {
              setFilterModalVisible(true);
            }}>
            <Icon name="filter-alt" size={20} />
            <Text> 조건 설정</Text>
            <FilterModal
              setFilter={setFilter}
              FilterPeopleDropDownData={FilterPeopleDropDownData}
              filter={filter}
              filterModalVisible={filterModalVisible}
              setFilterModalVisible={setFilterModalVisible}
              // handleFilter={()=>{}}
            />
          </Pressable>
          <Pressable style={styles.listfilter}>
            <RNPickerSelect
              placeholder={{}}
              onValueChange={value => {
                setSortSelect(value);
              }}
              items={SortDropDownData}
              value={sortSelect}
            />
            <Icon name="arrow-drop-down" size={18} />
          </Pressable>
        </View>
        {shownMeetings.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>해당하는 미팅이 없습니다</Text>
          </View>
        ) : (
          <View style={styles.meetingLists}>
            {shownMeetings.map((meeting, idx) => {
              return <MeetingElement key={idx} item={meeting} />;
            })}
          </View>
        )}

        <SingleModal
          text="미팅을 생성하시겠습니까?"
          //body={<Text>정말로?</Text>}
          buttonText="네"
          modalVisible={confirmModalVisible}
          setModalVisible={setConfirmModalVisible}
          pFunction={() => {
            setConfirmModalVisible(!confirmModalVisible);
            navigation.navigate('MeetingCreate');
          }}
        />
      </ScrollView>
      <WalletButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  areaEnd: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  checkicon: {
    marginLeft: 5,
  },
  createButton: {},
  titleArea: {
    width: 230,
    paddingLeft: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 31,
    fontWeight: '500',
  },
  listfilterArea: {
    marginTop: 20,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listfilter: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingLists: {
    marginBottom: 40,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 30,
  },
  emptyText: {
    color: 'lightgray',
  },
});

export default MeetingMarket;
