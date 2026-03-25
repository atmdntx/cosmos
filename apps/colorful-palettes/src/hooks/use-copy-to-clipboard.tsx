import { useCallback, useEffect, useRef, useState } from "react";
import { m } from "@/paraglide/messages";

type CopyStatus = "idle" | "reading" | "copying" | "copied" | "already" | "error";

interface UseCopyToClipboardOptions {
  /**
   * Default text to copy when `copy` is invoked without arguments.
   */
  text?: string;
  /**
   * Milliseconds to wait before returning the status to `idle`.
   * Set to `0` or a negative value to keep the last status.
   */
  resetAfter?: number;
  /**
   * Whether to read the clipboard before writing so we can detect
   * if the target text is already stored.
   */
  compareOnCopy?: boolean;
}

interface UseCopyToClipboardReturn {
  status: CopyStatus;
  isSupported: boolean;
  clipboardText: string | null;
  isClipboardEqual: boolean;
  error: Error | null;
  copy: (value?: string) => Promise<boolean>;
  readClipboard: () => Promise<string | null>;
  reset: () => void;
}

const DEFAULT_RESET_AFTER = 0;

const hasClipboardWrite = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.clipboard !== "undefined" &&
  typeof navigator.clipboard.writeText === "function";

const hasClipboardRead = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.clipboard !== "undefined" &&
  typeof navigator.clipboard.readText === "function";

const toError = (reason: unknown) => (reason instanceof Error ? reason : new Error(String(reason)));

/**
 * Small helper to centralize copy button feedback logic. Besides handling the
 * `navigator.clipboard` actions, it also lets consumers know when the text to
 * copy is already present in the clipboard so UI messages/icons can react.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { text, resetAfter = DEFAULT_RESET_AFTER, compareOnCopy = true } = options;

  const [status, setStatus] = useState<CopyStatus>("idle");
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const textRef = useRef(text ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSupported, setIsSupported] = useState(() => hasClipboardWrite());

  useEffect(() => {
    textRef.current = text ?? "";
  }, [text]);

  useEffect(() => {
    setIsSupported(hasClipboardWrite());
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setError(null);
  }, [clearTimer]);

  const scheduleReset = useCallback(() => {
    if (resetAfter <= 0) {
      return;
    }
    clearTimer();
    timerRef.current = setTimeout(() => {
      setStatus("idle");
      timerRef.current = null;
    }, resetAfter);
  }, [clearTimer, resetAfter]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const readClipboard = useCallback(async () => {
    if (!hasClipboardRead()) {
      const err = new Error(m.error_clipboard_read());
      setError(err);
      setStatus("error");
      return null;
    }

    try {
      setStatus("reading");
      const textFromClipboard = await navigator.clipboard.readText();
      setClipboardText(textFromClipboard);
      setStatus(textFromClipboard === textRef.current ? "already" : "idle");
      return textFromClipboard;
    } catch (reason) {
      const err = toError(reason);
      setError(err);
      setStatus("error");
      return null;
    }
  }, []);

  const copy = useCallback(
    async (value?: string) => {
      if (!hasClipboardWrite()) {
        const err = new Error(m.error_clipboard_write());
        setError(err);
        setStatus("error");
        return false;
      }

      const target = value ?? textRef.current;
      if (!target) {
        const err = new Error(m.error_nothing_to_copy());
        setError(err);
        setStatus("error");
        return false;
      }

      textRef.current = target;

      try {
        setStatus("copying");

        if (compareOnCopy && hasClipboardRead()) {
          try {
            const currentClipboard = await navigator.clipboard.readText();
            setClipboardText(currentClipboard);
            if (currentClipboard === target) {
              setStatus("already");
              scheduleReset();
              return true;
            }
          } catch (reason) {
            // Reading may fail due to permissions; surface the error but keep copying.
            setError(toError(reason));
          }
        }

        await navigator.clipboard.writeText(target);
        setClipboardText(target);
        setError(null);
        setStatus("copied");
        scheduleReset();
        return true;
      } catch (reason) {
        const err = toError(reason);
        setError(err);
        setStatus("error");
        return false;
      }
    },
    [compareOnCopy, scheduleReset],
  );

  return {
    status,
    clipboardText,
    isClipboardEqual: Boolean(clipboardText && clipboardText === textRef.current),
    error,
    isSupported,
    copy,
    readClipboard,
    reset,
  };
}
