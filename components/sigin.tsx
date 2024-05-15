// import React, { useState } from 'react';
// import { View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Mail, Lock, Eye, User, EyeOff } from 'lucide-react-native';
// import usePasswordVisibilityStore from '@/lib/zustand';
// import { cn } from '@/lib/utils';
// import { Text } from '@/components/ui/text';
// import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// //@ts-ignore
// import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
// import LoadingSpinnerOverlay from 'react-native-loading-spinner-overlay';
// import { useMutation } from '@tanstack/react-query';
// import { useToast } from '@/components/Toast';
// import { useSignUp, useSignIn, useAuth, useOAuth } from '@clerk/clerk-expo';
// import { useWarmUpBrowser } from '@/utils/hooks/useWarmBrowser';
// import OtpTextInput from 'react-native-text-input-otp';
// import { useRouter } from 'expo-router';
// import * as Burnt from 'burnt';

// type SignUpData = {
//     email: string;
//     password: string;
//     userName: string;
// };

// type SignInData = {
//     email: string;
//     password: string;
// };

// const signInSchema = z.object({
//     email: z.string().email({ message: 'Invalid email address' }),
//     password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
// });

// const signUpSchema = z
//     .object({
//         username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
//         email: z.string().email({ message: 'Invalid email address' }),
//         password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
//         confirmPassword: z
//             .string()
//             .min(6, { message: 'Confirm Password must be at least 6 characters' }),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//         message: "Passwords don't match",
//         path: ['confirmPassword'],
//     });

// const useSignUpMutation = () => {
//     const { toast } = useToast();
//     const router = useRouter();
//     const { isLoaded, signUp, setActive } = useSignUp();
//     const [pendingVerification, setPendingVerification] = useState(false);
//     const [code, setCode] = useState('');

//     const signUpMutation = useMutation({
//         mutationFn: async ({ email, password, userName }: SignUpData) => {
//             if (!isLoaded) {
//                 return;
//             }

//             try {
//                 await signUp.create({
//                     emailAddress: email,
//                     password,
//                 });

//                 await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
//                 setPendingVerification(true);
//             } catch (err: any) {
//                 throw new Error(err.errors[0].message);
//             }
//         },
//         mutationKey: ['signUp'],
//         onSuccess: () => {
//             toast(
//                 'You have successfully signed up! Please check your email for verification.',
//                 'success',
//                 4000,
//                 'top'
//             );
//         },
//         onError: (error: Error) => {
//             toast(`There was an error! ${error.message}`, 'destructive', 4000, 'top', false);
//         },
//     });

//     const verifyEmailMutation = useMutation({
//         mutationFn: async () => {
//             if (!isLoaded) {
//                 return;
//             }

//             try {
//                 const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
//                 console.log(`completeSignUp message: ${JSON.stringify(completeSignUp)}`);
//                 setCode('');
//                 await setActive({ session: completeSignUp.createdSessionId });
//             } catch (err: any) {
//                 throw new Error(err.errors[0].message);
//             }
//         },
//         mutationKey: ['verifyEmail'],
//         onSuccess: () => {
//             toast('Your email has been verified successfully!', 'success', 4000, 'top', true);
//             router.push('/signin');
//         },
//         onError: (error: Error) => {
//             toast(`error ${error.message}`, 'destructive', 4000, 'top', true);
//             setCode('');
//         },
//     });

//     return {
//         signUpMutation,
//         verifyEmailMutation,
//         pendingVerification,
//         setPendingVerification,
//         code,
//         setCode,
//     };
// };

// const useSignInMutation = () => {
//     const { toast } = useToast();
//     const { isLoaded, signIn, setActive } = useSignIn();

//     return useMutation({
//         mutationFn: async ({ email, password }: SignInData) => {
//             if (!isLoaded) {
//                 return;
//             }

//             try {
//                 const completeSignIn = await signIn.create({
//                     identifier: email,
//                     password,
//                 });

//                 await setActive({ session: completeSignIn.createdSessionId });
//             } catch (err: any) {
//                 throw new Error(err.errors[0].message);
//             }
//         },
//         mutationKey: ['signIn'],
//         onSuccess: () => {
//             toast('You have successfully signed in!', 'success', 4000, 'top', true);
//         },
//         onError: (error: Error) => {
//             toast(`There was an error! ${error.message}`, 'destructive', 4000, 'top', true);
//         },
//     });
// };

// export default function AuthComponent() {
//     const [value, setValue] = useState('signin');
//     const {
//         showPassword,
//         showPassword2,
//         showConfirmPassword,
//         toggleShowPassword,
//         toggleShowPassword2,
//         toggleShowConfirmPassword,
//     } = usePasswordVisibilityStore();
//     useWarmUpBrowser();

//     const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

//     const onPress = React.useCallback(async () => {
//         try {
//             const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

//             if (createdSessionId) {
//                 setActive?.({ session: createdSessionId });
//             } else {
//                 // Use signIn or signUp for next steps such as MFA
//             }
//         } catch (err) {
//             console.error('OAuth error', err);
//         }
//     }, []);

//     const {
//         control: signInControl,
//         handleSubmit: handleSignInSubmit,
//         formState: { errors: signInErrors },
//     } = useForm({
//         resolver: zodResolver(signInSchema),
//     });

//     const {
//         control: signUpControl,
//         handleSubmit: handleSignUpSubmit,
//         formState: { errors: signUpErrors },
//         watch,
//     } = useForm({
//         resolver: zodResolver(signUpSchema),
//     });

//     const {
//         signUpMutation,
//         verifyEmailMutation,
//         pendingVerification,
//         setPendingVerification,
//         code,
//         setCode,
//     } = useSignUpMutation();
//     const signInMutation = useSignInMutation();

//     const password = watch('password');

//     const onSignInSubmit: SubmitHandler<FieldValues> = (data) => {
//         Burnt.toast({
//             title: 'Sign up successful!',
//             message: 'Please check your email for verification.',
//             preset: 'done',
//         });
//         const { email, password } = data as { email: string; password: string };
//         signInMutation.mutateAsync({ email, password });
//     };

//     const onSignUpSubmit: SubmitHandler<FieldValues> = (data) => {
//         const { email, password, username } = data as {
//             email: string;
//             password: string;
//             username: string;
//         };
//         signUpMutation.mutateAsync({ email, password, userName: username });
//     };

//     const onVerifyEmailSubmit = () => {
//         verifyEmailMutation.mutateAsync();
//     };
//     Burnt.toast({
//         title: 'Sign up successful!',
//         message: 'Please check your email for verification.',
//         preset: 'done',
//     });
//     return (
//         <SafeAreaView className="pt-9 dark:bg-black flex-1 bg-white">
//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {pendingVerification && (
//                     <View className="items-center justify-center flex-1 py-40">
//                         <View className="flex flex-col items-center flex-1 gap-8">
//                             <Text className="text-xl font-bold text-white">Verification Code</Text>
//                             <View className=" flex flex-col items-center justify-center gap-6 p-8">
//                                 <OtpTextInput
//                                     otp={code}
//                                     setOtp={setCode}
//                                     digits={6}
//                                     style={{
//                                         borderRadius: 8,
//                                         borderWidth: 0,

//                                         backgroundColor: '#2c2c2c',
//                                         height: 60,
//                                         marginHorizontal: 4,
//                                         shadowColor: '#000',
//                                         shadowOffset: {
//                                             width: 0,
//                                             height: 2,
//                                         },
//                                         shadowOpacity: 0.25,
//                                         shadowRadius: 3.84,
//                                         elevation: 5,
//                                     }}
//                                     fontStyle={{
//                                         fontSize: 24,
//                                         fontWeight: 'bold',
//                                         fontFamily: 'Arial',
//                                     }}
//                                     focusedStyle={{
//                                         borderColor: '#4cd964',
//                                         borderWidth: 2,
//                                     }}
//                                     textStyle={{
//                                         color: '#fff',
//                                     }}
//                                     inputStyle={{
//                                         color: '#fff',
//                                         fontSize: 24,
//                                         fontWeight: 'bold',
//                                         fontFamily: 'Arial',
//                                     }}
//                                 />
//                                 <Text className="text-red-500">
//                                     {verifyEmailMutation.isError
//                                         ? verifyEmailMutation.error.message
//                                         : ''}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View className="flex flex-row gap-4 px-4 mt-40">
//                             <Button
//                                 className="bg-gradient-to-r from-blue-500 to-pink-500 w-32 py-3 font-medium text-white rounded-md"
//                                 onPress={onVerifyEmailSubmit}>
//                                 <Text className="text-sm font-bold text-center text-white">
//                                     Verify Email
//                                 </Text>
//                             </Button>
//                             <Button
//                                 className="w-32 py-3 font-medium text-white bg-red-500 rounded-md"
//                                 onPress={() => setPendingVerification(false)}>
//                                 <Text className="text-lg font-bold text-center text-white">
//                                     Back
//                                 </Text>
//                             </Button>
//                         </View>
//                     </View>
//                 )}

//                 {!pendingVerification && (
//                     <View className="bg-neutral-950 items-center justify-center flex-1 px-4 py-8 mt-20">
//                         <Text className="mb-4 text-3xl font-bold text-center text-white">
//                             Sign in to JambGpt
//                         </Text>
//                         <Text className="mb-6 text-base text-center text-gray-400">
//                             You're one step away from something awesome
//                         </Text>
//                         <Card className="bg-neutral-900 w-full max-w-md">
//                             <Tabs value={value} onValueChange={setValue} className="p-4">
//                                 <TabsList className="border-neutral-800 bg-neutral-900 flex flex-row gap-2 border rounded-md">
//                                     <TabsTrigger
//                                         value="signin"
//                                         className={cn(
//                                             'flex-1 text-base font-medium ',
//                                             value === 'signin' ? 'bg-neutral-800' : 'bg-neutral-900'
//                                         )}>
//                                         <Text className="text-white">Sign In</Text>
//                                     </TabsTrigger>
//                                     <TabsTrigger
//                                         value="signup"
//                                         className={cn(
//                                             'flex-1 rounded-sm text-base font-medium ',
//                                             value === 'signup' ? 'bg-neutral-800' : 'bg-neutral-900'
//                                         )}>
//                                         <Text className="text-white">Sign Up</Text>
//                                     </TabsTrigger>
//                                 </TabsList>

//                                 <TabsContent value="signin">
//                                     <CardContent className="flex flex-col gap-4">
//                                         <View className="gap-2">
//                                             <Text className="text-gray-400">Email</Text>
//                                             <View className="border-neutral-800 flex flex-row items-center p-2 border rounded-md">
//                                                 <Mail color="#d3d3d3" size={24} />
//                                                 <Controller
//                                                     control={signInControl}
//                                                     render={({
//                                                         field: { onChange, onBlur, value },
//                                                     }) => (
//                                                         <Input
//                                                             id="email"
//                                                             className="flex-1 text-white placeholder-gray-400 bg-transparent border-none"
//                                                             placeholder="Enter email"
//                                                             onBlur={onBlur}
//                                                             onChangeText={onChange}
//                                                             value={value}
//                                                         />
//                                                     )}
//                                                     name="email"
//                                                 />
//                                             </View>
//                                             {signInErrors.email && (
//                                                 <Text className="text-red-500">
//                                                     {(signInErrors.email.message as string) || ''}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                         <View className="flex flex-col gap-2">
//                                             <Text className="text-gray-400">Password</Text>
//                                             <View className="border-neutral-800 flex flex-row items-center p-2 border rounded-md">
//                                                 <Lock
//                                                     className="w-5 h-5 mr-2 text-gray-400"
//                                                     color="#d3d3d3"
//                                                 />
//                                                 <Controller
//                                                     control={signInControl}
//                                                     render={({
//                                                         field: { onChange, onBlur, value },
//                                                     }) => (
//                                                         <Input
//                                                             id="password"
//                                                             className="flex-1 text-white placeholder-gray-400 bg-transparent border-none"
//                                                             placeholder="Enter password"
//                                                             secureTextEntry={!showPassword}
//                                                             onBlur={onBlur}
//                                                             onChangeText={onChange}
//                                                             value={value}
//                                                         />
//                                                     )}
//                                                     name="password"
//                                                 />
//                                                 <TouchableOpacity onPress={toggleShowPassword}>
//                                                     {showPassword ? (
//                                                         <EyeOff
//                                                             className="w-5 h-5 text-gray-400"
//                                                             color="#d3d3d3"
//                                                             size={24}
//                                                         />
//                                                     ) : (
//                                                         <Eye
//                                                             className="w-5 h-5 text-gray-400"
//                                                             color="#d3d3d3"
//                                                             size={24}
//                                                         />
//                                                     )}
//                                                 </TouchableOpacity>
//                                             </View>
//                                             {signInErrors.password && (
//                                                 <Text className="text-red-500">
//                                                     {(signInErrors.password.message as string) ||
//                                                         ''}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                         <Text className="text-red-500">
//                                             {signInMutation.isError
//                                                 ? signInMutation.error.message
//                                                 : ''}
//                                         </Text>
//                                     </CardContent>
//                                     <CardFooter className="flex flex-row items-center justify-between mt-6">
//                                         <Button
//                                             className="bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 font-medium text-white rounded-md"
//                                             onPress={handleSignInSubmit(onSignInSubmit)}>
//                                             <Text>Sign In</Text>
//                                         </Button>
//                                         <TouchableOpacity>
//                                             <Text className="text-sm text-blue-500">
//                                                 Forgot Password?
//                                             </Text>
//                                         </TouchableOpacity>
//                                     </CardFooter>
//                                 </TabsContent>

//                                 <TabsContent value="signup" className="pt-4">
//                                     <CardContent className="gap-4">
//                                         <View className="gap-2">
//                                             <Text className="text-gray-400">Username</Text>
//                                             <View className="border-neutral-800 flex flex-row items-center p-2 border rounded-md">
//                                                 <User color="#d3d3d3" size={24} />
//                                                 <Controller
//                                                     control={signUpControl}
//                                                     render={({
//                                                         field: { onChange, onBlur, value },
//                                                     }) => (
//                                                         <Input
//                                                             id="username"
//                                                             className="flex-1 text-white placeholder-gray-400 bg-transparent border-none"
//                                                             placeholder="Enter username"
//                                                             onBlur={onBlur}
//                                                             onChangeText={onChange}
//                                                             value={value}
//                                                         />
//                                                     )}
//                                                     name="username"
//                                                 />
//                                             </View>
//                                             {signUpErrors.username && (
//                                                 <Text className="text-red-500">
//                                                     {(signUpErrors.username.message as string) ||
//                                                         ''}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                         <View className="gap-2">
//                                             <Text className="text-gray-400">Email</Text>
//                                             <View className="border-neutral-800 flex flex-row items-center p-2 border rounded-md">
//                                                 <Mail color="#d3d3d3" size={24} />
//                                                 <Controller
//                                                     control={signUpControl}
//                                                     render={({
//                                                         field: { onChange, onBlur, value },
//                                                     }) => (
//                                                         <Input
//                                                             id="email"
//                                                             className="flex-1 text-white placeholder-gray-400 bg-transparent border-none"
//                                                             placeholder="Enter email"
//                                                             onBlur={onBlur}
//                                                             onChangeText={onChange}
//                                                             value={value}
//                                                         />
//                                                     )}
//                                                     name="email"
//                                                 />
//                                             </View>
//                                             {signUpErrors.email && (
//                                                 <Text className="text-red-500">
//                                                     {(signUpErrors.email.message as string) || ''}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                         <View className="gap-2">
//                                             <Text className="text-gray-400">Password</Text>
//                                             <View className="border-neutral-800 flex flex-row items-center p-2 border rounded-md">
//                                                 <Lock color="#d3d3d3" size={24} />
//                                                 <Controller
//                                                     control={signUpControl}
//                                                     render={({
//                                                         field: { onChange, onBlur, value },
//                                                     }) => (
//                                                         <Input
//                                                             id="password"
//                                                             className="flex-1 text-white placeholder-gray-400 bg-transparent border-none"
//                                                             placeholder="Enter password"
//                                                             secureTextEntry={!showPassword2}
//                                                             onBlur={onBlur}
//                                                             onChangeText={onChange}
//                                                             value={value}
//                                                         />
//                                                     )}
//                                                     name="password"
//                                                 />
//                                                 <TouchableOpacity onPress={toggleShowPassword2}>
//                                                     {showPassword2 ? (
//                                                         <EyeOff color="#d3d3d3" size={24} />
//                                                     ) : (
//                                                         <Eye color="#d3d3d3" size={24} />
//                                                     )}
//                                                 </TouchableOpacity>
//                                             </View>
//                                             <View className="">
//                                                 <BarPasswordStrengthDisplay
//                                                     width={Dimensions.get('window').width - 150}
//                                                     password={password}
//                                                 />
//                                             </View>
//                                             {signUpErrors.password && (
//                                                 <Text className="text-red-500">
//                                                     {(signUpErrors.password.message as string) ||
//                                                         ''}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                         <View className="gap-2">
//                                             <Text className="text-gray-400">Confirm Password</Text>
//                                             <View className="border-neutral-800 flex flex-row items-center p-2 border rounded-md">
//                                                 <Lock color="#d3d3d3" size={24} />
//                                                 <Controller
//                                                     control={signUpControl}
//                                                     render={({
//                                                         field: { onChange, onBlur, value },
//                                                     }) => (
//                                                         <Input
//                                                             id="confirmPassword"
//                                                             className="flex-1 text-white placeholder-gray-400 bg-transparent border-none"
//                                                             placeholder="Confirm Password"
//                                                             secureTextEntry={!showConfirmPassword}
//                                                             onBlur={onBlur}
//                                                             onChangeText={onChange}
//                                                             value={value}
//                                                         />
//                                                     )}
//                                                     name="confirmPassword"
//                                                 />
//                                                 <TouchableOpacity
//                                                     onPress={toggleShowConfirmPassword}>
//                                                     {showConfirmPassword ? (
//                                                         <EyeOff color="#d3d3d3" size={24} />
//                                                     ) : (
//                                                         <Eye color="#d3d3d3" size={24} />
//                                                     )}
//                                                 </TouchableOpacity>
//                                             </View>
//                                             {signUpErrors.confirmPassword && (
//                                                 <Text className="text-red-500">
//                                                     {(signUpErrors.confirmPassword
//                                                         .message as string) || ''}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                     </CardContent>
//                                     <Text className="text-red-500">
//                                         {signUpMutation.isError ? signUpMutation.error.message : ''}
//                                     </Text>
//                                     <CardFooter className="flex justify-end mt-6">
//                                         <Button
//                                             className="bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 font-medium text-white rounded-md"
//                                             onPress={handleSignUpSubmit(onSignUpSubmit)}>
//                                             <Text>Sign Up</Text>
//                                         </Button>
//                                     </CardFooter>
//                                 </TabsContent>
//                             </Tabs>
//                         </Card>
//                         <View className="flex flex-row items-center justify-center w-full max-w-md my-6 space-x-2">
//                             <View className="flex-1 h-px bg-gray-600" />
//                             <Text className="text-sm text-gray-400">OR CONTINUE WITH</Text>
//                             <View className="flex-1 h-px bg-gray-600" />
//                         </View>
//                         <Button
//                             onPress={onPress}
//                             className="p-3 bg-gray-800 rounded-md"
//                             variant="ghost">
//                             <Text className="font-medium text-white">Sign in with Google</Text>
//                         </Button>
//                     </View>
//                 )}
//             </ScrollView>
// <LoadingSpinnerOverlay
//     visible={
//         signUpMutation.isPending ||
//         signInMutation.isPending ||
//         verifyEmailMutation.isPending
//     }
//     textContent={'Loading...'}
//     textStyle={{ color: '#FFF' }}
// />
//         </SafeAreaView>
//     );
// }

import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, Lock, Eye, User, EyeOff } from 'lucide-react-native';
import usePasswordVisibilityStore from '@/lib/zustand';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
//@ts-ignore
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import { useMutation } from '@tanstack/react-query';
import { useSignUp, useSignIn, useAuth, useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '@/utils/hooks/useWarmBrowser';
import OtpTextInput from 'react-native-text-input-otp';
import { useRouter } from 'expo-router';
// import * as Burnt from 'burnt';

type SignUpData = {
  email: string;
  password: string;
  userName: string;
};

type SignInData = {
  email: string;
  password: string;
};

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signUpSchema = z
  .object({
    username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm Password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const useSignUpMutation = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const { mutateAsync: syncUser } = useMutation({
    mutationKey: ['sync-user'],
    mutationFn: async (ref: string) => {
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
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, userName }: SignUpData) => {
      if (!isLoaded) {
        return;
      }

      try {
        await signUp.create({
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
      } catch (err: any) {
        throw new Error(err.errors[0].message);
      }
    },
    mutationKey: ['signUp'],
    onMutate: () => {
      // Burnt.toast({
      //   title: 'Signing up...',
      //   message: 'Please wait',
      //   // preset: 'spinner',
      //   duration: Infinity,
      // });
    },
    onSuccess: async (data, variables) => {
      // Burnt.dismissAllAlerts();
      // Burnt.toast({
      //   title: 'Sign up successful!',
      //   message: 'Please check your email for verification.',
      //   preset: 'done',
      // });
      await syncUser(variables.userName);
    },
    onError: (error: Error) => {
      // Burnt.dismissAllAlerts();
      // Burnt.toast({
      //   title: 'Sign up failed',
      //   message: error.message,
      //   preset: 'error',
      // });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      if (!isLoaded) {
        return;
      }

      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
        console.log(`completeSignUp message: ${JSON.stringify(completeSignUp)}`);
        setCode('');
        await setActive({ session: completeSignUp.createdSessionId });
      } catch (err: any) {
        throw new Error(err.errors[0].message);
      }
    },
    mutationKey: ['verifyEmail'],
    onMutate: () => {
      // Burnt.toast({
      //   title: 'Verifying email...',
      //   message: 'Please wait',
      //   // preset: 'spinner',
      //   duration: Infinity,
      // });
    },
    onSuccess: () => {
      // Burnt.dismissAllAlerts();

      // Burnt.toast({
      //   title: 'Email verified!',
      //   message: 'Your email has been verified successfully.',
      //   preset: 'done',
      // });
      router.push('/signin');
    },
    onError: (error: Error) => {
      // Burnt.dismissAllAlerts();

      // Burnt.toast({
      //   title: 'Email verification failed',
      //   message: error.message,
      //   preset: 'error',
      // });
      setCode('');
    },
  });

  return {
    signUpMutation,
    verifyEmailMutation,
    pendingVerification,
    setPendingVerification,
    code,
    setCode,
  };
};

const useSignInMutation = () => {
  const { isLoaded, signIn, setActive } = useSignIn();

  const { mutateAsync: syncUser } = useMutation({
    mutationKey: ['sync-user'],
    mutationFn: async (ref: string) => {
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
  });

  return useMutation({
    mutationFn: async ({ email, password }: SignInData) => {
      if (!isLoaded) {
        return;
      }

      try {
        const completeSignIn = await signIn.create({
          identifier: email,
          password,
        });

        await setActive({ session: completeSignIn.createdSessionId });
      } catch (err: any) {
        throw new Error(err.errors[0].message);
      }
    },
    mutationKey: ['signIn'],
    onMutate: () => {
      // Burnt.toast({
      //   title: 'Signing in...',
      //   message: 'Please wait',
      //   // preset: 'spinner',
      //   duration: Infinity,
      // });
    },
    onSuccess: async (data, variables) => {
      // Burnt.dismissAllAlerts();

      // Burnt.toast({
      //   title: 'Sign in successful!',
      //   message: 'You have successfully signed in.',
      //   preset: 'done',
      // });
      await syncUser(variables.email);
    },
    onError: (error: Error) => {
      // Burnt.dismissAllAlerts();
      // Burnt.toast({
      //   title: 'Sign in failed',
      //   message: error.message,
      //   preset: 'error',
      // });
    },
  });
};

export default function AuthComponent() {
  const [value, setValue] = useState('signin');
  const {
    showPassword,
    showPassword2,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowPassword2,
    toggleShowConfirmPassword,
  } = usePasswordVisibilityStore();
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  const {
    control: signInControl,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const {
    control: signUpControl,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    watch,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const {
    signUpMutation,
    verifyEmailMutation,
    pendingVerification,
    setPendingVerification,
    code,
    setCode,
  } = useSignUpMutation();
  const signInMutation = useSignInMutation();

  const password = watch('password');

  const onSignInSubmit: SubmitHandler<FieldValues> = (data) => {
    const { email, password } = data as { email: string; password: string };
    signInMutation.mutateAsync({ email, password });
  };

  const onSignUpSubmit: SubmitHandler<FieldValues> = (data) => {
    const { email, password, username } = data as {
      email: string;
      password: string;
      username: string;
    };
    signUpMutation.mutateAsync({ email, password, userName: username });
  };

  const onVerifyEmailSubmit = () => {
    verifyEmailMutation.mutateAsync();
  };

  return (
    <SafeAreaView className="flex-1 bg-black pt-9">
      <ScrollView showsVerticalScrollIndicator={false}>
        {pendingVerification && (
          <View className="flex-1 items-center justify-center py-40">
            <View className="flex flex-1 flex-col items-center gap-8">
              <Text className="text-xl font-bold text-white">Verification Code</Text>
              <View className=" flex flex-col items-center justify-center gap-6 p-8">
                <OtpTextInput
                  otp={code}
                  setOtp={setCode}
                  digits={6}
                  style={{
                    borderRadius: 8,
                    borderWidth: 0,
                    backgroundColor: '#2c2c2c',
                    height: 60,
                    marginHorizontal: 4,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                  fontStyle={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}
                  focusedStyle={{
                    borderColor: '#4cd964',
                    borderWidth: 2,
                  }}
                  textStyle={{
                    color: '#fff',
                  }}
                  inputStyle={{
                    color: '#fff',
                    fontSize: 24,
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                  }}
                />
              </View>
            </View>
            <View className="mt-40 flex flex-row gap-4 px-4">
              <Button
                className="w-32 rounded-md bg-gradient-to-r from-blue-500 to-pink-500 py-3 font-medium text-white"
                onPress={onVerifyEmailSubmit}>
                <Text className="text-center text-sm font-bold text-white">Verify Email</Text>
              </Button>
              <Button
                className="w-32 rounded-md bg-red-500 py-3 font-medium text-white"
                onPress={() => setPendingVerification(false)}>
                <Text className="text-center text-lg font-bold text-white">Back</Text>
              </Button>
            </View>
          </View>
        )}

        {!pendingVerification && (
          <View className="mt-20 flex-1 items-center justify-center bg-neutral-950 px-4 py-8">
            <Text className="mb-4 text-center text-3xl font-bold text-white">
              Sign in to JambGpt
            </Text>
            <Text className="mb-6 text-center text-base text-gray-400">
              You're one step away from something awesome
            </Text>
            <Card className="w-full max-w-md bg-neutral-900">
              <Tabs value={value} onValueChange={setValue} className="p-4">
                <TabsList className="flex flex-row gap-2 rounded-md border border-neutral-800 bg-neutral-900">
                  <TabsTrigger
                    value="signin"
                    className={cn(
                      'flex-1 text-base font-medium ',
                      value === 'signin' ? 'bg-neutral-800' : 'bg-neutral-900'
                    )}>
                    <Text className="text-white">Sign In</Text>
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className={cn(
                      'flex-1 rounded-sm text-base font-medium ',
                      value === 'signup' ? 'bg-neutral-800' : 'bg-neutral-900'
                    )}>
                    <Text className="text-white">Sign Up</Text>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <CardContent className="flex flex-col gap-4">
                    <View className="gap-2">
                      <Text className="text-gray-400">Email</Text>
                      <View className="flex flex-row items-center rounded-md border border-neutral-800 p-2">
                        <Mail color="#d3d3d3" size={24} />
                        <Controller
                          control={signInControl}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              id="email"
                              className="flex-1 border-none bg-transparent text-white placeholder-gray-400"
                              placeholder="Enter email"
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                            />
                          )}
                          name="email"
                        />
                      </View>
                      {signInErrors.email && (
                        <Text className="text-red-500">
                          {(signInErrors.email.message as string) || ''}
                        </Text>
                      )}
                    </View>
                    <View className="flex flex-col gap-2">
                      <Text className="text-gray-400">Password</Text>
                      <View className="flex flex-row items-center rounded-md border border-neutral-800 p-2">
                        <Lock className="mr-2 h-5 w-5 text-gray-400" color="#d3d3d3" />
                        <Controller
                          control={signInControl}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              id="password"
                              className="flex-1 border-none bg-transparent text-white placeholder-gray-400"
                              placeholder="Enter password"
                              secureTextEntry={!showPassword}
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                            />
                          )}
                          name="password"
                        />
                        <TouchableOpacity onPress={toggleShowPassword}>
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" color="#d3d3d3" size={24} />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" color="#d3d3d3" size={24} />
                          )}
                        </TouchableOpacity>
                      </View>
                      {signInErrors.password && (
                        <Text className="text-red-500">
                          {(signInErrors.password.message as string) || ''}
                        </Text>
                      )}
                    </View>
                  </CardContent>
                  <CardFooter className="mt-6 flex flex-row items-center justify-between">
                    <Button
                      className="rounded-md bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 font-medium text-white"
                      onPress={handleSignInSubmit(onSignInSubmit)}>
                      <Text>Sign In</Text>
                    </Button>
                    <TouchableOpacity>
                      <Text className="text-sm text-blue-500">Forgot Password?</Text>
                    </TouchableOpacity>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="signup" className="pt-4">
                  <CardContent className="gap-4">
                    <View className="gap-2">
                      <Text className="text-gray-400">Username</Text>
                      <View className="flex flex-row items-center rounded-md border border-neutral-800 p-2">
                        <User color="#d3d3d3" size={24} />
                        <Controller
                          control={signUpControl}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              id="username"
                              className="flex-1 border-none bg-transparent text-white placeholder-gray-400"
                              placeholder="Enter username"
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                            />
                          )}
                          name="username"
                        />
                      </View>
                      {signUpErrors.username && (
                        <Text className="text-red-500">
                          {(signUpErrors.username.message as string) || ''}
                        </Text>
                      )}
                    </View>
                    <View className="gap-2">
                      <Text className="text-gray-400">Email</Text>
                      <View className="flex flex-row items-center rounded-md border border-neutral-800 p-2">
                        <Mail color="#d3d3d3" size={24} />
                        <Controller
                          control={signUpControl}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              id="email"
                              className="flex-1 border-none bg-transparent text-white placeholder-gray-400"
                              placeholder="Enter email"
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                            />
                          )}
                          name="email"
                        />
                      </View>
                      {signUpErrors.email && (
                        <Text className="text-red-500">
                          {(signUpErrors.email.message as string) || ''}
                        </Text>
                      )}
                    </View>
                    <View className="gap-2">
                      <Text className="text-gray-400">Password</Text>
                      <View className="flex flex-row items-center rounded-md border border-neutral-800 p-2">
                        <Lock color="#d3d3d3" size={24} />
                        <Controller
                          control={signUpControl}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              id="password"
                              className="flex-1 border-none bg-transparent text-white placeholder-gray-400"
                              placeholder="Enter password"
                              secureTextEntry={!showPassword2}
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                            />
                          )}
                          name="password"
                        />
                        <TouchableOpacity onPress={toggleShowPassword2}>
                          {showPassword2 ? (
                            <EyeOff color="#d3d3d3" size={24} />
                          ) : (
                            <Eye color="#d3d3d3" size={24} />
                          )}
                        </TouchableOpacity>
                      </View>
                      <View className="">
                        <BarPasswordStrengthDisplay
                          width={Dimensions.get('window').width - 150}
                          password={password}
                        />
                      </View>
                      {signUpErrors.password && (
                        <Text className="text-red-500">
                          {(signUpErrors.password.message as string) || ''}
                        </Text>
                      )}
                    </View>
                    <View className="gap-2">
                      <Text className="text-gray-400">Confirm Password</Text>
                      <View className="flex flex-row items-center rounded-md border border-neutral-800 p-2">
                        <Lock color="#d3d3d3" size={24} />
                        <Controller
                          control={signUpControl}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              id="confirmPassword"
                              className="flex-1 border-none bg-transparent text-white placeholder-gray-400"
                              placeholder="Confirm Password"
                              secureTextEntry={!showConfirmPassword}
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                            />
                          )}
                          name="confirmPassword"
                        />
                        <TouchableOpacity onPress={toggleShowConfirmPassword}>
                          {showConfirmPassword ? (
                            <EyeOff color="#d3d3d3" size={24} />
                          ) : (
                            <Eye color="#d3d3d3" size={24} />
                          )}
                        </TouchableOpacity>
                      </View>
                      {signUpErrors.confirmPassword && (
                        <Text className="text-red-500">
                          {(signUpErrors.confirmPassword.message as string) || ''}
                        </Text>
                      )}
                    </View>
                  </CardContent>
                  <CardFooter className="mt-6 flex justify-end">
                    <Button
                      className="rounded-md bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 font-medium text-white"
                      onPress={handleSignUpSubmit(onSignUpSubmit)}>
                      <Text>Sign Up</Text>
                    </Button>
                  </CardFooter>
                </TabsContent>
              </Tabs>
            </Card>
            <View className="my-6 flex w-full max-w-md flex-row items-center justify-center space-x-2">
              <View className="h-px flex-1 bg-gray-600" />
              <Text className="text-sm text-gray-400">OR CONTINUE WITH</Text>
              <View className="h-px flex-1 bg-gray-600" />
            </View>
            <Button onPress={onPress} className="rounded-md bg-gray-800 p-3" variant="ghost">
              <Text className="font-medium text-white">Sign in with Google</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
