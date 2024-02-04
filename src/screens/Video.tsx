import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Video as VideoType} from '../data/video';
import PlaylistItemVideo from '../components/videos/PlaylistItemVideo';

type Props = NativeStackScreenProps<{
  video: VideoType;
  accessToken: string;
}>;

const Video = (props: Props) => {
  const {route, navigation} = props;
  const {video, accessToken} = route.params;

  return (
    <PlaylistItemVideo
      playlistItem={video}
      accessToken={accessToken}
      navigation={navigation}
    />
  );
};

export default Video;
