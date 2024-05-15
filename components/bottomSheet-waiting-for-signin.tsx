// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
// import {
//   createClient,
//   SupabaseClient,
//   User,
//   AuthChangeEvent,
//   Session,
// } from '@supabase/supabase-js';
// import { useRouter } from 'expo-router';
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Button } from 'react-native';
// import CountDown, { CountDownProps } from 'react-native-countdown-component';

// import { supabase } from '@/utils/supabase';

// const EmailVerificationSheet: React.FC = () => {
//   const [timerKey, setTimerKey] = useState<number>(0);
//   const router = useRouter();
//   const bottomSheetRef = useRef<BottomSheet>(null);

//   useEffect(() => {
//     const checkUserStatus = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;
//       if (user.email_confirmed_at) {
//         router.replace('/'); // Use router.replace to navigate without adding to the history
//       } else {
//         bottomSheetRef.current?.snapToIndex(0);
//       }
//     };

//     checkUserStatus();

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event: AuthChangeEvent, session: Session | null) => {
//         const user: User | undefined = session?.user;
//         if (user?.email_confirmed_at) {
//           router.replace('/');
//         }
//       }
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, [router]);

//   const resendVerification = async () => {
//     await supabase.auth.refreshSession();
//     setTimerKey((prevKey) => prevKey + 1);
//   };

//   const countdownProps: CountDownProps = {
//     until: 30,
//     size: 20,
//     onFinish: resendVerification,
//     digitStyle: { backgroundColor: '#FFF' },
//     digitTxtStyle: { color: '#000' },
//     timeToShow: ['S'],
//     timeLabels: { s: '' },
//   };

//   return (
//     <BottomSheet ref={bottomSheetRef} snapPoints={['50%']} index={-1}>
//       <BottomSheetView className="bg-neutral-900 items-center justify-center flex-1 p-4">
//         <Text className="text-lg font-bold text-white">Verify Your Email</Text>
//         <Text className="mt-2 text-gray-300">
//           Please check your email and click on the verification link.
//         </Text>
//         <CountDown key={timerKey} {...countdownProps} />
//         <Button title="Resend Email" onPress={resendVerification} disabled={timerKey !== 0} />
//       </BottomSheetView>
//     </BottomSheet>
//   );
// };

// export default EmailVerificationSheet;
