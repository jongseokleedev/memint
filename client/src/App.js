import React, {useEffect, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
// import {createStore} from 'redux';
// import {configureStore} from 'redux';
import {legacy_createStore as createStore} from 'redux';
import rootReducer from './slices/Index';
import Main from './pages/Main';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ToastProvider} from './context/ToastContext';
import Toast from './components/common/Toast';
import ChattingRoom from './pages/ChattingPage/ChattingRoom';
import {ChatContextProvider} from './components/chattingComponents/context/chatContext';
import SignInScreen from './pages/AuthPage/SignInScreen';
import SignUpScreen from './pages/AuthPage/SignUpScreen';
import VerifyMobileScreen from './pages/AuthPage/VerifyMobileScreen';
import SignUpUserInfoScreen from './pages/AuthPage/SignUpUserInfoScreen';
import SignUpUserDetailScreen from './pages/AuthPage/SignUpUserDetailScreen';
import SplashScreen from 'react-native-splash-screen';
import SignUpServeNFTScreen from './pages/AuthPage/SignUpServeNFTScreen';
import SignUpAgreementScreen from './pages/AuthPage/SignUpAgreement';
import SignUpAlarmScreen from './pages/AuthPage/SignUpAlarmScreen';
import FindIdVerifyMobileScreen from './pages/AuthPage/FindIdVerifyMobileScreen';
import FindIdShowIdScreen from './pages/AuthPage/FindIdShowIdScreen';
import FindPWVerifyScreen from './pages/AuthPage/FindPWVerifyScreen';
import SetNewPWScreen from './pages/AuthPage/SetNewPWScreen';
import WalletOffchainScreen from './pages/WalletPage/WalletOffchainScreen';
import useAuth from './utils/hooks/UseAuth';
import useAuthActions from './utils/hooks/UseAuthActions';
import {subscribeAuth} from './lib/Auth';
import {getUser, getUserProperty, saveTokenToDatabase} from './lib/Users';
import useNftActions from './utils/hooks/UseNftActions';
import {getNFTs, getProfile, getMemin} from './lib/NFT';
import {getMeeting} from './lib/Meeting';
import useMeetingActions from './utils/hooks/UseMeetingActions';
import useUser from './utils/hooks/UseUser';
import {getOnchainKlayLog} from './lib/OnchainKlayLog';
import {getOnchainTokenLog} from './lib/OnchainTokenLog';
import useOnchainActions from './utils/hooks/UseOnchainActions';
import FeedbackChoicePage from './pages/ChattingPage/FeedbackChoicePage';
import FeedbackSendPage from './pages/ChattingPage/FeedbackSendPage';
import MeetingSet from './pages/ChattingPage/MeetingSet';
import EditMeetingInfo from './pages/ChattingPage/EditMeetingInfo';
import MeetingMemberOut from './pages/ChattingPage/MeetingMemberOut';
import Report from './pages/ChattingPage/Report';
import MeetingConfirm from './pages/ChattingPage/MeetingConfirm';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {useToast} from './utils/hooks/useToast';

const Stack = createNativeStackNavigator();
const store = createStore(rootReducer);

function App() {
  const userInfo = useAuth();
  const userState = useUser();
  const {authorize, logout, saveInfo} = useAuthActions();
  const {saveNFT, setMemin} = useNftActions();
  const {saveMeeting} = useMeetingActions();
  const [initialRouteName, setInitialRouteName] = useState('SignIn');
  const {addKlayLog, addLcnLog} = useOnchainActions();
  const saveUserInfo = async user => {
    try {
      let userDetail = await getUser(user.uid);
      let userProperty = await getUserProperty(user.uid);
      getOnchainKlayLog(user.uid).then(res => {
        const logs = res.docs.map(el => {
          return {...el.data()};
        });
        addKlayLog(logs);
      });
      getOnchainTokenLog(user.uid).then(res => {
        const logs = res.docs.map(el => {
          return {...el.data()};
        });
        addLcnLog(logs);
      });
      // add code to remove undefined TypeError in SignUp Page
      userDetail = userDetail === undefined ? {nftProfile: ''} : userDetail;
      userProperty =
        userProperty.length === 0
          ? [
              {
                alcoholQuantity: [],
                alcoholType: [],
                alcoholStype: [],
                nftImage: '',
                profileImage: '',
              },
            ]
          : userProperty;

      const res = await getNFTs(user.uid);
      const nfts = res.docs.map(el => {
        return {...el.data()};
      });
      saveNFT(nfts);

      setMemin(...getMemin(nfts));
      // const createdrooms = await Promise.all(
      //   userDetail.createdroomId.map(async el => {
      //     const meetingInfo = await getMeeting(el);
      //     const hostInfo = await getUser(meetingInfo.hostId);
      //     return {
      //       id: meetingInfo.id,
      //       ...meetingInfo.data(),
      //       hostInfo: {...hostInfo},
      //     };
      //   }),
      // );
      // const joinedrooms = await Promise.all(
      //   userDetail.joinedroomId.map(async el => {
      //     const meetingInfo = await getMeeting(el);
      //     const hostInfo = await getUser(meetingInfo.hostId);
      //     return {
      //       id: meetingInfo.id,
      //       ...meetingInfo.data(),
      //       hostInfo: {...hostInfo},
      //     };
      //   }),
      // );
      // saveMeeting({
      //   createdrooms: createdrooms.sort(
      //     (a, b) => b.createdAt.toDate() - a.createdAt.toDate(),
      //   ),
      //   joinedrooms: joinedrooms.sort(
      //     (a, b) => b.createdAt.toDate() - a.createdAt.toDate(),
      //   ),
      // });

      // saveMeeting(meetingRes);

      saveInfo({
        ...userState,
        id: user.uid,
        email: user.email,
        nickName: userDetail.nickName,
        gender: userDetail.gender,
        birth: userDetail.birth,
        nftIds: userDetail.nftIds,
        picture: userDetail.picture,
        address: userDetail.address,
        // privateKey: userDetail.privateKey,
        phoneNumber: userDetail.phoneNumber,
        tokenAmount: userDetail.tokenAmount,
        klayAmount: userDetail.klayAmount,
        onChainTokenAmount: userDetail.onChainTokenAmount,
        // createdroomId: userDetail.createdroomId,
        // joinedroomId: userDetail.joinedroomId,
        nftProfile: userDetail.nftProfile.toString(),
        property: {
          alcoholType: userDetail.property.alcoholType,
          drinkCapa: userDetail.property.drinkCapa,
          drinkStyle: userDetail.property.drinkStyle,
        },
        visibleUser: userDetail.visibleUser,
        likesroomId: userDetail.likesroomId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    try {
      console.log('rendering splash');
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
      checkApplicationPermission();
    } catch (e) {
      console.wanr('Error occured');
      console.warn(e);
    }
  }, []);

  async function checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log(' permissions enabled.');
      return true;
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
      return true;
    } else {
      console.log('User has notification permissions disabled');
      return false;
    }
  }

  async function registerAppWithFCM() {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeAuth(user => {
      console.log({user});
      const userProvider = user
        ? user.additionalUserInfo
          ? user.additionalUserInfo.providerId
          : user.providerId
        : null;
      console.log({userProvider});
      if (user && user.email !== null) {
        console.log('DEBUG');
        authorize({
          id: user.uid,
          email: user.email,
        });
        //push notification
        //get the device token
        registerAppWithFCM().then(() => {
          messaging()
            .getToken()
            .then(token => {
              return saveTokenToDatabase(token, user.uid);
            });

          //listen to whether the token changes
          messaging().onTokenRefresh(token => {
            saveTokenToDatabase(token, user.uid);
          });
        });

        saveUserInfo(user);
        setInitialRouteName('Main');
      } else {
        logout();
        setInitialRouteName('SignIn');
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    console.log('@@UseEffect Re-rendering@@@@');
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   //get the device token
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       return saveTokenToDatabase(token);
  //     });

  //     //listen to whether the token changes
  //   return messaging().onTokenRefresh(token => {
  //     saveTokenToDatabase(token);
  //   });
  // },[]);

  if (initializing) {
    return null;
  }
  console.log('@@Re-rendering@@@@');
  console.log('currentUser is');
  console.log(userInfo);
  // if (!user) {
  //   console.log('Login Necessary');
  // } else {
  //   console.log('welcome' + user.email);
  // }
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ToastProvider>
          <ChatContextProvider>
            <Stack.Navigator initialRouteName={initialRouteName}>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="VerifyMobile"
                component={VerifyMobileScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpUserInfo"
                component={SignUpUserInfoScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpUserDetail"
                component={SignUpUserDetailScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpServeNFT"
                component={SignUpServeNFTScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpAgreement"
                component={SignUpAgreementScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpAlarm"
                component={SignUpAlarmScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FindIdVerifyMobile"
                component={FindIdVerifyMobileScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FindIdShowId"
                component={FindIdShowIdScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FindPWVerify"
                component={FindPWVerifyScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SetNewPW"
                component={SetNewPWScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="Wallet"
                component={WalletOffchainScreen}
                options={{title: null, headerShown: false}}
              />
              <Stack.Screen
                name="ChattingRoom"
                component={ChattingRoom}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FeedbackChoicePage"
                component={FeedbackChoicePage}
                options={{headerShown: false}}
                // options={{animation: 'none'}}
              />
              <Stack.Screen
                name="MeetingSet"
                component={MeetingSet}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FeedbackSendPage"
                component={FeedbackSendPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MeetingMemberOut"
                component={MeetingMemberOut}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditMeetingInfo"
                component={EditMeetingInfo}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Report"
                component={Report}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MeetingConfirm"
                component={MeetingConfirm}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
            <Toast />
          </ChatContextProvider>
        </ToastProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
