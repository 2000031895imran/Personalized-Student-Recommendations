import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Target, 
  Brain,
  ChevronUp,
  ChevronDown,
  BookMarked,
  GraduationCap
} from 'lucide-react';

// Mock data to ensure reliable display
const MOCK_QUIZ_DATA = {
  questions: [
    { id: "q1", topic: "Physics", difficulty: "medium", correct_option: "a" },
    { id: "q2", topic: "Chemistry", difficulty: "hard", correct_option: "b" },
    { id: "q3", topic: "Biology", difficulty: "medium", correct_option: "c" },
    { id: "q4", topic: "Physics", difficulty: "easy", correct_option: "b" },
    { id: "q5", topic: "Chemistry", difficulty: "medium", correct_option: "a" }
  ]
};

const MOCK_SUBMISSION_DATA = {
  responses: {
    "q1": "a",
    "q2": "c",
    "q3": "c",
    "q4": "b",
    "q5": "d"
  }
};

const MOCK_HISTORICAL_DATA = {
  "user123": [
    { score: 65, date: "2024-02-01" },
    { score: 70, date: "2024-02-08" },
    { score: 75, date: "2024-02-15" },
    { score: 72, date: "2024-02-22" },
    { score: 78, date: "2024-02-29" }
  ]
};

interface QuizData {
  questions: Array<{
    id: string;
    topic: string;
    difficulty: string;
    correct_option: string;
  }>;
}

interface SubmissionData {
  responses: Record<string, string>;
}

interface HistoricalData {
  [key: string]: Array<{
    score: number;
    date: string;
  }>;
}

interface AnalyzedData {
  recommendations: {
    weak_topics: string[];
    suggested_difficulty: string;
    improvement_areas: string[];
    study_plan: Array<{
      topic: string;
      recommended_hours: number;
      resource_type: string;
      practice_questions: number;
    }>;
    performance_summary: {
      current_strengths: string[];
      historical_trend: string;
    };
  };
  rank_prediction: {
    predicted_percentile: number;
    predicted_rank: number;
    confidence_level: string;
  };
}

function StatCard({ title, value, icon: Icon, trend = null }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-start justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <div className={`mt-2 flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span className="ml-1">{trend === 'up' ? 'Improving' : 'Needs Focus'}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon size={24} className="text-blue-600" />
      </div>
    </div>
  );
}

function RecommendationCard({ title, items, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg mr-3">
          <Icon size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-600" />
            <span className="ml-3 text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudyPlanCard({ plans }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-50 rounded-lg mr-3">
          <BookMarked size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Personalized Study Plan</h3>
      </div>
      <div className="space-y-6">
        {plans.map((plan, index) => (
          <div key={index} className="border-l-4 border-blue-600 pl-4">
            <h4 className="font-medium text-gray-900">{plan.topic}</h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Recommended Hours</p>
                <p className="mt-1 font-medium">{plan.recommended_hours} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Practice Questions</p>
                <p className="mt-1 font-medium">{plan.practice_questions} questions</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function App() {
  const [data, setData] = useState<AnalyzedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API delay for a more realistic experience
    setTimeout(() => {
      try {
        const analyzedData = analyzeData(MOCK_QUIZ_DATA, MOCK_SUBMISSION_DATA, MOCK_HISTORICAL_DATA);
        setData(analyzedData);
      } catch (err) {
        setError('An error occurred while analyzing the data. Please try again later.');
        console.error('Error analyzing data:', err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

  function analyzeData(quizData: QuizData, submissionData: SubmissionData, historicalData: HistoricalData): AnalyzedData {
    // Group questions by topic
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    const weakTopics: string[] = [];
    const strengths: string[] = [];

    quizData.questions.forEach(question => {
      const topic = question.topic;
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }

      topicPerformance[topic].total++;
      if (submissionData.responses[question.id] === question.correct_option) {
        topicPerformance[topic].correct++;
      }
    });

    // Analyze topic performance
    Object.entries(topicPerformance).forEach(([topic, performance]) => {
      const accuracy = performance.correct / performance.total;
      if (accuracy < 0.6) {
        weakTopics.push(topic);
      } else if (accuracy >= 0.8) {
        strengths.push(topic);
      }
    });

    // Calculate overall performance for rank prediction
    const totalCorrect = Object.values(topicPerformance).reduce((sum, { correct }) => sum + correct, 0);
    const totalQuestions = Object.values(topicPerformance).reduce((sum, { total }) => sum + total, 0);
    const overallAccuracy = totalCorrect / totalQuestions;

    // Generate improvement areas
    const improvementAreas = weakTopics.map(topic => 
      `Critical review needed for ${topic}`
    );

    // Create study plan
    const studyPlan = weakTopics.map(topic => ({
      topic,
      recommended_hours: 4,
      resource_type: "video_lectures",
      practice_questions: 50
    }));

    // Analyze historical trend
    const userId = Object.keys(historicalData)[0];
    const userHistory = historicalData[userId];
    const historicalTrend = userHistory[userHistory.length - 1].score > userHistory[0].score 
      ? "improving" 
      : "needs_focus";

    // Calculate predicted rank and percentile
    const predictedPercentile = overallAccuracy * 100;
    const predictedRank = Math.round((1 - predictedPercentile / 100) * 2000000); // Assuming 2M candidates

    return {
      recommendations: {
        weak_topics: weakTopics,
        suggested_difficulty: "medium",
        improvement_areas: improvementAreas,
        study_plan: studyPlan,
        performance_summary: {
          current_strengths: strengths,
          historical_trend: historicalTrend
        }
      },
      rank_prediction: {
        predicted_percentile: Number(predictedPercentile.toFixed(1)),
        predicted_rank: predictedRank,
        confidence_level: "medium"
      }
    };
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <GraduationCap size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">NEET Performance Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Predicted NEET Rank"
            value={data.rank_prediction.predicted_rank.toLocaleString()}
            icon={Target}
          />
          <StatCard
            title="Percentile"
            value={`${data.rank_prediction.predicted_percentile}%`}
            icon={TrendingUp}
          />
          <StatCard
            title="Performance Trend"
            value={data.recommendations.performance_summary.historical_trend === "improving" ? "Positive" : "Needs Work"}
            icon={Brain}
            trend={data.recommendations.performance_summary.historical_trend === "improving" ? "up" : "down"}
          />
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecommendationCard
            title="Areas for Improvement"
            items={data.recommendations.improvement_areas}
            icon={BookOpen}
          />
          <RecommendationCard
            title="Current Strengths"
            items={data.recommendations.performance_summary.current_strengths}
            icon={Award}
          />
          <StudyPlanCard plans={data.recommendations.study_plan} />
        </div>
      </main>
    </div>
  );
}

export default App;