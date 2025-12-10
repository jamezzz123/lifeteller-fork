import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface FloatingActionButtonProps {
  onPress?: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.button}>
        <Plus color={colors['grey-plain']['50']} size={24} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    zIndex: 10,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors['grey-alpha']['500'],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
