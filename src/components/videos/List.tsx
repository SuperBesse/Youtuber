import {
  StyleSheet,
  Text,
  View,
  Image,
  ListRenderItem,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {SearchResult} from 'data/searchResults';
import he from 'he';

type Props = {
  accessToken: string;
  onTouch: (video: SearchResult) => void;
  data: SearchResult[];
};

const CELL_HEIGHT = 300;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: CELL_HEIGHT,
    borderRadius: 50,
    width: '100%',
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  preview: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 20,
  },
});

const ChannelVideosList = (props: Props) => {
  const {onTouch, data} = props;

  const keyExtractor = useCallback((item: SearchResult) => {
    return item.id.videoId;
  }, []);

  const renderItem: ListRenderItem<SearchResult> = useCallback(({item}) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    };

    const formatedPublishedDate = new Date(
      item.snippet.publishedAt,
    ).toLocaleString(undefined, options);

    return (
      <View style={styles.container}>
        <Text>{formatedPublishedDate}</Text>
        <TouchableOpacity style={styles.item} onPress={() => onTouch(item)}>
          <Image
            style={styles.preview}
            source={{uri: item.snippet.thumbnails.high.url}}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {he.decode(item.snippet.title)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <FlatList
      style={{flex: 1}}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
    />
  );
};

export default ChannelVideosList;
