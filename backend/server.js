require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer=require("multer");
const { GoogleGenAI } = require("@google/genai");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const upload = multer({
  storage: multer.memoryStorage(),
});


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "SmartChef backend is running 🚀",
  });
});

// Image upload endpoint
app.post("/scan", upload.single("image"), async (req, res) => {
  console.log("SCAN REQUEST RECEIVED");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image received",
      });
    }

    console.log("IMAGE RECEIVED");
    console.log("File type:", req.file.mimetype);
    console.log("File size:", req.file.size);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
          },
        },
        {
          text: `
            Look at this image carefully.

            Identify the food ingredients that are clearly
            visible in the image.

            Return ONLY a JSON object in this format:

            {
              "ingredients": [
                "ingredient 1",
                "ingredient 2",
                "ingredient 3"
              ]
            }

            Do not include cooking utensils, containers,
            shelves, packaging, or non-food objects.

            Only include ingredients you can reasonably identify.
          `,
        },
      ],
    });

    console.log("GEMINI RESPONSE:");
    console.log(result.text);

let cleanedText = result.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const ingredientsData = JSON.parse(cleanedText);

res.json({
  success: true,
  ingredients: ingredientsData.ingredients,
});

  } catch (error) {
    console.error("GEMINI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze image",
      error: error.message,
    });
  }
});

// Recipe generation endpoint
app.post("/recipes", async (req, res) => {
  console.log("RECIPE REQUEST RECEIVED");

  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No ingredients provided",
      });
    }

    console.log("INGREDIENTS FOR RECIPE:", ingredients);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
You are SmartChef, an AI cooking assistant.

The user has these available ingredients:
${ingredients.join(", ")}

Suggest 3 recipes that can reasonably be prepared using these ingredients.

You may assume basic pantry items such as salt, oil, pepper and common spices.

Return ONLY a JSON object in this exact format:

{
  "recipes": [
    {
      "name": "Recipe name",
      "description": "Short description",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": [
        "Step 1",
        "Step 2",
        "Step 3"
      ]
    }
  ]
}

Do not include markdown.
Do not include text outside the JSON object.
          `,
        },
      ],
    });

    console.log("RECIPE GEMINI RESPONSE:");
    console.log(result.text);

    let cleanedText = result.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const recipesData = JSON.parse(cleanedText);

    res.json({
      success: true,
      recipes: recipesData.recipes,
    });

  } catch (error) {
    console.error("RECIPE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate recipes",
      error: error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SmartChef server running on port ${PORT}`);
});