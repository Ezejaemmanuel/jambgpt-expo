import React from 'react';
import { View, Pressable } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const ActionButtons: React.FC = () => {
  return (
    <View className="mt-4 flex-row justify-between rounded-lg bg-neutral-900 p-4">
      <Pressable className="mx-1 flex-1 items-center p-2">
        <FontAwesome name="pencil" size={24} color="green" />
      </Pressable>
      <Pressable className="mx-1 flex-1 items-center p-2">
        <FontAwesome name="question-circle" size={24} color="green" />
      </Pressable>
      <Pressable className="mx-1 flex-1 items-center p-2">
        <MaterialCommunityIcons name="robot" size={24} color="green" />
      </Pressable>
    </View>
  );
};

export default ActionButtons;
