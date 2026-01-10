import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  House,
  ListVideo,
  HandHelping,
  WalletMinimal,
  User,
} from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface TabIconProps {
  focused: boolean;
  children: React.ReactNode;
}

function TabIcon({ focused, children }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activeIndicator} />}
      {children}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'ios' ? 20 : Math.max(insets.bottom, 8);

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary.purple,
          tabBarInactiveTintColor: colors['grey-plain']['550'],
          tabBarStyle: {
            backgroundColor: colors['grey-plain']['50'],
            borderTopWidth: 1,
            borderTopColor: colors['grey-plain']['350'],
            paddingBottom: bottomPadding,
            paddingTop: 8,
            height:
              Platform.OS === 'ios' ? 88 : 64 + Math.max(insets.bottom - 8, 0),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        {/* Feeds */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feeds',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused}>
                <House color={color} size={size} />
              </TabIcon>
            ),
          }}
        />

        {/* LiftClips */}
        <Tabs.Screen
          name="lift-clips"
          options={{
            title: 'LiftClips',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused}>
                <ListVideo color={color} size={size} />
              </TabIcon>
            ),
          }}
        />

        {/* Lifts */}
        <Tabs.Screen
          name="lifts"
          options={{
            title: 'Lifts',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused}>
                <HandHelping color={color} size={size} />
              </TabIcon>
            ),
          }}
        />

        {/* Wallet */}
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused}>
                <WalletMinimal color={color} size={size} />
              </TabIcon>
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused}>
                <User color={color} size={size} />
              </TabIcon>
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    height: 4,
    width: 42,
    borderRadius: 999,
    backgroundColor: colors.primary.purple,
  },
});
