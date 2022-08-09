import React from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {StyleSheet} from 'react-native';

/*
  value는 필수 요소 입니다(required)

  Ex)
  <DatePicker value={new Date()} onChange={(event, date) => console.log(date)} />;
*/

function DatePicker({value, onChange}) {
  return (
    <RNDateTimePicker
      style={styles.datePicker}
      display="default"
      value={value}
      onChange={onChange}
      maximumDate={new Date(2022, 12, 31)}
      minimumDate={new Date(2022, 6, 13)}
    />
  );
}

const styles = StyleSheet.create({
  datePicker: {
    width: 80,
    height: 50,
  },
});

export default DatePicker;
