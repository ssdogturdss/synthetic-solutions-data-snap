import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useKeysStore } from '../src/features/keys/store';
import { KeyType, KeyGenerationConfig } from '../src/features/keys/types';
import { router } from 'expo-router';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function GenerateScreen() {
  const [type, setType] = useState<KeyType>('promo');
  const [prefix, setPrefix] = useState('DS');
  const [length, setLength] = useState('16');
  const [days, setDays] = useState('30');
  const [maxUses, setMaxUses] = useState('100');

  const generate = useKeysStore((s) => s.generateKey);

  const handleGenerate = () => {
    const config: KeyGenerationConfig = {
      type,
      prefix: prefix.toUpperCase(),
      length: parseInt(length),
      charset: CHARSET,
      expiresInDays: parseInt(days),
      maxUses: parseInt(maxUses),
    };
    const key = generate(config);
    Alert.alert('Key Generated', key.value, [{ text: 'Done', onPress: () => router.back() }]);
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <Text className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">Generate {type.toUpperCase()} Key</Text>

      <View className="flex-row gap-2 mb-6">
        {(['promo','paid','api'] as const).map(t => (
          <Pressable key={t} onPress={() => setType(t)} className={`flex-1 py-3 rounded-2xl ${type === t ? 'bg-black dark:bg-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
            <Text className={`text-center font-medium ${type === t ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput value={prefix} onChangeText={setPrefix} placeholder="Prefix" className="bg-zinc-100 dark:bg-zinc-900 px-4 py-4 rounded-2xl mb-3 text-lg text-zinc-900 dark:text-white" />
      <TextInput value={length} onChangeText={setLength} keyboardType="number-pad" placeholder="Length" className="bg-zinc-100 dark:bg-zinc-900 px-4 py-4 rounded-2xl mb-3 text-lg text-zinc-900 dark:text-white" />
      <TextInput value={days} onChangeText={setDays} keyboardType="number-pad" placeholder="Expires in days (0 = never)" className="bg-zinc-100 dark:bg-zinc-900 px-4 py-4 rounded-2xl mb-3 text-lg text-zinc-900 dark:text-white" />
      <TextInput value={maxUses} onChangeText={setMaxUses} keyboardType="number-pad" placeholder="Max uses" className="bg-zinc-100 dark:bg-zinc-900 px-4 py-4 rounded-2xl mb-8 text-lg text-zinc-900 dark:text-white" />

      <Pressable onPress={handleGenerate} className="bg-black dark:bg-white py-5 rounded-2xl active:opacity-80">
        <Text className="text-center text-white dark:text-black font-semibold text-lg">Generate Secure Key</Text>
      </Pressable>
    </View>
  );
}