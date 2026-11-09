import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { productDetails } = await req.json();

    if (!productDetails) {
      return NextResponse.json({ error: 'Product details are required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert e-commerce copywriter and SEO specialist. 
Your job is to take raw product features provided by the user and turn them into high-converting, professional product copy ready for Shopify.

You MUST respond strictly in valid JSON format with the following keys:
{
  "title": "An attention-grabbing, SEO-friendly product title",
  "description": "A 2-3 paragraph persuasive sales copy using benefit-driven language",
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: productDetails },
      ],
      response_format: { type: 'json_object' },
    });

    const parsedResult = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate copy' }, { status: 500 });
  }
}

