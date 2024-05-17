import LandPageHeader from '@/components/LandPageHeader';
import ActionButtons from '@/components/acctionnButtons';
import ScoreCard from '@/components/scoreBoard';
import { useSyncUserMutation } from '@/utils/hooks/useSyncUser';
import { useAuth } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { View, Button, Text, SafeAreaView, ScrollView } from 'react-native';
const getRandomPoints = (): number => {
  return Math.floor(Math.random() * (5000 - -100 + 1)) + -100;
};
const SyncUserPage = () => {
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const points = getRandomPoints();
    setPoints(points);
  }, []);
  return (
    <SafeAreaView className="w-full flex-1 bg-black  pt-9 ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-1 flex-col  ">
          <LandPageHeader />
          <View className="py-2">
            <ScoreCard points={points} />
          </View>
          <View>
            <ActionButtons />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SyncUserPage;
