import React from 'react';
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
  const {route} = props;
  const {channel, accessToken} = route.params;

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
  return (
    <View style={{flex: 1}}>
      <Image
        style={styles.avatar}
        source={{uri: channel.snippet.thumbnails.high.url}}
      />
      <Text>{channel.snippet.title}</Text>
      <Text>{channel.snippet.resourceId.channelId}</Text>
      <ChannelVideosList data={results} />
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
