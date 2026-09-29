import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SavedRecipesScreen() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);

  const loadSavedRecipes = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedRecipes");

      setSavedRecipes(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.log("LOAD SAVED RECIPES ERROR:", error);
    }
  };

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>❤️ Saved Recipes</Text>
      </View>

      {savedRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🍳</Text>

          <Text style={styles.emptyTitle}>
            No saved recipes yet
          </Text>

          <Text style={styles.emptyText}>
            Save a recipe and it will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedRecipes}
          keyExtractor={(item, index) =>
            `${item.name}-${index}`
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Text style={styles.recipeName}>
                {item.name}
              </Text>

              <Text
                style={styles.description}
                numberOfLines={3}
              >
                {item.description}
              </Text>

              <Pressable
                style={styles.viewButton}
                onPress={() => {
                  router.push({
                    pathname: "/recipe-details",
                    params: {
                      recipe: encodeURIComponent(
                        JSON.stringify(item)
                      ),
                    },
                  });
                }}
              >
                <Text style={styles.viewButtonText}>
                  View Recipe →
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
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

  list: {
    padding: 16,
    paddingBottom: 30,
  },

  recipeCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  recipeName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173B2A",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#68766E",
  },

  viewButton: {
    marginTop: 15,
    backgroundColor: "#07915C",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  viewButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#173B2A",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: "#68766E",
    textAlign: "center",
  },
});