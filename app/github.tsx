import { useState } from 'react';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { startGitHubDeviceFlow, pollForGitHubToken, openGitHubVerification, fetchUserRepos, createGitHubIssue, clearGitHubToken } from '../src/lib/github';
import { useKeysStore } from '../src/features/keys/store';

export default function GitHubScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const keys = useKeysStore((s) => s.keys);

  const connect = async () => {
    setLoading(true);
    try {
      const flow = await startGitHubDeviceFlow();
      Alert.alert('GitHub Device Code', `Code: ${flow.userCode}\nOpen browser to authorize`, [
        { text: 'Open Browser', onPress: () => openGitHubVerification(flow.verificationUri) },
        { text: 'Cancel', style: 'cancel' }
      ]);
      const t = await pollForGitHubToken(flow.deviceCode, flow.interval);
      if (t) {
        setToken(t.accessToken);
        const r = await fetchUserRepos(t.accessToken);
        setRepos(r);
      }
    } finally { setLoading(false); }
  };

  const createIssueFromKey = async (repo: any) => {
    if (!token) return;
    const key = keys[0];
    if (!key) return Alert.alert('No keys', 'Generate a key first');
    const [owner, name] = repo.full_name.split('/');
    await createGitHubIssue(token, owner, name, `Support key request: ${key.value}`, `Key: ${key.value}\nType: ${key.type}`);
    Alert.alert('Issue created');
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950 p-6">
      {!token ? (
        <Pressable onPress={connect} disabled={loading} className="bg-black py-5 rounded-2xl mt-12">
          <Text className="text-center text-white font-semibold text-lg">{loading ? 'Connecting...' : 'Connect to GitHub'}</Text>
        </Pressable>
      ) : (
        <>
          <Text className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Your Repos</Text>
          <FlatList data={repos} keyExtractor={i => i.id.toString()} renderItem={({ item }) => (
            <Pressable onPress={() => createIssueFromKey(item)} className="py-4 border-b border-zinc-200 dark:border-zinc-800">
              <Text className="font-medium text-zinc-900 dark:text-white">{item.full_name}</Text>
            </Pressable>
          )} />
          <Pressable onPress={async () => { await clearGitHubToken(); setToken(null); setRepos([]); }} className="mt-auto py-4"><Text className="text-red-500 text-center">Disconnect</Text></Pressable>
        </>
      )}
    </View>
  );
}