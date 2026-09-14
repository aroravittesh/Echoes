import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE = "http://192.168.0.23:7001";

type UserProfile = {
  _id: string;
  username?: string;
  email?: string;
  score?: number;
  placesVisited?: { name?: string; photo?: string }[];
};

function initials(profile: UserProfile | null): string {
  if (!profile) return "?";
  const u = profile.username?.trim();
  if (u) return u.slice(0, 2).toUpperCase();
  const e = profile.email?.trim();
  if (e) return e.slice(0, 1).toUpperCase();
  return "—";
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bgImage = require("../assets/aaa.jpg");

  const loadProfile = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setProfile(null);
        setError("Not signed in");
        return;
      }
      const res = await axios.get<UserProfile>(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (e) {
      console.error("Profile load error:", e);
      setError("Could not load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Not signed in");
        return;
      }
      const res = await axios.get<UserProfile>(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setError(null);
    } catch {
      setError("Could not load profile");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "userId"]);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      })
    );
  };

  const placesCount = profile?.placesVisited?.length ?? 0;
  const displayName =
    profile?.username?.trim() || profile?.email?.split("@")[0] || "Explorer";
  const emailLine = profile?.email?.trim();

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bgImage}
      imageStyle={{ opacity: 0.22 }}
    >
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7c3aed"
            />
          }
        >
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backPill}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.backChevron}>‹</Text>
              <Text style={styles.backLabel}>Back</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text style={styles.loadingHint}>Loading your profile…</Text>
            </View>
          ) : error ? (
            <LinearGradient
              colors={["#fff5f5", "#ffe4e6"]}
              style={styles.errorCard}
            >
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={loadProfile}
                activeOpacity={0.9}
              >
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <>
              <LinearGradient
                colors={["#9d7cf5", "#7c3aed", "#5b21b6"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
              >
                <View style={styles.avatarRing}>
                  <View style={styles.avatarInner}>
                    <Text style={styles.avatarText}>{initials(profile)}</Text>
                  </View>
                </View>
                <Text style={styles.heroName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.heroEmail} numberOfLines={1}>
                  {emailLine || "No email on file"}
                </Text>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>Explorer</Text>
                </View>
              </LinearGradient>

              <View style={styles.statsRow}>
                <LinearGradient
                  colors={["#ffffff", "#faf8ff"]}
                  style={styles.statCard}
                >
                  <Text style={styles.statValue}>{profile?.score ?? 0}</Text>
                  <Text style={styles.statLabel}>Score</Text>
                </LinearGradient>
                <LinearGradient
                  colors={["#ffffff", "#faf8ff"]}
                  style={styles.statCard}
                >
                  <Text style={styles.statValue}>{placesCount}</Text>
                  <Text style={styles.statLabel}>Places</Text>
                </LinearGradient>
              </View>

              <View style={styles.sectionLabelWrap}>
                <Text style={styles.sectionLabel}>Account</Text>
              </View>

              <LinearGradient
                colors={["#ffffff", "#f8f5ff", "#f3efff"]}
                locations={[0, 0.4, 1]}
                style={styles.detailCard}
              >
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Username</Text>
                  <Text style={styles.detailVal} numberOfLines={1}>
                    {profile?.username?.trim() ? profile.username : "—"}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Email</Text>
                  <Text style={styles.detailVal} numberOfLines={2}>
                    {profile?.email ?? "—"}
                  </Text>
                </View>
              </LinearGradient>

              <TouchableOpacity
                style={styles.logoutOuter}
                onPress={handleLogout}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#f87171", "#dc2626", "#b91c1c"]}
                  locations={[0, 0.55, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoutBtn}
                >
                  <Text style={styles.logoutText}>Log out</Text>
                  <Text style={styles.logoutSub}>Sign out on this device</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {!loading && !error && (
            <Text style={styles.footerNote}>Pull down to refresh</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  topRow: {
    marginBottom: 14,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.18)",
    shadowColor: "#4c1d95",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  backChevron: {
    fontSize: 22,
    fontWeight: "400",
    color: "#5b21b6",
    marginRight: 2,
    marginTop: -2,
  },
  backLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4c1d95",
    letterSpacing: 0.2,
  },
  loadingCard: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 20,
    paddingVertical: 48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  loadingHint: {
    marginTop: 14,
    fontSize: 15,
    color: "rgba(59, 7, 100, 0.55)",
    fontWeight: "600",
  },
  errorCard: {
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.2)",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#991b1b",
    marginBottom: 6,
  },
  errorText: {
    fontSize: 15,
    color: "#7f1d1d",
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#7c3aed",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  hero: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#5b21b6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginBottom: 14,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#5b21b6",
    letterSpacing: 1,
  },
  heroName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroEmail: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
  },
  heroBadge: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.14)",
    shadowColor: "#4c1d95",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b0764",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(59, 7, 100, 0.5)",
    letterSpacing: 0.5,
  },
  sectionLabelWrap: {
    marginTop: 22,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(59, 7, 100, 0.45)",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  detailCard: {
    borderRadius: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.12)",
    overflow: "hidden",
    shadowColor: "#4c1d95",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  detailRow: {
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(124, 58, 237, 0.12)",
    marginLeft: 18,
  },
  detailKey: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(59, 7, 100, 0.45)",
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  detailVal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e1b4b",
    lineHeight: 22,
  },
  logoutOuter: {
    marginTop: 24,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#b91c1c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  logoutBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.4,
  },
  logoutSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  footerNote: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(59, 7, 100, 0.35)",
  },
});
