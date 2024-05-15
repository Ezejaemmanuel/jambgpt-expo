import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { ScreenContent } from '@/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>
        <Text className="text-white">fglksfhglasfflavskmmbmnbmnbmnb</Text>
        <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
