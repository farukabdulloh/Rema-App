import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../app/contexts/AuthContext";
import { COLOR } from "../constants/colors";

interface Props {
  btnBack?: boolean;
  title?: string;
  showProfile?: boolean;
}

const Header = ({ btnBack = false, title = "Rema-App", showProfile = false }: Props) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    if (isLoggingOut) return;

    Alert.alert("Logout Confirmation", "Are you sure you want to log out from Rema-App?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoggingOut(true);

            await logout();

            setShowMenu(false);
            router.replace("/(tabs)");
          } catch (error) {
            setIsLoggingOut(false);

            Alert.alert("Logout Failed", "Something went wrong. Please try again.");
          }
        },
      },
    ]);
  };

  const handleLogin = () => {
    setShowMenu(false);
    router.push("/login");
  };

  const handleRegister = () => {
    setShowMenu(false);
    router.push("/register");
  };

  return (
    <View style={styles.header}>
      {/* LEFT SECTION */}
      <View style={styles.leftSection}>
        {btnBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={21} color={COLOR.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="restaurant" size={20} color={COLOR.accent} />
            </View>

            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>Cook with inspiration</Text>
            </View>
          </View>
        )}
      </View>

      {/* RIGHT SECTION */}
      {showProfile && (
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowMenu(!showMenu)}>
            {isLoggedIn ? (
              <View style={styles.chefIcon}>
                <MaterialCommunityIcons name="chef-hat" size={24} color={COLOR.accent} />
              </View>
            ) : (
              <Ionicons name="person" size={21} color={COLOR.secondary} />
            )}
          </TouchableOpacity>

          {isLoggedIn && (
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Welcome Back, Chef!</Text>
              <Text style={styles.welcomeSubtitle}>Ready to create?</Text>
            </View>
          )}
        </View>
      )}

      {/* PROFILE MENU */}
      {showProfile && showMenu && (
        <View style={styles.profileMenu}>
          {!isLoggedIn ? (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogin}>
                <Ionicons name="log-in-outline" size={18} color={COLOR.primary} />
                <Text style={styles.menuText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleRegister}>
                <Ionicons name="person-add-outline" size={18} color={COLOR.primary} />
                <Text style={styles.menuText}>Register</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  router.push("/adminProfile");
                }}
              >
                <Ionicons name="person-outline" size={18} color={COLOR.primary} />
                <Text style={styles.menuText}>Admin Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <>
                    <ActivityIndicator size="small" color={COLOR.secondary} />
                    <Text style={styles.menuText}>Logging out...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="log-out-outline" size={18} color={COLOR.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    position: "relative",
    zIndex: 10,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLOR.primary,
    letterSpacing: -0.2,
  },

  subtitle: {
    fontSize: 11,
    color: COLOR.secondaryText,
    marginTop: 2,
    letterSpacing: 0.2,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeText: {
    alignItems: "flex-start",
  },

  welcomeTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLOR.primary,
  },

  welcomeSubtitle: {
    fontSize: 10,
    color: COLOR.secondaryText,
    marginTop: 2,
  },

  chefIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileMenu: {
    position: "absolute",
    top: 54,
    right: 0,
    backgroundColor: COLOR.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: 6,
    minWidth: 180,
    elevation: 4,
    shadowColor: "#344437",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    zIndex: 100,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  menuText: {
    color: COLOR.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  logoutText: {
    color: COLOR.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
