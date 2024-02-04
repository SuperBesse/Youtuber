import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import type {Channel} from '../../data/channel';

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
  const subscribers = `Subscribers: ${channel?.statistics?.subscriberCount}`;
  const hiddenSubscribers = `viewCount: ${channel?.statistics?.viewCount}`;
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
    </View>
  );
};

export default HeaderChannel;
