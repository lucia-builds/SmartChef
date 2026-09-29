import { parseRecipe } from "../types/recipe";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

export default function RecipeDetailsScreen() {
  const { recipe } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  const recipeData = parseRecipe(recipe);

  if (!recipeData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Recipe Details</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Recipe not found.</Text>
        </View>
      </View>
    );
  }
  useEffect(() => {
  const checkSavedRecipe = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedRecipes");

      if (!saved || !recipeData) return;

      const savedRecipes = JSON.parse(saved);

      const alreadySaved = savedRecipes.some(
        (item: any) => item.name === recipeData.name
      );

      setIsSaved(alreadySaved);
    } catch (error) {
      console.log("CHECK SAVED RECIPE ERROR:", error);
    }
  };

  checkSavedRecipe();
}, [recipeData?.name]);

const toggleSaveRecipe = async () => {
  try {
    const saved = await AsyncStorage.getItem("savedRecipes");

    let savedRecipes = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      savedRecipes = savedRecipes.filter(
        (item: any) => item.name !== recipeData.name
      );

      await AsyncStorage.setItem(
        "savedRecipes",
        JSON.stringify(savedRecipes)
      );

      setIsSaved(false);
    } else {
      savedRecipes.push(recipeData);

      await AsyncStorage.setItem(
        "savedRecipes",
        JSON.stringify(savedRecipes)
      );

      setIsSaved(true);
    }
  } catch (error) {
    console.log("SAVE RECIPE ERROR:", error);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          Recipe Details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <Text style={styles.recipeName}>
            {recipeData.name}
          </Text>

          <Pressable
  style={styles.saveButton}
  onPress={toggleSaveRecipe}
>
  <Text style={styles.saveButtonText}>
    {isSaved ? "❤️ Saved" : "♡ Save Recipe"}
  </Text>
</Pressable>
 <Pressable
  style={styles.savedRecipesButton}
  onPress={() => router.push("/saved-recipes")}
>
  <Text style={styles.savedRecipesButtonText}>
    📚 View Saved Recipes
  </Text>
</Pressable>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🥕 Ingredients
          </Text>

          {recipeData.ingredients?.map(
            (ingredient: string, index: number) => (
              <View
                key={index}
                style={styles.ingredientRow}
              >
                <Text style={styles.check}>
                  ✓
                </Text>

                <Text style={styles.ingredientText}>
                  {ingredient}
                </Text>
              </View>
            )
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            👩‍🍳 Cooking Steps
          </Text>

          {recipeData.steps?.map(
            (step: string, index: number) => (
              <View
                key={index}
                style={styles.stepRow}
              >
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>
                    {index + 1}
                  </Text>
                </View>

                <Text style={styles.stepText}>
                  {step}
                </Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "white",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#173B2A",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "white",
    fontSize: 25,
  },

  headerTitle: {
    marginLeft: 15,
    fontSize: 21,
    fontWeight: "800",
    color: "#173B2A",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  recipeName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#173B2A",
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#68766E",
  },

  section: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#07915C",
    marginBottom: 14,
  },

  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  check: {
    fontSize: 17,
    fontWeight: "800",
    color: "#07915C",
    width: 25,
  },

  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#07915C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  stepNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  },

  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#333333",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#68766E",
    fontSize: 16,
  },
  saveButton: {
  marginTop: 18,
  backgroundColor: "#07915C",
  paddingVertical: 13,
  borderRadius: 12,
  alignItems: "center",
},

saveButtonText: {
  color: "white",
  fontSize: 15,
  fontWeight: "700",
},
savedRecipesButton: {
  marginTop: 10,
  paddingVertical: 12,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#07915C",
  alignItems: "center",
},

savedRecipesButtonText: {
  color: "#07915C",
  fontSize: 15,
  fontWeight: "700",
},
});