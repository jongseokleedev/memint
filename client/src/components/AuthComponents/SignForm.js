import React, {useRef} from 'react';
import BorderedInput from './BorderedInput';

const SignForm = ({onSubmit, form, createChangeTextHandler}) => {
  const passwordRef = useRef();

  return (
    <>
      <BorderedInput
        placeholder="이메일"
        hasMarginBottom
        value={form.email}
        onChangeText={createChangeTextHandler('email')}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <BorderedInput
        placeholder="비밀번호"
        value={form.password}
        onChangeText={createChangeTextHandler('password')}
        secureTextEntry
        ref={passwordRef}
        returnKeyType={'done'}
        onSubmitEditing={() => {
          onSubmit();
        }}
      />
    </>
  );
};

export default SignForm;
