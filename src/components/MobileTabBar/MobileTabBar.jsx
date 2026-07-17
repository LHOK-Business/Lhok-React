import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MobileTabBar.module.css';
import { Home, Search, Users, User, Mail } from 'lucide-react'; // or react-icons, your call

const TABS = [
  { label: 'Home',       to: '/',              Icon: Home   },
  { label: 'Search',     to: '/search',         Icon: Search },
  { label: 'Communities',to: '/communities',    Icon: Users  },
  { label: 'Profile',    to: '/profile',        Icon: User   },
  { label: 'Contact',    to: '/contact',        Icon: Mail   },
];

function MobileTabBar() {
  return (
    <nav className={styles.tabBar} aria-label="Primary mobile navigation">
      {TABS.map(({ label, to, Icon }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            isActive ? `${styles.tabItem} ${styles.active}` : styles.tabItem
          }
          end={to === '/'}
        >
          <Icon size={22} strokeWidth={2} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileTabBar;