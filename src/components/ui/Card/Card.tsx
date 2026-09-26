import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = '', interactive = false }: CardProps) {
  return (
    <div className={`${styles.card} ${interactive ? styles.interactive : ''} ${className}`}>
      {children}
    </div>
  );
}
