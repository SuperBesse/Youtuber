import {
  StyleSheet,
  Text,
  View,
  Image,
  ListRenderItem,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useCallback} from 'react';
import {SearchResult} from 'data/searchResults';
import he from 'he';
import useFetchPlaylistItems from '../../hooks/useFetchPlaylistItems';
import {PlaylistItem} from '../../data/playlistItem';

type Props = {
  accessToken: string;
  onTouch?: (video: PlaylistItem) => void;
  playlistId: string;
  headerComponent: React.ReactNode;
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
    backgroundColor: 'red',
    flex: 1,
  },
});

const PlaylistUploads = (props: Props) => {
  const {onTouch, accessToken, playlistId, headerComponent} = props;

  const keyExtractor = useCallback((item: SearchResult) => {
    return item.id.videoId;
  }, []);

  // const renderHeader = useCallback(() => {
  //   return
  // }, []);

  const {playlistItems, isLoading, error} = useFetchPlaylistItems({
    apiUrl: 'https://www.googleapis.com/youtube/v3/playlistItems',
    part: 'snippet,contentDetails,id,status',
    accessToken: accessToken,
    playlistId: playlistId,
    maxResults: 30,
  });

  const renderItem: ListRenderItem<PlaylistItem> = useCallback(({item}) => {
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
      data={playlistItems}
      renderItem={renderItem}
      ListHeaderComponent={headerComponent}
    />
  );
};

export default PlaylistUploads;
