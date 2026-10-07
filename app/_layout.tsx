import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: 'DataSnap', headerLargeTitle: true }} />
        <Stack.Screen name="keys" options={{ title: 'Keys' }} />
        <Stack.Screen name="generate" options={{ title: 'Generate Key' }} />
        <Stack.Screen name="github" options={{ title: 'GitHub' }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}