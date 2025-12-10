import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WalletScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 24, fontWeight: 'bold' }}
        >
          Wallet
        </Text>
        {/* TODO: Implement Wallet screen per Figma design */}
      </View>
    </SafeAreaView>
  );
}
