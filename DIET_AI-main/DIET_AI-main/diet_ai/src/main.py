from ai_brain import DietAssistant

def get_user_input():
    """Function to ask the user for input data."""
    print("Please enter the following details:")

    age = int(input("Age (in years): "))
    weight = float(input("Weight (in kg): "))
    height = float(input("Height (in cm): "))
    gender = input("Gender (male/female): ").lower()
    goal = input("Goal (gain/lose/maintain): ").lower()
    activity_level = input("Activity level (sedentary, light, moderate, active): ").lower()

    user_info = {
        "age": age,
        "weight": weight,
        "height": height,
        "gender": gender,
        "goal": goal,
        "activity_level": activity_level
    }

    return user_info

def main():
    assistant = DietAssistant()

    # Get user input to build the user profile
    user_info = get_user_input()

    # Set the user profile for the assistant
    assistant.set_user_profile(user_info)

    # Calculate and print BMI
    bmi_message = assistant.calculate_bmi()
    print(f"\n{bmi_message}")

    # Calculate Total Daily Energy Expenditure (TDEE)
    tdee = assistant.calculate_calories()
    print(f"\nYour estimated TDEE (calories needed per day) is: {tdee:.2f} kcal")

    # Display the suggested meal plan based on the user's goal
    meal_plan = assistant.display_suggested_meal_plan()
    print("\nSuggested Meal Plan:")
    print(meal_plan)

if __name__ == "__main__":
    main()
