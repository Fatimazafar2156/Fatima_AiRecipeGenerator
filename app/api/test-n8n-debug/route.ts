import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || "NOT_SET",
      N8N_API_KEY: process.env.N8N_API_KEY ? "SET (hidden)" : "NOT_SET",
      NODE_ENV: process.env.NODE_ENV,
    },
    tests: [] as any[],
  }

  // Test 1: Check if webhook URL is configured
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl || webhookUrl === "https://your-n8n-instance.com/webhook/recipe-generator") {
    debugInfo.tests.push({
      test: "Webhook URL Configuration",
      status: "FAIL",
      message: "N8N_WEBHOOK_URL is not properly configured",
      solution: "Set N8N_WEBHOOK_URL in your .env.local file",
    })
    return NextResponse.json(debugInfo)
  }

  debugInfo.tests.push({
    test: "Webhook URL Configuration",
    status: "PASS",
    message: `Webhook URL is configured: ${webhookUrl}`,
  })

  // Test 2: Check URL format
  try {
    new URL(webhookUrl)
    debugInfo.tests.push({
      test: "URL Format",
      status: "PASS",
      message: "Webhook URL format is valid",
    })
  } catch (error) {
    debugInfo.tests.push({
      test: "URL Format",
      status: "FAIL",
      message: "Invalid webhook URL format",
      solution: "Check that your webhook URL is a valid URL (starts with http:// or https://)",
    })
    return NextResponse.json(debugInfo)
  }

  // Test 3: Basic connectivity test
  try {
    const testPayload = {
      type: "test",
      input: "connection test",
      userId: "debug-test",
      timestamp: new Date().toISOString(),
      source: "debug-test",
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (process.env.N8N_API_KEY && process.env.N8N_API_KEY !== "your-n8n-api-key-optional") {
      headers["Authorization"] = `Bearer ${process.env.N8N_API_KEY}`
    }

    console.log("Testing n8n connection to:", webhookUrl)
    console.log("Headers:", headers)
    console.log("Payload:", testPayload)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    const responseText = await response.text()
    console.log("n8n response status:", response.status)
    console.log("n8n response text:", responseText)

    if (response.ok) {
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      debugInfo.tests.push({
        test: "n8n Connection",
        status: "PASS",
        message: "Successfully connected to n8n webhook",
        response: {
          status: response.status,
          data: responseData,
        },
      })
    } else {
      debugInfo.tests.push({
        test: "n8n Connection",
        status: "FAIL",
        message: `n8n webhook returned ${response.status}`,
        response: {
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        },
        solutions: [
          "Check if your n8n workflow is active",
          "Verify the webhook URL is correct",
          "Check if n8n is running and accessible",
          "Verify your n8n credentials are correct",
        ],
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    debugInfo.tests.push({
      test: "n8n Connection",
      status: "ERROR",
      message: `Connection failed: ${errorMessage}`,
      solutions: [
        "Check if n8n is running (if local: http://localhost:5678)",
        "Verify network connectivity",
        "Check firewall settings",
        "If using n8n cloud, verify the webhook URL",
      ],
    })
  }

  return NextResponse.json(debugInfo)
}
