import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Channel} from '../../data/channel';
import React, {useCallback} from 'react';
import useFetchChannelsData from './../../hooks/useFetchChannelsData';

type Props = {
  accessToken: string;
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

const ChannelsList = (props: Props) => {
  const {accessToken} = props;
  const keyExtractor = useCallback((item: Channel) => {
    return item.id;
  }, []);

  const renderItem = useCallback(({item}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.snippet.title}</Text>
      </View>
    );
  }, []);

  const {data, isLoading, error} = useFetchChannelsData({
    apiUrl: 'https://www.googleapis.com/youtube/v3/subscriptions',
    part: 'snippet,contentDetails,subscriberSnippet',
    mine: true,
    maxResults: 50,
    accessToken: accessToken,
  });

  return (
    <View>
      {isLoading && <Text>Is loading ...</Text>}
      <FlatList
        style={{flex: 1, backgroundColor: 'red'}}
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ChannelsList;
