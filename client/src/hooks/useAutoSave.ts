import { useEffect, useRef, useState, useCallback } from "react";

interface UseAutoSaveOptions {
  onSave: () => void | Promise<void>;
  delay?: number; // Delay in milliseconds (default: 30000 = 30 seconds)
  enabled?: boolean;
}

export function useAutoSave({ onSave, delay = 30000, enabled = true }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const triggerSave = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    try {
      isSavingRef.current = true;
      setStatus("saving");
      
      await onSave();
      
      setStatus("saved");
      setLastSaved(new Date());
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Auto-save error:", error);
      setStatus("error");
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave, enabled]);

  const scheduleAutoSave = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule new auto-save
    timeoutRef.current = setTimeout(() => {
      triggerSave();
    }, delay);
  }, [delay, enabled, triggerSave]);

  const resetTimer = useCallback(() => {
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Start auto-save timer on mount
  useEffect(() => {
    if (enabled) {
      scheduleAutoSave();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, scheduleAutoSave]);

  return {
    status,
    lastSaved,
    resetTimer,
    triggerSave,
  };
}
