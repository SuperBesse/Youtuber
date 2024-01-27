/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
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
import {Subscriptions} from './src/data/subscriptions';
import ChannelsList from './src/components/channels/List';

function App(): React.JSX.Element {
  const [subscriptions, setSubscriptions] = useState<Subscriptions>(null);
  const accessToken = useRef();
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
    console.log('fetchYouTubeData ');
    const getAccessToken = await GoogleSignin.getTokens();
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails,subscriberSnippet&mine=true&maxResults=5',
      {
        headers: {Authorization: `Bearer ${getAccessToken.accessToken}`},
      },
    );
    const data: Subscriptions = await response.json();
    accessToken.current = getAccessToken.accessToken;
    console.log('DATA: ', data);
    setSubscriptions(data);
  };
  const onLoginTouch = () => {
    signInWithGoogle();
  };

  const fetchNext = async () => {
    console.log('FETCH NEXT!');
    const nextTokenRequest = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails,subscriberSnippet&mine=true&maxResults=50&pageToken=${subscriptions.nextPageToken}`;
    const response = await fetch(nextTokenRequest, {
      headers: {Authorization: `Bearer ${accessToken.current}`},
    });
    const data: Subscriptions = await response.json();
    setSubscriptions(previous => {
      return {...previous, ...data};
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'green',
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
        {subscriptions && (
          <ChannelsList data={subscriptions.items} fetchNext={fetchNext} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
});

export default App;
