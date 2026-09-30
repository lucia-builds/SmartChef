import { File } from "expo-file-system";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch } from "expo/fetch";
import { router } from "expo-router";
import { useCallback,useRef, useState } from "react";
import { isRecipe } from "../types/recipe";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_BASE_URL = "http://192.168.29.177:5000";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function responseMessage(value: unknown, fallback: string): string {
  return isRecord(value) && typeof value.message === "string"
    ? value.message
    : fallback;
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

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
    if (!cameraRef.current || !cameraReady || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const formData = new FormData();
      formData.append("image", new File(photo.uri), "ingredients.jpg");

      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        body: formData,
      });
      const data: unknown = await response.json();

      if (
        !response.ok ||
        !isRecord(data) ||
        data.success !== true ||
        !Array.isArray(data.ingredients)
      ) {
        Alert.alert("Scan Error", responseMessage(data, "Image upload failed."));
        return;
      }

      const detectedIngredients = data.ingredients.filter(
        (ingredient): ingredient is string => typeof ingredient === "string"
      );

      if (detectedIngredients.length === 0) {
        Alert.alert("No Ingredients Found", "Try another photo with ingredients clearly visible.");
        return;
      }

      setIngredients(detectedIngredients);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      Alert.alert("Upload Error", "Could not send image to the backend.");
    } finally {
      setIsCapturing(false);
    }
  };

  const findRecipes = async () => {
    if (loadingRecipes || ingredients.length === 0) {
      return;
    }

    setLoadingRecipes(true);

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data: unknown = await response.json();

      if (
        !response.ok ||
        !isRecord(data) ||
        data.success !== true ||
        !Array.isArray(data.recipes)
      ) {
        Alert.alert("Recipe Error", responseMessage(data, "Could not generate recipes."));
        return;
      }

      const recipes = data.recipes.filter(isRecipe);

      if (recipes.length === 0) {
  Alert.alert("Recipe Error", "The backend did not return any valid recipes.");
  return;
}

try {
  const existingRecent = await AsyncStorage.getItem("recentRecipes");

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
} catch (error) {
  console.log("SAVE RECENT RECIPES ERROR:", error);
}

router.push({
  pathname: "/recipes",
  params: { recipes: JSON.stringify(recipes) },
});
    } catch (error) {
      console.log("RECIPE REQUEST ERROR:", error);
      Alert.alert("Connection Error", "Could not connect to the SmartChef backend.");
    } finally {
      setLoadingRecipes(false);
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
          <Text style={styles.ingredientsTitle}>Ingredients Detected</Text>
          {ingredients.map((ingredient, index) => (
            <Text key={`${ingredient}-${index}`} style={styles.ingredientText}>
              {ingredient}
            </Text>
          ))}
          <Pressable
            accessibilityRole="button"
            disabled={loadingRecipes}
            style={[styles.cookButton, loadingRecipes && styles.disabledButton]}
            onPress={findRecipes}
          >
            <Text style={styles.cookButtonText}>
              {loadingRecipes ? "Finding Recipes..." : "What Can I Cook?"}
            </Text>
          </Pressable>
        </View>
      )}


      <View style={styles.bottomControls}>
        <Text style={styles.helpText}>
          {isCapturing ? "Scanning ingredients..." : "Point the camera at your ingredients"}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take ingredient photo"
          disabled={!cameraReady || isCapturing}
          style={[styles.captureButton, (!cameraReady || isCapturing) && styles.disabledButton]}
          onPress={takePicture}
        >
          {isCapturing ? (
            <ActivityIndicator color="#07915C" />
          ) : (
            <View style={styles.captureInner} />
          )}
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

  disabledButton: {
    opacity: 0.6,
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