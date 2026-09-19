import { File } from "expo-file-system";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
const [recipes, setRecipes] = useState<any[]>([]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>
          SmartChef needs camera access 📷
        </Text>

        <Text style={styles.permissionText}>
          Allow camera access so SmartChef can scan ingredients in your fridge.
        </Text>

        <Pressable
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>
            Allow Camera
          </Text>
        </Pressable>
      </View>
    );
  }

 const takePicture = async () => {
  if (!cameraRef.current || !cameraReady) {
    return;
  }

  try {
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
    });

    if (!photo) return;

    console.log("PHOTO URI:", photo.uri);

    const imageFile = new File(photo.uri);

    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await fetch(
      "http://192.168.29.177:5000/scan",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("SERVER RESPONSE:", data);

    if (data.success) {
  console.log("INGREDIENTS:", data.ingredients);

  setIngredients(data.ingredients);

  Alert.alert(
    "Success ✅",
    "Ingredients detected successfully!"
  );
} else {
      Alert.alert(
        "Error",
        data.message || "Image upload failed"
      );
    }
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    Alert.alert(
      "Upload Error",
      "Could not send image to backend."
    );
  }
};

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      />

      <View style={styles.topOverlay}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>Scan Ingredients</Text>
      </View>

      <View style={styles.scanGuide}>
        <Text style={styles.scanText}>
          Place your ingredients inside this area
        </Text>

        <View style={styles.scanBox} />
      </View>
     {ingredients.length > 0 && (
  <View style={styles.ingredientsContainer}>
    <Text style={styles.ingredientsTitle}>
      Ingredients Detected
    </Text>

    {ingredients.map((ingredient, index) => (
      <Text key={index} style={styles.ingredientText}>
        🥕 {ingredient}
      </Text>
    ))}

    <Pressable
  style={styles.cookButton}
  onPress={async () => {
    try {
      const response = await fetch(
        "http://192.168.29.177:5000/recipes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients: ingredients,
          }),
        }
      );

      const data = await response.json();

      console.log("RECIPE RESPONSE:", data);

      if (data.success) {
  console.log("RECIPES:", data.recipes);

  setRecipes(data.recipes);

  Alert.alert(
    "Recipes Ready! 🍳",
    `Gemini generated ${data.recipes.length} recipes.`
  );
} else {
        Alert.alert(
          "Recipe Error",
          data.message || "Could not generate recipes."
        );
      }
    } catch (error) {
      console.log("RECIPE REQUEST ERROR:", error);

      Alert.alert(
        "Connection Error",
        "Could not connect to the SmartChef backend."
      );
    }
  }}
>
  <Text style={styles.cookButtonText}>
    ✨ What Can I Cook?
  </Text>
</Pressable>
  </View>
)}

{recipes.length > 0 && (
  <View style={styles.recipesContainer}>
    <Text style={styles.recipesTitle}>
      🍳 Recipe Suggestions
    </Text>

    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.recipesContent}
    >
      {recipes.map((recipe, index) => (
        <View key={index} style={styles.recipeCard}>
          <Text style={styles.recipeName}>
            {recipe.name}
          </Text>

          <Text style={styles.recipeDescription}>
            {recipe.description}
          </Text>

          <Text style={styles.recipeSectionTitle}>
            Ingredients
          </Text>

          {recipe.ingredients.map(
            (ingredient: string, ingredientIndex: number) => (
              <Text
                key={ingredientIndex}
                style={styles.recipeIngredient}
              >
                • {ingredient}
              </Text>
            )
          )}

          <Text style={styles.recipeSectionTitle}>
            Cooking Steps
          </Text>

          {recipe.steps.map(
            (step: string, stepIndex: number) => (
              <Text
                key={stepIndex}
                style={styles.recipeStep}
              >
                {stepIndex + 1}. {step}
              </Text>
            )
          )}
        </View>
      ))}
    </ScrollView>
  </View>
)}


      <View style={styles.bottomControls}>
        <Text style={styles.helpText}>
          Point the camera at the ingredients in your fridge
        </Text>

        <Pressable
          style={styles.captureButton}
          onPress={takePicture}
        >
          <View style={styles.captureInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F7FAF5",
  },

  permissionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#173B2A",
    textAlign: "center",
  },

  permissionText: {
    fontSize: 16,
    color: "#68766E",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },

  permissionButton: {
    marginTop: 30,
    backgroundColor: "#07915C",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 15,
  },

  permissionButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  recipesContainer: {
  position: "absolute",
  top: "10%",
  left: 15,
  right: 15,
  bottom: 120,
  backgroundColor: "rgba(255,255,255,0.97)",
  borderRadius: 20,
  padding: 15,
  zIndex: 20,
},

recipesTitle: {
  fontSize: 22,
  fontWeight: "800",
  color: "#173B2A",
  marginBottom: 12,
},

recipeCard: {
  backgroundColor: "#F7FAF5",
  borderRadius: 16,
  padding: 15,
  marginBottom: 12,
},

recipeName: {
  fontSize: 18,
  fontWeight: "800",
  color: "#173B2A",
},

recipeDescription: {
  fontSize: 14,
  color: "#68766E",
  marginTop: 6,
  lineHeight: 20,
},

recipeSectionTitle: {
  fontSize: 15,
  fontWeight: "700",
  color: "#07915C",
  marginTop: 12,
  marginBottom: 5,
},

recipeIngredient: {
  fontSize: 14,
  color: "#333333",
  marginBottom: 3,
},

recipeStep: {
  fontSize: 14,
  color: "#333333",
  lineHeight: 20,
  marginBottom: 5,
},
recipesContent: {
  paddingBottom: 30,
},

  topOverlay: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "white",
    fontSize: 28,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 20,
  },

  scanGuide: {
    position: "absolute",
    top: "25%",
    left: 25,
    right: 25,
    alignItems: "center",
  },

  scanText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  scanBox: {
    width: "100%",
    height: 300,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 25,
  },
   ingredientsContainer: {
    position: "absolute",
    top: "18%",
    left: 25,
    right: 25,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    zIndex: 10,
  },

  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173B2A",
    marginBottom: 12,
  },

  ingredientText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  cookButton: {
  marginTop: 15,
  backgroundColor: "#07915C",
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: "center",
},

cookButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "700",
},

  bottomControls: {
    position: "absolute",
    bottom: 45,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  helpText: {
    color: "white",
    fontSize: 14,
    marginBottom: 20,
  },

  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "#07915C",
  },
});