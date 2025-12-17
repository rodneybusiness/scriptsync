/**
 * Mobile Layout Hook
 *
 * Provides responsive layout utilities including:
 * - Screen size detection
 * - Orientation detection
 * - Mobile-specific UI state management
 * - Touch gesture support
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Orientation = 'portrait' | 'landscape';

export interface MobileLayoutState {
  screenSize: ScreenSize;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  viewportWidth: number;
  viewportHeight: number;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

// =============================================================================
// BREAKPOINTS
// =============================================================================

const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// =============================================================================
// SCREEN SIZE DETECTION
// =============================================================================

const getScreenSize = (width: number): ScreenSize => {
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
};

const getOrientation = (width: number, height: number): Orientation => {
  return width > height ? 'landscape' : 'portrait';
};

const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// =============================================================================
// SAFE AREA DETECTION
// =============================================================================

const getSafeAreaInsets = () => {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10),
  };
};

// =============================================================================
// MAIN HOOK
// =============================================================================

export const useMobileLayout = (): MobileLayoutState => {
  const [state, setState] = useState<MobileLayoutState>(() => {
    if (typeof window === 'undefined') {
      return {
        screenSize: 'lg',
        orientation: 'landscape',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        viewportWidth: 1024,
        viewportHeight: 768,
        safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = getScreenSize(width);

    return {
      screenSize: size,
      orientation: getOrientation(width, height),
      isMobile: size === 'xs' || size === 'sm',
      isTablet: size === 'md',
      isDesktop: size === 'lg' || size === 'xl' || size === '2xl',
      isTouchDevice: isTouchDevice(),
      viewportWidth: width,
      viewportHeight: height,
      safeAreaInsets: getSafeAreaInsets(),
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = getScreenSize(width);

      setState({
        screenSize: size,
        orientation: getOrientation(width, height),
        isMobile: size === 'xs' || size === 'sm',
        isTablet: size === 'md',
        isDesktop: size === 'lg' || size === 'xl' || size === '2xl',
        isTouchDevice: isTouchDevice(),
        viewportWidth: width,
        viewportHeight: height,
        safeAreaInsets: getSafeAreaInsets(),
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
};

// =============================================================================
// SWIPE GESTURE HOOK
// =============================================================================

interface UseSwipeOptions {
  threshold?: number; // Minimum distance to trigger swipe (px)
  velocityThreshold?: number; // Minimum velocity to trigger swipe (px/ms)
  onSwipe?: (gesture: SwipeGesture) => void;
  onSwipeLeft?: (gesture: SwipeGesture) => void;
  onSwipeRight?: (gesture: SwipeGesture) => void;
  onSwipeUp?: (gesture: SwipeGesture) => void;
  onSwipeDown?: (gesture: SwipeGesture) => void;
}

export const useSwipeGesture = (options: UseSwipeOptions = {}) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const velocity = Math.max(absX, absY) / deltaTime;

    // Check if swipe meets threshold
    if (Math.max(absX, absY) < threshold && velocity < velocityThreshold) {
      touchStartRef.current = null;
      return;
    }

    let direction: SwipeGesture['direction'];
    let distance: number;

    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left';
      distance = absX;
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
      distance = absY;
    }

    const gesture: SwipeGesture = { direction, distance, velocity };

    onSwipe?.(gesture);

    switch (direction) {
      case 'left':
        onSwipeLeft?.(gesture);
        break;
      case 'right':
        onSwipeRight?.(gesture);
        break;
      case 'up':
        onSwipeUp?.(gesture);
        break;
      case 'down':
        onSwipeDown?.(gesture);
        break;
    }

    touchStartRef.current = null;
  }, [threshold, velocityThreshold, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

// =============================================================================
// MOBILE DRAWER HOOK
// =============================================================================

interface UseDrawerOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const useMobileDrawer = (options: UseDrawerOptions = {}) => {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.classList.add('modal-open');
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove('modal-open');
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Close drawer with swipe
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: close,
    threshold: 100,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    swipeHandlers,
  };
};

// =============================================================================
// BOTTOM SHEET HOOK
// =============================================================================

interface UseBottomSheetOptions {
  defaultOpen?: boolean;
  snapPoints?: number[]; // Percentage heights (e.g., [25, 50, 90])
  onOpen?: () => void;
  onClose?: () => void;
  onSnap?: (index: number) => void;
}

export const useBottomSheet = (options: UseBottomSheetOptions = {}) => {
  const {
    defaultOpen = false,
    snapPoints = [50],
    onOpen,
    onClose,
    onSnap,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [snapIndex, setSnapIndex] = useState(0);

  const open = useCallback((snapIdx = 0) => {
    setIsOpen(true);
    setSnapIndex(snapIdx);
    document.body.classList.add('modal-open');
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove('modal-open');
    onClose?.();
  }, [onClose]);

  const snapTo = useCallback((index: number) => {
    if (index >= 0 && index < snapPoints.length) {
      setSnapIndex(index);
      onSnap?.(index);
    }
  }, [snapPoints.length, onSnap]);

  const swipeHandlers = useSwipeGesture({
    onSwipeDown: (gesture) => {
      if (gesture.velocity > 0.5 || gesture.distance > 100) {
        if (snapIndex > 0) {
          snapTo(snapIndex - 1);
        } else {
          close();
        }
      }
    },
    onSwipeUp: (gesture) => {
      if (gesture.velocity > 0.5 || gesture.distance > 100) {
        if (snapIndex < snapPoints.length - 1) {
          snapTo(snapIndex + 1);
        }
      }
    },
    threshold: 30,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return {
    isOpen,
    open,
    close,
    snapIndex,
    snapTo,
    currentSnapPoint: snapPoints[snapIndex] ?? 50,
    swipeHandlers,
  };
};

// =============================================================================
// RESPONSIVE VALUE HOOK
// =============================================================================

type ResponsiveValue<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  default: T;
};

export const useResponsiveValue = <T>(values: ResponsiveValue<T>): T => {
  const { screenSize } = useMobileLayout();

  // Return value for current screen size or cascade down
  const sizes: ScreenSize[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = sizes.indexOf(screenSize);

  for (let i = currentIndex; i < sizes.length; i++) {
    const size = sizes[i];
    if (values[size] !== undefined) {
      return values[size] as T;
    }
  }

  return values.default;
};

// =============================================================================
// PULL TO REFRESH HOOK
// =============================================================================

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const usePullToRefresh = (options: UsePullToRefreshOptions) => {
  const { onRefresh, threshold = 80 } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only track if at top of scroll container
    const target = e.currentTarget as HTMLElement;
    if (target.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startYRef.current === null || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startYRef.current);

    // Apply resistance
    const resistance = 0.4;
    setPullDistance(distance * resistance);
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }

    setPullDistance(0);
    startYRef.current = null;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    isRefreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / threshold, 1),
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

export default useMobileLayout;
