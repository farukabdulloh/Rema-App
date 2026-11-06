import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "./contexts/AuthContext";

const waitForLoading = async (startTime: number) => {
  const remaining = 2000 - (Date.now() - startTime);

  if (remaining > 0) {
    await new Promise(resolve => setTimeout(resolve, remaining));
  }
};

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const startTime = Date.now();

    try {
      setIsLoading(true);
      setError("");

      const result = await login(email.trim().toLowerCase(), password);

      await waitForLoading(startTime);

      if (!result) {
        setError("Email or password is incorrect.");
        return;
      }

      Alert.alert("Login Successful!", "Welcome back, Chef! Ready to create something delicious?", [
        {
          text: "Let's Cook!",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      await waitForLoading(startTime);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLOR.background, COLOR.backgroundLight, COLOR.beige]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header btnBack />

          <View style={styles.card}>
        {/* APP LOGO */}
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Ionicons name="restaurant" size={34} color={COLOR.accent} />
          </View>

          <Text style={styles.brandTitle}>Rema-App</Text>
          <Text style={styles.brandSubtitle}>Cook with inspiration</Text>
        </View>

        {/* LOGIN HEADING */}
        <View style={styles.headingSection}>
          <Text style={styles.title}>Welcome Back, Chef!</Text>
          <Text style={styles.subtitle}>Login to Rema-App</Text>
        </View>

        {/* LOGIN FORM */}
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLOR.secondaryText}
            value={email}
            onChangeText={value => {
              setEmail(value);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor={COLOR.secondaryText}
              value={password}
              onChangeText={value => {
                setPassword(value);
                setError("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLOR.brown} />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={COLOR.onPrimary} size="small" />
                <Text style={styles.buttonText}>Logging in...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>

          {/* REGISTER LINK */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>

            <Pressable onPress={() => router.push("/register")} disabled={isLoading}>
              <Text style={styles.registerLink}>Register</Text>
            </Pressable>
          </View>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
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
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 26,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  brandTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLOR.primary,
    letterSpacing: -0.3,
  },

  brandSubtitle: {
    fontSize: 12,
    color: COLOR.secondaryText,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  headingSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLOR.primary,
    textAlign: "center",
    letterSpacing: -0.2,
  },

  subtitle: {
    fontSize: 13,
    color: COLOR.secondaryText,
    marginTop: 6,
  },

  form: {
    width: "100%",
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
    marginBottom: 16,
    fontSize: 14,
    color: COLOR.primary,
    backgroundColor: COLOR.background,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: COLOR.background,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: COLOR.primary,
  },

  button: {
    height: 52,
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: COLOR.onPrimary,
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  error: {
    color: COLOR.danger,
    fontSize: 12.5,
    marginBottom: 12,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 22,
  },

  registerText: {
    fontSize: 13,
    color: COLOR.secondaryText,
  },

  registerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: COLOR.secondary,
  },
});
