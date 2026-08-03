import "server-only";

const DEFAULT_BASE_URL = "https://app.nutshell.com";

const getBaseUrl = () => {
  const base = process.env.NUTSHELL_BASE_URL || DEFAULT_BASE_URL;
  return base.replace(/\/$/, "");
};

const getAuthHeader = () => {
  const apiKey = process.env.NUTSHELL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NUTSHELL_API_KEY");
  }

  const token = Buffer.from(`${apiKey}:`).toString("base64");
  return `Basic ${token}`;
};

const nutshellRequest = async <T>(path: string, options?: RequestInit) => {
  const url = `${getBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: getAuthHeader(),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Nutshell API error ${response.status}: ${text}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

type Stageset = {
  id: string;
  name: string;
};

type StageLink = {
  stageset?: string;
};

type Stage = {
  id: string;
  name: string;
  links?: StageLink[];
};

type LeadResponse = {
  id?: string;
  htmlUrl?: string;
};

export const resolveStagesetId = async (pipelineName: string) => {
  const stagesets = await nutshellRequest<Stageset[]>("/rest/stagesets");
  const match = stagesets.find((stageset) => stageset.name.toLowerCase() === pipelineName.toLowerCase());
  return match?.id;
};

export const resolveStageId = async (stageName: string, stagesetId?: string) => {
  const stages = await nutshellRequest<Stage[]>("/rest/stages");
  const filtered = stagesetId
    ? stages.filter((stage) => stage.links?.some((link) => link.stageset === stagesetId))
    : stages;
  const match = filtered.find((stage) => stage.name.toLowerCase() === stageName.toLowerCase());
  return match?.id;
};

export const createLead = async (lead: Record<string, unknown>) => {
  const response = await nutshellRequest<LeadResponse>("/rest/leads", {
    method: "POST",
    body: JSON.stringify({ leads: [lead] }),
  });
  return response;
};

export const setLeadStageset = async (leadId: string, stagesetId: string) => {
  await nutshellRequest(`/rest/leads/${leadId}/stageset`, {
    method: "POST",
    body: JSON.stringify({ stageset: stagesetId }),
  });
};

export const setLeadStage = async (leadId: string, stageId: string) => {
  await nutshellRequest(`/rest/leads/${leadId}/stage`, {
    method: "POST",
    body: JSON.stringify({ stage: stageId }),
  });
};
