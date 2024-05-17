import { View, Text, Button } from 'react-native';
import { Stack } from 'expo-router';

export default function Settings() {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          title: 'Settings Header',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Text className="text-lg text-primary">Settings Screen</Text>
      {/* Add the remaining part of the Settings screen here */}
      <Text className="mt-4 text-base">User Preferences</Text>
      <View className="mt-2">
        <Button
          title="Change Password"
          onPress={() => {
            // Handle button press
          }}
          color="#1E90FF" // TailwindCSS class for blue color
        />
      </View>
      {/* Add more components as needed */}
    </View>
  );
}
