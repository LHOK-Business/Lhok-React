import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import styles from './Admin.module.css';

// ── ADMIN LIST ────────────────────────────────────────────────
// Must match your Firestore rules
const ADMIN_EMAILS = [
  'hunain.jd@gmail.com',
  'jenngbari@gmail.com',
  'angeleenmatti@gmail.com',
  'lhok.business@gmail.com',
];

const TABS = [
  { key: 'pending',  label: '⏳ Pending' },
  { key: 'approved', label: '✅ Approved' },
  { key: 'all',      label: '📋 All Users' },
];

// ── HELPERS ───────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  return words.length === 1
    ? words[0][0].toUpperCase()
    : (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const formatDate = (timestamp) =>
  timestamp?.toDate().toLocaleDateString() || '—';

function Admin() {
  const navigate   = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [toast,     setToast]     = useState('');

  // ── TOAST ──────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── AUTH CHECK ─────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { navigate('/login'); return; }
      if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        setError('Access denied. Admins only.');
        setLoading(false);
        return;
      }
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  // ── LOAD USERS ─────────────────────────────────────────────
  // Re-runs whenever activeTab or adminUser changes
  useEffect(() => {
    if (!adminUser) return;

    setLoading(true);
    const usersRef = collection(db, 'users');
    const q = activeTab === 'all'
      ? query(usersRef)
      : query(usersRef, where('approved', '==', activeTab === 'approved'));

    // onSnapshot = real-time listener — updates automatically
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError('Error loading users: ' + err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [activeTab, adminUser]);

  // ── ACTIONS ────────────────────────────────────────────────
  const approveUser = async (userId) => {
    if (!window.confirm('Approve this user? They will appear on the Community page.')) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved:   true,
        approvedAt: serverTimestamp(),
      });
      showToast('✅ User approved');
    } catch (e) { showToast('Error: ' + e.message); }
  };

  const unapproveUser = async (userId) => {
    if (!window.confirm('Remove approval? User will be hidden from the Community page.')) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved:     false,
        approvedAt:   null,
        unapprovedAt: serverTimestamp(),
      });
      showToast('↶ User unapproved');
    } catch (e) { showToast('Error: ' + e.message); }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    if (!window.confirm('Are you absolutely sure?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      showToast('🗑 User deleted');
    } catch (e) { showToast('Error: ' + e.message); }
  };

  // ── RENDER ─────────────────────────────────────────────────
  if (error) return (
    <div className={styles.page}>
      <div className={styles.errorCard}>
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Review and approve professional profiles</p>
        </div>
        {adminUser && (
          <div className={styles.adminBadge}>
            👤 {adminUser.email}
          </div>
        )}
      </div>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statNum}>
            {users.filter(u => !u.approved).length}
          </span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>
            {users.filter(u => u.approved).length}
          </span>
          <span className={styles.statLabel}>Approved</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{users.length}</span>
          <span className={styles.statLabel}>
            {activeTab === 'all' ? 'Total' : 'Showing'}
          </span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className={styles.empty}>
          No {activeTab === 'all' ? '' : activeTab} users found.
        </div>
      ) : (
        <div className={styles.grid}>
          {users.map(user => (
            <div key={user.id} className={styles.card}>

              {/* Avatar */}
              <div className={styles.cardTop}>
                {user.profilePhotoURL ? (
                  <img
                    src={user.profilePhotoURL}
                    alt={user.displayName}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.initials}>
                    {getInitials(user.displayName)}
                  </div>
                )}
                <div className={styles.cardMeta}>
                  <h3 className={styles.userName}>
                    {user.displayName || 'No Name'}
                  </h3>
                  <span className={`${styles.badge} ${user.approved ? styles.badgeApproved : styles.badgePending}`}>
                    {user.approved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                </div>
              </div>

              {/* Specialties */}
              {user.specialties?.length > 0 && (
                <div className={styles.pills}>
                  {user.specialties.map(s => (
                    <span key={s} className={styles.pill}>{s}</span>
                  ))}
                </div>
              )}

              {/* Info rows */}
              <div className={styles.info}>
                <InfoRow label="Email"    value={user.email} />
                <InfoRow label="Location" value={user.location} />
                <InfoRow label="Experience" value={user.yearsInIndustry ? `${user.yearsInIndustry} years` : null} />
                <InfoRow label="Contact"  value={user.preferredContact} />
                {user.bio && <InfoRow label="Bio" value={user.bio} />}
                {user.instagram && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Instagram</span>
                    <a href={user.instagram} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      View Profile
                    </a>
                  </div>
                )}
                {user.website && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Website</span>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      Visit Site
                    </a>
                  </div>
                )}
                <InfoRow label="Joined"   value={formatDate(user.createdAt)} />
                {user.approved && (
                  <InfoRow label="Approved" value={formatDate(user.approvedAt)} />
                )}
                {user.unapprovedAt && (
                  <InfoRow label="Unapproved" value={formatDate(user.unapprovedAt)} />
                )}
              </div>

              {/* Action buttons */}
              <div className={styles.actions}>
                {!user.approved ? (
                  <button
                    onClick={() => approveUser(user.id)}
                    className={`${styles.btn} ${styles.btnApprove}`}
                  >
                    ✓ Approve
                  </button>
                ) : (
                  <button
                    onClick={() => unapproveUser(user.id)}
                    className={`${styles.btn} ${styles.btnUnapprove}`}
                  >
                    ↶ Unapprove
                  </button>
                )}
                <button
                  onClick={() => deleteUser(user.id, user.displayName || user.email)}
                  className={`${styles.btn} ${styles.btnDelete}`}
                >
                  🗑 Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div className={styles.toast}>{toast}</div>}

    </div>
  );
}

// Small helper component for info rows
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

export default Admin;