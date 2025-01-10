import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuestionFormProps {
  onSubmit: (question: string) => void;
}

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [quiz, setQuiz] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quiz.trim()) {
      onSubmit(quiz);
      setQuiz("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          name="quiz"
          id="quiz"
          value={quiz}
          onChange={(e) => setQuiz(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow"
        />
        <Button type="submit">Ask</Button>
      </div>
    </form>
  );
}
