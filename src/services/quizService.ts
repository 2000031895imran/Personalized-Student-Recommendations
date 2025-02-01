import { StudentInsight } from "../types/quiz";

// Mock data for development
const mockQuizData = {
  questions: [
    {
      id: "q1",
      topic: "Biology",
      difficulty: "medium",
      correctOption: "a"
    },
    {
      id: "q2",
      topic: "Chemistry",
      difficulty: "hard",
      correctOption: "b"
    },
    {
      id: "q3",
      topic: "Physics",
      difficulty: "easy",
      correctOption: "c"
    }
  ]
};

const mockHistoricalData = {
  quizzes: [
    {
      id: "quiz1",
      responses: {
        "q1": "a",
        "q2": "b",
        "q3": "a"
      },
      score: 75,
      timestamp: "2024-02-01"
    },
    {
      id: "quiz2",
      responses: {
        "q1": "b",
        "q2": "b",
        "q3": "c"
      },
      score: 85,
      timestamp: "2024-02-15"
    }
  ]
};

// API endpoints (with fallback to mock data)
const QUIZ_ENDPOINT = 'https://jsonkeeper.com/b/LLQT';
const SUBMISSION_ENDPOINT = 'https://api.jsonserve.com/rJvd7g';
const HISTORICAL_ENDPOINT = 'https://api.jsonserve.com/XgAgFJ';

export async function fetchQuizData() {
  try {
    const response = await fetch(QUIZ_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz data');
    }
    return response.json();
  } catch (error) {
    console.warn('Using mock quiz data due to API error:', error);
    return mockQuizData;
  }
}

export async function fetchSubmissionData() {
  try {
    const response = await fetch(SUBMISSION_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch submission data');
    }
    return response.json();
  } catch (error) {
    console.warn('Using mock submission data due to API error:', error);
    return { submissions: [] };
  }
}

export async function fetchHistoricalData() {
  try {
    const response = await fetch(HISTORICAL_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    return response.json();
  } catch (error) {
    console.warn('Using mock historical data due to API error:', error);
    return mockHistoricalData;
  }
}

export function analyzePerformance(currentQuiz: any, historicalData: any): StudentInsight {
  // Analyze topic performance
  const topicScores: Record<string, number[]> = {};
  
  // Calculate topic-wise performance
  historicalData.quizzes.forEach((quiz: any) => {
    Object.entries(quiz.responses).forEach(([questionId, response]) => {
      const question = currentQuiz.questions.find((q: any) => q.id === questionId);
      if (question) {
        if (!topicScores[question.topic]) {
          topicScores[question.topic] = [];
        }
        topicScores[question.topic].push(
          response === question.correctOption ? 1 : 0
        );
      }
    });
  });

  // Calculate average scores per topic
  const topicAverages = Object.entries(topicScores).reduce(
    (acc, [topic, scores]) => ({
      ...acc,
      [topic]: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    }),
    {} as Record<string, number>
  );

  // Identify weak and strong topics
  const sortedTopics = Object.entries(topicAverages).sort(
    ([, a], [, b]) => b - a
  );
  
  return {
    weakTopics: sortedTopics.slice(-3).map(([topic]) => topic),
    strongTopics: sortedTopics.slice(0, 3).map(([topic]) => topic),
    recommendedDifficulty: calculateRecommendedDifficulty(historicalData),
    improvementTrend: calculateImprovementTrend(historicalData),
  };
}

function calculateRecommendedDifficulty(historicalData: any): string {
  const recentScores = historicalData.quizzes
    .slice(-3)
    .map((quiz: any) => quiz.score);
  const averageScore = 
    recentScores.reduce((sum: number, score: number) => sum + score, 0) / 
    recentScores.length;

  if (averageScore > 80) return 'hard';
  if (averageScore > 60) return 'medium';
  return 'easy';
}

function calculateImprovementTrend(historicalData: any): 'improving' | 'declining' | 'stable' {
  const scores = historicalData.quizzes.map((quiz: any) => quiz.score);
  const trend = scores[scores.length - 1] - scores[0];
  
  if (trend > 5) return 'improving';
  if (trend < -5) return 'declining';
  return 'stable';
}







// // Mock data for demonstration
// const mockQuizData = {
//   questions: [
//     { id: "q1", topic: "Physics", difficulty: "medium", correctOption: "a" },
//     { id: "q2", topic: "Chemistry", difficulty: "hard", correctOption: "b" },
//     { id: "q3", topic: "Biology", difficulty: "easy", correctOption: "c" },
//     { id: "q4", topic: "Physics", difficulty: "hard", correctOption: "b" },
//     { id: "q5", topic: "Chemistry", difficulty: "medium", correctOption: "a" }
//   ]
// };

// const mockHistoricalData = {
//   quizzes: [
//     {
//       userId: "user1",
//       quizId: "quiz1",
//       responses: { "q1": "a", "q2": "b", "q3": "c", "q4": "a", "q5": "a" },
//       score: 75,
//       timestamp: "2024-03-10"
//     },
//     {
//       userId: "user1",
//       quizId: "quiz2",
//       responses: { "q1": "a", "q2": "c", "q3": "c", "q4": "b", "q5": "a" },
//       score: 85,
//       timestamp: "2024-03-11"
//     }
//   ],
//   averageScore: 80,
//   topicPerformance: {
//     "Physics": 0.75,
//     "Chemistry": 0.8,
//     "Biology": 0.9
//   }
// };

// export async function fetchQuizData() {
//   // Return mock data instead of fetching
//   return Promise.resolve(mockQuizData);
// }

// export async function fetchSubmissionData() {
//   // Not used in current implementation
//   return Promise.resolve({});
// }

// export async function fetchHistoricalData() {
//   // Return mock data instead of fetching
//   return Promise.resolve(mockHistoricalData);
// }

// export function analyzePerformance(currentQuiz: any, historicalData: any): StudentInsight {
//   // Analyze topic performance
//   const topicScores: Record<string, number[]> = {};
  
//   // Calculate topic-wise performance
//   historicalData.quizzes.forEach((quiz: any) => {
//     Object.entries(quiz.responses).forEach(([questionId, response]) => {
//       const question = currentQuiz.questions.find((q: any) => q.id === questionId);
//       if (question) {
//         if (!topicScores[question.topic]) {
//           topicScores[question.topic] = [];
//         }
//         topicScores[question.topic].push(
//           response === question.correctOption ? 1 : 0
//         );
//       }
//     });
//   });

//   // Calculate average scores per topic
//   const topicAverages = Object.entries(topicScores).reduce(
//     (acc, [topic, scores]) => ({
//       ...acc,
//       [topic]: scores.reduce((sum, score) => sum + score, 0) / scores.length,
//     }),
//     {} as Record<string, number>
//   );

//   // Identify weak and strong topics
//   const sortedTopics = Object.entries(topicAverages).sort(
//     ([, a], [, b]) => b - a
//   );
  
//   return {
//     weakTopics: ["Physics", "Organic Chemistry", "Human Physiology"],
//     strongTopics: ["Cell Biology", "Mechanics", "Inorganic Chemistry"],
//     recommendedDifficulty: calculateRecommendedDifficulty(historicalData),
//     improvementTrend: calculateImprovementTrend(historicalData),
//   };
// }

// function calculateRecommendedDifficulty(historicalData: any): string {
//   const recentScores = historicalData.quizzes
//     .slice(-3)
//     .map((quiz: any) => quiz.score);
//   const averageScore = 
//     recentScores.reduce((sum: number, score: number) => sum + score, 0) / 
//     recentScores.length;

//   if (averageScore > 80) return 'hard';
//   if (averageScore > 60) return 'medium';
//   return 'easy';
// }

// function calculateImprovementTrend(historicalData: any): 'improving' | 'declining' | 'stable' {
//   const scores = historicalData.quizzes.map((quiz: any) => quiz.score);
//   const trend = scores[scores.length - 1] - scores[0];
  
//   if (trend > 5) return 'improving';
//   if (trend < -5) return 'declining';
//   return 'stable';
// }

