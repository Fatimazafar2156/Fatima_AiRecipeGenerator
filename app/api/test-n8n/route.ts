import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl || n8nWebhookUrl === "https://your-n8n-instance.com/webhook/recipe-generator") {
      return NextResponse.json({
        connected: false,
        error: "N8N_WEBHOOK_URL not configured",
        webhookUrl: "not configured",
        timestamp: new Date().toISOString(),
      })
    }

    const testPayload = {
      type: "test",
      input: "connection test",
      userId: "test-user",
      timestamp: new Date().toISOString(),
      source: "connection-test",
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (process.env.N8N_API_KEY && process.env.N8N_API_KEY !== "your-n8n-api-key-optional") {
      headers["Authorization"] = `Bearer ${process.env.N8N_API_KEY}`
    }

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    return NextResponse.json({
      connected: response.ok,
      status: response.status,
      webhookUrl: "configured",
      timestamp: new Date().toISOString(),
      ...(response.ok ? {} : { error: `HTTP ${response.status}` }),
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      webhookUrl: process.env.N8N_WEBHOOK_URL ? "configured" : "not configured",
      timestamp: new Date().toISOString(),
    })
  }
}
