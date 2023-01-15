import { api } from "@/utils/api";
import { type QuestionType as IQuestionType } from "@prisma/client";
import { QuestionType } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";

type Question = {
  id: string;
  text: string;
  type: IQuestionType;
};

interface YesNoAnswer {
  questionId: string;
  answer: 1 | 5;
  type: typeof IQuestionType.YES_NO;
}
interface OneToFiveAnswer {
  questionId: string;
  answer: 1 | 2 | 3 | 4 | 5;
  type: typeof IQuestionType.ONE_TO_FIVE;
}
type Answer = YesNoAnswer | OneToFiveAnswer;

type FormValues = {
  answers: Answer[];
};

const AnswerSurvey = ({ questions }: { questions: Question[] }) => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      answers: questions.map((question) => ({
        questionId: question.id,
        type: question.type,
      })),
    },
    mode: "onBlur",
  });
  const { fields } = useFieldArray({
    name: "answers",
    control,
  });

  const answerSurveyMutation = api.survey.answerSurvey.useMutation();

  const onSubmit = (data: FormValues) => {
    answerSurveyMutation.mutate(
      {
        date: new Date(),
        answers: data.answers.map((answer) => ({
          ...answer,
          answer: Number(answer.answer),
        })),
      },
      {
        onSuccess() {
          router.push("/").catch(console.error);
        },
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="pb-16 text-3xl">Answer the survey</h1>
      <h1 className="text-2xl">Your questions:</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="grid grid-cols-5 gap-4">
              <div className="col-span-5">
                <h2 className="text-xl">{questions[index]!.text}</h2>
              </div>
              {questions[index]!.type === QuestionType.YES_NO && (
                <div className="col-span-5">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="1"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="5"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>No</span>
                  </label>
                </div>
              )}
              {questions[index]!.type === QuestionType.ONE_TO_FIVE && (
                <div className="col-span-5">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="1"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>1</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="2"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>2</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="3"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>3</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="4"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>4</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="5"
                      {...register(`answers.${index}.answer` as const, {
                        required: true,
                      })}
                    />
                    <span>5</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default function AnswerSurveyPage() {
  const surveyQuestions = api.survey.get.useQuery();

  if (surveyQuestions.isLoading) return <div>Loading...</div>;
  if (surveyQuestions.isError) return <div>Error...</div>;
  if (surveyQuestions.isSuccess)
    return <AnswerSurvey questions={surveyQuestions.data} />;
}
