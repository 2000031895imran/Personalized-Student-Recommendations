# Personalized-Student-Recommendations


## Overview
This project aims to analyze student quiz performance and provide personalized recommendations to help improve their NEET exam preparation. The system utilizes both current and historical quiz data to generate insights, identify weak areas, and suggest actionable steps for improvement.

## App Link
[NEET Testline - Google Play](https://play.google.com/store/apps/details?id=com.neettestline)

## Features
- **Performance Analysis:** Evaluate students' quiz results across multiple attempts.
- **Insights Generation:** Identify strengths, weaknesses, and trends in performance.
- **Personalized Recommendations:** Provide actionable tips based on quiz data.
- **Student Persona Profiling:** Categorize students based on their response patterns.
- **Probabilistic Rank Prediction:** Predict NEET ranks using a probabilistic model based on quiz performance and historical NEET results.

## Data Sources
### 1. Current Quiz Data
- Latest quiz submission details.
- Questions, topics, selected responses.
- API Endpoint: `quiz_submission_data`

### 2. Historical Quiz Data
- Last 5 quiz results per user.
- Score trends and response accuracy.
- API Endpoint: `historical_quiz_data`

## Implementation Steps
### 1. Data Analysis
- Fetch and preprocess quiz data.
- Identify trends in topic-wise performance and difficulty levels.

### 2. Insights Generation
- Highlight weak areas based on incorrect responses.
- Track improvement trends over the last 5 quizzes.
- Detect performance gaps and knowledge inconsistencies.

### 3. Recommendations Engine
- Suggest topics and question types to focus on.
- Recommend practice strategies based on past errors.
- Adjust difficulty levels based on current progress.

### 4. Student Persona Profiling (Bonus Feature)
- Categorize students (e.g., "Concept Master", "Needs Practice", "Time-Struggler").
- Assign personalized labels based on strengths and weaknesses.

### 5. Rank Prediction Model (Bonus Feature)
- Use a probabilistic approach to estimate NEET rank.
- Incorporate past quiz performance and previous year NEET results.

## Technologies Used
- **Python** (Data processing and analysis)
- **Pandas, NumPy** (Data manipulation)
- **Scikit-learn** (Modeling and prediction)
- **Flask/FastAPI** (API development for data processing)
- **Matplotlib, Seaborn** (Visualization)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personalized-student-recommendations.git
   cd personalized-student-recommendations
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure API endpoints for data retrieval.
4. Run the application:
   ```bash
   python app.py
   ```

## Future Enhancements
- Improve rank prediction accuracy with advanced ML models.
- Integrate adaptive learning techniques.
- Expand support for additional exam types.

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License
This project is licensed under the MIT License.

THE OUTPUT OF HTE ABOVE PROJECT 

![image](https://github.com/user-attachments/assets/b163f40f-98a8-4454-b478-8ac46ef016ce)
