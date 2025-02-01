import json
import requests
from collections import defaultdict
from typing import Dict, List, Tuple
import numpy as np
from datetime import datetime

class StudentAnalyzer:
    def __init__(self):
        self.quiz_data_url = "https://jsonkeeper.com/b/LLQT"
        self.submission_url = "https://api.jsonserve.com/rJvd7g"
        self.historical_url = "https://api.jsonserve.com/XgAgFJ"
        
    def fetch_data(self, url: str) -> dict:
        """Fetch data from API endpoint"""
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching data from {url}: {e}")
            return {}

    def analyze_current_quiz(self, user_id: str) -> Dict:
        """Analyze current quiz performance"""
        quiz_data = self.fetch_data(self.quiz_data_url)
        submission_data = self.fetch_data(self.submission_url)
        
        topic_performance = defaultdict(lambda: {"correct": 0, "total": 0})
        difficulty_performance = defaultdict(lambda: {"correct": 0, "total": 0})
        
        for question in quiz_data.get("questions", []):
            topic = question["topic"]
            difficulty = question["difficulty"]
            question_id = question["id"]
            
            # Check if answer was correct
            user_answer = submission_data.get("responses", {}).get(question_id)
            correct_answer = question["correct_option"]
            is_correct = user_answer == correct_answer
            
            # Update performance metrics
            topic_performance[topic]["total"] += 1
            difficulty_performance[difficulty]["total"] += 1
            
            if is_correct:
                topic_performance[topic]["correct"] += 1
                difficulty_performance[difficulty]["correct"] += 1
        
        return {
            "topic_performance": dict(topic_performance),
            "difficulty_performance": dict(difficulty_performance)
        }

    def analyze_historical_data(self, user_id: str) -> Dict:
        """Analyze historical quiz performance"""
        historical_data = self.fetch_data(self.historical_url)
        user_history = historical_data.get(user_id, [])
        
        trend_data = []
        for quiz in user_history:
            score = quiz["score"]
            date = quiz["date"]
            trend_data.append({"date": date, "score": score})
            
        return {
            "performance_trend": trend_data,
            "average_score": np.mean([q["score"] for q in user_history])
        }

    def generate_recommendations(self, user_id: str) -> Dict:
        """Generate personalized recommendations"""
        current_analysis = self.analyze_current_quiz(user_id)
        historical_analysis = self.analyze_historical_data(user_id)
        
        # Identify weak topics
        weak_topics = []
        for topic, perf in current_analysis["topic_performance"].items():
            accuracy = perf["correct"] / perf["total"] if perf["total"] > 0 else 0
            if accuracy < 0.6:  # Less than 60% accuracy
                weak_topics.append(topic)
        
        # Analyze difficulty progression
        difficulty_analysis = current_analysis["difficulty_performance"]
        
        recommendations = {
            "weak_topics": weak_topics,
            "suggested_difficulty": self._suggest_difficulty(difficulty_analysis),
            "improvement_areas": self._generate_improvement_areas(current_analysis),
            "study_plan": self._create_study_plan(weak_topics),
            "performance_summary": {
                "current_strengths": self._identify_strengths(current_analysis),
                "historical_trend": "improving" if self._is_improving(historical_analysis) else "needs_focus"
            }
        }
        
        return recommendations

    def predict_neet_rank(self, user_id: str) -> Dict:
        """Predict NEET rank based on performance"""
        historical_analysis = self.analyze_historical_data(user_id)
        current_analysis = self.analyze_current_quiz(user_id)
        
        # Simple prediction model (this should be replaced with a more sophisticated ML model)
        avg_score = historical_analysis["average_score"]
        current_accuracy = sum(p["correct"] for p in current_analysis["topic_performance"].values()) / \
                         sum(p["total"] for p in current_analysis["topic_performance"].values())
        
        # Simplified rank prediction (mock calculation)
        predicted_percentile = (avg_score * 0.7 + current_accuracy * 0.3) * 100
        predicted_rank = int((1 - predicted_percentile/100) * 2000000)  # Assuming 2M candidates
        
        return {
            "predicted_percentile": round(predicted_percentile, 2),
            "predicted_rank": predicted_rank,
            "confidence_level": "medium"
        }

    def _suggest_difficulty(self, difficulty_analysis: Dict) -> str:
        """Suggest next difficulty level"""
        accuracies = {
            level: perf["correct"]/perf["total"] if perf["total"] > 0 else 0
            for level, perf in difficulty_analysis.items()
        }
        
        if accuracies.get("hard", 0) > 0.7:
            return "hard"
        elif accuracies.get("medium", 0) > 0.7:
            return "hard"
        else:
            return "medium"

    def _generate_improvement_areas(self, analysis: Dict) -> List[str]:
        """Generate specific improvement areas"""
        areas = []
        for topic, perf in analysis["topic_performance"].items():
            accuracy = perf["correct"] / perf["total"] if perf["total"] > 0 else 0
            if accuracy < 0.4:
                areas.append(f"Critical review needed for {topic}")
            elif accuracy < 0.7:
                areas.append(f"Practice more questions in {topic}")
        return areas

    def _create_study_plan(self, weak_topics: List[str]) -> List[Dict]:
        """Create a structured study plan"""
        study_plan = []
        for topic in weak_topics:
            study_plan.append({
                "topic": topic,
                "recommended_hours": 4,
                "resource_type": "video_lectures",
                "practice_questions": 50
            })
        return study_plan

    def _identify_strengths(self, analysis: Dict) -> List[str]:
        """Identify student's strengths"""
        strengths = []
        for topic, perf in analysis["topic_performance"].items():
            accuracy = perf["correct"] / perf["total"] if perf["total"] > 0 else 0
            if accuracy >= 0.8:
                strengths.append(topic)
        return strengths

    def _is_improving(self, historical_analysis: Dict) -> bool:
        """Check if performance is improving"""
        trend = historical_analysis["performance_trend"]
        if len(trend) < 2:
            return False
        return trend[-1]["score"] > trend[0]["score"]