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
import LoadingSpinnerOverlay from 'react-native-loading-spinner-overlay';

import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useSyncUserMutation } from '@/utils/hooks/useSyncUser';
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
  const { signOut } = useAuth();

  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const syncUserMutation = useSyncUserMutation();
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
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Sign Up Failed',
          textBody: err.errors[0].message,
        });
        throw new Error(err.errors[0].message);
      }
    },
    mutationKey: ['signUp'],
    onMutate: () => {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'Signing Up',
        textBody: 'Please wait...',
      });
    },
    onSuccess: async (data, variables) => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Sign Up Successful',
        textBody: 'Please check your email for verification.',
        button: 'Dismiss',
      });
    },
    onError: (error: Error) => {
      signOut();

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Sign Up Error',
        textBody: error.message,
        button: 'Dismiss',
        autoClose: false,
      });
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
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Email Verification Failed',
          textBody: err.errors[0].message,
        });
        throw new Error(err.errors[0].message);
      }
    },
    mutationKey: ['verifyEmail'],
    onMutate: () => {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'Verifying Email',
        textBody: 'Please wait...',
      });
    },
    onSuccess: () => {
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Email Verified',
        textBody: 'Your email has been verified successfully.',
      });
      syncUserMutation.mutateAsync();
    },
    onError: (error: Error) => {
      signOut();
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Email Verification Error',
        textBody: error.message,
        button: 'Dismiss',
      });

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
  const syncUserMutation = useSyncUserMutation();
  const { signOut } = useAuth();

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
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Sign In Failed',
          textBody: err.errors[0].message,
          autoClose: false,
        });
        throw new Error(err.errors[0].message);
      }
    },
    mutationKey: ['signIn'],
    onMutate: () => {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'Signing In',
        textBody: 'Please wait...',
      });
    },
    onSuccess: async (data, variables) => {
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Sign In Successful',
        textBody: 'You have successfully signed in.',
      });
      syncUserMutation.mutateAsync();
    },
    onError: (error: Error) => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Sign In Error',
        textBody: error.message,
        button: 'Close',
        autoClose: false,
      });
      signOut();
    },
  });
};

export default function AuthComponent() {
  const [value, setValue] = useState('signin');
  const syncUserMutation = useSyncUserMutation();

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
        syncUserMutation.mutateAsync();
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
      <LoadingSpinnerOverlay
        visible={
          signUpMutation.isPending ||
          signInMutation.isPending ||
          verifyEmailMutation.isPending ||
          syncUserMutation.isPending
        }
        // textContent={'Loading...'}
        color="yellow"
        // textStyle={{ color: '#00FF00' }}
      />
    </SafeAreaView>
  );
}
