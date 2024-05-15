import { useSyncUserMutation } from '@/utils/hooks/useSyncUser';
import { useAuth } from '@clerk/clerk-expo';
import React from 'react';
import { View, Button, Text } from 'react-native';

const SyncUserPage = () => {
  const { mutate: syncUser, isPending, isError, error, data } = useSyncUserMutation();
  const { signOut } = useAuth();

  const handleSyncUser = () => {
    console.log('Attempting to sync user...');
    // syncUser(); // You might want to replace 'user-reference-id' with actual data
    signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className="bg-black">
      <Button title="SignOut" onPress={handleSyncUser} disabled={isPending} />
      {isPending && <Text>Syncing...</Text>}
      {isError && <Text>Error: {error.message}</Text>}
    </View>
  );
};

export default SyncUserPage;
