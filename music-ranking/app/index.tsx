import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import songsData from "../assets/songs.json";

type Song = {
  id: number;
  title: string;
  artist: string;
  image: string;
  description: string;
};

export default function Index() {
  const [username, setUsername] = useState<string | null>(null);
  const [remainingSongs, setRemainingSongs] = useState<Song[]>([]);
  const [pair, setPair] = useState<[Song, Song] | null>(null);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [round, setRound] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem("username");
      if (!name) router.replace("/start");
      else setUsername(name);
    };
    loadUser();
  }, []);

  useEffect(() => {
    setRemainingSongs(songsData);
  }, []);

  useEffect(() => {
    if (remainingSongs.length >= 2 && round < 10) {
      const shuffled = [...remainingSongs].sort(() => Math.random() - 0.5);
      setPair([shuffled[0], shuffled[1]]);
    } else if (remainingSongs.length === 1) {
      finishVoting(remainingSongs[0]);
      setPair(null);
    }
  }, [remainingSongs, round]);

  const vote = (winnerId: number) => {
    if (!pair) return;

    const loserId = pair[0].id === winnerId ? pair[1].id : pair[0].id;

    setVotes((prev) => ({
      ...prev,
      [winnerId]: (prev[winnerId] || 0) + 1,
    }));

    setRound((prev) => prev + 1);

    // eliminăm melodia pierzătoare
    setRemainingSongs((prev) => prev.filter((s) => s.id !== loserId));
  };
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

  const finishVoting = async (winner?: Song) => {
    if (!winner) return;

    const username = await AsyncStorage.getItem("username");
    if (!username) return;

    const existingData = await AsyncStorage.getItem("userResults");
    const allResults = existingData ? JSON.parse(existingData) : {};

    allResults[username] = winner;
    await AsyncStorage.setItem("userResults", JSON.stringify(allResults));

    router.push("/results");
  };

  if (!pair) return <Text style={{ color: "white" }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={{ color: "#ffcc00", marginBottom: 10 }}>
        Hello, {username} 👋
      </Text>
      <Text style={styles.title}>🎵 Vote your favorite song!</Text>
      <Text style={styles.round}>Round: {round + 1}</Text>
      <View style={styles.votingArea}>
        {pair.map((song) => (
          <Pressable
            key={song.id}
            onPress={() => vote(song.id)}
            style={styles.card}
          >
            <Image source={imagesMap[song.id]} style={styles.image} />
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.artist}>{song.artist}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={async () => {
          await AsyncStorage.removeItem("username");
          router.replace("/start");
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Change user</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/results")} style={styles.button}>
        <Text style={styles.buttonText}>Results</Text>
      </Pressable>
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
  title: { color: "#fff", fontSize: 20, marginBottom: 10 },
  round: { color: "#aaa", marginBottom: 20 },
  votingArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  card: {
    width: "40%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  image: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  songTitle: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  artist: { color: "#aaa", fontSize: 12, textAlign: "center" },
  button: {
    backgroundColor: "#ffcc00",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { fontWeight: "bold" },
});
