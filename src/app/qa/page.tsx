"use client";

import { useState, useEffect } from "react";
import QuestionForm from "../../components/QuestionForm";
import QuestionList from "../../components/QuestionList";
import Header from "../../components/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function QAPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch("/api/questions");
    const data = await response.json();
    setQuestions(data);

    console.log(data);
  };

  const addQuestion = async (question: string) => {
    const request = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz: question,
        approved: null,
        contributor: user?.fullName,
        contributorId: user?.id,
      }),
    });
    const response = await request.json();
    alert(response.message);
    router.push("/qa");
    setQuestions([...questions, response]);
  };

  const editQuestion = async (id: number, newText: string) => {
    try {
      const request = await fetch(`/api/questions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, newText }),
      });

      const response = await request.json();

      if (request.ok) {
        setQuestions(
          questions.map((q) =>
            q.id === id ? { ...q, text: newText, approved: null } : q
          )
        );
      } else {
        const errorMessage = response.message || "Failed to update question";
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Failed to update question:", err);
      alert("An error occurred while updating the question.");
    }
  };

  const deleteQuestion = async (id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const request = await fetch(`/api/questions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!request.ok) {
        const errorResponse = await request.json();
        console.error("Server error:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
        return;
      }

      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Failed to delete question:", err);
      alert("An error occurred while deleting the question.");
    }
  };

  const addAnswer = async (questionId: number, answer: string) => {
    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          ans: answer,
          contributor: user?.fullName,
          contributorId: user?.id,
        }),
      });

      if (response.ok) {
        const newAnswer = await response.json();
        setQuestions(
          questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  answers: [...q.answers, newAnswer],
                }
              : q
          )
        );
      } else {
        console.error("Failed to add answer:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  const editAnswer = async (
    questionId: number,
    answerId: number,
    newText: string
  ) => {
    try {
      const request = await fetch(`/api/answers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: answerId, newText }),
      });
      const response = await request.json();

      if (request.ok) {
        setQuestions(
          questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                answers: q.answers
                  ? q.answers.map((a) =>
                      a.id === answerId
                        ? { ...a, text: newText, approved: null }
                        : a
                    )
                  : [],
              };
            }
            return q;
          })
        );
      } else {
        console.log(response.message);
        alert(`Error: ${response.message}`);
      }
    } catch (err) {
      console.error("Failed to update answer:", err);
      alert("An error occurred while updating the answer.");
    }
  };

  const deleteAnswer = async (questionId: number, answerId: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const request = await fetch(`/api/answers`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: answerId }),
      });

      if (!request.ok) {
        const errorResponse = await request.json();
        console.error("Server error:", errorResponse);
        alert(`Error: ${errorResponse.message}`);
        return;
      }

      setQuestions(
        questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              answers: q.answers
                ? q.answers.filter((a) => a.id !== answerId)
                : [],
            };
          }
          return q;
        })
      );
    } catch (err) {
      console.error("Failed to delete answer:", err);
      alert("An error occurred while deleting the answer.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {isSignedIn && <QuestionForm onSubmit={addQuestion} />}
        {Array.isArray(questions) && (
          <QuestionList
            questions={questions.filter((q) => q.approved !== false)}
            onEditQuestion={editQuestion}
            onDeleteQuestion={deleteQuestion}
            onAddAnswer={addAnswer}
            onEditAnswer={editAnswer}
            onDeleteAnswer={deleteAnswer}
          />
        )}
      </main>
    </div>
  );
}
