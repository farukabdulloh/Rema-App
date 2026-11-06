import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Header from "../../components/Header";
import RecipeItems from "../../components/RecipeItems";
import { COLOR } from "../../constants/colors";

export interface RecipeData {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

const CARD_WIDTH = Dimensions.get("window").width - 40;

const HomeTabs = () => {
  const [randomRecipe, setRandomRecipe] = useState<RecipeData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const carouselRef = useRef<FlatList<RecipeData> | null>(null);

  // Random starting position (0-40)
  const [randomSkip] = useState(() => Math.floor(Math.random() * 41));

  // Get Random Recipes
  const getRandomRecipe = async () => {
    try {
      const { data } = await axios.get(`https://dummyjson.com/recipes?limit=4&skip=${randomSkip}`);

      setRandomRecipe(data.recipes);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  // Initial Fetch
  useEffect(() => {
    getRandomRecipe();
  }, []);

  // Auto Slide
  useEffect(() => {
    if (randomRecipe.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % randomRecipe.length;

      carouselRef.current?.scrollToOffset({
        offset: nextIndex * CARD_WIDTH,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, randomRecipe.length, isDragging]);

  // Manual Swipe
  const handleScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);

    setActiveIndex(index);
    setIsDragging(false);
  };

  return (
    <LinearGradient colors={[COLOR.background, COLOR.backgroundLight]} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Header showProfile />

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.eyebrow}>TODAY'S SPECIAL</Text>

          <Text style={styles.heading}>Discover Recipes</Text>

          <Text style={styles.subtitle}>Find something delicious to make today.</Text>
        </View>

        {/* Featured Recipe Carousel */}
        <FlatList
          ref={carouselRef}
          data={randomRecipe}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index,
          })}
          onScrollBeginDrag={() => setIsDragging(true)}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item }) => (
            <View style={styles.featuredSlide}>
              <Pressable onPress={() => router.push(`/recipe/${item.id}`)} style={styles.card}>
                {/* Recipe Image */}
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.featuredImage} />

                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>FEATURED</Text>
                  </View>
                </View>

                {/* Recipe Information */}
                <View style={styles.titleContainer}>
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeLabel}>RECOMMENDED FOR YOU</Text>

                    <Text style={styles.title}>{item.name}</Text>
                  </View>

                  <View style={styles.bottomInfo}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoIcon}>◷</Text>

                      <Text style={styles.cookTime}>{item.cookTimeMinutes} min</Text>
                    </View>

                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.difficulty}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        />

        {/* Carousel Indicators */}
        <View style={styles.indicatorContainer}>
          {randomRecipe.map((item, index) => (
            <View key={item.id} style={[styles.indicator, activeIndex === index && styles.activeIndicator]} />
          ))}
        </View>

        {/* Explore More Header */}
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Explore More</Text>

            <Text style={styles.listSubtitle}>Recipes you might love</Text>
          </View>

          <View style={styles.listBadge}>
            <Text style={styles.listBadgeText}>50 RECIPES</Text>
          </View>
        </View>

        {/* Explore More Recipes */}
        <FlatList
          data={randomRecipe}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.carouselContent}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <RecipeItems id={item.id} name={item.name} image={item.image} cookTimeMinutes={item.cookTimeMinutes} />
            </View>
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeTabs;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 30,
  },

  sectionHeader: {
    marginBottom: 20,
    marginTop: 14,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    color: COLOR.secondary,
    marginBottom: 8,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: COLOR.primary,
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 13,
    color: COLOR.secondaryText,
    marginTop: 6,
    lineHeight: 19,
  },

  featuredSlide: {
    width: CARD_WIDTH,
  },

  card: {
    width: "100%",
    borderRadius: 22,
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

  imageWrapper: {
    width: "100%",
    height: 210,
    position: "relative",
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

  titleContainer: {
    padding: 18,
  },

  recipeInfo: {
    marginBottom: 16,
  },

  recipeLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: COLOR.brown,
    marginBottom: 7,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLOR.primary,
    lineHeight: 27,
    letterSpacing: -0.3,
  },

  bottomInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    fontSize: 18,
    color: COLOR.secondary,
    marginRight: 7,
  },

  cookTime: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.secondaryText,
  },

  categoryBadge: {
    backgroundColor: COLOR.beige,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLOR.secondary,
    letterSpacing: 0.3,
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    marginBottom: 8,
  },

  indicator: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLOR.border,
  },

  activeIndicator: {
    width: 20,
    backgroundColor: COLOR.accent,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 16,
  },

  listTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLOR.primary,
    letterSpacing: -0.3,
  },

  listSubtitle: {
    fontSize: 12,
    color: COLOR.secondaryText,
    marginTop: 4,
  },

  listBadge: {
    backgroundColor: COLOR.beige,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
  },

  listBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: COLOR.secondary,
  },

  carouselContent: {
    paddingRight: 20,
    paddingBottom: 20,
    gap: 14,
  },

  carouselItem: {
    width: 240,
  },
});
