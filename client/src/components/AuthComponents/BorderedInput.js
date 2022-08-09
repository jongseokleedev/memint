import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const BorderedInput = ({hasMarginBottom, size, ...rest}, ref) => {
  const sizeStyle = SIZE[size];

  return (
    <TextInput
      style={[styles.input, hasMarginBottom && styles.margin, sizeStyle]}
      ref={ref}
      {...rest}
      autoComplete={false}
      autoCorrect={false}
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
    width: 320,
    height: 40,
  },
});

const styles = StyleSheet.create({
  input: {
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 48,
    backgroundColor: 'white',
  },
  margin: {
    marginBottom: 16,
  },
});
export default React.forwardRef(BorderedInput);
