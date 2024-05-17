import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAppState } from '@/utils/hooks/useAppState';
import { useOnlineManager } from '@/utils/hooks/useOnlineManager';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateStatus, Platform, Pressable, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import AuthComponent from '@/components/sigin';
import LoadingSpinnerOverlay from 'react-native-loading-spinner-overlay';

import { ThemeToggle } from '@/components/nativewindui/ThemeToggle';
import { cn } from '@/lib/cn';
import { useColorScheme, useInitialAndroidBarSync } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/theme';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { ClerkLoading, ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import AuthComponent from '@/components/sign-in-2';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
  IConfigDialog,
  IConfigToast,
} from 'react-native-alert-notification';
import { MagicModalPortal } from 'react-native-magic-modal';
import { IColors } from 'react-native-alert-notification/lib/typescript/service/color';
import React from 'react';
import AppErrorBoundary from '@/components/errorBoundary';
import LandPageHeader from '@/components/LandPageHeader';
const lightColors: IColors = {
  label: '#000000', // Black text for light theme
  card: '#FFFFFF', // White for card backgrounds in light theme
  overlay: '#00000080', // Semi-transparent black overlay
  success: '#4CAF50', // Green for success messages
  danger: '#F44336', // Red for error messages
  warning: '#FFEB3B', // Yellow for warning messages
  info: '#2196F3', // Blue for informational messages
};

const darkColors: IColors = {
  label: '#FFFFFF', // White text for dark theme
  card: '#2A2A2A', // Dark grey for card backgrounds in dark theme
  overlay: '#00000080', // Semi-transparent black overlay
  success: '#4CAF50', // Green for success messages
  danger: '#F44336', // Red for error messages
  warning: '#FFEB3B', // Yellow for warning messages
  info: '#2196F3', // Blue for informational messages
};

const customColors: [IColors, IColors] = [lightColors, darkColors];
// Define global configurations for dialogs and toasts
const dialogConfig: Pick<IConfigDialog, 'closeOnOverlayTap' | 'autoClose'> = {
  closeOnOverlayTap: true,
  autoClose: 5000, // Auto close after 5 seconds
};

const toastConfig: Pick<IConfigToast, 'autoClose' | 'titleStyle' | 'textBodyStyle'> = {
  autoClose: 3000, // Auto close after 3 seconds
  titleStyle: { color: '#FFFFFF', fontSize: 16 },
  textBodyStyle: { color: '#FFFFFF', fontSize: 14 },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      gcTime: Infinity,
      refetchIntervalInBackground: false,
    },
  },
});

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  useOnlineManager();
  useAppState(onAppStateChange);
  return (
    <>
      <AppErrorBoundary>
        <ClerkProvider
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
          tokenCache={tokenCache}>
          <QueryClientProvider client={queryClient}>
            <StatusBar
              key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
              style={isDarkColorScheme ? 'light' : 'dark'}
            />

            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <ActionSheetProvider>
                  <NavThemeProvider value={NAV_THEME[colorScheme]}>
                    {/* <Stack screenOptions={SCREEN_OPTIONS}>
                    <Stack.Screen name="index" options={INDEX_OPTIONS} />
                    <Stack.Screen name="modal" options={MODAL_OPTIONS} />
                  </Stack> */}
                    <MagicModalPortal />
                    <AlertNotificationRoot
                      theme={'dark'}
                      colors={customColors}
                      dialogConfig={dialogConfig}
                      toastConfig={toastConfig}>
                      <SignedIn>
                        <Stack>
                          <Stack.Screen
                            name="(tabs)"
                            options={{
                              headerShown: false,
                            }}
                          />
                        </Stack>
                      </SignedIn>

                      <SignedOut>
                        <AuthComponent />
                      </SignedOut>
                      <ClerkLoading>
                        <LoadingSpinnerOverlay
                          visible={true}
                          // textContent={'Loading...'}
                          color="yellow"
                          // textStyle={{ color: '#FFF' }}
                        />
                      </ClerkLoading>
                    </AlertNotificationRoot>
                  </NavThemeProvider>
                </ActionSheetProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ClerkProvider>
      </AppErrorBoundary>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'NativeWindUI',
  headerRight: () => <SettingsIcon />,
} as const;

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/modal" asChild>
      <Pressable className="opacity-80">
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
            <Icon name="cog-outline" color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
