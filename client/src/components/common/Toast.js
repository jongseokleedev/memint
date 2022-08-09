import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native';
import {useToast} from '../../utils/hooks/useToast';

/*
  useToast import 후,
  showToast(타입, 메시지); 와 같이 사용하시면 됩니다.
  타입('success', 'error', 'basic')

  Ex)
  const {showToast} = useToast();

  showToast('success', '미팅 신청을 보냈습니다\n주선자의 수락을 기다려주세요!');
*/
const fadeDuration = 500;

function Toast() {
  const {toastConfig, hideToast} = useToast();
  const opacity = useRef(new Animated.Value(0)).current;
  const fadeIn = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start();
  }, [opacity]);
  const fadeOut = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start(() => {
      hideToast();
    });
  }, [opacity, hideToast]);
  useEffect(() => {
    if (!toastConfig) {
      return;
    }
    fadeIn();

    const timer = setTimeout(fadeOut, toastConfig.duration);

    return () => clearTimeout(timer);
  }, [toastConfig, fadeIn, fadeOut]);
  if (!toastConfig) {
    return null;
  }
  const {type, message} = toastConfig;

  const backgroundColor = StyleSheet.create({
    success: {color: '#609afa'},
    error: {color: '#f87171'},
    basic: {color: 'black'},
  });

  return (
    <Animated.View style={[styles.container, opacity]}>
      <View style={[styles.toast]}>
        <Text style={[styles.message, backgroundColor[type]]}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    top: 100,
    marginHorizontal: 20,
    width: 300,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  toast: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Toast;
