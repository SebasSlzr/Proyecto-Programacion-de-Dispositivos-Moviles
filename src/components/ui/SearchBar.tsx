import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Buscar…' }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-ivory rounded-2xl px-4 py-3 border border-taupe gap-2">
      <Ionicons name="search-outline" size={18} color={COLORS.ink} />
      <TextInput
        className="font-body text-ink flex-1"
        placeholder={placeholder}
        placeholderTextColor={COLORS.ink + '80'}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
    </View>
  );
}