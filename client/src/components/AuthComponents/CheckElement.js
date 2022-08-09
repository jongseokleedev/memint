import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function CheckElement({tag, checkInfo, setCheckInfo}) {
  const [colored, setColored] = useState(false);
  const handleClick = () => {
    if (colored) {
      setColored(false);
      setCheckInfo({
        ...checkInfo,
      });
    } else {
      setColored(true);
      setCheckInfo({...checkInfo});
    }
  };
  return (
    <TouchableOpacity
      //   style={[styles.tag, colored ? styles.coloredTag : '']}
      onPress={handleClick}>
      <Icon
        name={colored ? 'check-circle' : 'check-circle-outline'}
        // name="check-circle"
        size={30}
        color={'black'}
      />
      <Text>{tag}</Text>
    </TouchableOpacity>
  );
}

// const styles = StyleSheet.create({
//   tag: {
//     // margin: 8,
//     padding: 8,
//     marginHorizontal: 8,
//   },
//   coloredTag: {
//     // backgroundColor: 'blue',
//   },
// });

export default CheckElement;
