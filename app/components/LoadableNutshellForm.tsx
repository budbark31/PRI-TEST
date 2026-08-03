"use client";

import { useState } from "react";
import NutshellForm from "@/app/components/NutshellForm";

type LoadableNutshellFormProps = {
  title: string;
  description: string;
  buttonLabel: string;
  formId?: string;
  instanceId?: string;
  targetId?: string;
  className?: string;
};

export default function LoadableNutshellForm({
  title,
  description,
  buttonLabel,
  formId,
  instanceId,
  targetId,
  className,
}: LoadableNutshellFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <div className="border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-900">Talk to sales</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{title}</h3>
          </div>
          {!isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center border-2 border-slate-900 bg-orange-500 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_#0f172a] transition-transform hover:-translate-y-0.5 hover:bg-orange-600 active:translate-y-0"
            >
              {buttonLabel}
            </button>
          )}
        </div>

        <p className="mt-3 max-w-2xl text-sm text-gray-600">{description}</p>

        {isOpen ? (
          <div className="mt-6">
            <NutshellForm
              formId={formId}
              instanceId={instanceId}
              targetId={targetId}
              className="w-full max-w-full bg-white [&_*]:bg-white"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}