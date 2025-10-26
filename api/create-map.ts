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
  x: number;
  y: number;
}

// OpenAI APIを使って曲を軸に沿ってマッピング
async function mapSongsWithAI(
  songs: Omit<Song, 'x' | 'y'>[],
  xAxis: string,
  yAxis: string
): Promise<Song[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `以下の曲リストを、指定された2つの軸に基づいて2次元平面上にマッピングしてください。

軸の定義:
- X軸: ${xAxis}（-1.0 が最も低く、+1.0 が最も高い）
- Y軸: ${yAxis}（-1.0 が最も低く、+1.0 が最も高い）

曲リスト:
${songs.map((song, i) => `${i + 1}. "${song.title}" by ${song.artist}`).join('\n')}

各曲について、指定された軸に基づいてX座標とY座標を-1.0から+1.0の範囲で割り当ててください。
JSONフォーマットで、以下の形式で返してください:
[
  {"index": 0, "x": 0.5, "y": -0.3},
  {"index": 1, "x": -0.2, "y": 0.8},
  ...
]

重要: 配列のみを返し、説明文は含めないでください。`;

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

  const responseText = completion.choices[0].message.content || '[]';
  let coordinates: Array<{ index: number; x: number; y: number }>;

  try {
    // レスポンスがオブジェクトでラップされている可能性があるため、処理する
    const parsed = JSON.parse(responseText);
    coordinates = Array.isArray(parsed) ? parsed : parsed.coordinates || parsed.songs || [];
  } catch (error) {
    console.error('Failed to parse AI response:', responseText);
    // パースに失敗した場合はランダムな座標を割り当て
    coordinates = songs.map((_, i) => ({
      index: i,
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    }));
  }

  // 曲に座標を割り当て
  return songs.map((song, i) => {
    const coord = coordinates.find((c) => c.index === i) || {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    return {
      ...song,
      x: coord.x,
      y: coord.y,
    };
  });
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
    const { xAxis, yAxis, songs } = req.body;

    if (!xAxis || !yAxis) {
      return res.status(400).json({
        success: false,
        message: 'X軸とY軸を指定してください',
        code: 'AXES_REQUIRED',
      });
    }

    // 曲が提供されていない場合は空の配列で初期化
    const initialSongs: Omit<Song, 'x' | 'y'>[] = songs || [];
    
    let mappedSongs: Song[] = [];
    
    // 曲がある場合はAIでマッピング
    if (initialSongs.length > 0) {
      if (!process.env.OPENAI_API_KEY) {
        // OpenAI APIキーがない場合はランダムな座標を割り当て
        mappedSongs = initialSongs.map((song) => ({
          ...song,
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
        }));
      } else {
        mappedSongs = await mapSongsWithAI(initialSongs, xAxis, yAxis);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        mapId: `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        songs: mappedSongs,
      },
      message: 'マップを作成しました',
    });
  } catch (error) {
    console.error('Map creation error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'マップの作成に失敗しました',
      code: 'MAP_CREATION_FAILED',
    });
  }
}

