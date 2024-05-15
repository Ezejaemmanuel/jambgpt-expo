import LandPageHeader from '@/components/LandPageHeader';
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View, useColorScheme, Text } from 'react-native';
import LoadingSpinnerOverlay from 'react-native-loading-spinner-overlay';

// import { useAuthenticatedUser } from '@/utils/hooks/useAuthenticatedUser';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarStyle: {
          backgroundColor: '#171717',
          height: 65,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          header: () => <LandPageHeader />,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="home"
              size={24}
              color={color}
              className={`${focused ? 'text-green-700' : 'text-gray-400'} dark:text-gray-200`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: 'Exams',
          tabBarIcon: ({ color, focused }) => (
            <Entypo
              name="book"
              size={24}
              color={color}
              className={`${focused ? 'text-green-700' : 'text-gray-400'} dark:text-gray-200`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`mb-10 h-16 w-16 items-center  justify-center rounded-full bg-orange-400`}>
              <Entypo
                name="plus"
                className={`${focused ? ' text-green-500' : ''}`}
                size={40}
                color={color}
              />
            </View>
          ),
          // href: '/nonono',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="history"
              size={24}
              color={color}
              className={`${focused ? 'text-green-700' : 'text-gray-400'} dark:text-gray-200`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="person-circle"
              size={24}
              color={color}
              className={`${focused ? 'text-green-700' : 'text-gray-400'} dark:text-gray-200`}
            />
          ),
        }}
      />
    </Tabs>
  );
}
