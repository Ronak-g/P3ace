import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useTasks, useCreateTask, usePatchTask } from "../Hooks/useTasks";

// ---- Types ----
// Mirrors ITask from Tasks.model.ts, but as it actually arrives over JSON
// (dates become strings, ObjectIds become strings).

export type Importance = "low" | "medium" | "high";
export type Status = "pending" | "completed";

export interface Task {
  _id: string;
  title: string;
  importance: Importance;
  date?: string;
  status: Status;
}

const importanceLabel: Record<Importance, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// Reuses the landing page's palette: gold for the "medium" accent (same as
// the Habits card), indigo stays reserved for primary actions/links, so
// "high" gets its own distinct accent rather than borrowing indigo.
const importanceDot: Record<Importance, string> = {
  low: "bg-gray-500",
  medium: "bg-[#c9a15a]",
  high: "bg-rose-400",
};

export default function TasksPage() {
  const { data: tasks, isLoading, isError } = useTasks();
  const createTask = useCreateTask();
  const patchTask = usePatchTask();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [importance, setImportance] = useState<Importance>("medium");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask.mutate(
      {
        title: title.trim(),
        importance,
        // datetime-local gives "2026-09-20T14:30" with no timezone —
        // convert to a real Date before it goes over the wire.
        date: date ? new Date(date) : undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDate("");
          setImportance("medium");
        },
      },
    );
  };

  const toggleStatus = (task: Task) => {
    patchTask.mutate({
      id: task._id,
      data: { status: task.status === "pending" ? "completed" : "pending" },
    });
  };

  const list: Task[] = tasks ?? [];

  // Completed tasks sink to the bottom regardless of date; within each
  // group, soonest-due first. Undated tasks sort after dated ones.
  const sortedTasks = [...list].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "completed" ? 1 : -1;
    }
    const aTime = a.date ? new Date(a.date).getTime() : Infinity;
    const bTime = b.date ? new Date(b.date).getTime() : Infinity;
    return aTime - bTime;
  });

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#f1f3f5] font-[IBM_Plex_Sans,sans-serif]">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
          Today and beyond
        </p>
        <h1 className="mt-3 font-[Fraunces,serif] text-3xl md:text-4xl font-normal tracking-tight">
          Tasks
        </h1>

        {/* New task form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 md:p-6"
        >
          <input
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
            className="w-full rounded-lg border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-indigo-500"
          />

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <input
              type="datetime-local"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="flex-1 rounded-lg border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-gray-300 outline-none transition focus:border-indigo-500 [color-scheme:dark]"
            />

            <select
              value={importance}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setImportance(e.target.value as Importance)
              }
              className="rounded-lg border border-white/10 bg-[#0b0f14] px-3.5 py-2.5 text-sm text-gray-300 outline-none transition focus:border-indigo-500"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>

            <button
              type="submit"
              disabled={createTask.isPending}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {createTask.isPending ? "Adding…" : "Add task"}
            </button>
          </div>
        </form>

        {/* Task list */}
        <div className="mt-10">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading your tasks…</p>
          )}

          {isError && (
            <p className="text-sm text-rose-400">
              Couldn't load tasks — try refreshing.
            </p>
          )}

          {!isLoading && sortedTasks.length === 0 && (
            <p className="text-sm text-gray-500">
              Nothing on your plate yet — add your first task above.
            </p>
          )}

          <ul className="flex flex-col gap-2.5">
            {sortedTasks.map((task) => {
              const completed = task.status === "completed";
              return (
                <li
                  key={task._id}
                  className={`flex items-start gap-3.5 rounded-xl border border-white/[0.07] px-4 py-3.5 transition ${
                    completed
                      ? "opacity-40"
                      : "opacity-100 hover:bg-white/[0.025]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleStatus(task)}
                    className="mt-1 h-[18px] w-[18px] shrink-0 accent-indigo-600"
                  />

                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        completed ? "text-gray-500 line-through" : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${importanceDot[task.importance]}`}
                      />
                      <span>{importanceLabel[task.importance]}</span>
                      {task.date && (
                        <>
                          <span>·</span>
                          <span>
                            {new Date(task.date).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
