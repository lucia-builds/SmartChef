# SmartChef — Intelligent Recipe Recommendation System

SmartChef is a **mobile-integrated recipe recommendation application** designed to help users decide what to prepare based on the ingredients available at home.

The application allows users to **capture an image of their refrigerator using a mobile device**. The system processes the image to identify available ingredients and generates suitable recipe recommendations for **breakfast, lunch, or dinner**.

## Key Features

* **Refrigerator Image Capture:** Capture ingredient images directly through a mobile device.
* **Ingredient Identification:** Analyze captured images to detect available food ingredients.
* **Recipe Recommendations:** Generate recipe suggestions based on the identified ingredients.
* **Meal-Based Suggestions:** Provide recommendations for breakfast, lunch, and dinner.
* **Mobile Integration:** Integrated with **Expo Go** for mobile image capture and interaction.
* **Responsive User Interface:** Designed for a smooth experience across different screen sizes.

## System Workflow

```text
Mobile Image Capture
        ↓
Image Processing
        ↓
Ingredient Identification
        ↓
Available Ingredients
        ↓
Recipe Recommendation
        ↓
Breakfast | Lunch | Dinner
```

## Technology Stack

| Category           | Technologies                      |
| ------------------ | --------------------------------- |
| Frontend           | React.js, JavaScript, HTML5, CSS3 |
| Backend            | Node.js, Express.js               |
| Database           | MongoDB                           |
| Mobile Integration | Expo Go / React Native            |
| Image Processing   | Computer Vision / Image Analysis  |

## Project Objective

The primary objective of SmartChef is to reduce the time and effort required to decide what to cook by **converting available household ingredients into practical meal recommendations**.

Instead of manually searching for recipes, users can capture their available ingredients and receive relevant suggestions based on the detected items.

## Future Enhancements

* Personalized recommendations based on dietary preferences
* Nutritional and calorie information
* Vegetarian, vegan, and other dietary filters
* Automated grocery-list generation
* Improved ingredient recognition and recommendation accuracy

## Project Structure

```text
SmartChef/
├── frontend/
├── backend/
├── mobile/
├── README.md
└── package.json
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/SmartChef.git
cd SmartChef
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

For the mobile component, use **Expo Go** to connect the application to a mobile device.

## Author

**Anwesha Sural**

Computer Science & Engineering Undergraduate
Full-Stack Developer | React.js | Node.js | Python
