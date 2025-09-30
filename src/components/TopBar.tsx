import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapAxes } from '../App';

interface TopBarProps {
  onCreateMap: (axes: MapAxes) => void;
  isLoading: boolean;
  mapAxes: MapAxes;
}

export function TopBar({ onCreateMap, isLoading, mapAxes }: TopBarProps) {
  const [xAxis, setXAxis] = useState(mapAxes.xAxis);
  const [yAxis, setYAxis] = useState(mapAxes.yAxis);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMap({ xAxis, yAxis });
  };

  return (
    <div className="border-b bg-card p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-4 max-w-4xl">
        <div className="flex-1">
          <Label htmlFor="x-axis">X軸</Label>
          <Input
            id="x-axis"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            placeholder="例: エネルギー、テンポ、ポジティブさ"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex-1">
          <Label htmlFor="y-axis">Y軸</Label>
          <Input
            id="y-axis"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            placeholder="例: ダンサビリティ、感情価、アコースティック度"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !xAxis.trim() || !yAxis.trim()}
        >
          {isLoading ? 'マップ作成中...' : 'マップ作成'}
        </Button>
      </form>
    </div>
  );
}