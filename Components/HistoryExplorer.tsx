// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// const screenWidth = Dimensions.get("window").width;
// const cardSize = (screenWidth - 60) / 2; // Padding and margin considered

// const data = [
//   {
//     title: "Explore Destinations",
//     image: "https://your-server.com/image1.jpg",
//     navigateTo: "MapScreen", // Navigate to MapScreen
//   },
//   {
//     title: "Historic Site Log",
//     image: "https://your-server.com/image2.jpg",
//     navigateTo: "PlacesVisited", // Navigate to PlacesVisited
//   },
//   {
//     title: "Challenge Yourself",
//     image: "https://your-server.com/image3.jpg",
//     navigateTo: "Quiz", // Navigate to Quiz
//   },
//   {
//     title: "Hall of Fame",
//     image: "https://your-server.com/image4.jpg",
//     navigateTo: "Leaderboard", // Navigate to Leaderboard
//   },
// ];

// const HistoryExplorer = ({ navigation }: any) => {
//   const renderCard = ({ item }: any) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate(item.navigateTo)} // Navigate based on button
//     >
//       <Image source={{ uri: item.image }} style={styles.cardImage} />
//       <Text style={styles.cardText}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>History Explorer</Text>
//         <TouchableOpacity>
//           <Icon name="settings-outline" size={22} color="#333" />
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={data}
//         renderItem={renderCard}
//         keyExtractor={(item, index) => index.toString()}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         contentContainerStyle={styles.grid}
//       />
//       <View style={styles.bottomNav}>
//         <Icon name="home" size={24} color="#000" />
//         <Icon name="search-outline" size={24} color="#7b4de4" />
//         <Icon name="person-outline" size={24} color="#7b4de4" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f1edf9",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
//   grid: { paddingBottom: 20 },
//   row: { justifyContent: "space-between", marginBottom: 20 },
//   card: {
//     width: cardSize,
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     elevation: 2,
//   },
//   cardImage: {
//     width: "100%",
//     height: cardSize,
//     resizeMode: "cover",
//   },
//   cardText: {
//     padding: 10,
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//     color: "#1a1a1a",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 14,
//     backgroundColor: "#f1edf9",
//     borderTopWidth: 1,
//     borderTopColor: "#dcd6f4",
//   },
// });

// export default HistoryExplorer;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const cardHeight = 220;
const bgImage = require("../assets/aaa.jpg");
const data = [
  {
    title: "🌍 Explore Nearby",
    image: require("../assets/Explore.jpeg"),
    description: "Unlock hidden tails beneath your feet.",
    navigateTo: "MapScreen",
  },
  {
    title: "📝 Places Visited",
    image: require("../assets/Visited.jpeg"),
    description: "Keep track of the amazing places you’ve explored.",
    navigateTo: "PlacesVisited",
  },
  {
    title: "🧠 Challenge Yourself",
    image: require("../assets/Quiz.jpeg"),
    description: "Test your knowledge through quests.",
    navigateTo: "Quiz",
  },
  {
    title: "🏆 Hall of Fame",
    image: require("../assets/Leaderboard.jpeg"),
    description: "Climb the leaderboard of elite explorers!",
    navigateTo: "Leaderboard",
  },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 300}
      style={styles.card}
      useNativeDriver
    >
      <TouchableOpacity onPress={() => navigation.navigate(item.navigateTo)}>
      <Image source={item.image} style={styles.image} />
        <LinearGradient colors={["#ffffff", "#f0f0f0"]} style={styles.overlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bgImage}
      imageStyle={{ opacity: 0.27 }}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.headerWrap}>
          <LinearGradient
            colors={["rgba(255,255,255,0.97)", "rgba(245,240,255,0.95)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topBar}
          >
            <View style={styles.brandBlock}>
              <Text style={styles.brand}>Echoes</Text>
              <Text style={styles.tagline}>Your history, explored</Text>
            </View>
            <TouchableOpacity
              style={styles.profileBtnOuter}
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#8b5cf6", "#6d28d9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileBtn}
              >
                <Text style={styles.profileIcon}>◉</Text>
                <Text style={styles.profileLabel}>Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(109, 40, 217, 0.12)",
    shadowColor: "#4c1d95",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  brandBlock: {
    flex: 1,
    marginRight: 12,
  },
  brand: {
    fontSize: 26,
    fontWeight: "900",
    color: "#4c1d95",
    letterSpacing: 1.2,
  },
  tagline: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(76, 29, 149, 0.55)",
    letterSpacing: 0.3,
  },
  profileBtnOuter: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#6d28d9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  profileIcon: {
    fontSize: 13,
    color: "rgba(255,255,255,0.95)",
    marginTop: -1,
  },
  profileLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.4,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
  },
  profilePic: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#aaa",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  image: {
    width: "100%",
    height: cardHeight,
  },
  overlay: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  cardDesc: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
});
