import React, {useCallback} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import useFetchVideo from '../hooks/useFetchVideo';
import {Video as VideoType} from '../data/video';

type Props = NativeStackScreenProps<{
  video: VideoType;
  accessToken: string;
}>;

const Video = (props: Props) => {
  const {route, navigation} = props;
  const {video, accessToken} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({title: video.snippet.title});
  }, [navigation, video]);

  const {data, isLoading, error} = useFetchVideo({
    apiUrl: 'https://www.googleapis.com/youtube/v3/videos',
    part: 'snippet,contentDetails,statistics',
    videoId: video.id.videoId,
    accessToken: accessToken,
  });

  const renderVideo = useCallback((video: VideoType) => {
    return <Text>{video.snippet.title}</Text>;
  }, []);
  return (
    <View style={{flex: 1}}>
      <Image style={styles.avatar} />
      {data && renderVideo(data)}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
  },
});
export default Video;
