// App.tsx
import React, { useMemo, useRef, useCallback, useState } from 'react';
import { View, Text, Button, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Modal from 'react-native-modal';
import { magicModal } from 'react-native-magic-modal';
const App = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  React.useEffect(() => {
    const showModal = async () => {
      console.log('opening modal');

      const modalResponse = await magicModal.show(() => <ExampleModal />);

      console.log('modal closed with response:', modalResponse);
    };

    showModal();
  }, []);
  const handleSignOut = () => {
    // Your actual sign-out logic here
    console.log('User signed out');
    // Close the bottom sheet after signing out
    bottomSheetRef.current?.close();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const maxWidth = Dimensions.get('screen').width - 300;
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 items-center justify-center">
        <Button title="Sign Out" onPress={handleOpenPress} />
        <Button title="Show modal" onPress={() => magicModal.show(() => <ExampleModal />)} />

        <Modal
          isVisible={isModalVisible}
          className="w w-full bg-gray-800"
          style={{ maxWidth: maxWidth }}>
          <Text className="text-white">Hello!</Text>

          <Button title="Hide modal" onPress={toggleModal} />
        </Modal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: '#1f2937' }} // Tailwind dark background color
        >
          <View className="bg-gray-800 p-4">
            <Text className="text-lg text-white">Are you sure you want to sign out?</Text>
            <View className="mt-4 flex-row justify-around">
              <Button title="Yes" onPress={handleSignOut} />
              <Button title="No" onPress={() => bottomSheetRef.current?.close()} />
            </View>
          </View>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default App;

export const ExampleModal = () => {
  return (
    <View className="mx-6 rounded-lg bg-white p-12 shadow-lg">
      <Text className="mb-2 text-lg font-bold">Example Modal</Text>
      <Text className="mb-4 text-base">
        This is an example to showcase the imperative Magic Modal!
      </Text>
      <TouchableOpacity
        onPress={() => magicModal.hide('close button pressed')}
        className="rounded-lg bg-blue-500 p-2">
        <Text className="text-center text-white">Close Modal</Text>
      </TouchableOpacity>
    </View>
  );
};
