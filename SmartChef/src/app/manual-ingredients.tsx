import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch } from "expo/fetch";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ManualIngredientsScreen() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
const [loadingRecipes, setLoadingRecipes] = useState(false);

  const addIngredient = () => {
    const value = input.trim();

    if (!value) return;

    const alreadyExists = ingredients.some(
      (ingredient) =>
        ingredient.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
      setInput("");
      return;
    }

    setIngredients((current) => [...current, value]);
    setInput("");
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients((current) =>
      current.filter(
        (ingredient) => ingredient !== ingredientToRemove
      )
    );
  };
const findRecipes = async () => {
  if (loadingRecipes || ingredients.length === 0) {
    return;
  }

  setLoadingRecipes(true);

  try {
    const response = await fetch(
      "http://192.168.29.177:5000/recipes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
        }),
      }
    );

    const data = await response.json();

    if (
      !response.ok ||
      !data.success ||
      !Array.isArray(data.recipes)
    ) {
      Alert.alert(
        "Recipe Error",
        data.message || "Could not generate recipes."
      );
      return;
    }

    const recipes = data.recipes;

    try {
      const existingRecent =
        await AsyncStorage.getItem("recentRecipes");

      const previousRecipes = existingRecent
        ? JSON.parse(existingRecent)
        : [];

      const updatedRecipes = [
        ...recipes,
        ...previousRecipes,
      ];

      await AsyncStorage.setItem(
        "recentRecipes",
        JSON.stringify(updatedRecipes.slice(0, 6))
      );
    } catch (storageError) {
      console.log(
        "SAVE RECENT RECIPES ERROR:",
        storageError
      );
    }

    router.push({
      pathname: "/recipes",
      params: {
        recipes: JSON.stringify(recipes),
      },
    });
  } catch (error) {
    console.log("MANUAL RECIPE REQUEST ERROR:", error);

    Alert.alert(
      "Connection Error",
      "Could not connect to the SmartChef backend."
    );
  } finally {
    setLoadingRecipes(false);
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

        <Text style={styles.title}>
          🥕 Enter Ingredients
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>
          What ingredients do you have?
        </Text>

        <Text style={styles.subtitle}>
          Add the ingredients you have, and SmartChef will
          suggest recipes.
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="e.g. Tomato"
            placeholderTextColor="#8A968E"
            style={styles.input}
            onSubmitEditing={addIngredient}
            returnKeyType="done"
          />

          <Pressable
            style={styles.addButton}
            onPress={addIngredient}
          >
            <Text style={styles.addButtonText}>
              Add
            </Text>
          </Pressable>
        </View>

        <Text style={styles.countText}>
          {ingredients.length} ingredient
          {ingredients.length !== 1 ? "s" : ""}
        </Text>

        {ingredients.length > 0 && (
          <View style={styles.ingredientsList}>
            {ingredients.map((ingredient, index) => (
              <View
                key={`${ingredient}-${index}`}
                style={styles.ingredientChip}
              >
                <Text style={styles.ingredientText}>
                  {ingredient}
                </Text>

                <Pressable
                  onPress={() => removeIngredient(ingredient)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>
                    ×
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tipBox}>
  <Text style={styles.tipTitle}>
    💡 Tip
  </Text>

  <Text style={styles.tipText}>
    Try adding ingredients like eggs, tomato,
    cheese, onion, potato, or spinach.
  </Text>
</View>

<Pressable
  disabled={ingredients.length === 0 || loadingRecipes}
  style={[
    styles.cookButton,
    (ingredients.length === 0 || loadingRecipes) &&
      styles.disabledButton,
  ]}
  onPress={findRecipes}
>
  {loadingRecipes ? (
    <View style={styles.loadingContent}>
      <ActivityIndicator color="white" />

      <Text style={styles.cookButtonText}>
        Finding Recipes...
      </Text>
    </View>
  ) : (
    <Text style={styles.cookButtonText}>
      ✨ What Can I Cook?
    </Text>
  )}
</Pressable>
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
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#173B2A",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#68766E",
  },

  inputRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DDE5DE",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333333",
  },

  addButton: {
    backgroundColor: "#07915C",
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  countText: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: "600",
    color: "#68766E",
  },

  ingredientsList: {
    marginTop: 12,
  },

  ingredientChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6EBE7",
  },

  ingredientText: {
    fontSize: 16,
    color: "#23372B",
  },

  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EDF4EF",
    justifyContent: "center",
    alignItems: "center",
  },

  removeText: {
    fontSize: 20,
    color: "#68766E",
  },

  tipBox: {
    marginTop: 20,
    backgroundColor: "#EDF4EF",
    borderRadius: 16,
    padding: 16,
  },

  tipTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173B2A",
  },

  tipText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#68766E",
  },
  cookButton: {
  marginTop: 20,
  backgroundColor: "#07915C",
  paddingVertical: 16,
  borderRadius: 14,
  alignItems: "center",
},

cookButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "700",
},

loadingContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

disabledButton: {
  opacity: 0.6,
},
});