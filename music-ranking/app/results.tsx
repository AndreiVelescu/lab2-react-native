import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Song = {
  id: number;
  title: string;
  artist: string;
  image: string;
  description: string;
};

export default function ResultsScreen() {
  const router = useRouter();
  const [winnerSong, setWinnerSong] = useState<Song | null>(null);
  const imagesMap: Record<number, any> = {
    1: require("../assets/images/around.jpg"),
    2: require("../assets/images/harder.jpg"),
    3: require("../assets/images/getlucky.jpg"),
    4: require("../assets/images/onemore.jpg"),
    5: require("../assets/images/digitallove.jpg"),
    6: require("../assets/images/robotrock.jpg"),
    7: require("../assets/images/loseyourself.jpg"),
    8: require("../assets/images/instant.jpg"),
    9: require("../assets/images/verdis.png"),
    10: require("../assets/images/verdis.png"),
  };

  useEffect(() => {
    (async () => {
      const username = await AsyncStorage.getItem("username");
      if (!username) return;

      const resultsRaw = await AsyncStorage.getItem("userResults");
      if (!resultsRaw) return;

      const results = JSON.parse(resultsRaw);
      const winner = results[username] || null;

      setWinnerSong(winner);
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#121212",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Câștigătorul este 🏆
      </Text>

      {winnerSong ? (
        <>
          <Image
            source={imagesMap[winnerSong.id]}
            style={{
              width: 180,
              height: 180,
              borderRadius: 12,
              marginBottom: 20,
            }}
          />
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {winnerSong.title}
          </Text>
          <Text style={{ color: "#aaa", fontSize: 16, marginBottom: 30 }}>
            {winnerSong.artist}
          </Text>
        </>
      ) : (
        <Text style={{ color: "#888" }}>Nu există date disponibile.</Text>
      )}

      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={{
          backgroundColor: "#1DB954",
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 24,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Reia jocul</Text>
      </TouchableOpacity>
    </View>
  );
}
