import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useKeysStore } from '../src/features/keys/store';

export default function Dashboard() {
  const keys = useKeysStore((s) => s.keys);
  const active = keys.filter(k => k.status === 'active').length;

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <Text className="text-4xl font-bold text-zinc-900 dark:text-white mt-12">DataSnap</Text>
      <Text className="text-zinc-500 dark:text-zinc-400 mt-1 mb-8">Secure key generator + GitHub</Text>

      <View className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-6 mb-8">
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">ACTIVE KEYS</Text>
        <Text className="text-7xl font-semibold text-zinc-900 dark:text-white mt-1">{active}</Text>
        <Text className="text-xs text-emerald-500 mt-2">ALL SYSTEMS READY</Text>
      </View>

      <View className="gap-3">
        <Link href="/generate" asChild>
          <Pressable className="bg-black dark:bg-white py-4 rounded-2xl active:opacity-80">
            <Text className="text-white dark:text-black text-center font-semibold text-lg">Generate New Key</Text>
          </Pressable>
        </Link>
        <Link href="/keys" asChild>
          <Pressable className="bg-zinc-100 dark:bg-zinc-900 py-4 rounded-2xl active:opacity-80">
            <Text className="text-zinc-900 dark:text-white text-center font-semibold text-lg">Manage Keys ({keys.length})</Text>
          </Pressable>
        </Link>
        <Link href="/github" asChild>
          <Pressable className="bg-zinc-100 dark:bg-zinc-900 py-4 rounded-2xl active:opacity-80">
            <Text className="text-zinc-900 dark:text-white text-center font-semibold text-lg">GitHub Integration</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}