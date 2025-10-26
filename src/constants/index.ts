// 定数定義
export const CONSTANTS = {
  // UI関連
  SIDEBAR_WIDTH: 320,
  FLOATING_CARD_WIDTH: 320,
  ANIMATION_DURATION: 200,
  
  // マップ関連
  MAP_PADDING: 0.1,
  MIN_SELECTION_SIZE: 20,
  COORDINATE_RANGE: 100,
  
  // タイミング関連
  NEW_SONG_HIGHLIGHT_DURATION: 3000,
  API_SIMULATION_DELAYS: {
    INITIAL_LOAD: 1000,
    MAP_CREATION: 1500,
    SONG_ADDITION: 800,
    SONG_REMOVAL: 500,
    SEARCH: 800,
  },
  
  // デフォルト値
  DEFAULT_PREVIEW_URL: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  
  // メッセージ
  MESSAGES: {
    ERROR: {
      MAP_CREATION_REQUIRED: 'まずマップを作成してください',
      AXES_REQUIRED: 'X軸とY軸の両方を入力してください',
      INITIAL_LOAD_FAILED: '初期データの読み込みに失敗しました',
      MAP_CREATION_FAILED: 'マップの作成に失敗しました',
      SONG_ADDITION_FAILED: '曲の追加に失敗しました',
      SONG_REMOVAL_FAILED: '曲の削除に失敗しました',
      SEARCH_FAILED: '検索に失敗しました',
    },
    SUCCESS: {
      MAP_CREATED: 'マップを作成しました',
      SONG_ADDED: '曲を追加しました',
      SONG_REMOVED: '曲を削除しました',
    },
    INFO: {
      LOADING_DATA: 'データを読み込み中...',
      UPDATING_MAP: 'マップを更新中...',
      SEARCHING: '検索中...',
      NO_RESULTS: '検索結果が見つかりませんでした',
      ENTER_SEARCH_TERM: '曲名やアーティスト名を入力して検索してください',
      MAP_CREATION_REQUIRED: '曲を追加するにはまずマップを作成してください',
      ENTER_AXES: 'X軸とY軸を入力してください',
      AXES_DESCRIPTION: '上部の入力フィールドでX軸とY軸を設定し、「マップ作成」ボタンを押してください。',
    },
  },
  
  // プレースホルダー
  PLACEHOLDERS: {
    X_AXIS: '例: エネルギー、テンポ、ポジティブさ',
    Y_AXIS: '例: ダンサビリティ、感情価、アコースティック度',
    SEARCH: '曲名やアーティスト名で検索',
  },
  
  // ボタンテキスト
  BUTTONS: {
    CREATE_MAP: 'マップ作成',
    CREATING_MAP: 'マップ作成中...',
    SEARCH: '検索',
    PREVIEW_PLAY: '再生',
    PAUSE: '停止',
    LOADING: '読み込み中...',
    NO_PREVIEW: 'プレビューなし',
  },
} as const;
