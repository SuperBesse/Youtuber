import React, {useCallback} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import type {Channel as ChannelType} from '../data/channel';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import useFetchChannelVideo from '../hooks/useFetchChannelVideos';
import PlaylistUploads from '../components/channels/PlaylistUploads';
import HeaderChannel from '../components/channel/HeaderChannel';
import {PlaylistItem} from '../data/playlistItem';

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

  const {
    channel: channelData,
    isLoading,
    error,
  } = useFetchChannelVideo({
    apiUrl: 'https://www.googleapis.com/youtube/v3/channels',
    part: 'snippet,contentDetails,contentOwnerDetails,id,localizations,statistics,status,topicDetails',
    accessToken: accessToken,
    channelId: channel.snippet.resourceId.channelId,
  });

  // const {
  //   data: playlistData,
  //   isLoading: playlistDataIsLoading,
  //   error: playlistDataError,
  // } = useFetchChannelPlaylists({
  //   apiUrl: 'https://www.googleapis.com/youtube/v3/playlists',
  //   part: 'snippet,contentDetails,id,localizations,status,player',
  //   maxResults: 50,
  //   accessToken: accessToken,
  //   channelId: channel.snippet.resourceId.channelId,
  // });
  // console.log('PLAYLIST: ', playlistData);

  console.log('CHANNEL ID', channel.snippet.resourceId.channelId);

  const openVideo = useCallback(
    (item: PlaylistItem) => {
      navigation.navigate('Video', {video: item, accessToken: accessToken});
    },
    [accessToken, navigation],
  );

  const totalVideo = `Vidéos: ${channel.contentDetails.totalItemCount}`;
  const playlistUploads = channelData?.contentDetails.relatedPlaylists?.uploads;
  return (
    <View style={styles.container}>
      <Text>{totalVideo}</Text>
      <HeaderChannel channel={channelData} />
      {playlistUploads && (
        <PlaylistUploads
          accessToken={accessToken}
          playlistId={playlistUploads}
          onTouch={openVideo}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Channel;
