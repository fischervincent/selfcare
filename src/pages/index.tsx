import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useMemo } from "react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const today = useMemo(() => new Date(), []);
  const todosOfTheDay = api.todo.getByToday.useQuery({
    date: today,
  });

  const TodoContent = () => {
    if (!sessionData) {
      return <></>;
    }
    if (todosOfTheDay.isLoading) return <p>Loading...</p>;
    if (todosOfTheDay?.data?.todoItems) {
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl">To do today</h1>
          <ul className="flex flex-col gap-2">
            {todosOfTheDay?.data?.todoItems.map((todo) => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <>
        <p>Nothing to do today?</p>
        <Link className="btn-outline btn" href="./newTodo">
          Create todo list for the day
        </Link>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>SelfCare</title>
        <meta name="description" content="Daily selfcare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="items-left flex min-h-screen flex-col justify-between p-4">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
        <div className="flex-1">
          <TodoContent />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="btn-outline btn"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
