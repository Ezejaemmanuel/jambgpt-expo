import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
// import AutoSignOut from './aside';
import AutoSignOut from '@/components/autoSignOut';

const CalculateResult = () => {
  const router = useRouter();
  const { ref = 'noRef' } = useGlobalSearchParams();

  const {
    mutateAsync: syncUser,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationKey: ['sync-user'],
    mutationFn: async () => {
      const response = await fetch(`api/syncUser?ref=${ref}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync user');
      }

      return response.json();
    },
    onSuccess: () => {
      router.push('/(tabs)/');
    },
  });

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      {isError && <AutoSignOut />}
      {isSuccess && (
        <View>
          <Text className="text-4xl text-green-500">✓</Text>
        </View>
      )}
    </View>
  );
};

export default CalculateResult;
