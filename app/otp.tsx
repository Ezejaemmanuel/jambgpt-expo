import React, { useState } from 'react';
import { View, Text } from 'react-native';
import OtpTextInput from 'react-native-text-input-otp';
import { Button } from '@/components/ui/button';

export default function Component() {
  const [otp, setOtp] = useState('');
  console.log('this is the otp', otp);
  return (
    <View className="flex-1 items-center justify-center bg-neutral-950 p-8">
      <View className="space-y-6">
        <View className="space-y-2 text-center">
          <Text className="text-3xl font-bold text-white">Verify Your Email</Text>
          <Text className="text-gray-400">
            We've sent a one-time password (OTP) to your email address. Enter the code below to
            verify your identity.
          </Text>
        </View>
        <View>
          <OtpTextInput
            otp={otp}
            setOtp={setOtp}
            digits={6}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
            inputStyle={{
              backgroundColor: '#262626',
              borderRadius: 8,
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              height: 50,
              textAlign: 'center',
              width: 50,
            }}
            focusedInputStyle={{
              borderColor: '#5cb85c',
              borderWidth: 2,
            }}
          />
          <Button className="mt-4 w-full bg-neutral-800">
            <Text className="font-bold text-white">Verify OTP</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
