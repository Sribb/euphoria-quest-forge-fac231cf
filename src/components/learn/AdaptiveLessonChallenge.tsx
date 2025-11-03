import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Brain, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicCategory: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AdaptiveLessonChallengeProps {
  lessonId: string;
  onComplete: (score: number, passed: boolean) => void;
  onBack: () => void;
}

export const AdaptiveLessonChallenge = ({ lessonId, onComplete, onBack }: AdaptiveLessonChallengeProps) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; topic: string; time: number }[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [adaptiveInfo, setAdaptiveInfo] = useState<any>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);

      // Fetch user progress to determine weak areas
      const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('weak_areas')
        .eq('user_id', user?.id)
        .eq('lesson_id', lessonId)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-adaptive-questions', {
        body: {
          lessonId,
          currentDifficulty: 'medium',
          weakAreas: Array.isArray(progress?.weak_areas) 
            ? progress.weak_areas.filter((a): a is string => typeof a === 'string')
            : [],
        },
      });

      if (error) throw error;

      setQuestions(data.questions);
      setAdaptiveInfo(data.adaptiveInfo);
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load challenge questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    // Record answer
    setAnswers([
      ...answers,
      {
        correct: isCorrect,
        topic: currentQuestion.topicCategory,
        time: timeTaken,
      },
    ]);

    // Store performance in database
    try {
      await supabase.from('lesson_question_performance').insert({
        user_id: user?.id,
        lesson_id: lessonId,
        question_text: currentQuestion.question,
        topic_category: currentQuestion.topicCategory,
        difficulty_level: currentQuestion.difficulty,
        is_correct: isCorrect,
        time_taken_seconds: timeTaken,
      });
    } catch (error) {
      console.error('Error saving performance:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      // Challenge complete - calculate results
      const correctCount = answers.filter(a => a.correct).length;
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= 80;

      // Identify weak areas
      const weakTopics = answers
        .filter(a => !a.correct)
        .map(a => a.topic)
        .filter((v, i, a) => a.indexOf(v) === i);

      // Update user progress
      updateProgressWithResults(score, passed, weakTopics);
    }
  };

  const updateProgressWithResults = async (score: number, passed: boolean, weakTopics: string[]) => {
    try {
      const { data: currentProgress } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('lesson_id', lessonId)
        .single();

      const attempts = (currentProgress?.quiz_attempts || 0) + 1;
      const bestScore = Math.max(currentProgress?.quiz_score || 0, score);
      
      const challengeHistoryData = currentProgress?.challenge_history;
      const currentHistory = Array.isArray(challengeHistoryData) ? challengeHistoryData : [];

      await supabase.from('user_lesson_progress').upsert({
        user_id: user?.id,
        lesson_id: lessonId,
        quiz_attempts: attempts,
        quiz_score: bestScore,
        weak_areas: weakTopics,
        last_challenge_at: new Date().toISOString(),
        progress: passed ? 100 : currentProgress?.progress || 0,
        completed: passed,
        completed_at: passed ? new Date().toISOString() : null,
        challenge_history: [
          ...currentHistory,
          {
            score,
            passed,
            timestamp: new Date().toISOString(),
            questionCount: questions.length,
          },
        ],
      }, {
        onConflict: 'user_id,lesson_id',
      });

      if (passed) {
        // Award coins for passing
        const { data: profile } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', user?.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ coins: profile.coins + 100 })
            .eq('id', user?.id);
        }
      }

      onComplete(score, passed);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to save progress');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-semibold">Generating adaptive questions...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Analyzing your performance to create personalized challenges
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <p className="text-lg font-semibold">Failed to load questions</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  const correctSoFar = answers.filter(a => a.correct).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with adaptive info */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Adaptive Challenge</p>
              <p className="text-xs text-muted-foreground">
                {adaptiveInfo && `Difficulty: ${adaptiveInfo.targetDifficulty} • Success Rate: ${adaptiveInfo.successRate}%`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            {correctSoFar}/{currentQuestionIndex} correct
          </Badge>
        </div>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="font-semibold">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-3">
            {currentQuestion.topicCategory}
          </Badge>
          <h3 className="text-xl font-bold mb-2">{currentQuestion.question}</h3>
          <Badge 
            variant={
              currentQuestion.difficulty === 'easy' ? 'default' :
              currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'
            }
          >
            {currentQuestion.difficulty}
          </Badge>
        </div>

        <div className="space-y-3 mt-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctIndex;
            const showResult = showFeedback;

            return (
              <Button
                key={index}
                variant={
                  showResult
                    ? isCorrect
                      ? "default"
                      : isSelected
                      ? "destructive"
                      : "outline"
                    : isSelected
                    ? "secondary"
                    : "outline"
                }
                className="w-full justify-start text-left h-auto py-4 px-4"
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
              >
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 ml-2 flex-shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-2 flex-shrink-0" />}
              </Button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            selectedAnswer === currentQuestion.correctIndex
              ? 'bg-success/10 border border-success/20'
              : 'bg-destructive/10 border border-destructive/20'
          }`}>
            <p className="font-semibold mb-2">
              {selectedAnswer === currentQuestion.correctIndex
                ? '✓ Correct! Excellent work!'
                : '✗ Not quite right.'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={onBack}>
            Back to Learn
          </Button>
          <Button
            onClick={handleNext}
            disabled={!showFeedback}
            className="bg-gradient-primary"
          >
            {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
          </Button>
        </div>
      </Card>
    </div>
  );
};