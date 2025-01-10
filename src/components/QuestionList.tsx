import QuestionItem from "./QuestionItem";

interface QuestionListProps {
  questions: Question[];
  onEditQuestion: (id: number, newText: string) => void;
  onDeleteQuestion: (id: number) => void;
  onAddAnswer: (questionId: number, answer: string) => void;
  onEditAnswer: (questionId: number, answerId: number, answer: string) => void;
  onDeleteAnswer: (questionId: number, answerId: number) => void;
}

export default function QuestionList({
  questions,
  onEditQuestion,
  onDeleteQuestion,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onEditQuestion={onEditQuestion}
          onDeleteQuestion={onDeleteQuestion}
          onAddAnswer={onAddAnswer}
          onEditAnswer={onEditAnswer}
          onDeleteAnswer={onDeleteAnswer}
        />
      ))}
    </div>
  );
}
