import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isFillPage = location.pathname.startsWith('/fill');

  return (
    <nav className={`${styles.navbar} no-print`}>
      <div className={styles.content}>
        <div className={styles.tabs}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/builder" 
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
          >
            Builder
          </NavLink>
          {isFillPage && (
            <div className={`${styles.tab} ${styles.active}`}>
              Fill
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
