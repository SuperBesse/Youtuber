import {createStackNavigator} from '@react-navigation/stack';
import Channels from './Channels';
import Channel from './Channel';
import React from 'react';

const MainStack = createStackNavigator();

const StackNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="List" component={Channels} />
      <MainStack.Screen name="Details" component={Channel} />
    </MainStack.Navigator>
  );
};

export default StackNavigator;
