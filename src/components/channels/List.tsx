import {
  StyleSheet,
  Text,
  View,
  Image,
  ListRenderItem,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import {Channel, groupedChannels} from '../../data/channel';
import React, {useCallback, useMemo, useRef} from 'react';
import useFetchChannelsData from './../../hooks/useFetchChannelsData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewAlert from './NewAlert';

type Props = {
  accessToken: string;
  onTouch: (channel: Channel) => void;
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
//TODO:
// **sort by alpha**
// **display by section**
// display by total video
// ouvrir une chaine
//créer un drawer:
//  - logout button
//  - changement de tri
// cliquer sur une chaine
//afficher les vidéos de la chaine
//lire une vidéo
//afficher des stats comme les chaines par nombre de vidéos

const VIDEO_ICON_SIZE = 20;

const ChannelsList = (props: Props) => {
  const {accessToken, onTouch} = props;
  const sectionListRef = useRef();

  const keyExtractor = useCallback((item: Channel) => {
    return item.id;
  }, []);

  const renderItem: ListRenderItem<Channel> = useCallback(({item}) => {
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

        <View style={styles.bottomHeader}>
          <View style={styles.row}>
            <Text style={styles.totalVideo}>
              {item.contentDetails.totalItemCount}
            </Text>
            <Icon name="message-video" size={VIDEO_ICON_SIZE} color="white" />
            {item.contentDetails.newItemCount > 0 && (
              <NewAlert
                style={styles.alert}
                value={item.contentDetails.newItemCount}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  //<Text style={styles.description}>{item.snippet.description}</Text>
  const {data, isLoading, error} = useFetchChannelsData({
    apiUrl: 'https://www.googleapis.com/youtube/v3/subscriptions',
    part: 'snippet,contentDetails,id,subscriberSnippet',
    mine: true,
    maxResults: 50,
    accessToken: accessToken,
  });

  const scrollToSection = index => {
    sectionListRef.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 50,
    });
  };

  const sortData = useMemo(() => {
    const grouped = groupedChannels(data);
    return grouped;
  }, [data]);

  const sectionIndex = useMemo(
    () => sortData.map(section => section.title),
    [sortData],
  );

  const getItemLayout = (data, index) => {
    const [section] = data;
    const length = CELL_HEIGHT;
    const headerHeight = 0;
    const totalHeight = length + headerHeight;
    const offset = totalHeight * index;

    return {length, offset, index};
  };

  const renderHeader = useCallback(({section: {title}}) => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{title}</Text>
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      {isLoading && <Text>Is loading ...</Text>}
      <SectionList
        ref={sectionListRef}
        keyExtractor={keyExtractor}
        sections={sortData}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        renderSectionHeader={renderHeader}
      />
      <View style={styles.indexContainer}>
        {sectionIndex.map((letter, index) => (
          <TouchableOpacity key={letter} onPress={() => scrollToSection(index)}>
            <Text style={styles.indexItem}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChannelsList;
