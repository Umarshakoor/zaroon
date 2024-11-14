import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../../BaseUrl/BaseUrl';

const Splash = ({ navigation }) => {
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const waveAnimationY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      const firebase_token = await AsyncStorage.getItem("fcm_token");
      if (token) {
        // navigation.replace('HomeDriver');
        const payload = {
          'email': email,
          'password': password,
          firebase_token: firebase_token,
        };
        try {
          const response = await instance.post('/login', payload, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          if (response?.data?.token) {
            await AsyncStorage.setItem('auth_token', response?.data?.token);

            const flagId = response?.data?.user?.flag;
            if(flagId == 1) {
              navigation.replace('Login')
            } else{
              const actorId = response?.data?.user?.actor_id;
              if (actorId === 5) {
                navigation.replace('BottomDriver');
              } else if (actorId === 4) {
                navigation.replace('DrawerNavigation');
              }
            }

            // const actorId = response?.data?.user?.actor_id;
            // if (actorId === 5) {
            //   navigation.replace('BottomDriver');
            // } else if (actorId === 4) {
            //   navigation.replace('DrawerNavigation');
            // }
          }
        } catch (error) {
          console.log('Login Api', error);
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    };

    Animated.parallel([
      Animated.timing(waveAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(waveAnimationY, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      checkToken();
    });
  }, [waveAnimation, waveAnimationY, navigation]);

  const translateX = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [450, 10],
  });
  const translateY = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, -60],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" />
      <View style={styles.waveContainer}>
        <Animated.Image
          style={[styles.waveImage, { transform: [{ translateX }, { translateY }] }]}
          source={require('../../assets/SplashIcons/waves.png')}
        />
      </View>
      <ImageBackground
        style={styles.frameContainer}
        source={require('../../assets/SplashIcons/splash03.png')}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  waveContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    zIndex: -1
  },
  waveImage: {
    resizeMode: 'center',
    marginTop: 10,
  },
  frameContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
