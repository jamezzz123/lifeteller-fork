import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastConfig {
  message: string;
  duration?: number;
  onHide?: () => void;
}

interface BottomToastContextType {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

const BottomToastContext = createContext<BottomToastContextType | null>(null);

export function useBottomToast() {
  const context = useContext(BottomToastContext);
  if (!context) {
    throw new Error('useBottomToast must be used within a BottomToastProvider');
  }
  return context;
}

interface BottomToastProviderProps {
  children: React.ReactNode;
}

export function BottomToastProvider({ children }: BottomToastProviderProps) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [onHideCallback, setOnHideCallback] = useState<(() => void) | null>(
    null
  );

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      if (onHideCallback) {
        onHideCallback();
        setOnHideCallback(null);
      }
    });
  }, [opacity, overlayOpacity, translateY, onHideCallback]);

  const show = useCallback(
    (config: ToastConfig) => {
      const { message: msg, duration = 3000, onHide } = config;

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setMessage(msg);
      setOnHideCallback(() => onHide || null);
      setVisible(true);

      // Reset animation values
      translateY.setValue(100);
      opacity.setValue(0);
      overlayOpacity.setValue(0);

      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [translateY, opacity, overlayOpacity, hideToast]
  );

  const hide = useCallback(() => {
    hideToast();
  }, [hideToast]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <BottomToastContext.Provider value={{ show, hide }}>
      {children}
      {visible && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* Dark Overlay */}
          <TouchableWithoutFeedback onPress={hideToast}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity,
                },
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Toast */}
          <Animated.View
            style={[
              styles.container,
              {
                bottom: insets.bottom + 60,
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.toast}>
              <Text style={styles.message}>{message}</Text>
              <TouchableOpacity
                onPress={hideToast}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeButton}
              >
                <X size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </BottomToastContext.Provider>
  );
}

// Legacy component for backwards compatibility
interface BottomToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  onHide: () => void;
}

export function BottomToast({
  visible,
  message,
  duration = 4000,
  onHide,
}: BottomToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [opacity, overlayOpacity, translateY, onHide]);

  useEffect(() => {
    if (visible) {
      // Reset animation values
      translateY.setValue(100);
      opacity.setValue(0);
      overlayOpacity.setValue(0);

      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, duration, hideToast, translateY, opacity, overlayOpacity]);

  if (!visible) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dark Overlay */}
      <TouchableWithoutFeedback onPress={hideToast}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Toast */}
      <Animated.View
        style={[
          styles.container,
          {
            bottom: insets.bottom + 60,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.toast}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            onPress={hideToast}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.closeButton}
          >
            <X size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3D3D3D',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
});
