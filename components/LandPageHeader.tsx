import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const LandPageHeader = () => {
  return (
    <View className="flex flex-1 flex-row items-center justify-between  bg-neutral-800 p-2">
      <View className="flex flex-row items-center">
        <Ionicons name="person" size={24} color="green" />
        <Text className="ml-2 text-sm  font-medium  text-zinc-300">Welcome, Emma</Text>
      </View>
      <View className="flex flex-row items-center">
        <TouchableOpacity className="mr-4">
          <MaterialIcons name="support-agent" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="mr-4">
          <FontAwesome name="share-alt" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="relative">
          <Ionicons name="notifications" size={24} color="white" />
          <View className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandPageHeader;
