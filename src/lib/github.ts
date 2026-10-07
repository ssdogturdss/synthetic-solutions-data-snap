import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

const CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID';
const GITHUB_TOKEN_KEY = 'github_token';

export interface GitHubToken {
  accessToken: string;
  scope: string;
}

export async function getStoredGitHubToken(): Promise<GitHubToken | null> {
  const stored = await SecureStore.getItemAsync(GITHUB_TOKEN_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function storeGitHubToken(token: GitHubToken): Promise<void> {
  await SecureStore.setItemAsync(GITHUB_TOKEN_KEY, JSON.stringify(token));
}

export async function clearGitHubToken(): Promise<void> {
  await SecureStore.deleteItemAsync(GITHUB_TOKEN_KEY);
}

export async function startGitHubDeviceFlow(): Promise<{ userCode: string; verificationUri: string; deviceCode: string; interval: number }> {
  const res = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, scope: 'repo read:user' }),
  });
  return res.json();
}

export async function pollForGitHubToken(deviceCode: string, interval: number): Promise<GitHubToken | null> {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, interval * 1000));
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, device_code: deviceCode, grant_type: 'urn:ietf:params:oauth:grant-type:device_code' }),
    });
    const data = await res.json();
    if (data.access_token) {
      const token: GitHubToken = { accessToken: data.access_token, scope: data.scope };
      await storeGitHubToken(token);
      return token;
    }
    if (data.error !== 'authorization_pending') break;
  }
  return null;
}

export async function openGitHubVerification(uri: string) {
  await WebBrowser.openBrowserAsync(uri);
}

export async function fetchUserRepos(token: string) {
  const res = await fetch('https://api.github.com/user/repos?per_page=20&sort=updated', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  return res.json();
}

export async function createGitHubIssue(token: string, owner: string, repo: string, title: string, body: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  return res.json();
}