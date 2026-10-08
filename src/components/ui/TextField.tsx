import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { COLORS } from '@/constants/theme';

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, ...input }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="font-body-medium text-ink text-sm">{label}</Text>
      <TextInput
        className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
        placeholderTextColor={COLORS.ink + '80'}
        {...input}
      />
    </View>
  );
}
