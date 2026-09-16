import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { refreshSession } from "../Api/authApi";

const Landing: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshSession();
        setAuthenticated(true);
      } catch (error) {
        console.log(error);
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      navigate("/page");
    }
  }, [authenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#f1f3f5] font-[IBM_Plex_Sans,sans-serif] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 border-b border-white/[0.07]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-[Fraunces,serif] text-2xl font-medium tracking-tight"
        >
          P3ace
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Register
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-20 md:pt-28 lg:pt-32 pb-24">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.08] blur-3xl" />

          <div className="relative max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Your day, in one place
            </div>

            <h1 className="max-w-4xl font-[Fraunces,serif] text-[2.8rem] md:text-[4.2rem] lg:text-[5rem] font-normal leading-[1.05] tracking-tight">
              One place for every
              <br />
              <span className="text-gray-400">task, habit, and thought.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base md:text-lg leading-relaxed text-gray-400">
              P3ace brings your tasks, habits, schedule, and an AI that
              understands your day into one quiet workspace.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Get started
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Log in
              </button>
            </div>
          </div>
        </section>

        {/* Product flow */}
        <section className="border-y border-white/[0.07] bg-[#0e141b] px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
                Everything connected
              </p>

              <h2 className="mt-3 max-w-xl font-[Fraunces,serif] text-3xl md:text-4xl font-normal leading-tight">
                Your productivity system shouldn't fight itself.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 border border-white/[0.07] rounded-2xl overflow-hidden">
              {/* Tasks */}
              <div className="group p-7 md:p-8 border-b md:border-b-0 md:border-r border-white/[0.07] transition hover:bg-white/[0.025]">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    01
                  </span>

                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                </div>

                <h3 className="font-[Fraunces,serif] text-xl font-medium">
                  Tasks
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  Know what needs doing today without losing sight of everything
                  else on your plate.
                </p>
              </div>

              {/* Habits */}
              <div className="group p-7 md:p-8 border-b md:border-b-0 md:border-r border-white/[0.07] transition hover:bg-white/[0.025]">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9a15a]/10 text-[#c9a15a]">
                    02
                  </span>

                  <span className="h-2 w-2 rounded-full bg-[#c9a15a]" />
                </div>

                <h3 className="font-[Fraunces,serif] text-xl font-medium">
                  Habits
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  Build consistency over time while keeping your habits
                  connected to the rest of your schedule.
                </p>
              </div>

              {/* AI */}
              <div className="group p-7 md:p-8 transition hover:bg-white/[0.025]">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    03
                  </span>

                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                </div>

                <h3 className="font-[Fraunces,serif] text-xl font-medium">
                  AI Chat
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  Ask, plan, rearrange, and make decisions with an AI that
                  already understands your workload.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-24">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c9a15a]">
                One system
              </p>

              <h2 className="mt-4 font-[Fraunces,serif] text-3xl md:text-4xl font-normal leading-tight">
                Stop maintaining your productivity tools.
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-base font-medium text-white">
                  Your schedule stays connected
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Tasks, habits, and calendar events share the same context.
                  Move one thing and the rest of your day can adapt with it.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-white">
                  Your AI sees the bigger picture
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Instead of explaining your situation every time, ask P3ace to
                  work with the context it already has.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-white">
                  Less management, more doing
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  P3ace is designed to stay out of your way while keeping your
                  day organized and visible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
          <div className="relative max-w-6xl mx-auto overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121821] px-7 py-12 md:px-12 md:py-14">
            <div className="pointer-events-none absolute right-[-100px] top-[-150px] h-[350px] w-[350px] rounded-full bg-indigo-600/[0.08] blur-3xl" />

            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
                Start simple
              </p>

              <h2 className="mt-3 max-w-2xl font-[Fraunces,serif] text-3xl md:text-4xl font-normal">
                Give your day one place to live.
              </h2>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="mt-7 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Create your account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-12 lg:px-20 py-6 border-t border-white/[0.07] text-xs text-gray-500">
        <span className="font-[Fraunces,serif] text-sm text-gray-300">
          P3ace
        </span>

        <span>Built for people who run on their own schedule.</span>
      </footer>
    </div>
  );
};

export default Landing;
