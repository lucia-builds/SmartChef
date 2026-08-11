import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);

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

      if (photo) {
        console.log("PHOTO URI:", photo.uri);

        Alert.alert(
          "Photo captured! ✅",
          "SmartChef captured the fridge image successfully."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not capture the image.");
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