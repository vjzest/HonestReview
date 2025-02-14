import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const prompt =
      "Create three engaging, open-ended questions separated by '||' for a diverse audience. " +
      "Avoid personal topics, focusing on universal themes. Format like: 'Question1||Question2||Question3'.";

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContentStream(prompt);

    // Log the result to debug
    console.log('Gemini API response:', result);

    // Convert the Gemini stream into a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = await chunk.text(); // Ensure `text()` is awaited
            console.log('Stream chunk:', text); // Log each chunk
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          controller.error(error);
        }
      },
    });

    // Return the stream directly as a Response
    return new Response(stream);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
