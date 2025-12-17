/**
 * Accessibility Provider Component
 *
 * Provides application-wide accessibility features:
 * - Skip navigation link
 * - Focus management
 * - Screen reader announcements (ARIA live regions)
 * - Reduced motion preferences
 * - High contrast mode support
 * - Keyboard navigation helpers
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface AccessibilityContextType {
  // Announcements for screen readers
  announce: (message: string, priority?: 'polite' | 'assertive') => void;

  // Focus management
  setFocusTrap: (containerId: string | null) => void;
  focusElement: (elementId: string) => void;
  returnFocus: () => void;

  // User preferences
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;

  // Navigation
  skipToMain: () => void;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Detect reduced motion preference
 */
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Detect high contrast preference
 */
const usePrefersHighContrast = (): boolean => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersHighContrast = usePrefersHighContrast();

  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusTrapRef = useRef<string | null>(null);

  // Screen reader announcement
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      // Small delay to ensure ARIA live region updates
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    }
  }, []);

  // Focus trap management
  const setFocusTrap = useCallback((containerId: string | null) => {
    if (containerId) {
      // Save current focus to return to later
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    focusTrapRef.current = containerId;
  }, []);

  // Focus a specific element
  const focusElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  }, []);

  // Return focus to previously focused element
  const returnFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
    focusTrapRef.current = null;
  }, []);

  // Skip to main content
  const skipToMain = useCallback(() => {
    const main = document.querySelector('main') || document.getElementById('main-content');
    if (main) {
      (main as HTMLElement).focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Focus trap keyboard handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!focusTrapRef.current) return;

      const container = document.getElementById(focusTrapRef.current);
      if (!container) return;

      // Only handle Tab key
      if (event.key !== 'Tab') return;

      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply reduced motion CSS class
  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [prefersReducedMotion]);

  // Apply high contrast CSS class
  useEffect(() => {
    if (prefersHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [prefersHighContrast]);

  const contextValue: AccessibilityContextType = {
    announce,
    setFocusTrap,
    focusElement,
    returnFocus,
    prefersReducedMotion,
    prefersHighContrast,
    skipToMain,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          skipToMain();
        }}
      >
        Skip to main content
      </a>

      {/* ARIA Live Regions for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>

      {children}
    </AccessibilityContext.Provider>
  );
};

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

/**
 * Screen reader only content
 */
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

/**
 * Focus visible indicator component
 */
export const FocusRing: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 rounded ${className}`}>
    {children}
  </div>
);

/**
 * Accessible icon button
 */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  className = '',
  ...props
}) => (
  <button
    {...props}
    aria-label={label}
    title={label}
    className={`p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${className}`}
  >
    {icon}
    <ScreenReaderOnly>{label}</ScreenReaderOnly>
  </button>
);

/**
 * Accessible modal wrapper
 */
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  id = 'modal',
}) => {
  const { setFocusTrap, returnFocus, announce } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFocusTrap(id);
      announce(`${title} dialog opened`, 'assertive');

      // Focus first focusable element
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      setTimeout(() => firstFocusable?.focus(), 100);
    } else {
      returnFocus();
    }
  }, [isOpen, id, title, setFocusTrap, returnFocus, announce]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        id={id}
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
      >
        <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
          <div className="p-4 border-b border-zinc-800">
            <h2 id={`${id}-title`} className="text-lg font-bold text-white">
              {title}
            </h2>
            {description && (
              <p id={`${id}-description`} className="text-sm text-zinc-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ACCESSIBILITY STYLES (to be added to global CSS)
// =============================================================================

/**
 * CSS to be added to index.html or a CSS file:
 *
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border: 0;
 * }
 *
 * .reduce-motion * {
 *   animation-duration: 0.01ms !important;
 *   animation-iteration-count: 1 !important;
 *   transition-duration: 0.01ms !important;
 *   scroll-behavior: auto !important;
 * }
 *
 * .high-contrast {
 *   --contrast-multiplier: 1.5;
 * }
 *
 * .high-contrast * {
 *   border-color: currentColor !important;
 * }
 */

export default AccessibilityProvider;
