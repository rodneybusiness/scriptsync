/**
 * Mobile-Optimized UI Components
 *
 * Components designed for optimal mobile experience:
 * - MobileNavigation (bottom nav bar)
 * - MobileDrawer (slide-out panel)
 * - BottomSheet (iOS-style modal)
 * - SwipeableCard (gesture-enabled cards)
 * - PullToRefresh (refresh indicator)
 * - MobileHeader (collapsible header)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useMobileLayout, useMobileDrawer, useBottomSheet, useSwipeGesture } from '../hooks/useMobileLayout';

// =============================================================================
// MOBILE NAVIGATION (Bottom Tab Bar)
// =============================================================================

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface MobileNavigationProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  activeId,
  onSelect,
}) => {
  const { isMobile, safeAreaInsets } = useMobileLayout();

  if (!isMobile) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-40"
      style={{ paddingBottom: safeAreaInsets.bottom || 0 }}
    >
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
              activeId === item.id
                ? 'text-blue-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// =============================================================================
// MOBILE DRAWER (Side Panel)
// =============================================================================

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
  children: React.ReactNode;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'left',
  children,
}) => {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: position === 'left' ? onClose : undefined,
    onSwipeRight: position === 'right' ? onClose : undefined,
    threshold: 50,
  });

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute top-0 bottom-0 ${
          position === 'left' ? 'left-0' : 'right-0'
        } w-4/5 max-w-sm bg-zinc-900 shadow-2xl flex flex-col`}
        {...swipeHandlers}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

// =============================================================================
// BOTTOM SHEET (iOS-style Modal)
// =============================================================================

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  snapPoints?: number[];
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  snapPoints = [50, 90],
  children,
}) => {
  const [currentSnap, setCurrentSnap] = useState(0);
  const { safeAreaInsets } = useMobileLayout();

  const swipeHandlers = useSwipeGesture({
    onSwipeDown: () => {
      if (currentSnap > 0) {
        setCurrentSnap(currentSnap - 1);
      } else {
        onClose();
      }
    },
    onSwipeUp: () => {
      if (currentSnap < snapPoints.length - 1) {
        setCurrentSnap(currentSnap + 1);
      }
    },
    threshold: 30,
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const height = snapPoints[currentSnap] || 50;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl shadow-2xl flex flex-col transition-all duration-300"
        style={{
          height: `${height}vh`,
          paddingBottom: safeAreaInsets.bottom || 0,
        }}
        {...swipeHandlers}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-zinc-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-3">{children}</div>
      </div>
    </div>
  );
};

// =============================================================================
// SWIPEABLE CARD
// =============================================================================

interface SwipeableCardProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  children,
  className = '',
}) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;

    // Limit the offset
    const maxOffset = 100;
    const newOffset = Math.max(-maxOffset, Math.min(maxOffset, diff));
    setOffset(newOffset);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    const threshold = 80;

    if (offset > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (offset < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }

    setOffset(0);
    startXRef.current = null;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left action (revealed on swipe right) */}
      {leftAction && offset > 0 && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start bg-green-600 px-4"
          style={{ width: Math.abs(offset) }}
        >
          {leftAction}
        </div>
      )}

      {/* Right action (revealed on swipe left) */}
      {rightAction && offset < 0 && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-600 px-4"
          style={{ width: Math.abs(offset) }}
        >
          {rightAction}
        </div>
      )}

      {/* Card content */}
      <div
        ref={cardRef}
        className={`relative bg-zinc-800 ${isDragging ? '' : 'transition-transform duration-200'}`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// PULL TO REFRESH
// =============================================================================

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className = '',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);

  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startYRef.current);

    // Apply resistance
    const resistance = 0.4;
    setPullDistance(Math.min(distance * resistance, 120));
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }

    setPullDistance(0);
    startYRef.current = null;
  };

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance,
          top: -pullDistance,
        }}
      >
        <div
          className={`w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={{
            opacity: progress,
            transform: `rotate(${progress * 360}deg)`,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.2s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// MOBILE HEADER (Collapsible)
// =============================================================================

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  collapsible?: boolean;
  children?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  collapsible = false,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { safeAreaInsets } = useMobileLayout();
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!collapsible) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      if (scrollingDown && currentScrollY > 100) {
        setIsCollapsed(true);
      } else if (!scrollingDown || currentScrollY < 50) {
        setIsCollapsed(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [collapsible]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 z-30 transition-transform duration-300 ${
        isCollapsed ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{ paddingTop: safeAreaInsets.top || 0 }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left action */}
        <div className="w-12 flex items-center justify-start">
          {leftAction}
        </div>

        {/* Title */}
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-zinc-400 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right action */}
        <div className="w-12 flex items-center justify-end">
          {rightAction}
        </div>
      </div>

      {/* Extended content */}
      {children && <div className="px-4 pb-3">{children}</div>}
    </header>
  );
};

// =============================================================================
// FLOATING ACTION BUTTON
// =============================================================================

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  position?: 'bottom-right' | 'bottom-center';
  variant?: 'primary' | 'secondary';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  label,
  position = 'bottom-right',
  variant = 'primary',
}) => {
  const { isMobile, safeAreaInsets } = useMobileLayout();

  const positionClasses = {
    'bottom-right': 'right-4',
    'bottom-center': 'left-1/2 -translate-x-1/2',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100',
  };

  return (
    <button
      onClick={onClick}
      className={`fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
        positionClasses[position]
      } ${variantClasses[variant]} ${label ? 'px-5 py-3' : 'w-14 h-14'}`}
      style={{
        bottom: (safeAreaInsets.bottom || 0) + (isMobile ? 72 : 16),
      }}
    >
      {icon}
      {label && <span className="ml-2 font-medium">{label}</span>}
    </button>
  );
};

// =============================================================================
// MOBILE TABS
// =============================================================================

interface MobileTabsProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabs,
  activeId,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeTab = container.querySelector(`[data-tab-id="${activeId}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto scrollbar-hide border-b border-zinc-800"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
            activeId === tab.id
              ? 'text-blue-500 border-blue-500'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
  useMobileDrawer,
  useBottomSheet,
};

export default MobileNavigation;
