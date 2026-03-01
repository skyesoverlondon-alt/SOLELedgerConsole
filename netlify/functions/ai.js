import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const baseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const normalizeMessages = (rawInput) => {
  const entries = Array.isArray(rawInput)
    ? rawInput
    : [{ role: "user", content: rawInput }];

  return entries.map((entry) => {
    if (typeof entry === "string") {
      return { role: "user", content: entry };
    }

    const role = entry?.role || "user";
    const contentValue = entry?.content ?? "";
    const content = typeof contentValue === "string"
      ? contentValue
      : JSON.stringify(contentValue);

    return { role, content };
  });
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: baseHeaders };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: "OPENAI_API_KEY is not set" })
    };
  }

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  const model = payload.model || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const system = payload.system || "You are a concise assistant for the SOLE Ledger console.";
  const input = payload.input ?? payload.messages ?? payload.prompt;

  if (!input) {
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({ error: "Provide input, messages, or prompt" })
    };
  }

  const messages = [
    { role: "system", content: system },
    ...normalizeMessages(input)
  ];

  try {
    const response = await client.responses.create({
      model,
      input: messages,
      max_output_tokens: payload.maxTokens ?? 512
    });

    const output = response.output?.[0]?.content?.[0]?.text ?? "";

    return {
      statusCode: 200,
      headers: baseHeaders,
      body: JSON.stringify({ output, model: response.model, usage: response.usage })
    };
  } catch (error) {
    const statusCode = error.status || 500;
    return {
      statusCode,
      headers: baseHeaders,
      body: JSON.stringify({
        error: error.message || "OpenAI request failed",
        details: error.response?.data || null
      })
    };
  }
};
