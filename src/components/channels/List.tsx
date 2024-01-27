import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Channel} from '../../data/channel';
import React, {useCallback} from 'react';

type Props = {
  data: Channel[];
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
  const {data} = props;
  const keyExtractor = useCallback((item: Channel) => {
    return item.id;
  }, []);

  const renderItem = ({item}) => {
    console.log('render item:', item);
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.snippet.title}</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{flex: 1, backgroundColor: 'red'}}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
    />
  );
};

export default ChannelsList;
