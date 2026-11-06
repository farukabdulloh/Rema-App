import { router } from "expo-router";
import { FC } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR } from "../constants/colors";

interface RecipeItemsProps {
  id: number;
  name: string;
  image: string;
  cookTimeMinutes?: number;
  description?: string;
}

const RecipeItems: FC<RecipeItemsProps> = ({ id, name, image, cookTimeMinutes, description }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/recipe/${id}`)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{name}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : (
          <Text style={styles.cookTime}>{cookTimeMinutes} minutes</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RecipeItems;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 0,
    borderRadius: 18,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    overflow: "hidden",
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  imageContainer: {
    width: "100%",
    height: 170,
    backgroundColor: COLOR.beige,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.primary,
    lineHeight: 22,
    letterSpacing: -0.2,
  },

  cookTime: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.secondary,
    letterSpacing: 0.2,
  },

  description: {
    fontSize: 13,
    color: COLOR.secondaryText,
    marginTop: 6,
    lineHeight: 19,
  },
});
