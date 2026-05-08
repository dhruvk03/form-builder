import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isFillPage = location.pathname.startsWith('/fill');

  return (
    <nav className={`${styles.navbar} no-print`}>
      <div className="layout-container">
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
            Build
          </NavLink>
          {isFillPage && (
            <div className={`${styles.tab} ${styles.active}`}>
              {location.pathname.endsWith('/new') ? 'Fill' : 'View'}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
