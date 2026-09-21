import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useTasks, useCreateTask, usePatchTask, useDeleteTask } from "../Hooks/useTasks";

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

const importanceDot: Record<Importance, string> = {
  low: "bg-gray-500",
  medium: "bg-[#c9a15a]",
  high: "bg-rose-400",
};

function toDatetimeLocalValue(isoString?: string): string {
  if (!isoString) return "";
  return new Date(isoString).toISOString().slice(0, 16);
}

export default function TasksPage() {
  const { data: tasks, isLoading, isError } = useTasks();
  const createTask = useCreateTask();
  const patchTask = usePatchTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [importance, setImportance] = useState<Importance>("medium");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editImportance, setEditImportance] = useState<Importance>("medium");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask.mutate(
      {
        title: title.trim(),
        importance,
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

  const startEdit = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDate(toDatetimeLocalValue(task.date));
    setEditImportance(task.importance);
  };

  const cancelEdit = () => setEditingId(null);

  const handleDelete = (task: Task) => {
    // const confirmed = window.confirm(`Delete "${task.title}"? This can't be undone.`);
    // if (!confirmed) return;
    deleteTask.mutate(task._id);
  };

  const saveEdit = (e: FormEvent, taskId: string) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    patchTask.mutate(
      {
        id: taskId,
        data: {
          title: editTitle.trim(),
          importance: editImportance,
          date: editDate ? new Date(editDate) : undefined,
        },
      },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const list: Task[] = tasks ?? [];

  const sortedTasks = [...list].sort((a, b) => {
    if (a.status !== b.status) return a.status === "completed" ? 1 : -1;
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

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 md:p-6"
        >
          <input
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-indigo-500"
          />

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <input
              type="datetime-local"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
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

        <div className="mt-10">
          {isLoading && <p className="text-sm text-gray-500">Loading your tasks…</p>}

          {isError && (
            <p className="text-sm text-rose-400">Couldn't load tasks — try refreshing.</p>
          )}

          {!isLoading && sortedTasks.length === 0 && (
            <p className="text-sm text-gray-500">
              Nothing on your plate yet — add your first task above.
            </p>
          )}

          <ul className="flex flex-col gap-2.5">
            {sortedTasks.map((task) => {
              const completed = task.status === "completed";
              const isEditing = editingId === task._id;

              if (isEditing) {
                return (
                  <li key={task._id}>
                    <form
                      onSubmit={(e) => saveEdit(e, task._id)}
                      className="rounded-xl border border-indigo-500/40 bg-white/[0.03] p-4"
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEditTitle(e.target.value)
                        }
                        required
                        autoFocus
                        className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                      />

                      <div className="mt-2.5 flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="datetime-local"
                          value={editDate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditDate(e.target.value)
                          }
                          className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-gray-300 outline-none focus:border-indigo-500 [color-scheme:dark]"
                        />

                        <select
                          value={editImportance}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setEditImportance(e.target.value as Importance)
                          }
                          className="rounded-lg border border-white/10 bg-[#0b0f14] px-3 py-2 text-sm text-gray-300 outline-none focus:border-indigo-500"
                        >
                          <option value="low">Low priority</option>
                          <option value="medium">Medium priority</option>
                          <option value="high">High priority</option>
                        </select>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={patchTask.isPending}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/[0.05]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </li>
                );
              }

              return (
                <li
                  key={task._id}
                  className={`group flex items-start gap-3.5 rounded-xl border border-white/[0.07] px-4 py-3.5 transition ${
                    completed ? "opacity-40" : "opacity-100 hover:bg-white/[0.025]"
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

                  <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      aria-label="Edit task"
                      className="rounded-md p-1.5 text-gray-500 transition hover:bg-white/[0.06] hover:text-gray-200"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                        <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.83.497l-3.09.883.883-3.09a2 2 0 0 1 .497-.83l8.212-8.212Z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task)}
                      aria-label="Delete task"
                      className="rounded-md p-1.5 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                        <path d="M8 2a1 1 0 0 0-1 1v1H4a1 1 0 0 0 0 2h.5l.75 10.5A2 2 0 0 0 7.24 18.5h5.52a2 2 0 0 0 1.99-1.9L15.5 6H16a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1H8Zm1 2V3.5h2V4H9Zm-1.5 4a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-1.5 0V8Zm4 0a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-1.5 0V8Z" />
                      </svg>
                    </button>
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