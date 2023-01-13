import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { api } from "../utils/api";

const InputText = ({
  onBlur,
  deleteTodo,
  value,
}: {
  onBlur: (value: string) => void;
  deleteTodo: () => void;
  value: string;
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  // we want to display the delete button when the input is focused (or hovered also)
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group flex w-full flex-row items-center">
      <span
        className="h-[7px] w-[7px] rounded-full bg-slate-700"
        onClick={() => inputRef?.current?.focus()}
      />
      <div
        suppressContentEditableWarning={true} // this is to avoid the warning about managing the contentEditable state
        ref={inputRef}
        className="ml-4 flex-1 focus:outline-blue-400"
        role="textbox"
        contentEditable
        onBlur={(e) => {
          setIsFocused(false);
          onBlur(e.target.textContent || "");
        }}
        onFocus={() => setIsFocused(true)}
      >
        {value}
      </div>
      <span
        className={`px-2 opacity-0 group-hover:opacity-100 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => deleteTodo()}
      >
        x
      </span>
    </div>
  );
};

interface Todo {
  viewId: number;
  text: string;
}

const newTodo = (id: number): Todo => ({
  viewId: id,
  text: "",
});

const NewTodoPage: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([{ viewId: 1, text: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const newTodoMutation = api.todo.new.useMutation();

  const addNewTodo = () => {
    const lastTodo = todos[todos.length - 1];
    if (lastTodo && lastTodo.text.trim() === "") return;
    const lastId = lastTodo?.viewId || 0;
    setTodos([...todos, newTodo(lastId + 1)]);
  };

  const submitTodoList = () => {
    setIsSubmitting(true);
    const todosNotEmpty = todos.filter((todo) => todo.text !== "");
    newTodoMutation.mutate(
      {
        date: new Date(),
        todos: todosNotEmpty.map((todo) => todo.text),
      },
      {
        onSuccess() {
          router.push("/").catch(console.error);
        },
      }
    );
  };

  return (
    <>
      <div className="items-left flex flex-col justify-center gap-12 p-4">
        <h1 className="pt-4 text-4xl">It&apos;s a new day</h1>
        <form className="flex flex-col gap-4">
          <p>What do you want to do today?</p>
          <ul className="flex flex-col gap-2 py-4">
            {todos.map(({ viewId, text }) => (
              <li key={viewId}>
                <InputText
                  deleteTodo={() => {
                    setTodos(todos.filter((todo) => todo.viewId !== viewId));
                  }}
                  onBlur={(val) => {
                    console.log({ val });
                    setTodos(
                      todos.map((todo) =>
                        todo.viewId === viewId ? { ...todo, text: val } : todo
                      )
                    );
                  }}
                  value={text}
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-outline btn w-fit"
            onClick={addNewTodo}
          >
            Add an item
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className="btn-outline btn w-fit self-end"
            onClick={submitTodoList}
          >
            Submit
          </button>
        </form>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl"></p>
        </div>
      </div>
    </>
  );
};

export default NewTodoPage;
