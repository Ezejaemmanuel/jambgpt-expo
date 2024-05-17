import React, { ReactElement } from 'react';
import { View, Text, Button } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { Ionicons } from '@expo/vector-icons';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

interface CustomFallbackProps {
  error: Error;
  resetError: () => void;
}

const CustomFallback: React.FC<CustomFallbackProps> = ({ error, resetError }) => (
  <View className="h-full w-full flex-1 items-center justify-center bg-gray-900 p-4">
    <Ionicons name="alert-circle" size={64} color="white" />
    <Text className="mt-4 text-2xl font-bold text-white">Something went wrong</Text>
    <Text className="mt-2 text-center text-gray-400">{error.toString()}</Text>
    <Button onPress={resetError} title="Try again" color="#1E90FF" />
  </View>
);

const AppErrorBoundary: React.FC<{ children: ReactElement }> = ({ children }) => {
  const errorHandler = (error: Error, stackTrace: string) => {
    console.error('Error caught by ErrorBoundary:', error, stackTrace);
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'There was an Error',
      textBody: error.message,
      button: 'Dismiss',
      autoClose: false,
    });
  };

  return (
    <ErrorBoundary FallbackComponent={CustomFallback} onError={errorHandler}>
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
