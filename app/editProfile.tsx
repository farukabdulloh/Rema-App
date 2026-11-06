import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import { COLOR } from "../constants/colors";

const EditProfile = () => {
  const router = useRouter();

  const [name, setName] = useState("Admin Rema");
  const [email, setEmail] = useState("admin@rema.app");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved profile
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

  // Select Profile Picture
  const handleChoosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Save Profile
  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Invalid Input", "Name and email cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);

      await AsyncStorage.multiSet([
        ["adminName", name.trim()],
        ["adminEmail", email.trim()],
        ["adminPhoto", photo ?? ""],
      ]);

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("Failed to save profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient colors={[COLOR.backgroundLight, COLOR.background]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header btnBack title="Edit Profile" />

        {/* Profile Picture */}
        <View style={styles.photoSection}>
          <View style={styles.avatarWrapper}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={COLOR.accent} />
              </View>
            )}

            <TouchableOpacity style={styles.cameraButton} onPress={handleChoosePhoto}>
              <Ionicons name="camera" size={18} color={COLOR.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.photoTitle}>Profile Picture</Text>
          <Text style={styles.photoSubtitle}>Choose your profile photo</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLOR.secondary} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLOR.secondaryText}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLOR.secondary} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={COLOR.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="save-outline" size={19} color={COLOR.onPrimary} />
          <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  photoSection: {
    alignItems: "center",
    marginTop: 22,
    marginBottom: 26,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 108,
    height: 108,
    borderRadius: 999,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: COLOR.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLOR.backgroundLight,
  },

  photoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.primary,
  },

  photoSubtitle: {
    fontSize: 12,
    color: COLOR.secondaryText,
    marginTop: 5,
  },

  formCard: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.primary,
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.primary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.background,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 18,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: COLOR.primary,
  },

  saveButton: {
    height: 52,
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 22,
  },

  saveButtonText: {
    color: COLOR.onPrimary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
