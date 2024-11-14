import React, { useEffect } from 'react';
import Navigation from './src/Navigation/StackNavigation/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';


const App = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async()=> {
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcm_token', token);
  }
  
  useEffect(()=>{
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    requestUserPermission();
    getToken();
  },[])


  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <Navigation />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
