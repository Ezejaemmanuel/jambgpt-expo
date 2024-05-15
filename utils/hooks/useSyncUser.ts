import { useAuth } from '@clerk/clerk-expo';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ALERT_TYPE, Toast, Dialog } from 'react-native-alert-notification';
import { createFullApiUrl } from '../getBaseUrl';

// interface SyncUserResponse {
//   message?: string;
//   error?: string;
//   user?: {
//     id: string;
//     email?: string;
//     firstName?: string;
//     lastName?: string;
//   };
// }

export const useSyncUserMutation = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const { getToken } = useAuth();
  return useMutation({
    mutationKey: ['sync-user'],
    mutationFn: async () => {
      const token = await getToken(); // Get the token from Clerk
      console.log('Token retrieved:', token); // Log the token
      if (!token) {
        throw new Error('there is no token provided at all ');
      }
      const response = await fetch(createFullApiUrl('api/syncUser'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      console.log('Response status:', response.status); // Log the response status

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Failed to sync user:', errorResponse.error || 'Unknown error'); // Log the specific error message
        throw new Error(errorResponse.error || 'Failed to sync user');
      }
    },
    onSuccess: (data) => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'User synchronized successfully!',
        button: 'Close',
      });
      console.log('User Details:', data); // Log the user details
      router.push('/(tabs)/');
    },
    onError: (error: Error) => {
      console.error('Error during user synchronization:', error); // Log the error
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
        button: 'Close',
        autoClose: false,
      });
      signOut();
    },
  });
};
