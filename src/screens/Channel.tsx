import React, {useCallback} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import type {Channel as ChannelType} from '../data/channel';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import useFetchChannelVideo from '../hooks/useFetchChannelVideos';
import ChannelVideosList from '../components/videos/List';
import {SearchResult} from '../data/searchResults';

type Props = NativeStackScreenProps<{
  channel: ChannelType;
  accessToken: string;
}>;

const Channel = (props: Props) => {
  const {route, navigation} = props;
  const {channel, accessToken} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({title: channel.snippet.title});
  }, [navigation, channel]);

  const {data, isLoading, error} = useFetchChannelVideo({
    apiUrl: 'https://www.googleapis.com/youtube/v3/search',
    part: 'snippet',
    maxResults: 50,
    accessToken: accessToken,
    channelId: channel.snippet.resourceId.channelId,
  });

  const results = data.filter((result: SearchResult) => {
    return result.id.kind === 'youtube#video';
  });

  const openVideo = useCallback(
    (item: SearchResult) => {
      navigation.navigate('Video', {video: item, accessToken: accessToken});
    },
    [accessToken, navigation],
  );

  return (
    <View style={{flex: 1}}>
      <Image
        style={styles.avatar}
        source={{uri: channel.snippet.thumbnails.high.url}}
      />
      <ChannelVideosList data={results} onTouch={openVideo} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
  },
});
export default Channel;
