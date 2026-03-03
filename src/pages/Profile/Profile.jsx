// UPDATE PROFILE PAGE
// Loads existing profile from Firestore, lets user edit and save.
// Handles profile photo upload to Firebase Storage.
// Redirects to /login if user is not authenticated.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../firebase/config';
import FormInput    from '../../components/FormInput/FormInput';
import FormTextarea from '../../components/FormTextarea/FormTextarea';
import FormSelect   from '../../components/FormSelect/FormSelect';
import Button       from '../../components/Button/Button';
import styles       from './Profile.module.css';

// ── DROPDOWN OPTIONS ──────────────────────────────────────────
const SPECIALTY_OPTIONS = [
  'Lashes', 'Haircuts', 'Hair Coloring', 'Nails', 'Facials',
  'Massage', 'Makeup', 'Waxing', 'Skincare', 'Brows',
];

const YEARS_OPTIONS = [
  { value: '0-1',   label: 'Less than 1 year' },
  { value: '1-2',   label: '1-2 years' },
  { value: '3-5',   label: '3-5 years' },
  { value: '6-10',  label: '6-10 years' },
  { value: '11-15', label: '11-15 years' },
  { value: '16-20', label: '16-20 years' },
  { value: '20+',   label: '20+ years' },
];

const CONTACT_OPTIONS = [
  { value: 'Email',     label: 'Email' },
  { value: 'Phone',     label: 'Phone' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Website',   label: 'Website' },
];

// ── COMPONENT ─────────────────────────────────────────────────
function Profile() {
  const navigate = useNavigate();

  // Current logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // All form fields in one object
  const [form, setForm] = useState({
    displayName:      '',
    bio:              '',
    location:         '',
    website:          '',
    instagram:        '',
    yearsInIndustry:  '',
    preferredContact: '',
    specialties:      [], // array of selected strings
  });

  // Profile photo state
  const [photoURL, setPhotoURL]         = useState(null);  // current saved photo
  const [photoFile, setPhotoFile]       = useState(null);  // new file selected
  const [photoPreview, setPhotoPreview] = useState(null);  // preview URL

  // Upload progress (0-100)
  const [uploadProgress, setUploadProgress] = useState(null);

  // UI state
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState({ text: '', type: '' });

  // ── AUTH CHECK ───────────────────────────────────────────────
  // Runs once on mount — checks if user is logged in
  // If not, redirects to /login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadProfileData(user.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ── LOAD EXISTING PROFILE ────────────────────────────────────
  // Fetches user's Firestore document and populates form
  const loadProfileData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc    = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setForm({
          displayName:      data.displayName      || '',
          bio:              data.bio              || '',
          location:         data.location         || '',
          website:          data.website          || '',
          instagram:        data.instagram        || '',
          yearsInIndustry:  data.yearsInIndustry  || '',
          preferredContact: data.preferredContact || '',
          specialties:      data.specialties      || [],
        });
        if (data.profilePhotoURL) {
          setPhotoURL(data.profilePhotoURL);
          setPhotoPreview(data.profilePhotoURL);
        }
        showMessage('Profile data loaded', 'success');
      }
    } catch (error) {
      showMessage('Error loading profile: ' + error.message, 'error');
    }
  };

  // ── GENERIC FIELD HANDLER ────────────────────────────────────
  // Works for all text/select fields
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ── SPECIALTIES HANDLER ──────────────────────────────────────
  // Toggles a specialty in/out of the selected array
  // e.g. clicking "Lashes" adds it if not selected, removes it if selected
  const handleSpecialtyToggle = (specialty) => {
    setForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)  // remove
        : [...prev.specialties, specialty],               // add
    }));
  };

  // ── PHOTO SELECTION ──────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image must be smaller than 5MB', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error');
      return;
    }

    setPhotoFile(file);
    // Create a local preview URL so user can see the image immediately
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // ── UPLOAD PHOTO TO STORAGE ──────────────────────────────────
  const uploadPhoto = (file, userId) => {
    return new Promise((resolve, reject) => {
      const fileName  = `profile_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `profile-pictures/${userId}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Update progress bar
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(pct);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadProgress(null);
          resolve(url);
        }
      );
    });
  };

  // ── DELETE OLD PHOTO ─────────────────────────────────────────
  const deleteOldPhoto = async (url) => {
    if (!url || url.includes('placeholder')) return;
    try {
      const filePath = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      await deleteObject(ref(storage, filePath));
    } catch (e) {
      console.error('Could not delete old photo:', e);
    }
  };

  // ── SHOW MESSAGE ─────────────────────────────────────────────
  const showMessage = (text, type) => {
    setMessage({ text, type });
    if (type === 'success') {
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  // ── SAVE PROFILE ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      let newPhotoURL = photoURL; // default to existing photo

      // Upload new photo if one was selected
      if (photoFile) {
        showMessage('Uploading photo...', 'success');
        newPhotoURL = await uploadPhoto(photoFile, currentUser.uid);
        await deleteOldPhoto(photoURL); // delete old one from storage
        setPhotoURL(newPhotoURL);
      }

      const profileData = {
        displayName:      form.displayName,
        bio:              form.bio,
        location:         form.location,
        website:          form.website,
        instagram:        form.instagram,
        yearsInIndustry:  form.yearsInIndustry,
        preferredContact: form.preferredContact,
        specialties:      form.specialties,
        profilePhotoURL:  newPhotoURL || null,
      };

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc    = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, {
          ...profileData,
          updatedAt: serverTimestamp(),
        });
        showMessage('Profile updated successfully!', 'success');
      } else {
        // Create new document
        await setDoc(userDocRef, {
          ...profileData,
          email:     currentUser.email,
          approved:  false,
          approvedAt: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showMessage('Profile created! Awaiting admin approval.', 'success');
      }
    } catch (error) {
      showMessage('Error saving profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>Update Your Profile</h1>

        {currentUser && (
          <p className={styles.loggedIn}>
            Logged in as: <strong>{currentUser.email}</strong>
          </p>
        )}

        {/* Status message */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* ── PROFILE PHOTO ── */}
          <div className={styles.photoSection}>
            <div className={styles.photoPreview}>
              <img
                src={photoPreview || 'https://via.placeholder.com/150/b54dbc/ffffff?text=No+Photo'}
                alt="Profile preview"
                className={styles.photoImg}
              />
            </div>

            <div className={styles.photoControls}>
              <label className={styles.photoLabel}>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className={styles.photoInput}
              />
              <p className={styles.hint}>Max 5MB. JPG, PNG, or GIF. Recommended: 400×400px square.</p>

              {/* Upload progress bar */}
              {uploadProgress !== null && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span className={styles.progressText}>{uploadProgress}%</span>
                </div>
              )}

              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className={styles.removeBtn}
                >
                  Remove Picture
                </button>
              )}
            </div>
          </div>

          {/* ── TEXT FIELDS ── */}
          <FormInput
            label="Display Name"
            id="displayName"
            value={form.displayName}
            onChange={handleChange('displayName')}
            placeholder="Enter your name"
            required={true}
          />

          {/* ── SPECIALTIES — custom multi-select as pill buttons ── */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>
              Specialties <span className={styles.required}>*</span>
            </label>
            <div className={styles.pillGrid}>
              {SPECIALTY_OPTIONS.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`${styles.pill} ${
                    form.specialties.includes(specialty) ? styles.pillActive : ''
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
            <p className={styles.hint}>Click to select/deselect</p>
          </div>

          <FormSelect
            label="Years in Industry"
            id="yearsInIndustry"
            value={form.yearsInIndustry}
            onChange={handleChange('yearsInIndustry')}
            options={YEARS_OPTIONS}
            required={true}
          />

          <FormSelect
            label="Preferred Way to Connect"
            id="preferredContact"
            value={form.preferredContact}
            onChange={handleChange('preferredContact')}
            options={CONTACT_OPTIONS}
            required={true}
          />

          <FormTextarea
            label="Bio"
            id="bio"
            value={form.bio}
            onChange={handleChange('bio')}
            placeholder="Tell us about yourself"
            maxLength={500}
          />

          <FormInput
            label="Location"
            id="location"
            value={form.location}
            onChange={handleChange('location')}
            placeholder="First 3 digits of Postal Code (e.g. M5V)"
          />

          <FormInput
            label="Instagram"
            id="instagram"
            type="url"
            value={form.instagram}
            onChange={handleChange('instagram')}
            placeholder="https://instagram.com/yourusername"
          />

          <FormInput
            label="Website"
            id="website"
            type="url"
            value={form.website}
            onChange={handleChange('website')}
            placeholder="https://yourwebsite.com"
          />

          <div className={styles.buttonRow}>
            <Button
              label={loading ? 'Saving...' : 'Save Profile'}
              type="submit"
              disabled={loading}
            />
          </div>

        </form>
      </div>
    </div>
  );
}

export default Profile;