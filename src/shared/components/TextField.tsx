import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/shared/utils/cn';

interface TextFieldProps extends TextInputProps {
  label?: string;
}

export function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor="#9ca3af"
        className={cn(
          'h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base text-zinc-900',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-white',
          className,
        )}
        {...props}
      />
    </View>
  );
}
