import { useState } from 'react';
import { CONSTANTS } from '../constants';
import { TopBarProps } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function TopBar({ onCreateMap, isLoading, mapAxes }: TopBarProps) {
  const [xAxis, setXAxis] = useState(mapAxes.xAxis);
  const [yAxis, setYAxis] = useState(mapAxes.yAxis);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMap({ xAxis, yAxis });
  };

  return (
    <div className="border-b bg-card p-4">
      <div className="flex items-center justify-between max-w-4xl">
        <form onSubmit={handleSubmit} className="flex items-end gap-4 flex-1">
          <div className="flex-1">
            <Label htmlFor="x-axis">X軸</Label>
            <Input
              id="x-axis"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              placeholder={CONSTANTS.PLACEHOLDERS.X_AXIS}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex-1">
            <Label htmlFor="y-axis">Y軸</Label>
            <Input
              id="y-axis"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              placeholder={CONSTANTS.PLACEHOLDERS.Y_AXIS}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !xAxis.trim() || !yAxis.trim()}
          >
            {isLoading ? CONSTANTS.BUTTONS.CREATING_MAP : CONSTANTS.BUTTONS.CREATE_MAP}
          </Button>
        </form>
        
      </div>
    </div>
  );
}