import { useEffect } from "react";

// Best-effort UI deterrents only. Note: in any web browser, users with intent
// can still open devtools and inspect network traffic. This raises friction.
export function NoInspect() {
  useEffect(() => {
    const onCtx = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U
      if (
        k === "f12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
        ((e.ctrlKey || e.metaKey) && k === "u")
      ) {
        e.preventDefault();
      }
    };
    const onDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onCtx);
    document.addEventListener("keydown", onKey);
    document.addEventListener("dragstart", onDrag);
    return () => {
      document.removeEventListener("contextmenu", onCtx);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("dragstart", onDrag);
    };
  }, []);
  return null;
}
