import { useMqtt } from '@/context/MqttContext';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

export function ConnectionStatus() {
  const { connectionStatus, connect } = useMqtt();
  const [showReconnect, setShowReconnect] = useState(false);

  // If disconnected for more than 5 seconds, show reconnect option
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (connectionStatus === 'disconnected') {
      timer = setTimeout(() => {
        setShowReconnect(true);
      }, 5000);
    } else {
      setShowReconnect(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [connectionStatus]);

  // Determine status color and text
  let statusColor = "bg-gray-500";
  let statusText = "Initializing";
  let icon = <Wifi className="h-4 w-4 mr-1" />;

  switch (connectionStatus) {
    case 'connected':
      statusColor = "bg-green-500";
      statusText = "Connected";
      break;
    case 'connecting':
      statusColor = "bg-yellow-500";
      statusText = "Connecting";
      break;
    case 'disconnected':
      statusColor = "bg-red-500";
      statusText = "Disconnected";
      icon = <WifiOff className="h-4 w-4 mr-1" />;
      break;
    case 'error':
      statusColor = "bg-red-500";
      statusText = "Error";
      icon = <WifiOff className="h-4 w-4 mr-1" />;
      break;
  }

  const handleReconnectClick = () => {
    if (showReconnect) {
      connect();
      setShowReconnect(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-flex items-center">
            <Badge
              variant="outline"
              className={`${statusColor} text-white hover:${statusColor} ${showReconnect ? 'cursor-pointer' : ''}`}
              onClick={handleReconnectClick}
            >
              {icon}
              {statusText}
            </Badge>
            {showReconnect && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>RFID Connection Status</p>
          {showReconnect && <p className="text-xs">Click to reconnect</p>}
          {connectionStatus === 'connected' && <p className="text-xs">Connected to real RFID hardware</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
