import React from 'react';
import {StatusBar, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function SafeStatusBar() {
  const {top} = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={{backgroundColor: '#3D3E44', height: top}} />
    </>
  );
}

export default SafeStatusBar;
