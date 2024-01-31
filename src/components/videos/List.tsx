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
    flex: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  totalVideo: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
    marginRight: 6,
  },
  description: {
    fontSize: 12,
    margin: 10,
    color: 'white',
  },
  avatar: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  indexContainer: {
    position: 'absolute',
    top: 0,
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexItem: {
    paddingVertical: 5,
    fontSize: 12,
    color: 'black',
  },
  bottomHeader: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert: {
    marginTop: -10,
    marginLeft: -5,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    fontSize: 22,
    color: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

const ChannelVideosList = (props: Props) => {
  const {onTouch, data} = props;
  const sectionListRef = useRef();

  const keyExtractor = useCallback((item: SearchResult) => {
    return item.id.videoId;
  }, []);

  const renderItem: ListRenderItem<SearchResult> = useCallback(({item}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onTouch(item)}>
        <Image
          style={styles.avatar}
          source={{uri: item.snippet.thumbnails.high.url}}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {item.snippet.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <FlatList
      style={{flex: 1}}
      ref={sectionListRef}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
    />
  );
};

export default ChannelVideosList;
