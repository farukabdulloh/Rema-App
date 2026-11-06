import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

import { COLOR } from "../constants/colors";

const Verify = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);

  const inputRefs = useRef<Array<React.ElementRef<typeof TextInput> | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds(previous => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;
    setOtp(updatedOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      Alert.alert("Incomplete Code", "Please enter all 6 digits.");
      return;
    }

    // UI simulation: any 6 digits are accepted for now.
    router.replace("/registerSuccesfull");
  };

  const handleResend = () => {
    if (seconds > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setSeconds(30);
    inputRefs.current[0]?.focus();

    Alert.alert("Code Requested", "The resend action is currently a UI simulation.");
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
          <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={34} color={COLOR.accent} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.subtitle}>We've sent a verification code to:</Text>

        <Text style={styles.email}>{email || "your email address"}</Text>

        <Text style={styles.instruction}>Enter the 6-digit code below to verify your account.</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textAlign="center"
            />
          ))}
        </View>

        <Pressable style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify Email</Text>
        </Pressable>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>

          <Pressable onPress={handleResend} disabled={seconds > 0}>
            <Text style={[styles.resendLink, seconds > 0 && styles.disabledLink]}>
              {seconds > 0 ? ` Resend in ${seconds}s` : " Resend Code"}
            </Text>
          </Pressable>
        </View>

            <Pressable onPress={() => router.replace("/register")}>
              <Text style={styles.changeEmail}>Change Email Address</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Verify;

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
    alignItems: "center",
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLOR.primary,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 13,
    color: COLOR.secondaryText,
    textAlign: "center",
    marginTop: 12,
  },

  email: {
    fontSize: 14,
    fontWeight: "700",
    color: COLOR.brown,
    marginTop: 5,
  },

  instruction: {
    fontSize: 13,
    color: COLOR.secondaryText,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 24,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    marginBottom: 26,
  },

  otpInput: {
    flex: 1,
    maxWidth: 46,
    height: 54,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    backgroundColor: COLOR.background,
    color: COLOR.primary,
    fontSize: 20,
    fontWeight: "700",
  },

  verifyButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  verifyButtonText: {
    color: COLOR.onPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 24,
  },

  resendText: {
    color: COLOR.secondaryText,
    fontSize: 13,
  },

  resendLink: {
    color: COLOR.secondary,
    fontSize: 13,
    fontWeight: "700",
  },

  disabledLink: {
    color: COLOR.secondaryText,
  },

  changeEmail: {
    color: COLOR.secondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 22,
    textDecorationLine: "underline",
  },
});
