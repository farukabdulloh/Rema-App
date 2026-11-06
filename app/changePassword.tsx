import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Header from "../components/Header";
import { COLOR } from "../constants/colors";

const ChangePassword = () => {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Oops!", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Weak Password", "Password must contain at least 6 characters.");
      return;
    }

    Alert.alert("Success", "Password validation completed.");
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (text: string) => void,
    visible: boolean,
    setVisible: (visible: boolean) => void,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLOR.secondaryText}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />

        <Pressable onPress={() => setVisible(!visible)}>
          <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={21} color={COLOR.brown} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLOR.background, COLOR.backgroundLight, COLOR.beige]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Header btnBack title="Change Password" />

        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons name="lock-closed-outline" size={32} color={COLOR.accent} />
          </View>

          <Text style={styles.title}>Secure Your Account</Text>
          <Text style={styles.description}>Create a strong password to keep your account safe.</Text>

          {renderPasswordInput("Current Password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent)}

          {renderPasswordInput("New Password", newPassword, setNewPassword, showNew, setShowNew)}

          {renderPasswordInput(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            setShowConfirm,
          )}

          <Pressable style={styles.button} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>Update Password</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 24,
  },

  card: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 22,
    padding: 22,
    marginTop: 20,
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },

  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLOR.primary,
    textAlign: "center",
    letterSpacing: -0.2,
  },

  description: {
    fontSize: 13,
    color: COLOR.secondaryText,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: COLOR.background,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: COLOR.primary,
  },

  button: {
    height: 52,
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: COLOR.onPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
