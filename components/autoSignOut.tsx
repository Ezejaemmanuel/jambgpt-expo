import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const AutoSignOut = () => {
    const { signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        signOut().then(() => {
            router.push('/');
        });
    }, [signOut, router]);

    return (
        <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Text className="text-lg font-bold text-red-500 dark:text-red-400">
                Signing user out...
            </Text>
        </View>
    );
};

export default AutoSignOut;
