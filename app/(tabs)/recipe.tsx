import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import RecipeItems from "../../components/RecipeItems";
import TagItem from "../../components/TagItem";
import { COLOR } from "../../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const RecipeScreen = () => {
  const [recipe, setRecipe] = useState<any[]>([]);
  const [tags, setTags] = useState([]);
  const [name, setName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn } = useAuth();

  const getRecipe = async () => {
    if (searchQuery.trim()) {
      const { data } = await axios.get(
        `https://dummyjson.com/recipes/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );

      setRecipe(data.recipes);
    } else if (name) {
      const { data } = await axios.get(`https://dummyjson.com/recipes/tag/${encodeURIComponent(name)}`);

      setRecipe(data.recipes);
    } else {
      const { data } = await axios.get(
        `https://dummyjson.com/recipes?limit=10&skip=10&select=id,name,image,description,cookTimeMinutes`,
      );

      setRecipe(data.recipes);
    }
  };

  const handleChangeRecipe = async (name: string) => {
    setName(name);
  };

  const getTags = async () => {
    const { data } = await axios.get(`https://dummyjson.com/recipes/tags`);
    setTags(data);
  };

  useEffect(() => {
    getRecipe();
  }, [name, searchQuery]);

  useEffect(() => {
    getTags();
  }, []);

  return (
    <LinearGradient colors={[COLOR.backgroundLight, COLOR.background]} style={styles.container}>
      <FlatList
        data={recipe}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerWrapper}>
                <Header />
              </View>

              {isLoggedIn && (
                <TouchableOpacity onPress={() => router.push("/recipe/addRecipe")} style={styles.addButton}>
                  <Ionicons name="add-circle-outline" size={18} style={styles.iconCircle} />
                  <Text style={styles.addButtonText}>Add Recipe</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLOR.secondaryText} />

              <TextInput
                style={styles.searchInput}
                placeholder="Search your favorite recipes..."
                placeholderTextColor={COLOR.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color={COLOR.secondaryText} />
                </TouchableOpacity>
              )}
            </View>

            {/* List Tags */}
            <View style={styles.tagSection}>
              <FlatList
                data={tags}
                renderItem={({ item }) => (
                  <TagItem name={item} handleChangeRecipe={handleChangeRecipe} selectedName={name} />
                )}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagContent}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeItems
            id={item.id}
            name={item.name}
            description={item.description}
            image={item.image}
            cookTimeMinutes={item.cookTimeMinutes}
          />
        )}
      />
    </LinearGradient>
  );
};

export default RecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    gap: 12,
  },

  headerWrapper: {
    flex: 1,
  },

  iconCircle: {
    color: COLOR.accent,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },

  addButtonText: {
    color: COLOR.onPrimary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  tagSection: {
    paddingTop: 18,
    paddingBottom: 8,
  },

  tagContent: {
    gap: 10,
  },

  listContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLOR.border,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: COLOR.primary,
    fontSize: 14,
  },

  listContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    gap: 18,
  },
});
