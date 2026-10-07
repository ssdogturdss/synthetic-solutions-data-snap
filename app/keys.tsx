import { useState } from 'react';
import { View, Text, TextInput, Pressable, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FlashList } from 'react-native-flash-list';
import { useKeysStore } from '../src/features/keys/store';
import { Key, KeyType, KeyStatus } from '../src/features/keys/types';

export default function KeysScreen() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<KeyType | undefined>();
  const [filterStatus, setFilterStatus] = useState<KeyStatus | undefined>();
  
  const searchKeys = useKeysStore((s) => s.searchKeys);
  const revokeKey = useKeysStore((s) => s.revokeKey);
  const keys = searchKeys(query, filterType, filterStatus);

  const copy = async (k: Key) => {
    await Clipboard.setStringAsync(k.value);
  };

  const share = async (k: Key) => {
    await Share.share({ message: k.value });
  };

  const renderItem = ({ item }: { item: Key }) => (
    <View className="bg-white dark:bg-zinc-900 p-4 mb-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-mono text-lg text-zinc-900 dark:text-white">{item.value}</Text>
          <Text className="text-xs text-zinc-500 mt-1">{item.type.toUpperCase()} • {item.status}</Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable onPress={() => copy(item)} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl"><Text className="text-xs">Copy</Text></Pressable>
          <Pressable onPress={() => share(item)} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl"><Text className="text-xs">Share</Text></Pressable>
          {item.status === 'active' && (
              <Pressable onPress={() => revokeKey(item.id)} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-xl"><Text className="text-xs text-red-600">Revoke</Text></Pressable>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950 p-4">
      <TextInput placeholder="Search keys..." value={query} onChangeText={setQuery} className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-2xl mb-4 text-zinc-900 dark:text-white" placeholderTextColor="#666" />
      
      <FlashList data={keys} renderItem={renderItem} estimatedItemSize={80} ListEmptyComponent={<Text className="text-center text-zinc-400 mt-12">No keys found</Text>} />
    </View>
  );
}