from analysis import StudentAnalyzer
import json

def main():
    analyzer = StudentAnalyzer()
    user_id = "12345"  # Example user ID
    
    # Generate comprehensive analysis
    recommendations = analyzer.generate_recommendations(user_id)
    rank_prediction = analyzer.predict_neet_rank(user_id)
    
    # Combine results
    analysis_result = {
        "recommendations": recommendations,
        "rank_prediction": rank_prediction
    }
    
    # Print formatted results
    print(json.dumps(analysis_result, indent=2))

if __name__ == "__main__":
    main()