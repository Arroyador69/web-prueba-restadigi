import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  createReservation,
  createSalesLead,
  ensureChatSession,
  parseReservationArgs,
  saveChatMessage,
} from "@/lib/chat-service";
import type { ChatMessage } from "@/lib/chatbot-prompt";
import { getDatabaseUrl } from "@/lib/database-url";
import {
  buildSalesChatbotSystemPrompt,
  formatSalesLeadMessage,
  parseSalesLeadArgs,
  SALES_LEAD_TOOL,
} from "@/lib/sales-chatbot-prompt";
import {
  buildChatbotSystemPrompt,
  buildReservationTool,
  getRestaurantSettings,
} from "@/lib/settings-service";
import { enforceRateLimit } from "@/lib/rate-limit";

const chatRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  visitorSessionId: z.string().uuid().optional(),
  locale: z.enum(["fi", "en", "es"]).optional(),
  mode: z.enum(["sales", "reservation"]).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

type OpenAiTool = ReturnType<typeof buildReservationTool> | typeof SALES_LEAD_TOOL;

type OpenAiMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
};

async function callOpenAi(
  messages: OpenAiMessage[],
  apiKey: string,
  model: string,
  tools: OpenAiTool[],
  temperature = 0.7,
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      ...(tools.length > 0 ? { tools, tool_choice: "auto" as const } : {}),
      max_tokens: 600,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API error:", response.status, errorText);
    throw new Error("OpenAI request failed");
  }

  return (await response.json()) as {
    choices?: Array<{ message?: OpenAiMessage }>;
  };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "chat");
        if (limited) return limited;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return Response.json(
            { error: "OpenAI API -avain puuttuu. Aseta OPENAI_API_KEY ympäristömuuttujaksi." },
            { status: 500 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Virheellinen pyyntö." }, { status: 400 });
        }

        const parsed = chatRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Virheelliset viestit." }, { status: 400 });
        }

        const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
        const userMessages = parsed.data.messages;
        const lastUserMessage = userMessages[userMessages.length - 1];
        const locale = parsed.data.locale ?? "fi";
        const mode = parsed.data.mode ?? "sales";
        const settings = await getRestaurantSettings();

        const tools: OpenAiTool[] =
          mode === "reservation"
            ? settings.reservationsEnabled
              ? [buildReservationTool(settings)]
              : []
            : [SALES_LEAD_TOOL];

        const systemPrompt =
          mode === "reservation"
            ? buildChatbotSystemPrompt(settings, locale)
            : buildSalesChatbotSystemPrompt(locale);

        let sessionId = parsed.data.sessionId;
        let reservationCreated = false;
        let leadCaptured = false;

        if (getDatabaseUrl()) {
          try {
            sessionId = await ensureChatSession(sessionId, parsed.data.visitorSessionId);
            if (lastUserMessage?.role === "user") {
              await saveChatMessage(sessionId, "user", lastUserMessage.content);
            }
          } catch (error) {
            console.error("Chat DB error:", error);
          }
        }

        const openAiMessages: OpenAiMessage[] = [
          { role: "system", content: systemPrompt },
          ...userMessages.map((m) => ({ role: m.role, content: m.content })),
        ];

        try {
          const temperature = mode === "reservation" ? 0.3 : 0.7;
          let data = await callOpenAi(openAiMessages, apiKey, model, tools, temperature);
          let assistantMsg = data.choices?.[0]?.message;

          if (assistantMsg?.tool_calls?.length) {
            openAiMessages.push(assistantMsg);

            for (const toolCall of assistantMsg.tool_calls) {
              let toolContent = "OK";

              if (toolCall.function.name === "create_restaurant_reservation") {
                toolContent = "Varaus tallennettu onnistuneesti.";
                try {
                  const args = parseReservationArgs(toolCall.function.arguments);
                  if (!getDatabaseUrl()) {
                    throw new Error("Tietokantaa ei ole konfiguroitu");
                  }
                  if (!sessionId) {
                    throw new Error("Chat-istunto puuttuu");
                  }
                  await createReservation({ ...args, chatSessionId: sessionId }, settings);
                  reservationCreated = true;
                } catch (error) {
                  console.error("Reservation error:", error);
                  toolContent =
                    error instanceof Error
                      ? `Varauksen tallennus epäonnistui: ${error.message}. Pyydä asiakasta tarkistamaan tiedot.`
                      : "Varauksen tallennus epäonnistui. Pyydä asiakasta tarkistamaan tiedot.";
                }
              } else if (toolCall.function.name === "capture_sales_lead") {
                toolContent = "Yhteystiedot tallennettu. Restadigi ottaa yhteyttä.";
                try {
                  const lead = parseSalesLeadArgs(toolCall.function.arguments);
                  if (!getDatabaseUrl()) {
                    throw new Error("Tietokantaa ei ole konfiguroitu");
                  }
                  if (!sessionId) {
                    throw new Error("Chat-istunto puuttuu");
                  }
                  await saveChatMessage(sessionId, "system", formatSalesLeadMessage(lead));
                  await createSalesLead({ ...lead, chatSessionId: sessionId });
                  leadCaptured = true;
                } catch (error) {
                  console.error("Sales lead error:", error);
                  toolContent =
                    error instanceof Error
                      ? `Yhteystietojen tallennus epäonnistui: ${error.message}. Pyydä puhelin ja sähköposti uudelleen.`
                      : "Yhteystietojen tallennus epäonnistui. Pyydä puhelin ja sähköposti uudelleen.";
                }
              }

              openAiMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: toolContent,
              });
            }

            data = await callOpenAi(openAiMessages, apiKey, model, tools, temperature);
            assistantMsg = data.choices?.[0]?.message;
          }

          const reply = assistantMsg?.content?.trim();
          if (!reply) {
            return Response.json({ error: "Tyhjä vastaus chatbotilta." }, { status: 502 });
          }

          if (getDatabaseUrl() && sessionId) {
            try {
              await saveChatMessage(sessionId, "assistant", reply);
            } catch (error) {
              console.error("Save assistant message error:", error);
            }
          }

          const assistantMessage: ChatMessage = { role: "assistant", content: reply };
          return Response.json({
            message: assistantMessage,
            sessionId,
            reservationCreated,
            leadCaptured,
          });
        } catch (error) {
          console.error("Chat API error:", error);
          return Response.json({ error: "Palvelinvirhe. Yritä uudelleen." }, { status: 500 });
        }
      },
    },
  },
});
