/**
 * EditableField Components
 *
 * Inline editing components for various field types with auto-save.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

// =============================================================================
// EDITABLE TEXT
// =============================================================================

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  placeholder = 'Click to edit...',
  className = '',
  inputClassName = '',
  multiline = false,
  maxLength,
  disabled = false,
  autoFocus = false,
}) => {
  const [isEditing, setIsEditing] = useState(autoFocus);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed !== value) {
      onSave(trimmed);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (disabled) {
    return (
      <span className={`${className} text-zinc-500`}>
        {value || placeholder}
      </span>
    );
  }

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        className={`bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-blue-500 ${inputClassName}`}
        style={multiline ? { minHeight: '80px', resize: 'vertical' } : undefined}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-zinc-800/50 rounded px-1 -mx-1 transition ${className} ${!value ? 'text-zinc-600 italic' : ''}`}
      title="Click to edit"
    >
      {value || placeholder}
    </span>
  );
};

// =============================================================================
// EDITABLE SELECT
// =============================================================================

interface EditableSelectProps<T extends string> {
  value: T;
  options: { value: T; label: string; color?: string }[];
  onSave: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

export function EditableSelect<T extends string>({
  value,
  options,
  onSave,
  className = '',
  disabled = false,
}: EditableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (disabled) {
    return (
      <span className={`${className} text-zinc-500`}>
        {selectedOption?.label || value}
      </span>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 rounded text-xs font-medium transition ${
          selectedOption?.color || 'bg-zinc-700 text-zinc-300'
        } hover:opacity-80`}
      >
        {selectedOption?.label || value}
        <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 min-w-[120px]">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSave(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 transition ${
                option.value === value ? 'bg-zinc-700' : ''
              }`}
            >
              {option.color && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: option.color }}
                />
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EDITABLE CHECKBOX
// =============================================================================

interface EditableCheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const EditableCheckbox: React.FC<EditableCheckboxProps> = ({
  checked,
  onToggle,
  label,
  className = '',
  disabled = false,
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        onClick={() => !disabled && onToggle(!checked)}
        disabled={disabled}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
          checked
            ? 'bg-green-600 border-green-600'
            : 'bg-transparent border-zinc-600 hover:border-zinc-500'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      {label && <span className={checked ? 'line-through text-zinc-500' : ''}>{label}</span>}
    </label>
  );
};

// =============================================================================
// EDITABLE TAGS
// =============================================================================

interface EditableTagsProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
  tagClassName?: string;
  disabled?: boolean;
}

export const EditableTags: React.FC<EditableTagsProps> = ({
  tags,
  onAdd,
  onRemove,
  suggestions = [],
  placeholder = 'Add tag...',
  className = '',
  tagClassName = '',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
  );

  const handleAdd = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 px-2 py-1 bg-zinc-700 rounded text-sm ${tagClassName}`}
        >
          {tag}
          {!disabled && (
            <button
              onClick={() => onRemove(tag)}
              className="text-zinc-400 hover:text-red-400 transition"
            >
              ×
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <div className="relative">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="bg-transparent border-b border-zinc-700 px-1 py-0.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 w-24"
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 max-h-32 overflow-auto">
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleAdd(suggestion)}
                  className="w-full text-left px-3 py-1 text-sm hover:bg-zinc-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// CONFIRM DELETE BUTTON
// =============================================================================

interface ConfirmDeleteProps {
  onConfirm: () => void;
  itemName?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  onConfirm,
  itemName = 'item',
  className = '',
  size = 'md',
}) => {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (confirming) {
      onConfirm();
      setConfirming(false);
    } else {
      setConfirming(true);
      timeoutRef.current = setTimeout(() => setConfirming(false), 3000);
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      className={`${sizeClasses} rounded font-medium transition ${
        confirming
          ? 'bg-red-600 text-white'
          : 'bg-zinc-800 text-zinc-400 hover:bg-red-900/50 hover:text-red-400'
      } ${className}`}
    >
      {confirming ? `Delete ${itemName}?` : 'Delete'}
    </button>
  );
};

// =============================================================================
// INLINE ADD BUTTON
// =============================================================================

interface InlineAddProps {
  onAdd: (value: string) => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export const InlineAdd: React.FC<InlineAddProps> = ({
  onAdd,
  placeholder = 'Enter value...',
  buttonText = '+ Add',
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue('');
    }
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setValue('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className={`text-sm text-zinc-500 hover:text-zinc-300 transition ${className}`}
    >
      {buttonText}
    </button>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  EditableText,
  EditableSelect,
  EditableCheckbox,
  EditableTags,
  ConfirmDelete,
  InlineAdd,
};
