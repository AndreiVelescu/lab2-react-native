import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Start() {
  const [name, setName] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("recentUsers");
      if (raw) setRecentUsers(JSON.parse(raw));
    })();
  }, []);

  const handleStart = async () => {
    if (!name.trim()) return;
    const username = name.trim();
    await AsyncStorage.setItem("username", username);

    const updated = Array.from(new Set([username, ...recentUsers])).slice(0, 5);
    await AsyncStorage.setItem("recentUsers", JSON.stringify(updated));

    router.replace("/");
  };

  const handleSelectRecent = async (username: string) => {
    await AsyncStorage.setItem("username", username);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Music Ranking</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name..."
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <Pressable style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start Ranking</Text>
      </Pressable>
      {recentUsers.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent accounts:</Text>
          <FlatList
            data={recentUsers}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.recentItem}
                onPress={() => handleSelectRecent(item)}
              >
                <Text style={styles.recentText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "70%",
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  recentContainer: { width: "80%" },
  recentTitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  recentItem: {
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 8,
    marginBottom: 8,
  },
  recentText: { color: "#fff", textAlign: "center", fontWeight: "500" },
});
