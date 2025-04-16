
import { toast } from 'sonner';
import mqttCore from '../core/mqttCore';

// Reconnection constants
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 5000;

class ReconnectionManager {
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private currentReconnectAttempts = 0;
  private reconnectDelay = INITIAL_RECONNECT_DELAY;
  
  scheduleReconnect(connectFunction: () => void): void {
    // Don't schedule multiple reconnects
    if (this.reconnectTimer) {
      return;
    }
    
    // Implement exponential backoff with max attempts
    if (this.currentReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.currentReconnectAttempts++;
      
      // Exponential backoff with jitter
      const jitter = Math.random() * 1000;
      const delay = Math.min(this.reconnectDelay * Math.pow(1.5, this.currentReconnectAttempts - 1), 60000) + jitter;
      
      console.log(`Scheduling reconnect attempt ${this.currentReconnectAttempts} in ${Math.round(delay/1000)}s`);
      
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        connectFunction();
      }, delay);
    } else {
      console.log('Maximum reconnect attempts reached. Please manually reconnect.');
      toast.error('Could not reconnect to RFID system after multiple attempts', {
        description: 'Please check your connection and try again manually',
        action: {
          label: 'Retry Now',
          onClick: () => {
            this.resetReconnection();
            connectFunction();
          }
        }
      });
    }
  }
  
  resetReconnection(): void {
    this.currentReconnectAttempts = 0;
    this.reconnectDelay = INITIAL_RECONNECT_DELAY;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Create and export a singleton instance
const reconnectionManager = new ReconnectionManager();
export default reconnectionManager;
