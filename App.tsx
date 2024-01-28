/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {Subscriptions} from './src/data/subscriptions';
import ChannelsList from './src/components/channels/List';

function App(): React.JSX.Element {
  const [subscriptions, setSubscriptions] = useState<Subscriptions>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

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

  useEffect(() => {
    const getAccessToken = async () => {
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      console.log('isGoogleSignedIn => ', isGoogleSignedIn);
      if (isGoogleSignedIn) {
        const userInfo = await GoogleSignin.signInSilently();
        const accessTokenValue = await GoogleSignin.getTokens();
        setAccessToken(accessTokenValue.accessToken);
      }
      setIsSignedIn(isGoogleSignedIn);
    };
    //manage logout state
    getAccessToken();
  }, []);

  const onLoginTouch = () => {
    signInWithGoogle();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          flex: 1,
        }}>
        {!isSignedIn && <Text>PAS LOGIN</Text>}
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={onLoginTouch}
          disabled={false}
        />
        {accessToken && <ChannelsList accessToken={accessToken} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
