import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

const SIZE = 20;
const styles = StyleSheet.create({
  alert: {
    height: SIZE,
    width: SIZE,
    backgroundColor: 'red',
    borderRadius: SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: 'white',
  },
});

type Props = {
  value: number;
  style: StyleProp<ViewStyle>;
};

const NewAlert = (props: Props) => {
  const {value, style} = props;
  return (
    <View style={[styles.alert, style]}>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default NewAlert;
