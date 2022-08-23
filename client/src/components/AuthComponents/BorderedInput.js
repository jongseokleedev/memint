import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';

const BorderedInput = ({hasMarginBottom, size, ...rest}, ref) => {
  const sizeStyle = SIZE[size];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        hasMarginBottom && styles.margin,
        sizeStyle,
        isFocused ? styles.isFocused : null,
      ]}
      ref={ref}
      {...rest}
      autoComplete={false}
      autoCorrect={false}
      placeholderTextColor="#EAFFEF"
      onFocus={() => {
        setIsFocused(true);
      }}
      onEndEditing={() => {
        setIsFocused(false);
      }}
    />
  );
};

const SIZE = StyleSheet.create({
  small: {
    width: 70,
    height: 35,
  },
  medium: {
    width: 100,
    height: 40,
  },
  large: {
    width: 220,
    height: 40,
  },
  wide: {
    width: '100%',
    height: 42,
  },
});

const styles = StyleSheet.create({
  input: {
    borderColor: '#EAFFEF',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 48,
    // backgroundColor: 'white',
    color: '#ffffff',
  },
  margin: {
    marginBottom: 16,
  },
  isFocused: {
    borderColor: '#AEFFC1',
  },
});
export default React.forwardRef(BorderedInput);
