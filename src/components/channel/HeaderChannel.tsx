import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import type {Channel} from '../../data/channel';
import {nFormatter} from '../../utils/formatter';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'green',
  },
  avatar: {
    width: 80,
    height: 80,
  },
});

type Props = {
  channel?: Channel;
};

const HeaderChannel = (props: Props) => {
  const {channel} = props;
  const subscribers = `Subscribers: ${nFormatter(
    Number(channel?.statistics?.subscriberCount),
  )}`;
  const hiddenSubscribers = `viewCount: ${nFormatter(
    Number(channel?.statistics?.viewCount),
  )}`;
  const videoCount = `Total videos: ${channel?.statistics?.videoCount}`;
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{uri: channel?.snippet.thumbnails.high.url}}
      />
      <Text>{channel?.snippet.title}</Text>
      <Text>{channel?.snippet.description}</Text>
      <Text>{subscribers}</Text>
      <Text>{hiddenSubscribers}</Text>
      <Text>{videoCount}</Text>
    </View>
  );
};

export default HeaderChannel;
