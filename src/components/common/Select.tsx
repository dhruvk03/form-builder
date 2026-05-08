import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'small' | 'medium';
  variant?: 'default' | 'borderless';
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  size = 'medium',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`${styles.container} ${className || ''} ${styles[size]} ${styles[variant]}`} 
      ref={containerRef}
    >
      <div 
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedContent}>
          {selectedOption?.icon && <span className={styles.icon}>{selectedOption.icon}</span>}
          <span className={styles.label}>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${option.value === value ? styles.optionSelected : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.icon && <span className={styles.icon}>{option.icon}</span>}
              <span className={styles.label}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
