import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        <LinearGradient
          colors={['#A7BFEB', '#FBC2EA']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.tag}>
          <Text style={styles.coloredtext}>{tag}</Text>
        </LinearGradient>
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
    backgroundColor: 'lightgrey',
    margin: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  coloredTag: {
    backgroundColor: 'yellow',
  },
  coloredtext: {
    color: 'white',
    fontWeight: '700',
  },
});

export default TagElement;
