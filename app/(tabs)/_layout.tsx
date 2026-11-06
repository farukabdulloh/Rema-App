import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLOR } from "../../constants/colors";

const TabsLayouts = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: COLOR.active,
        tabBarInactiveTintColor: COLOR.inactive,

        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#4A5A4C",
          backgroundColor: COLOR.primary,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="home" size={size} color={focused ? COLOR.active : COLOR.inactive} />
          ),
        }}
      />

      <Tabs.Screen
        name="recipe"
        options={{
          title: "Recipe",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="receipt" size={size} color={focused ? COLOR.active : COLOR.inactive} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayouts;
