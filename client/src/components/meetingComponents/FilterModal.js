import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DatePicker from '../common/DatePicker';
import RNPickerSelect from 'react-native-picker-select';
import SingleModal from '../common/SingleModal';
import {getMeetingTags} from '../../lib/MeetingTag';

function FilterModal({
  setFilter,
  FilterPeopleDropDownData,
  filter,
  filterModalVisible,
  setFilterModalVisible,
}) {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    getTags();
  }, [getTags]);
  const getTags = useCallback(async () => {
    const res = await getMeetingTags();
    const data = res.docs.map(el => el.data());
    const meetingTags = data
      .sort((a, b) => {
        if (a.type > b.type) {
          return -1;
        } else {
          return 1;
        }
      })
      .map(el => {
        return {label: el.content, value: el.content};
      });
    setTags(meetingTags);
  }, []);
  return (
    <SingleModal
      text="필터를 설정하세요"
      body={
        <View style={styles.filterContent}>
          <View style={styles.filterElement}>
            <Text style={styles.filterText}>인원</Text>
            <RNPickerSelect
              placeholder={{label: '전체', value: 0}}
              onValueChange={value => {
                setFilter({...filter, peopleNum: value});
              }}
              items={FilterPeopleDropDownData}
              value={filter.peopleNum}
              style={{
                inputIOS: {
                  fontSize: 16,
                  color: 'black',
                },
                placeholder: {
                  fontSize: 16,
                  color: 'gray',
                },
              }}
            />
          </View>
          <View style={styles.filterElement}>
            <Text style={styles.filterText}>날짜</Text>
            <DatePicker
              value={filter.meetDate}
              onChange={(event, date) => {
                setFilter({...filter, meetDate: date});
              }}
            />
          </View>
          <View style={styles.filterElement}>
            <Text style={styles.filterText}>태그</Text>
            <RNPickerSelect
              placeholder={{label: '전체', value: 0}}
              onValueChange={value => {
                setFilter({...filter, meetingTags: value});
              }}
              items={tags}
              value={filter.meetingTags}
              style={{
                inputIOS: {
                  fontSize: 16,
                  color: 'black',
                },
                placeholder: {
                  fontSize: 16,
                  color: 'gray',
                },
              }}
            />
          </View>
        </View>
      }
      buttonText="닫기"
      modalVisible={filterModalVisible}
      setModalVisible={setFilterModalVisible}
      pFunction={() => {
        // handleFilter();
        setFilterModalVisible(!filterModalVisible);
      }}
      nFunction={() => {
        setFilterModalVisible(!filterModalVisible);
      }}
    />
  );
}

const styles = StyleSheet.create({
  filterContent: {
    marginBottom: 30,
    marginHorizontal: 10,
  },
  filterElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 30,
  },
});

export default FilterModal;
