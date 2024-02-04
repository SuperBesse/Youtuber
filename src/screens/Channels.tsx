import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Channel} from '../data/channel';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import ChannelsList from '../components/channels/List';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {UserInfo} from '../data/userInfo';

type Props = NativeStackScreenProps & {
  channel: Channel;
};

const Channels = (props: Props) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo>();

  useEffect(() => {
    const getAccessToken = async () => {
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignedIn) {
        const userInfo: UserInfo = await GoogleSignin.signInSilently();
        setUser(userInfo);
        const accessTokenValue = await GoogleSignin.getTokens();
        setAccessToken(accessTokenValue.accessToken);
      }
      setIsSignedIn(isGoogleSignedIn);
    };
    //manage logout state
    getAccessToken();
  }, []);

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

  const onLoginTouch = () => {
    signInWithGoogle();
  };

  const {navigation} = props;
  return (
    <View
      style={styles.container}>
      {!isSignedIn && (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={onLoginTouch}
          disabled={false}
        />
      )}
      <Text style={styles.givenName}>{user?.user.givenName}</Text>
      {accessToken && (
        <ChannelsList
          accessToken={accessToken}
          onTouch={channel =>
            navigation.navigate('Details', {
              channel: channel,
              accessToken: accessToken,
            })
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  givenName: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Channels;
