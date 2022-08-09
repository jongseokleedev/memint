import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WalletOffchainMain from './WalletOffchainMain';
import WalletOffchainRecieve from './WalletOffchainRecieve';
import WalletOffchainTransfer from './WalletOffchainTransfer';
import WalletOnchainMain from './WalletOnchainMain';
import WalletOnchainTrade from './WalletOnchainTrade';
import WalletLcnTransfer from './WalletLcnTransfer';
import WalletEthTransfer from './WalletEthTransfer';
import WalletOffchainTrade from './WalletOffchainTrade';

const Stack = createNativeStackNavigator();

const WalletOffchainScreen = () => {
  return (
    <Stack.Navigator initialRouteName="WalletOffchainMain">
      <Stack.Screen
        name="WalletOffchainMain"
        component={WalletOffchainMain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletOffchainTrade"
        component={WalletOffchainTrade}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletOffchainRecieve"
        component={WalletOffchainRecieve}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletOffchainTransfer"
        component={WalletOffchainTransfer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletOnchainMain"
        component={WalletOnchainMain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletOnchainTrade"
        component={WalletOnchainTrade}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletLcnTransfer"
        component={WalletLcnTransfer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletEthTransfer"
        component={WalletEthTransfer}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default WalletOffchainScreen;
