import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AlarmPage from './AlarmPage/AlarmPage';
import ChattingPage from './ChattingPage/ChattingPage';
import MeetingPage from './MeetingPage/MeetingPage';
import MyPage from './MyPage/MyPage';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialBottomTabNavigator();

function Main() {
  return (
    <Tab.Navigator
      initialRouteName="Mypage"
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: '#009688',
        },
        tabBarActiveTintColor: '#009688',
      }}>
      <Tab.Screen
        name="mypage"
        component={MyPage}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="meeting"
        component={MeetingPage}
        options={{
          tabBarLabel: 'meeting',
          tabBarIcon: ({color}) => (
            <Icon name="search" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="chatting"
        component={ChattingPage}
        options={{
          tabBarLabel: 'chatting',
          tabBarIcon: ({color}) => (
            <Icon name="message" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="alarm"
        component={AlarmPage}
        options={{
          tabBarLabel: 'alarm',
          tabBarIcon: ({color}) => (
            <Icon name="notifications" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;
