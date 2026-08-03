"use client";

import { useEffect, useId, useMemo } from "react";
const DEFAULT_FORM_ID = "RsLNpW";
const DEFAULT_INSTANCE_ID = "382895";

type NutshellFormProps = {
  formId?: string;
  instanceId?: string;
  authToken?: string;
  targetId?: string;
  className?: string;
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

export default function NutshellForm({
  formId = DEFAULT_FORM_ID,
  instanceId = DEFAULT_INSTANCE_ID,
  authToken = "",
  targetId,
  className,
}: NutshellFormProps) {
  const reactId = useId();
  const resolvedTargetId = useMemo(
    () => sanitizeId(targetId ?? `nutshell-form-${reactId}`),
    [targetId, reactId]
  );

  useEffect(() => {
    ensureNutshellerQueue();

    const win = window as NutshellWindow;
    win.Nutsheller?.("initForm", {
      form: formId,
      instance: instanceId,
      authToken,
      target: resolvedTargetId,
    });
  }, [formId, instanceId, authToken, resolvedTargetId]);

  return <div id={resolvedTargetId} className={className} />;
}
