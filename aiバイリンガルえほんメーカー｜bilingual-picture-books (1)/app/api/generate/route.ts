import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/genai"; // 例：@google/genai の場合
// ↑ SDKによっては import 名が異なるので、`package.json` の依存とREADMEのサンプルに合わせてください。

export async function POST(req: Request) {
  const { params } = await req.json(); // CreationParams を受ける
  const apiKey = process.env.GOOGLE_API_KEY!;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
  }

  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({ model: "gemini-1.5-pro" });
  // ↑ 使っていたモデル名に合わせて変更（flash等でも可）

  // ここで、もともとの services/geminiService.ts のロジックを移植
  // 例：物語テキスト生成 → 画像プロンプト生成 → 必要なら画像生成API など
  const res = await model.generateContent(/* あなたのプロンプト組み立て */);
  const text = res.response.text();

  return NextResponse.json({ text });
}
