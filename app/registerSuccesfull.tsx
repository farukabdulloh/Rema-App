import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLOR } from "../constants/colors";

const RegisterSuccess = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[COLOR.background, COLOR.backgroundLight, COLOR.beige]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={42} color={COLOR.onPrimary} />
        </View>

        <Text style={styles.title}>Registration Successful!</Text>

        <Text style={styles.subtitle}>Your email has been verified and your account is ready.</Text>

        <Pressable style={styles.button} onPress={() => router.replace("/login")}>
          <Text style={styles.buttonText}>Continue to Login</Text>
        </Pressable>

        <Text style={styles.footer}>Welcome to Rema-App. Happy cooking!</Text>
      </View>
    </LinearGradient>
  );
};

export default RegisterSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },

  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: COLOR.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLOR.primary,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 14,
    color: COLOR.secondaryText,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 28,
  },

  button: {
    width: "100%",
    height: 52,
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: COLOR.onPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  footer: {
    fontSize: 12,
    color: COLOR.secondaryText,
    marginTop: 22,
    textAlign: "center",
  },
});
