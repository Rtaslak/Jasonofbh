
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface ConfigActionButtonsProps {
  isTesting: boolean;
  onTest: () => void;
  onSave: () => void;
}

export function ConfigActionButtons({ isTesting, onTest, onSave }: ConfigActionButtonsProps) {
  return (
    <div className="pt-2 flex space-x-2">
      <Button 
        variant="outline" 
        onClick={onTest} 
        disabled={isTesting}
      >
        {isTesting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Test Connection
      </Button>
      <Button onClick={onSave}>
        <Save className="w-4 h-4 mr-2" />
        Save Configuration
      </Button>
    </div>
  );
}
