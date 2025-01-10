import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";

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

interface Answer {
  id: number;
  ans: string;
  approved: boolean;
  contributor: string;
  timestamp: string;
  contributorId: number;
  questionId: number;
}

interface QuestionItemProps {
  question: Question;
  onEditQuestion: (id: number, newText: string) => void;
  onDeleteQuestion: (id: number) => void;
  onAddAnswer: (questionId: number, answerText: string) => void;
  onEditAnswer: (questionId: number, answerId: number, newText: string) => void;
  onDeleteAnswer: (questionId: number, answerId: number) => void;
}

export default function QuestionItem({
  question,
  onEditQuestion,
  onDeleteQuestion,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: QuestionItemProps) {
  const { isSignedIn, user } = useUser();
  const [answer, setAnswer] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.quiz);
  const [answers, setAnswers] = useState<
    {
      id: number;
      ans: string;
      approved: boolean;
      contributor: string;
      timestamp: string;
      contributorId: number;
      questionId: number;
    }[]
  >([]);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  useEffect(() => {
    fetchAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const fetchAnswers = async () => {
    setIsLoadingAnswers(true);
    try {
      const response = await fetch(`/api/answers?questionId=${question.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch answers");
      }
      const data = await response.json();
      setAnswers(data);
    } catch (error) {
      console.error("Error fetching answers:", error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer.trim()) {
      if (question.id !== null) {
        onAddAnswer(question.id, answer);
      }
      setAnswer("");
    }
  };

  const handleQuestionEdit = () => {
    if (editedQuestion.trim() && editedQuestion !== question.quiz) {
      if (question.id !== null) {
        onEditQuestion(question.id, editedQuestion);
      }
      setIsEditing(false);
    }
  };

  const handleAnswerEdit = async (answerId: number, newText: string) => {
    if (question.id !== null) {
      await onEditAnswer(question.id, answerId, newText);
    }
    fetchAnswers();
  };

  const handleAnswerDelete = async (answerId: number) => {
    if (question.id !== null) {
      await onDeleteAnswer(question.id, answerId);
      fetchAnswers();
    }
  };

  return (
    <Card>
      <CardHeader>
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleQuestionEdit}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <CardTitle>{question.quiz}</CardTitle>
              {(user?.id === question?.contributorId ||
                user?.publicMetadata?.role === "admin") && (
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      question.id !== null && onDeleteQuestion(question.id)
                    }>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <span>{question.contributor}</span>
              <span> • </span>
              <span>{formatDate(question.timestamp)}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">Answers:</h3>
        {isLoadingAnswers ? (
          <p>Loading answers...</p>
        ) : answers.filter((a) => a.approved !== false).length > 0 ? (
          <ul className="space-y-4">
            {answers
              .filter((a) => a.approved !== false)
              .map((answer, index, filteredAnswers) => (
                <li key={answer.id}>
                  <AnswerItem
                    answer={answer}
                    onEditAnswer={(newText) =>
                      handleAnswerEdit(answer.id, newText)
                    }
                    onDeleteAnswer={() => handleAnswerDelete(answer.id)}
                  />
                  {index < filteredAnswers.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No answers yet.</p>
        )}
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full">
          {isSignedIn && (
            <div className="flex gap-2">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Add an answer..."
                className="flex-grow"
              />
              <Button type="submit">Answer</Button>
            </div>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}

function AnswerItem({
  answer,
  onEditAnswer,
  onDeleteAnswer,
}: {
  answer: Answer;
  onEditAnswer: (newText: string) => void;
  onDeleteAnswer: () => void;
}) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(answer.ans);

  const handleEdit = () => {
    if (editedAnswer.trim() && editedAnswer !== answer.ans) {
      onEditAnswer(editedAnswer);
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex gap-2 w-full">
          <Input
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleEdit}>Save</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <p>{answer.ans}</p>
            {(user?.id === answer?.contributorId.toString() ||
              user?.publicMetadata?.role === "admin") && (
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDeleteAnswer}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            <span>{answer.contributor}</span>
            <span> • </span>
            <span>{formatDate(answer.timestamp)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
