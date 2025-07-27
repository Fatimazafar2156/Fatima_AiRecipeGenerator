import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY

    if (!apiKey || apiKey === "your_google_genai_api_key") {
      return NextResponse.json({
        connected: false,
        error: "GOOGLE_GENAI_API_KEY environment variable is not set",
        timestamp: new Date().toISOString(),
      })
    }

    // Test the Gemini API connection with a simple request
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say 'Hello' in one word.",
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 10,
          },
        }),
      },
    )

    if (response.ok) {
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      return NextResponse.json({
        connected: true,
        message: "Gemini API connection successful",
        testResponse: text,
        timestamp: new Date().toISOString(),
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json({
        connected: false,
        error: `Gemini API returned ${response.status}: ${errorText}`,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    let errorMessage = "Unknown error"

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for specific errors
      if (errorMessage.includes("401")) {
        errorMessage = "Invalid Gemini API key"
      } else if (errorMessage.includes("429")) {
        errorMessage = "Gemini API rate limit exceeded or insufficient quota"
      } else if (errorMessage.includes("quota")) {
        errorMessage = "Gemini API quota exceeded - please check your usage"
      }
    }

    return NextResponse.json({
      connected: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    })
  }
}
