import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import BasicButton from '../common/BasicButton';
import GradientButton from '../common/GradientButton';
const SignButtons = ({onSubmitSignIn, onSubmitSignUp}) => {
  return (
    <View style={styles.buttons}>
      <GradientButton
        width={150}
        height={50}
        textSize={15}
        margin={[5, 5, 5, 5]}
        text="로그인"
        onPress={onSubmitSignIn}
      />
      <GradientButton
        width={150}
        height={50}
        text="회원가입"
        textSize={15}
        margin={[5, 5, 5, 5]}
        onPress={onSubmitSignUp}
      />

      {/* <BasicButton
        style={styles.button}
        width={150}
        height={50}
        textSize={15}
        margin={[5, 5, 5, 5]}
        text="로그인"
        hasMarginBottom
        onPress={onSubmitSignIn}
        // onPress={onPressLogin}
        backgroundColor="#FF9999"
      />
      <BasicButton
        style={styles.button}
        size="medium"
        variant="disable"
        text="회원가입"
        width={150}
        height={50}
        textSize={15}
        margin={[5, 5, 5, 5]}
        backgroundColor="#6633ff"
        onPress={onSubmitSignUp}
      /> */}
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
