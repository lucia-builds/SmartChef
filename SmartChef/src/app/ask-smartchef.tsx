import { router } from "expo-router";
import { fetch } from "expo/fetch";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_BASE_URL = "http://192.168.29.177:5000";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AskSmartChefScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "👋 Hi! I'm SmartChef. Ask me anything about cooking, ingredients, or recipes.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to get AI response"
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.log("CHAT REQUEST ERROR:", error);

      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: "Sorry, I couldn't connect to SmartChef right now.",
        },
      ]);
    } finally {
      setLoading(false);
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

        <View>
          <Text style={styles.title}>Ask SmartChef</Text>
          <Text style={styles.subtitle}>
            Your AI cooking assistant
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item, index) => (
          <View
            key={index}
            style={
              item.role === "user"
                ? styles.userMessage
                : styles.aiMessage
            }
          >
            <Text style={styles.messageText}>
              {item.text}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={styles.aiMessage}>
            <ActivityIndicator color="#07915C" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask something..."
          placeholderTextColor="#8A968E"
          style={styles.input}
          multiline
          editable={!loading}
          onSubmitEditing={sendMessage}
        />

        <Pressable
          style={[
            styles.sendButton,
            loading && styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  backText: {
    color: "white",
    fontSize: 25,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#173B2A",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#68766E",
  },

  chatArea: {
    flex: 1,
  },

  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },

  aiMessage: {
    alignSelf: "flex-start",
    maxWidth: "85%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginBottom: 10,
  },

  userMessage: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: "#07915C",
    padding: 15,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    marginBottom: 10,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#333333",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E6EBE7",
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor: "#F1F5F2",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333333",
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#07915C",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  sendText: {
    color: "white",
    fontSize: 22,
  },

  disabledButton: {
    opacity: 0.6,
  },
});