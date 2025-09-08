import os
import json


class DietAssistant:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        food_items_path = os.path.join(current_dir, '..', 'data', 'food_items.json')
        meal_plans_path = os.path.join(current_dir, '..', 'data', 'meal_plans.json')

        self.food_items = self.load_data(food_items_path)
        self.meal_plans = self.load_data(meal_plans_path)
        self.user_profile = {}  # Initialize user profile

    def set_user_profile(self, profile):
        """Set the user profile with provided information."""
        self.user_profile = profile

    def load_data(self, filename):
        """Load data from a JSON file."""
        with open(filename, 'r') as file:
            return json.load(file)

    def calculate_calories(self):
        """Calculate Total Daily Energy Expenditure (TDEE)."""
        bmr = 10 * self.user_profile["weight"] + 6.25 * self.user_profile["height"] - 5 * self.user_profile["age"]
        if self.user_profile["gender"] == "male":
            bmr += 5
        else:
            bmr -= 161

        activity_multiplier = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725
        }

        tdee = bmr * activity_multiplier.get(self.user_profile["activity_level"], 1.2)
        return round(tdee)

    def calculate_bmi(self):
        """Calculate BMI (Body Mass Index) and return both BMI value and a message."""
        height_meters = self.user_profile["height"] / 100  # Convert height to meters
        bmi = self.user_profile["weight"] / (height_meters ** 2)

        # Categorize BMI
        if bmi < 18.5:
            return round(bmi, 2), "You are underweight."
        elif 18.5 <= bmi < 24.9:
            return round(bmi, 2), "You are in a healthy weight range."
        elif 25 <= bmi < 29.9:
            return round(bmi, 2), "You are overweight."
        else:
            return round(bmi, 2), "You are obese."

    def suggest_meal_plan(self):
        """Suggest a meal plan based on the user's goal."""
        goal = self.user_profile["goal"]
        meal_plan = self.meal_plans.get(goal)
        if not meal_plan:
            return "Sorry, no meal plans available for this goal."

        meals = []
        for meal in meal_plan:
            meal_details = {
                "meal": meal["meal"],
                "foods": []
            }
            for food in meal["foods"]:
                food_item = next((item for item in self.food_items if item["food"] == food), None)
                if food_item:
                    meal_details["foods"].append(food_item)
                else:
                    # If the food item isn't found in the food_items list
                    meal_details["foods"].append({"food": food, "calories": "N/A", "protein": "N/A"})
            meals.append(meal_details)

        return meals

    def display_suggested_meal_plan(self):
        """Display the suggested meal plan."""
        meal_plan = self.suggest_meal_plan()
        if isinstance(meal_plan, str):
            return meal_plan
        else:
            meal_plan_text = ""
            for meal in meal_plan:
                meal_plan_text += f"\n{meal['meal']}:\n"
                for food in meal['foods']:
                    meal_plan_text += f"- {food['food']} (Calories: {food['calories']}, Protein: {food['protein']}g)\n"
            return meal_plan_text
