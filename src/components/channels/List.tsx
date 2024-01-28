import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ListRenderItem,
} from 'react-native';
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
//TODO:
// sort by alpha
//display by section
// display by total video
// checker si newItemCount correspond à des videos non vues
// ouvrir une chaine

const ChannelsList = (props: Props) => {
  const {accessToken} = props;
  const keyExtractor = useCallback((item: Channel) => {
    return item.id;
  }, []);

  const renderItem: ListRenderItem<Channel> = useCallback(({item}) => {
    return (
      <View style={styles.item}>
        <Image
          style={{width: 80, height: 80}}
          source={{uri: item.snippet.thumbnails.default.url}}
        />
        <Text style={styles.title}>
          Total: {item.contentDetails.totalItemCount}
        </Text>
        <Text style={styles.title}>
          Unread: {item.contentDetails.newItemCount}
        </Text>
        <Text style={styles.title}>{item.snippet.title}</Text>
        <Text style={styles.title}>{item.snippet.description}</Text>
      </View>
    );
  }, []);

  const {data, isLoading, error} = useFetchChannelsData({
    apiUrl: 'https://www.googleapis.com/youtube/v3/subscriptions',
    part: 'snippet,contentDetails',
    mine: true,
    maxResults: 50,
    accessToken: accessToken,
  });

  return (
    <View>
      {isLoading && <Text>Is loading ...</Text>}
      <FlatList
        style={{flex: 1}}
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ChannelsList;
