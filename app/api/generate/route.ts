import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { params } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
    }

    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: "gemini-1.5-pro" });

    // 簡単なテスト用のレスポンスを返す
    const testBook = {
      title: `${params.name}の冒険`,
      pages: [
        {
          text: `むかしむかし、${params.name}という${params.gender}がいました。`,
          textEn: `Once upon a time, there was a ${params.gender === 'おとこのこ' ? 'boy' : 'girl'} named ${params.name}.`,
          image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
          text: `${params.name}は${params.animals[0]}と友達になりました。`,
          textEn: `${params.name} became friends with a ${params.animals[0]}.`,
          image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
          text: `そして二人は楽しい冒険をしました。おしまい。`,
          textEn: `And they had a wonderful adventure together. The end.`,
          image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
        }
      ]
    };

    return NextResponse.json(testBook);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}