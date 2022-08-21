import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function SafeStatusBar() {
  const {top} = useSafeAreaInsets();

  return <View style={{backgroundColor: '#3D3E44', height: top}} />;
}

export default SafeStatusBar;
