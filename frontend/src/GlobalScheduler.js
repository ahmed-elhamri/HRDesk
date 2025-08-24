import { useEffect, useRef } from "react";
import axios from "axios";

export default function GlobalScheduler() {
  const startedRef = useRef(false); // avoid double-run (Strict Mode)
  const timeoutRef = useRef(null); // current daily timer
  const nextRunAtRef = useRef(null); // when the next run is scheduled

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // 1) Run immediately on first load
    runTask();

    // 2) Schedule today's/tomorrow's 00:05
    scheduleNextDailyRun();

    // 3) If tab becomes visible after 00:05, catch up
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      const now = new Date();
      if (nextRunAtRef.current && now >= nextRunAtRef.current) {
        runTask();
        scheduleNextDailyRun();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  async function runTask() {
    // Your task (runs on first load + daily at 00:05)
    // console.log("Running scheduled task:", new Date().toString());

    // Monthly-only logic:
    if (new Date().getDate() === 1) {
      try {
        const res = await axios.get("http://localhost:8000/api/merge-employes");
        // use res.data
      } catch (e) {
        console.error("merge-employes failed:", e);
      }
      console.log("First of the month — monthly logic here");
    }
  }

  function scheduleNextDailyRun() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(0, 5, 0, 0); // 00:05 local time
    if (next <= now) {
      next.setDate(next.getDate() + 1); // schedule for tomorrow if time passed
    }
    const ms = next - now;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      runTask();
      scheduleNextDailyRun(); // chain the next day (handles DST correctly)
    }, ms);

    nextRunAtRef.current = next;
    // Debug:
    // console.log("Next run at:", next.toString(), "in", ms, "ms");
  }

  return null; // no UI
}
