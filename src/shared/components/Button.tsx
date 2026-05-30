import { ActivityIndicator, Pressable, Text } from 'react-native';

import { cn } from '@/shared/utils/cn';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  testID?: string;
}

export function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'h-12 flex-row items-center justify-center rounded-xl px-4',
        variant === 'primary' ? 'bg-brand' : 'bg-transparent',
        isDisabled && 'opacity-50',
      )}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#208AEF'} />
      ) : (
        <Text
          className={cn(
            'text-base font-semibold',
            variant === 'primary' ? 'text-white' : 'text-brand',
          )}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
