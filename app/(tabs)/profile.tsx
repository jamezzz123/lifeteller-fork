import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 24, fontWeight: 'bold' }}
        >
          Profile
        </Text>
        {/* TODO: Implement Profile screen per Figma design */}
      </View>
    </SafeAreaView>
  );
}
