import { api } from "@/utils/api";
import type { QuestionType as IQuestionType } from "@prisma/client";
import { QuestionType } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  questions: {
    title: string;
    text: string;
    type: IQuestionType;
  }[];
};

export default function CustomizeSurveyPage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      questions: [{ title: "", type: QuestionType.ONE_TO_FIVE, text: "" }],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });

  const surveyMutation = api.survey.new.useMutation();

  const onSubmit = (data: FormValues) => {
    surveyMutation.mutate(data, {
      onSuccess() {
        router.push("/").catch(console.error);
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="pb-16 text-3xl">Customize your survey</h1>
      <h1 className="text-2xl">Your questions:</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="grid grid-cols-8 gap-2">
              <input
                placeholder="name"
                {...register(`questions.${index}.title` as const, {
                  required: true,
                })}
                className={`input-bordered input col-span-5 ${
                  errors?.questions?.[index]?.title ? "error" : ""
                }`}
              />
              <select
                className={`select-bordered select relative col-span-3 w-full max-w-xs ${
                  errors?.questions?.[index]?.type ? "error" : ""
                }`}
                {...register(`questions.${index}.type` as const, {
                  required: true,
                })}
              >
                {Object.values(QuestionType).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <div
                contentEditable
                suppressContentEditableWarning
                className={`input-bordered input min-h-12 col-span-8 h-auto ${
                  errors?.questions?.[index]?.text ? "error" : ""
                }`}
                role="textbox"
                onInput={(e) => {
                  setValue(
                    `questions.${index}.text`,
                    e.currentTarget.textContent || "",
                    { shouldValidate: true }
                  );
                }}
              />

              <button
                type="button"
                className="btn-outline btn col-span-8"
                onClick={() => remove(index)}
              >
                DELETE QUESTION
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="btn-outline btn"
          onClick={() =>
            append({
              title: "",
              type: QuestionType.YES_NO,
              text: "",
            })
          }
        >
          ADD A QUESTION
        </button>
        <input className="btn-primary btn" value="SUBMIT" type="submit" />
      </form>
    </div>
  );
}
