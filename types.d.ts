interface Answer {
  id: number | null;
  ans: string;
  approved?: boolean | null;
  contributor: string;
  contributorId: string;
  questionId: number;
  timestamp: string; // ISO 8601 string format
}

interface Question {
  id: number | null;
  quiz: string;
  approved: boolean | null;
  answers: Answer[];
  contributor: string;
  contributorId: string;
  timestamp: string; // ISO 8601 string format
}
