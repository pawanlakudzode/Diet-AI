from flask import Flask, jsonify, request
from flask_cors import CORS  # Add CORS to handle cross-origin requests
from src.ai_brain import DietAssistant

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for all routes

@app.route('/api/diet', methods=['POST'])
def get_diet():
    # Get user input from the request (frontend)
    data = request.json

    # Initialize the DietAssistant
    assistant = DietAssistant()

    # Updating user profile with incoming data
    assistant.user_profile["age"] = data.get('age', assistant.user_profile.get('age'))
    assistant.user_profile["weight"] = data.get('weight', assistant.user_profile.get('weight'))
    assistant.user_profile["height"] = data.get('height', assistant.user_profile.get('height'))
    assistant.user_profile["gender"] = data.get('gender', assistant.user_profile.get('gender'))
    assistant.user_profile["goal"] = data.get('goal', assistant.user_profile.get('goal'))
    assistant.user_profile["activity_level"] = data.get('activity_level', assistant.user_profile.get('activity_level'))

    # Calculate BMI
    bmi, bmi_message = assistant.calculate_bmi()

    # Calculate TDEE (calories needed)
    tdee = assistant.calculate_calories()

    # Get meal plan based on the user's goal
    meal_plan = assistant.suggest_meal_plan()

    # If meal plan is a string (error message)
    if isinstance(meal_plan, str):
        return jsonify({"error": meal_plan}), 400

    # Return the result in JSON format
    return jsonify({
        "bmi": bmi,
        "bmi_message": bmi_message,
        "tdee": tdee,
        "meal_plan": meal_plan
    })

if __name__ == '__main__':
    app.run(debug=True)
