/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const signInWithGoogle = async () => {
    try {
      GoogleSignin.configure({
        webClientId:
          '8377471577-8iua8f5644ihni29k8nv0e8b0u7i4hhj.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
        offlineAccess: false,
        forceCodeForRefreshToken: true,
      });
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.addScopes({
        scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
      });

      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchYouTubeData = async () => {
    const accessToken = await GoogleSignin.getTokens();

    console.log('accessToken: ', accessToken);
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      {
        headers: {Authorization: `Bearer ${accessToken.accessToken}`},
      },
    );
    const data = await response.json();
    // Traitez les données reçues de l'API YouTube
    console.log('DATA: ', data);
  };
  const onLoginTouch = () => {
    signInWithGoogle();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{flex: 1}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onLoginTouch}
            disabled={false}
          />
          <TouchableOpacity onPress={fetchYouTubeData}>
            <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>
              FETCH
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
