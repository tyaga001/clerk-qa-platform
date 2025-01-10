"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch("/api/questions");
    const data = await response.json();
    setQuestions(data.map((q: Question) => ({ ...q, answers: [] })));

    console.log(data);
  };

  const fetchAnswers = async (questionId: number) => {
    const response = await fetch(`/api/answers?questionId=${questionId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch answers");
    }
    const data = await response.json();
    return data;
  };

  const approveQuestion = async (id: number) => {
    try {
      const request = await fetch(`/api/questions/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action: "approve" }),
      });

      if (!request.ok) {
        const errorResponse = await request.json();
        console.error("Server error:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
        return;
      }

      const updatedQuestion = await request.json();

      setQuestions(
        questions.map((q) =>
          q.id === id ? { ...updatedQuestion, answers: q.answers } : q
        )
      );
    } catch (err) {
      console.error("Failed to approve question:", err);
      alert("An error occurred while approving the question.");
    }
  };

  const disapproveQuestion = async (id: number) => {
    try {
      const request = await fetch(`/api/questions/disapprove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action: "disapprove" }),
      });

      if (!request.ok) {
        const errorResponse = await request.json();
        console.error("Server error:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
        return;
      }

      const updatedQuestion = await request.json();

      setQuestions(
        questions.map((q) =>
          q.id === id ? { ...updatedQuestion, answers: q.answers } : q
        )
      );
    } catch (err) {
      console.error("Failed to approve question:", err);
      alert("An error occurred while approving the question.");
    }
  };

  const approveAnswer = async (questionId: number, answerId: number) => {
    try {
      const request = await fetch(`/api/answers/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: answerId, action: "approve" }),
      });

      if (!request.ok) {
        const errorResponse = await request.json();
        console.error("Server error:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
        return;
      }

      const updatedAnswer = await request.json();

      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId ? updatedAnswer : a
                ),
              }
            : q
        )
      );
    } catch (err) {
      console.error("Failed to approve answer:", err);
      alert("An error occurred while approving the answer.");
    }
  };

  const disapproveAnswer = async (questionId: number, answerId: number) => {
    try {
      const request = await fetch(`/api/answers/disapprove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: answerId, action: "disapprove" }),
      });

      if (!request.ok) {
        const errorResponse = await request.json();
        console.error("Server error:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
        return;
      }

      const updatedAnswer = await request.json();

      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId ? updatedAnswer : a
                ),
              }
            : q
        )
      );
    } catch (err) {
      console.error("Failed to disapprove answer:", err);
      alert("An error occurred while disapproving the answer.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex justify-end mb-4">
          <Button>
            <Link href="/searchUsers">Set Roles</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              fetchAnswers={fetchAnswers}
              approveQuestion={approveQuestion}
              disapproveQuestion={disapproveQuestion}
              approveAnswer={approveAnswer}
              disapproveAnswer={disapproveAnswer}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  fetchAnswers: (questionId: number) => Promise<Answer[]>;
  approveQuestion: (id: number) => void;
  disapproveQuestion: (id: number) => void;
  approveAnswer: (questionId: number, answerId: number) => void;
  disapproveAnswer: (questionId: number, answerId: number) => void;
}

function QuestionCard({
  question,
  fetchAnswers,
  approveQuestion,
  disapproveQuestion,
  approveAnswer,
  disapproveAnswer,
}: QuestionCardProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  useEffect(() => {
    loadAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAnswers = async () => {
    setIsLoadingAnswers(true);
    try {
      if (question.id !== null) {
        const fetchedAnswers = await fetchAnswers(question.id);
        setAnswers(fetchedAnswers);
      }
    } catch (error) {
      console.error("Error loading answers:", error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{question.quiz}</span>
              <ApprovalBadge approved={question.approved} />
            </div>

            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  question.id !== null && approveQuestion(question.id)
                }>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  question.id !== null && disapproveQuestion(question.id)
                }>
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span>{question.contributor}</span>
            <span> • </span>
            <span>{formatDate(question.timestamp)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">Answers:</h3>
        {isLoadingAnswers ? (
          <p>Loading answers...</p>
        ) : answers.length > 0 ? (
          <ul className="space-y-4">
            {answers.map((answer) => (
              <li key={answer.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{answer.ans}</span>
                    <ApprovalBadge approved={answer.approved ?? null} />
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (question.id !== null && answer.id !== null) {
                          approveAnswer(question.id, answer.id);
                        }
                      }}>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (question.id !== null && answer.id !== null) {
                          disapproveAnswer(question.id, answer.id);
                        }
                      }}>
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <span>{answer.contributor}</span>
                  <span> • </span>
                  <span>{formatDate(answer.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No answers yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function ApprovalBadge({ approved }: { approved: boolean | null }) {
  if (approved === true) {
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 border-green-300">
        Approved
      </Badge>
    );
  } else if (approved === false) {
    return (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-800 border-red-300">
        Disapproved
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-100 text-yellow-800 border-yellow-300">
        Pending
      </Badge>
    );
  }
}
