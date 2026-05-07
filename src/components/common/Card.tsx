import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, active, onClick }) => {
  const cardClasses = `${styles.card} ${className || ''} ${active ? styles.active : ''}`;
  return <div className={cardClasses} onClick={onClick}>{children}</div>;
};
