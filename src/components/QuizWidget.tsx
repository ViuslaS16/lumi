import React, { useState } from 'react';
import {
  COMMUNICATION_QUIZ_QUESTIONS,
  QUIZ_TOPICS,
  QuizQuestion,
} from '@/data/quizzes';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface QuizWidgetProps {
  onFinish?: (score: number, total: number) => void;
  onActionClick?: (action: 'skills' | 'menu') => void;
}

export const QuizWidget: React.FC<QuizWidgetProps> = ({
  onFinish,
  onActionClick,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize from localStorage safely using lazy initializers
  const [attemptCount, setAttemptCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    try {
      const stored = localStorage.getItem('lumi_quiz_attempts');
      return stored !== null ? Math.max(1, parseInt(stored, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem('lumi_quiz_best_score');
      return stored !== null ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const questions: QuizQuestion[] = COMMUNICATION_QUIZ_QUESTIONS;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (showAnswerFeedback) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: index }));
    setShowAnswerFeedback(true);
  };

  const handleNext = () => {
    setShowAnswerFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          score += 1;
        }
      });

      const newBest = Math.max(bestScore, score);
      setBestScore(newBest);
      setIsFinished(true);

      try {
        localStorage.setItem('lumi_quiz_best_score', newBest.toString());
        localStorage.setItem('lumi_quiz_attempts', attemptCount.toString());
      } catch {
        // ignore
      }

      if (onFinish) onFinish(score, questions.length);
    }
  };

  const handleRetake = () => {
    if (attemptCount >= 3) return;
    const nextAttempts = attemptCount + 1;
    setAttemptCount(nextAttempts);
    try {
      localStorage.setItem('lumi_quiz_attempts', nextAttempts.toString());
    } catch {
      // ignore
    }
    setSelectedAnswers({});
    setShowAnswerFeedback(false);
    setCurrentQuestionIndex(0);
    setIsFinished(false);
  };

  // 1. Topic Selection View
  if (!selectedTopic) {
    return (
      <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F5F5F4]">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#292524]">Select a Quiz Topic</h3>
            <p className="text-[11px] text-[#78716C]">Earn up to 20 learning points per quiz</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {QUIZ_TOPICS.map(topic => (
            <button
              key={topic.id}
              disabled={!topic.available}
              onClick={() => setSelectedTopic(topic.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                topic.available
                  ? 'border-[#E7E5E4] hover:border-[#D97706] hover:bg-[#FFFBF5]'
                  : 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#292524]">{topic.title}</span>
                  {topic.available ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                      5 Questions
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-200 text-stone-600 font-medium">
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#78716C] mt-1 leading-snug">{topic.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 mt-1 shrink-0 ml-2" />
            </button>
          ))}
        </div>

        <div className="mt-3 text-[10px] text-stone-400 italic text-center">
          Quizzes are for learning and self-assessment, not evaluation.
        </div>
      </div>
    );
  }

  // 2. Results Screen
  if (isFinished) {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        finalScore += 1;
      }
    });
    const percentage = Math.round((finalScore / questions.length) * 100);
    const pointsAwarded = Math.round((finalScore / questions.length) * 20);

    return (
      <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
        {/* Results Header */}
        <div className="text-center py-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-base text-[#292524]">Communication Quiz Complete!</h3>
          <p className="text-xs text-[#78716C] mt-0.5">Attempt {attemptCount} of 3</p>

          <div className="my-4 inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-[#FFFBF5] border border-[#FEF3C7]">
            <div>
              <span className="text-[11px] text-[#78716C] block">Final Score</span>
              <span className="text-lg font-bold text-[#92400E]">
                {finalScore} / {questions.length} ({percentage}%)
              </span>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div>
              <span className="text-[11px] text-[#78716C] block">Points Earned</span>
              <span className="text-lg font-bold text-[#D97706]">+{pointsAwarded} pts</span>
            </div>
          </div>

          <p className="text-xs text-[#78716C]">
            Best recorded score: <strong>{bestScore} / 5</strong>
          </p>
        </div>

        {/* Answers Review */}
        <div className="mt-4 border-t border-[#F5F5F4] pt-3 space-y-2.5">
          <p className="text-xs font-semibold text-[#292524]">Review Answers:</p>
          {questions.map((q, qIdx) => {
            const userChoice = selectedAnswers[qIdx];
            const isCorrect = userChoice === q.correctIndex;
            return (
              <div key={q.id} className="p-2.5 rounded-xl bg-stone-50 text-xs border border-stone-200">
                <div className="flex items-start gap-1.5 font-medium text-[#292524]">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span>
                    Q{q.id}: {q.question}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-stone-600 pl-5">
                  <span className="font-medium text-emerald-700">
                    Correct Answer: {q.options[q.correctIndex]}
                  </span>
                  <p className="text-stone-500 text-[10px] mt-0.5">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Retake & Actions */}
        <div className="mt-4 pt-3 border-t border-[#F5F5F4] flex flex-wrap gap-2">
          {attemptCount < 3 ? (
            <button
              onClick={handleRetake}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#92400E] text-white font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz ({3 - attemptCount} remaining)</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 py-1.5">Maximum 3 attempts reached</span>
          )}

          {onActionClick && (
            <>
              <button
                onClick={() => onActionClick('skills')}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-medium transition-colors cursor-pointer"
              >
                Skill Recommendations
              </button>
              <button
                onClick={() => onActionClick('menu')}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer ml-auto"
              >
                Back to Menu
              </button>
            </>
          )}
        </div>

        {/* Fictional Disclaimer */}
        <div className="mt-2 text-[10px] text-stone-400 italic text-center">
          Simulated quiz for demonstration. Results are not sent to HRIS.
        </div>
      </div>
    );
  }

  // 3. Question View (1 question at a time)
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
      {/* Header with question count */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#D97706]">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
            Communication
          </span>
        </div>
        <span className="text-xs text-[#78716C]">Attempt {attemptCount} of 3</span>
      </div>

      {/* Question prompt */}
      <div className="my-4">
        <h4 className="text-sm font-semibold text-[#292524] leading-snug">
          {currentQ.question}
        </h4>
      </div>

      {/* 4 Options */}
      <div className="space-y-2">
        {currentQ.options.map((option, optIdx) => {
          const isThisSelected = currentAnswer === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;

          let btnClass = 'border-stone-200 bg-white hover:border-[#D97706] hover:bg-[#FFFBF5] text-stone-800';

          if (showAnswerFeedback) {
            if (isCorrect) {
              btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
            } else if (isThisSelected) {
              btnClass = 'border-red-400 bg-red-50 text-red-900 line-through';
            } else {
              btnClass = 'border-stone-200 bg-stone-50 text-stone-400';
            }
          }

          return (
            <button
              key={optIdx}
              disabled={showAnswerFeedback}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnClass}`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className="flex-1">{option}</span>
              {showAnswerFeedback && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              {showAnswerFeedback && isThisSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate feedback explanation */}
      {showAnswerFeedback && (
        <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          <p className="text-[11px] text-stone-700 leading-relaxed">
            <strong className="font-semibold">
              {currentAnswer === currentQ.correctIndex ? '✓ Correct! ' : '✕ Incorrect. '}
            </strong>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Next Question / Finish Button */}
      {showAnswerFeedback && (
        <div className="mt-4 pt-3 border-t border-[#F5F5F4] flex justify-end">
          <button
            onClick={handleNext}
            className="text-xs px-3.5 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#92400E] text-white font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
