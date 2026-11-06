import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../../components/Header";
import { COLOR } from "../../../constants/colors";

const EditId = () => {
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [rating, setRating] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  const handleSave = async () => {
    try {
      const updatedRecipe = {
        name: name,
        prepTimeMinutes: Number(prepTime),
        cookTimeMinutes: Number(cookTime),
        rating: Number(rating),
        difficulty: difficulty,
        ingredients: ingredients,
        instructions: instructions,
      };

      const { data } = await axios.patch(`https://dummyjson.com/recipes/${id}`, updatedRecipe);

      console.log("Updated Recipe:", data);

      Alert.alert("Success", "Recipe changes have been submitted successfully!");
    } catch (error) {
      console.log("Failed to update recipe:", error);

      Alert.alert("Error", "Failed to update recipe. Please try again.");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getRecipeDetails = async () => {
    try {
      const { data } = await axios.get(`https://dummyjson.com/recipes/${id}`);
      setPrepTime(String(data.prepTimeMinutes));
      setCookTime(String(data.cookTimeMinutes));
      setName(data.name);
      setImage(data.image);
      setRating(String(data.rating));
      setDifficulty(data.difficulty);
      setIngredients(data.ingredients);
      setInstructions(data.instructions);
    } catch (error) {
      console.log("Failed to fetch recipe:", error);
    }
  };

  useEffect(() => {
    getRecipeDetails();
  }, [id]);

  return (
    <LinearGradient colors={[COLOR.backgroundLight, COLOR.background]} style={styles.screen}>
      <Header btnBack title="Edit Recipe" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Badge */}
        <Text style={styles.headerBadge}>EDIT MODE</Text>
        {/* Title */}
        <View style={styles.heading}>
          <Text style={styles.title}>Edit Recipe</Text>
          <Text style={styles.subtitle}>Make your recipe just the way you like it.</Text>
        </View>
        {/* Recipe Image */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>RECIPE IMAGE</Text>

          {image && <Image source={{ uri: image }} style={styles.previewImage} />}

          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Recipe Information</Text>

          <Text style={styles.label}>RECIPE NAME</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter recipe name"
            placeholderTextColor={COLOR.secondaryText}
          />

          <Text style={styles.helperText}>Update the name of your recipe.</Text>

          <Text style={styles.label}>PREP TIME (MINUTES)</Text>
          <TextInput
            style={styles.input}
            value={prepTime}
            onChangeText={setPrepTime}
            placeholder="Enter prep time"
            placeholderTextColor={COLOR.secondaryText}
            keyboardType="numeric"
          />

          <Text style={styles.label}>COOK TIME (MINUTES)</Text>
          <TextInput
            style={styles.input}
            value={cookTime}
            onChangeText={setCookTime}
            placeholder="Enter cook time"
            placeholderTextColor={COLOR.secondaryText}
            keyboardType="numeric"
          />
          <Text style={styles.label}>RATING</Text>
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={setRating}
            placeholder="Enter rating"
            placeholderTextColor={COLOR.secondaryText}
            keyboardType="decimal-pad"
          />
          <Text style={styles.label}>DIFFICULTY</Text>

          <View style={styles.difficultyContainer}>
            {["Easy", "Medium", "Hard"].map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.difficultyButton, difficulty === item && styles.selectedDifficulty]}
                onPress={() => setDifficulty(item)}
              >
                <Text style={[styles.difficultyText, difficulty === item && styles.selectedDifficultyText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Ingredients & Instructions</Text>

          <Text style={styles.label}>INGREDIENTS</Text>

          {ingredients.map((item, index) => (
            <View key={index} style={styles.arrayRow}>
              <TextInput
                style={[styles.input, styles.arrayInput]}
                value={item}
                onChangeText={text => {
                  const updatedIngredients = [...ingredients];
                  updatedIngredients[index] = text;
                  setIngredients(updatedIngredients);
                }}
                placeholder={`Ingredient ${index + 1}`}
                placeholderTextColor={COLOR.secondaryText}
              />

              <TouchableOpacity
                onPress={() => {
                  setIngredients(ingredients.filter((_, i) => i !== index));
                }}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={19} color={COLOR.danger} />
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.label, { marginTop: 15 }]}>INSTRUCTIONS</Text>

          {instructions.map((item, index) => (
            <View key={index} style={styles.arrayRow}>
              <TextInput
                style={[styles.input, styles.arrayInput, styles.instructionInput]}
                value={item}
                onChangeText={text => {
                  const updatedInstructions = [...instructions];
                  updatedInstructions[index] = text;
                  setInstructions(updatedInstructions);
                }}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor={COLOR.secondaryText}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={() => {
                  setInstructions(instructions.filter((_, i) => i !== index));
                }}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={19} color={COLOR.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};
export default EditId;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLOR.primary,
  },

  headerBadge: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: COLOR.brown,
  },

  heading: {
    marginTop: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLOR.primary,
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 13,
    color: COLOR.secondaryText,
    marginTop: 7,
    lineHeight: 19,
  },

  form: {
    backgroundColor: COLOR.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.border,
    marginBottom: 16,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.primary,
    marginBottom: 2,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: COLOR.secondaryText,
    marginTop: 16,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: COLOR.primary,
    backgroundColor: COLOR.background,
  },

  helperText: {
    fontSize: 11,
    color: COLOR.secondaryText,
    marginTop: 7,
  },

  saveButton: {
    backgroundColor: COLOR.primary,
    height: 52,
    justifyContent: "center",
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  saveButtonText: {
    color: COLOR.onPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  imageSection: {
    marginBottom: 20,
  },

  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: COLOR.beige,
  },

  imageButton: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    height: 50,
    justifyContent: "center",
    borderRadius: 14,
    alignItems: "center",
  },

  imageButtonText: {
    color: COLOR.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  arrayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  arrayInput: {
    flex: 1,
  },

  instructionInput: {
    minHeight: 80,
  },

  removeButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLOR.background,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: "center",
    justifyContent: "center",
  },

  difficultyContainer: {
    flexDirection: "row",
    gap: 10,
  },

  difficultyButton: {
    flex: 1,
    height: 46,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: "center",
    backgroundColor: COLOR.background,
  },

  selectedDifficulty: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },

  difficultyText: {
    color: COLOR.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  selectedDifficultyText: {
    color: COLOR.onPrimary,
  },
});
