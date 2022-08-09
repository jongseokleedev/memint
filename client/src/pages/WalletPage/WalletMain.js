import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, View, StyleSheet, ScrollView} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import WalletOffchainMain from './WalletOffchainMain';
import WalletOnchainMain from './WalletOnchainMain';
import {Icon} from 'react-native-vector-icons/MaterialIcons';
import WalletOffchainRecieve from './WalletOffchainRecieve';
// import useAuthActions from '../utils/hooks/UseAuthActions';
const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
function WalletMain() {
  // const {updateTokenAmount} = useAuthActions();
  // useEffect(() => {
  //   updateTokenAmount();
  // }, []);
  return (
    <>
      <Tab.Navigator
        initialRouteName="WalletOffchain"
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: '#009688',
          },
          tabBarActiveTintColor: '#009688',
        }}>
        <Tab.Screen
          name="WalletOffchain"
          component={WalletOffchainScreen}
          options={{
            tabBarLabel: 'fafaf',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="WalletOnchain"
          component={WalletOnchainScreen}
          options={{
            tabBarLabel: 'asd',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const WalletOffchainScreen = () => {
  return (
    //     <Stack.Navigator initialRouteName="WalletOffchainMain">
    //       <Stack.Screen
    //         name="WalletOffchainMain"
    //         component={WalletOffchainMain}
    //         // options={{headerShown: false}}
    //       />
    //       <Stack.Screen
    //         name="WalletOffchainRecieve"
    //         component={WalletOffchainRecieve}
    //         // options={{headerShown: false}}
    //       />
    //     </Stack.Navigator>
    //   );
    <Text>test</Text>
  );
};

const WalletOnchainScreen = () => {
  return (
    //     <Stack.Navigator initialRouteName="WalletOnchainMain">
    //       <Stack.Screen
    //         name="WalletOnchainMain"
    //         component={WalletOnchainMain}
    //         options={{headerShown: false}}
    //       />
    //     </Stack.Navigator>
    //   );
    <Text>test</Text>
  );
};

export default WalletMain;
