/**
 * Simple event emitter for auth-related events
 * Used to communicate between API client and auth context
 */
type AuthEventListener = () => void;

class AuthEventEmitter {
  private listeners: AuthEventListener[] = [];

  /**
   * Subscribe to logout events
   */
  onLogout(callback: AuthEventListener) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  /**
   * Emit logout event
   */
  emitLogout() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error('Error in logout listener:', error);
      }
    });
  }
}

export const authEvents = new AuthEventEmitter();
