import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import BasicButton from '../common/BasicButton';
const SignButtons = ({onSubmitSignIn, onSubmitSignUp}) => {
  return (
    <View style={styles.buttons}>
      <BasicButton
        style={styles.button}
        width={150}
        height={42}
        textSize={15}
        margin={[5, 5, 5, 5]}
        text="로그인"
        hasMarginBottom
        onPress={onSubmitSignIn}
        // onPress={onPressLogin}
      />
      <BasicButton
        style={styles.button}
        size="medium"
        variant="disable"
        text="회원가입"
        width={150}
        height={42}
        textSize={15}
        margin={[5, 5, 5, 5]}
        onPress={onSubmitSignUp}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    marginTop: 32,
  },
  button: {
    flex: 1,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignButtons;
