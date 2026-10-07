import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Text style={styles.eyebrow}>REACT NATIVE · EXPO</Text>
      <Text style={styles.title}>Your mobile app starts here.</Text>
      <Text style={styles.description}>
        This starter runs on iOS and Android. Edit App.tsx to build your app.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setCount((value) => value + 1)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Tap count: {count}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#f7f8fa",
  },
  eyebrow: {
    color: "#ef6538",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  title: {
    color: "#171a20",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 39,
    marginBottom: 12,
  },
  description: {
    color: "#555d6b",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#ef6538",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
