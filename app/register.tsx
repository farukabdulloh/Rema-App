import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Header from "../components/Header";
import { COLOR } from "../constants/colors";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    Alert.alert(
      "Registration Form Ready!",
      "Your information is valid. Account registration will be connected to the backend later.",
      [{ text: "OK", onPress: () => router.replace("/login") }],
    );
  };

  return (
    <LinearGradient
      colors={[COLOR.background, COLOR.backgroundLight, COLOR.beige]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header btnBack />

          <View style={styles.card}>
            {/* LOGO */}
            <View style={styles.logo}>
              <Ionicons name="restaurant" size={32} color={COLOR.accent} />
            </View>

            {/* TITLE */}
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Join Rema-App and start your culinary journey.</Text>

            {/* FULL NAME */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLOR.secondaryText}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* EMAIL */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLOR.secondaryText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor={COLOR.secondaryText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLOR.brown} />
                </Pressable>
              </View>
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirm Password</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLOR.secondaryText}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />

                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLOR.brown}
                  />
                </Pressable>
              </View>
            </View>

            {/* ERROR */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* REGISTER BUTTON */}
            <Pressable style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Create Account</Text>
            </Pressable>

            {/* LOGIN LINK */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>

              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}> Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: 24,
    borderRadius: 24,
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },

  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: COLOR.primary,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 13,
    color: COLOR.secondaryText,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 26,
    lineHeight: 20,
  },

  fieldContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.primary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLOR.text,
    backgroundColor: COLOR.background,
  },

  passwordContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    backgroundColor: COLOR.background,
    paddingHorizontal: 14,
    overflow: "hidden",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 2,
    fontSize: 14,
    color: COLOR.text,
  },

  error: {
    color: COLOR.danger,
    fontSize: 12.5,
    marginBottom: 14,
  },

  registerButton: {
    height: 52,
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  registerButtonText: {
    color: COLOR.onPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  loginText: {
    color: COLOR.secondaryText,
    fontSize: 13,
  },

  loginLink: {
    color: COLOR.secondary,
    fontSize: 13,
    fontWeight: "700",
  },
});
