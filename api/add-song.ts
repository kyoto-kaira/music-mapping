import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  spotifyUrl?: string;
  previewUrl?: string;
  imageUrl?: string;
}

// OpenAI APIを使って曲の座標を計算
async function calculateSongPosition(
  song: Song,
  xAxis: string,
  yAxis: string
): Promise<{ x: number; y: number }> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `曲「${song.title}」by ${song.artist} を以下の2つの軸に基づいて2次元平面上にマッピングしてください。

軸の定義:
- X軸: ${xAxis}（-1.0 が最も低く、+1.0 が最も高い）
- Y軸: ${yAxis}（-1.0 が最も低く、+1.0 が最も高い）

この曲の特徴を考慮して、適切なX座標とY座標を-1.0から+1.0の範囲で決定してください。
JSONフォーマットで以下の形式で返してください:
{"x": 0.5, "y": -0.3}

重要: JSONオブジェクトのみを返し、説明文は含めないでください。`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'あなたは音楽の専門家です。曲の特徴を分析し、指定された軸に基づいて正確にマッピングしてください。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const responseText = completion.choices[0].message.content || '{"x": 0, "y": 0}';

  try {
    const position = JSON.parse(responseText);
    return {
      x: position.x || 0,
      y: position.y || 0,
    };
  } catch (error) {
    console.error('Failed to parse AI response:', responseText);
    // パースに失敗した場合はランダムな座標を返す
    return {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTリクエストのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { song, xAxis, yAxis } = req.body;

    if (!song || !song.id || !song.title || !song.artist) {
      return res.status(400).json({
        success: false,
        message: '曲の情報が不足しています',
        code: 'INVALID_SONG_DATA',
      });
    }

    if (!xAxis || !yAxis) {
      return res.status(400).json({
        success: false,
        message: 'マップの軸情報が必要です',
        code: 'AXES_REQUIRED',
      });
    }

    let position: { x: number; y: number };

    if (!process.env.OPENAI_API_KEY) {
      // OpenAI APIキーがない場合はランダムな座標を割り当て
      position = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
      };
    } else {
      // AIを使って座標を計算
      position = await calculateSongPosition(song, xAxis, yAxis);
    }

    const songWithPosition = {
      ...song,
      ...position,
    };

    return res.status(200).json({
      success: true,
      data: songWithPosition,
      message: '曲を追加しました',
    });
  } catch (error) {
    console.error('Add song error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '曲の追加に失敗しました',
      code: 'SONG_ADDITION_FAILED',
    });
  }
}

