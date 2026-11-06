import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import { COLOR } from "../constants/colors";

const AdminProfile = () => {
  const router = useRouter();
  const [name, setName] = useState("Admin Rema");
  const [email, setEmail] = useState("admin@rema.app");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedName = await AsyncStorage.getItem("adminName");
        const savedEmail = await AsyncStorage.getItem("adminEmail");
        const savedPhoto = await AsyncStorage.getItem("adminPhoto");

        if (savedName) setName(savedName);
        if (savedEmail) setEmail(savedEmail);
        if (savedPhoto) setPhoto(savedPhoto);
      } catch (error) {
        console.log("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  return (
    <LinearGradient
      colors={[COLOR.background, COLOR.backgroundLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header btnBack title="Admin Profile" />

        <View style={styles.profileCard}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <MaterialCommunityIcons name="chef-hat" size={44} color={COLOR.accent} />
            </View>
          )}

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>Administrator</Text>

          <View style={styles.status}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active Account</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="person-outline" size={20} color={COLOR.secondary} />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={20} color={COLOR.secondary} />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLOR.secondary} />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Account Role</Text>
              <Text style={styles.value}>Administrator</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color={COLOR.accent} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.changePasswordButton} onPress={() => router.push("/changePassword")}>
          <Ionicons name="lock-closed-outline" size={20} color={COLOR.primary} />
          <Text style={styles.changePasswordText}>Change Password</Text>
        </Pressable>

        <Text style={styles.footer}>Rema-App • Admin Dashboard</Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default AdminProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: COLOR.primary,
    marginBottom: 16,
    overflow: "hidden",
  },

  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLOR.primary,
    letterSpacing: -0.3,
  },

  role: {
    fontSize: 13,
    color: COLOR.secondaryText,
    marginTop: 5,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLOR.beige,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 16,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLOR.secondary,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLOR.secondary,
    letterSpacing: 0.2,
  },

  infoCard: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.primary,
    marginBottom: 18,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLOR.background,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: COLOR.secondaryText,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: COLOR.primary,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: COLOR.border,
    marginVertical: 12,
  },

  editButton: {
    height: 52,
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 22,
  },

  editButtonText: {
    color: COLOR.onPrimary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  footer: {
    fontSize: 11,
    color: COLOR.secondaryText,
    textAlign: "center",
    marginTop: 24,
  },

  changePasswordButton: {
    height: 52,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 12,
  },

  changePasswordText: {
    color: COLOR.primary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
