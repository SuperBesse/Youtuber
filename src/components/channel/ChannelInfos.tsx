import React, {useCallback} from 'react';
import PlaylistUploads from '../channels/PlaylistUploads';
import {StyleSheet, View} from 'react-native';
import HeaderChannel from './HeaderChannel';
import {Channel} from '../../data/channel';
import useFetchChannelVideo from '../../hooks/useFetchChannelVideos';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PlaylistItem} from '../../data/playlistItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = NativeStackScreenProps<{
  channel: Channel;
  accessToken: string;
}>;

const ChannelInfos = (props: Props) => {
  const {accessToken, channel, navigation} = props;
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

  const openVideo = useCallback(
    (item: PlaylistItem) => {
      navigation.navigate('Video', {video: item, accessToken: accessToken});
    },
    [accessToken, navigation],
  );

  const playlistUploads = channelData?.contentDetails.relatedPlaylists?.uploads;
  return (
    <View style={styles.container}>
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

export default ChannelInfos;
