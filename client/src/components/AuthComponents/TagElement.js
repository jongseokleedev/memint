import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

function TagElement({tag, drinkInfo, setDrinkInfo, type}) {
  const [colored, setColored] = useState(false);
  const handleClick = () => {
    if (colored) {
      setColored(false);
      if (type === 'alcoholType') {
        setDrinkInfo({
          ...drinkInfo,
          alcoholType: drinkInfo.alcoholType.filter(el => el !== tag),
        });
      } else if (type === 'drinkStyle') {
        setDrinkInfo({
          ...drinkInfo,
          alcoholType: drinkInfo.drinkStyle.filter(el => el !== tag),
        });
      }
    } else {
      setColored(true);
      if (type === 'alcoholType') {
        const alcoholType = [...drinkInfo.alcoholType, tag];
        setDrinkInfo({
          ...drinkInfo,
          alcoholType: alcoholType,
        });
      } else if (type === 'drinkStyle') {
        const drinkStyle = [...drinkInfo.drinkStyle, tag];
        setDrinkInfo({
          ...drinkInfo,
          drinkStyle: drinkStyle,
        });
      }
    }
  };
  return (
    <TouchableOpacity
      // style={[styles.tag, colored ? styles.coloredTag : '']}
      onPress={handleClick}>
      {colored ? (
        <View style={[styles.tag, styles.coloredTag]}>
          <Text style={styles.coloredtext}>{tag}</Text>
        </View>
      ) : (
        <View style={styles.tag}>
          <Text style={styles.text}>{tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#3C3D43',
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginVertical: 4,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 4,
  },
  coloredTag: {
    borderColor: '#AEFFC1',
    borderWidth: 1,
  },
  coloredtext: {
    color: '#AEFFC1',
    fontSize: 16,
    letterSpacing: -0.5,
  },
  text: {
    color: '#EAFFEFCC',
    fontSize: 16,
    letterSpacing: -0.5,
  },
});

export default TagElement;
