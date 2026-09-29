import { router, useLocalSearchParams } from "expo-router";
import { parseRecipes } from "../types/recipe";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

export default function RecipesScreen() {
  const { recipes } = useLocalSearchParams();
  const recipeList = parseRecipes(recipes);

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
        <Text style={styles.title}>Recipe Suggestions</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {recipeList.map((recipe, index) => (
          <View key={index} style={styles.recipeCard}>
            <Pressable
              style={styles.viewRecipeButton}
              onPress={() => {
                router.push({
                  pathname: "/recipe-details",
                  params: { recipe: JSON.stringify(recipe) },
                });
              }}
            >
              <Text style={styles.viewRecipeButtonText}>View Recipe →</Text>
            </Pressable>
            <Text style={styles.recipeName}>
              {recipe.name}
            </Text>

            <Text style={styles.recipeDescription}>
              {recipe.description}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>
              Ingredients
            </Text>

            {recipe.ingredients?.map(
              (ingredient: string, ingredientIndex: number) => (
                <Text
                  key={ingredientIndex}
                  style={styles.ingredient}
                >
                  • {ingredient}
                </Text>
              )
            )}

            <Text style={styles.sectionTitle}>
              Cooking Steps
            </Text>

            {recipe.steps?.map(
              (step: string, stepIndex: number) => (
                <Text
                  key={stepIndex}
                  style={styles.step}
                >
                  {stepIndex + 1}. {step}
                </Text>
              )
            )}
          </View>
        ))}
        {recipeList.length === 0 && (
          <Text style={styles.emptyText}>
            No recipes are available. Scan ingredients and try again.
          </Text>
        )}
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

  title: {
    marginLeft: 15,
    fontSize: 21,
    fontWeight: "800",
    color: "#173B2A",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  recipeCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  recipeName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173B2A",
  },

  recipeDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#68766E",
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5EAE6",
    marginVertical: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#07915C",
    marginTop: 8,
    marginBottom: 6,
  },

  ingredient: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },

  step: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 21,
    marginBottom: 7,
  },
  viewRecipeButton: {
  marginTop: 15,
  backgroundColor: "#07915C",
  paddingVertical: 13,
  borderRadius: 12,
  alignItems: "center",
},

viewRecipeButtonText: {
  color: "white",
  fontSize: 15,
  fontWeight: "700",
},
  emptyText: {
    color: "#68766E",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
});