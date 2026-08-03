"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
const DEFAULT_FORM_ID = "rt1MGX";
const DEFAULT_INSTANCE_ID = "382895";
const NUTSHELL_SCRIPT_SRC = "https://loader.nutshell.com/nutsheller-esm.js";
const NUTSHELL_SCRIPT_ATTR = "data-nutsheller-script";

type NutshellFormProps = {
  formId?: string;
  instanceId?: string;
  authToken?: string;
  targetId?: string;
  className?: string;
  deferUntilVisible?: boolean;
};

type NutshellerFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

type NutshellWindow = Window & {
  Nutsheller?: NutshellerFn;
};

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");

const ensureNutshellerQueue = () => {
  const win = window as NutshellWindow;
  if (win.Nutsheller) return;

  const queueFn: NutshellerFn = (...args: unknown[]) => {
    queueFn.q = queueFn.q || [];
    queueFn.q.push(args);
  };

  win.Nutsheller = queueFn;
};

const ensureNutshellerScript = () => {
  if (document.querySelector(`script[src="${NUTSHELL_SCRIPT_SRC}"]`)) return;
  if (document.querySelector(`script[${NUTSHELL_SCRIPT_ATTR}]`)) return;

  const script = document.createElement("script");
  script.src = NUTSHELL_SCRIPT_SRC;
  script.type = "module";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute(NUTSHELL_SCRIPT_ATTR, "true");
  document.head.appendChild(script);
};

export default function NutshellForm({
  formId = DEFAULT_FORM_ID,
  instanceId = DEFAULT_INSTANCE_ID,
  authToken = "",
  targetId,
  className,
  deferUntilVisible = false,
}: NutshellFormProps) {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(!deferUntilVisible);
  const resolvedTargetId = useMemo(
    () => sanitizeId(targetId ?? `nutshell-form-${reactId}`),
    [targetId, reactId]
  );

  useEffect(() => {
    if (!deferUntilVisible) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px", threshold: 1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [deferUntilVisible]);

  useEffect(() => {
    if (!isVisible) return;

    ensureNutshellerQueue();

    const win = window as NutshellWindow;
    win.Nutsheller?.("initForm", {
      form: formId,
      instance: instanceId,
      authToken,
      target: resolvedTargetId,
    });

    ensureNutshellerScript();
  }, [formId, instanceId, authToken, resolvedTargetId, isVisible]);

  const containerClassName = ["w-full max-w-full", className].filter(Boolean).join(" ");

  return <div ref={containerRef} id={resolvedTargetId} className={containerClassName} />;
}
