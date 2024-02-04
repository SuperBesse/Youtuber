import React from 'react';
import type {Channel as ChannelType} from '../data/channel';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import ChannelInfos from '../components/channel/ChannelInfos';

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

  return (
    <ChannelInfos
      channel={channel}
      accessToken={accessToken}
      navigation={navigation}
    />
  );
};

export default Channel;
