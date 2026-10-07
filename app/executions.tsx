import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FlashList } from 'react-native-flash-list';
import { useExecutionStore } from '../src/features/execution/store';
import { ExecutionTask } from '../src/features/keys/types';

export default function ExecutionsScreen() {
  const tasks = useExecutionStore((s) => s.tasks);

  const renderItem = ({ item }: { item: ExecutionTask }) => (
    <View className="bg-white dark:bg-zinc-900 p-4 mb-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <Text className="font-mono text-sm text-zinc-900 dark:text-white">{item.keyValue}</Text>
      <Text className="text-xs text-zinc-500 mt-1">{item.type.toUpperCase()} • {item.status}</Text>
      {item.result && <Text className="text-xs mt-2 text-zinc-600 dark:text-zinc-400">{item.result}</Text>}
      <Text className="text-[10px] text-zinc-400 mt-1">{new Date(item.startedAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950 p-4">
      <FlashList data={tasks} renderItem={renderItem} estimatedItemSize={90} ListEmptyComponent={<Text className="text-center text-zinc-400 mt-12">No executions yet. Tap Execute on a key.</Text>} />
    </View>
  );
}