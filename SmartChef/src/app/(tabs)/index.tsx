import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🍳 SmartChef</Text>
          <Text style={styles.subtitle}>Your AI Cooking Assistant</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            What do you want to cook today?
          </Text>

          <Text style={styles.heroText}>
            Scan your ingredients and let SmartChef suggest delicious meals.
          </Text>
        </View>

     <TouchableOpacity
  style={styles.primaryButton}
  onPress={() => {
    console.log("SCAN BUTTON PRESSED");
    router.push("/camera");
  }}
>
  <Text style={styles.buttonIcon}>📷</Text>

  <View>
    <Text style={styles.primaryButtonTitle}>Scan My Fridge</Text>
    <Text style={styles.primaryButtonText}>
      Detect ingredients using your camera
    </Text>
  </View>
</TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionIcon}>🥕</Text>

          <View>
            <Text style={styles.optionTitle}>Enter Ingredients</Text>
            <Text style={styles.optionText}>
              Add ingredients manually
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionIcon}>🎤</Text>

          <View>
            <Text style={styles.optionTitle}>Ask SmartChef</Text>
            <Text style={styles.optionText}>
              Talk with your AI cooking assistant
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recipes</Text>

          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>
              Your recently generated recipes will appear here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF5",
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    marginTop: 20,
    marginBottom: 35,
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#173B2A",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
    color: "#6B7C72",
  },

  hero: {
    marginBottom: 28,
  },

  heroTitle: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    color: "#17261E",
  },

  heroText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#68766E",
  },

  primaryButton: {
    backgroundColor: "#2F855A",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  buttonIcon: {
    fontSize: 32,
    marginRight: 17,
  },

  primaryButtonTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "white",
  },

  primaryButtonText: {
    color: "#E1F2E8",
    marginTop: 4,
    fontSize: 13,
  },

  optionButton: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E6EBE7",
  },

  optionIcon: {
    fontSize: 29,
    marginRight: 16,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#23372B",
  },

  optionText: {
    marginTop: 4,
    color: "#748078",
    fontSize: 13,
  },

  section: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#23372B",
    marginBottom: 15,
  },

  emptyBox: {
    backgroundColor: "#EDF4EF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyText: {
    marginTop: 10,
    textAlign: "center",
    color: "#738077",
    lineHeight: 20,
  },
});