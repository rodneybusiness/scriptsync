/**
 * Hooks module exports
 */

export { useProjectCRUD } from './useProjectCRUD';
export type { CRUDOperations } from './useProjectCRUD';

export {
  useKeyboardShortcuts,
  useShortcutsHelp,
  formatShortcut,
  getShortcutsByCategory,
  DEFAULT_SHORTCUTS,
} from './useKeyboardShortcuts';
export type { KeyBinding, ShortcutAction } from './useKeyboardShortcuts';

export {
  useMobileLayout,
  useSwipeGesture,
  useMobileDrawer,
  useBottomSheet,
  useResponsiveValue,
  usePullToRefresh,
} from './useMobileLayout';
export type {
  ScreenSize,
  Orientation,
  MobileLayoutState,
  SwipeGesture,
} from './useMobileLayout';
