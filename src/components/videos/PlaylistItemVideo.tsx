import React, {useCallback, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import useFetchVideo from '../../hooks/useFetchVideo';
import {Video} from '../../data/video';
import YoutubePlayer from 'react-native-youtube-iframe';
import {PlaylistItem} from '../../data/playlistItem';

type Props = NativeStackScreenProps<{
  playlistItem: PlaylistItem;
  accessToken: string;
}>;

const PlaylistItemVideo = (props: Props) => {
  const {playlistItem, accessToken, navigation} = props;
  const [playing, setPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({title: playlistItem.snippet.title});
  }, [navigation, playlistItem]);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const playerRef = useRef(null);

  const onPlayerReady = useCallback(() => {
    setPlayerReady(true);
  }, []);

  const {data, isLoading, error} = useFetchVideo({
    apiUrl: 'https://www.googleapis.com/youtube/v3/videos',
    part: 'snippet,contentDetails,statistics',
    videoId: playlistItem.contentDetails.videoId,
    accessToken: accessToken,
  });

  const renderVideo = useCallback((video: Video) => {
    return (
      <View style={styles.container}>
        <YoutubePlayer
          ref={playerRef}
          height={300}
          play={playing}
          videoId={video.id}
          onChangeState={onStateChange}
          onReady={onPlayerReady}
        />
        <Text>{video.snippet.title}</Text>
      </View>
    );
  }, []);
  return <View style={{flex: 1}}>{data && renderVideo(data)}</View>;
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
  },
  container: {
    flex: 1,
  },
});
export default PlaylistItemVideo;
