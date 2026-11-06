import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { COLOR } from "../../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const AddRecipe = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [rating, setRating] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/(tabs)/recipe");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading || !isLoggedIn) {
    return null;
  }

  const handleSave = async () => {
    if (!isLoggedIn) {
      router.replace("/(tabs)/recipe");
      return;
    }

    try {
      const newRecipe = {
        name,
        prepTimeMinutes: Number(prepTime),
        cookTimeMinutes: Number(cookTime),
        rating: Number(rating),
        difficulty,
        ingredients,
        instructions,
      };

      const { data } = await axios.post("https://dummyjson.com/recipes/add", newRecipe);

      console.log("Created Recipe:", data);

      Alert.alert("Success", "Recipe created successfully!");
    } catch (error) {
      console.log("Failed to add recipe:", error);

      Alert.alert("Error", "Failed to add recipe. Please try again.");
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

  return (
    <LinearGradient colors={[COLOR.backgroundLight, COLOR.background]} style={styles.screen}>
      <Header btnBack title="Add Recipe" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Badge */}
        <Text style={styles.headerBadge}>ADD MODE</Text>
        {/* Title */}
        <View style={styles.heading}>
          <Text style={styles.title}>Add Recipe</Text>
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

          <Text style={styles.helperText}>Add the name of your recipe.</Text>

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
                style={[styles.input, { marginBottom: 10, flex: 1 }]}
                value={item}
                onChangeText={text => {
                  const updatedIngredients = [...ingredients];
                  updatedIngredients[index] = text;
                  setIngredients(updatedIngredients);
                }}
                placeholder={`Ingredient ${index + 1}`}
                placeholderTextColor={COLOR.secondaryText}
              />

              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => {
                    setIngredients(ingredients.filter((_, i) => i !== index));
                  }}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={19} color={COLOR.danger} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={() => setIngredients([...ingredients, ""])} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={18} style={styles.icon} />
            <Text style={styles.addButtonText}>Add Ingredient</Text>
          </TouchableOpacity>

          <Text style={[styles.label, { marginTop: 15 }]}>INSTRUCTIONS</Text>

          {instructions.map((item, index) => (
            <View key={index} style={styles.arrayRow}>
              <TextInput
                style={[styles.input, { marginBottom: 10, minHeight: 80, flex: 1 }]}
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

              {instructions.length > 1 && (
                <TouchableOpacity
                  onPress={() => {
                    setInstructions(instructions.filter((_, i) => i !== index));
                  }}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={19} color={COLOR.danger} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={() => setInstructions([...instructions, ""])} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={18} style={styles.icon} />
            <Text style={styles.addButtonText}>Add Step</Text>
          </TouchableOpacity>
        </View>
        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddRecipe;

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

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.beige,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 6,
  },

  addButtonText: {
    color: COLOR.secondary,
    fontSize: 12,
    fontWeight: "600",
  },

  icon: {
    color: COLOR.secondary,
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

  arrayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
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
    marginBottom: 10,
  },
});
