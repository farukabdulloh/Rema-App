import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { COLOR } from "../../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const DetailRecipe = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useLocalSearchParams();

  const [recipe, setRecipe] = useState<Record<string, any>>({});

  // Get recipe details
  const getRecipeDetails = async () => {
    const { data } = await axios.get(`https://dummyjson.com/recipes/${id}`);

    setRecipe(data);
  };

  useEffect(() => {
    getRecipeDetails();
  }, [id]);

  const handleEdit = () => {
    router.push(`/recipe/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert("Delete Recipe", "Are you sure you want to delete this recipe?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const { data } = await axios.delete(`https://dummyjson.com/recipes/${id}`);

            console.log("Deleted Recipe:", data);

            Alert.alert("Success", "Recipe deleted successfully!");
          } catch (error) {
            console.log("Failed to delete recipe:", error);
            Alert.alert("Error", "Failed to delete recipe.");
          }
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={[COLOR.backgroundLight, COLOR.background]} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Back Button */}
        <Header btnBack title="Recipe Details" />

        {/* Recipe Actions */}
        {isLoggedIn && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={17} color={COLOR.onPrimary} />
              <Text style={styles.editText}>Edit Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={17} color={COLOR.danger} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {recipe.id && (
          <>
            {/* Recipe Image */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: recipe.image }} style={styles.featuredImage} />

              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>RECIPE</Text>
              </View>
            </View>

            <View style={styles.content}>
              {/* Recipe Name */}
              <Text style={styles.title}>{recipe.name}</Text>

              {/* Recipe Information */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>◷</Text>

                  <View>
                    <Text style={styles.infoLabel}>COOK TIME</Text>
                    <Text style={styles.infoValue}>{recipe.cookTimeMinutes} min</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>★</Text>

                  <View>
                    <Text style={styles.infoLabel}>RATING</Text>
                    <Text style={styles.infoValue}>{recipe.rating}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>●</Text>

                  <View>
                    <Text style={styles.infoLabel}>DIFFICULTY</Text>
                    <Text style={styles.infoValue}>{recipe.difficulty}</Text>
                  </View>
                </View>
              </View>

              {/* Cuisine */}
              <View style={styles.cuisineContainer}>
                <Text style={styles.cuisineLabel}>CUISINE</Text>
                <Text style={styles.cuisineValue}>{recipe.cuisine}</Text>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About this recipe</Text>

                <Text style={styles.description}>{recipe.description}</Text>
              </View>

              {/* Ingredients */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients</Text>

                {recipe.ingredients?.map((ingredient: string, index: number) => (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.dot} />

                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>

              {/* Instructions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>

                {recipe.instructions?.map((instruction: string, index: number) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.numberCircle}>
                      <Text style={styles.numberText}>{index + 1}</Text>
                    </View>

                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },

  editButton: {
    flex: 1,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLOR.primary,
    borderRadius: 12,
  },

  editText: {
    color: COLOR.onPrimary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  imageWrapper: {
    width: "100%",
    height: 250,
    position: "relative",
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: COLOR.beige,
  },

  featuredImage: {
    width: "100%",
    height: "100%",
  },

  featuredBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: COLOR.beige,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  featuredBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: COLOR.primary,
  },

  content: {
    paddingTop: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLOR.primary,
    lineHeight: 33,
    letterSpacing: -0.5,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  infoIcon: {
    fontSize: 17,
    color: COLOR.brown,
    marginRight: 7,
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: COLOR.secondaryText,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR.primary,
    marginTop: 3,
  },

  cuisineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
  },

  cuisineLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: COLOR.secondaryText,
  },

  cuisineValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR.brown,
    backgroundColor: COLOR.beige,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  section: {
    marginTop: 26,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLOR.primary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLOR.secondaryText,
  },

  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLOR.accent,
    marginTop: 7,
    marginRight: 10,
  },

  ingredientText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: COLOR.primary,
  },

  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: COLOR.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  numberText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR.onPrimary,
  },

  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: COLOR.secondaryText,
  },

  deleteButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.danger,
    backgroundColor: COLOR.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  deleteButtonText: {
    color: COLOR.danger,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
