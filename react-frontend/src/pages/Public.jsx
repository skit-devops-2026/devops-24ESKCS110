import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Search,
  Code2,
  Bookmark,
  Bug,
  NotebookPen,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import { Field, inputClass } from "../components/UI";
export function Landing() {
  return (
    <div className="grid-bg min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
            <BookOpen />
          </span>
          DevVault<span className="text-blue-600">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
          >
            Get started <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <Zap size={14} /> Your developer second brain
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-6xl">
            All your developer knowledge.{" "}
            <span className="text-blue-600">One home.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            Save notes, reusable code, learning resources, bugs, and project
            context in one searchable workspace built for the way developers
            think.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-200 hover:bg-blue-700"
            >
              Build your second brain{" "}
              <ArrowRight className="ml-2 inline" size={17} />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore workspace
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <ShieldCheck size={17} className="text-emerald-500" /> Frontend demo
            · Your sample data stays in this browser
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="relative rounded-3xl border border-white bg-white/90 p-5 shadow-2xl shadow-blue-100">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-xs font-medium text-slate-400">
                devvault / workspace
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search size={17} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                Find that snippet from last week...
              </span>
              <span className="ml-auto rounded border bg-white px-2 py-1 text-[10px] text-slate-400">
                ⌘ K
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                [
                  NotebookPen,
                  "Smart notes",
                  "12 notes",
                  "bg-blue-50 text-blue-600",
                ],
                [
                  Code2,
                  "Code snippets",
                  "08 snippets",
                  "bg-violet-50 text-violet-600",
                ],
                [
                  Bookmark,
                  "Resources",
                  "16 saved links",
                  "bg-emerald-50 text-emerald-600",
                ],
                [
                  Bug,
                  "Bug journal",
                  "03 tracked bugs",
                  "bg-amber-50 text-amber-600",
                ],
              ].map(([Icon, title, sub, cls]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div
                    className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${cls}`}
                  >
                    <Icon size={19} />
                  </div>
                  <div className="font-semibold">{title}</div>
                  <div className="mt-1 text-xs text-slate-400">{sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Code2 size={14} /> recently saved · javascript
              </div>
              <pre className="mt-3 overflow-hidden text-xs leading-6 text-blue-200">{`async function getData(url) {\n  const response = await fetch(url);\n  if (!response.ok) throw Error();\n  return response.json();\n}`}</pre>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 sm:grid-cols-3">
        {[
          [
            Layers,
            "Everything connected",
            "Keep learning notes, snippets, bugs and projects together.",
          ],
          [
            Search,
            "Find it in seconds",
            "Search across your saved developer knowledge.",
          ],
          [
            ShieldCheck,
            "Your local workspace",
            "This frontend demo stores data in your browser.",
          ],
        ].map(([Icon, title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-6"
          >
            <Icon className="mb-4 text-blue-600" size={22} />
            <h3 className="font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
export function Auth({ register = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    localStorage.setItem(
      "devvault_user",
      JSON.stringify({
        name: name || email.split("@")[0] || "Developer",
        email,
      }),
    );
    navigate("/dashboard");
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="grid-bg hidden flex-col justify-between bg-blue-600 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold">
          <BookOpen />
          DevVault.
        </Link>
        <div className="max-w-lg">
          <div className="mb-5 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            A home for what you learn
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Think clearly.
            <br />
            Build consistently.
          </h1>
          <p className="mt-5 leading-7 text-blue-100">
            Your notes, snippets, resources and debugging lessons — organized
            and ready when you need them.
          </p>
        </div>
        <p className="text-xs text-blue-100">
          DevVault · Developer Knowledge Management
        </p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 flex items-center gap-3 text-xl font-bold lg:hidden"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
              <BookOpen />
            </span>
            DevVault.
          </Link>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-blue-600">
              Welcome {register ? "aboard" : "back"}
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              {register ? "Create your account" : "Sign in to DevVault"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {register
                ? "Start organizing your developer knowledge."
                : "Pick up where your learning left off."}
            </p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            {register && (
              <Field label="Full name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </Field>
            )}
            <Field label="Email address">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password">
              <input
                required
                minLength="4"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter any password for demo"
              />
            </Field>
            <button className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
              {register ? "Create account" : "Sign in"}{" "}
              <ArrowRight className="ml-1 inline" size={16} />
            </button>
            <p className="text-center text-xs leading-5 text-slate-400">
              Demo authentication only. No server or real account is created.
            </p>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            {register ? "Already have an account?" : "New to DevVault?"}{" "}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-800"
              to={register ? "/login" : "/register"}
            >
              {register ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
