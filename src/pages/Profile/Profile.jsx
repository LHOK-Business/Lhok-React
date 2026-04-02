// ============================================
// UPDATE PROFILE PAGE
// Loads existing profile from Firestore and lets user edit it.
// Supports two user types: Professional and Client.
// Once userType is saved once, it is locked and cannot be changed.
//
// PROFESSIONAL fields: specialties, yearsInIndustry, preferredContact, website
// CLIENT fields: servicesLookingFor
// SHARED fields: displayName, bio, location, instagram, profilePhotoURL
// ============================================

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
// These match the options in the original vanilla HTML form exactly

const SPECIALTY_OPTIONS = [
  'Lashes', 'Haircuts', 'Hair Coloring', 'Nails', 'Facials',
  'Massage', 'Makeup', 'Waxing', 'Skincare', 'Brows',
];

// Services clients are looking for — same list as specialties
const SERVICES_LOOKING_FOR_OPTIONS = [
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

  // The currently logged-in Firebase Auth user object
  const [currentUser, setCurrentUser] = useState(null);

  // ── USER TYPE STATE ────────────────────────────────────────
  // 'professional' or 'client' — controls which fields are shown
  // null means not yet loaded from Firestore
  const [userType, setUserType] = useState('professional');

  // Once the user saves their profile once, userType is locked
  // They cannot switch between professional and client after first save
  const [userTypeLocked, setUserTypeLocked] = useState(false);

  // ── SHARED FORM FIELDS ─────────────────────────────────────
  // These fields exist for both professionals and clients
  const [form, setForm] = useState({
    displayName:      '',
    bio:              '',
    location:         '',
    instagram:        '',
  });

  // ── PROFESSIONAL-ONLY FIELDS ───────────────────────────────
  const [proForm, setProForm] = useState({
    website:          '',
    yearsInIndustry:  '',
    preferredContact: '',
    specialties:      [], // Array of selected strings e.g. ['Lashes', 'Nails']
  });

  // ── CLIENT-ONLY FIELDS ─────────────────────────────────────
  const [clientForm, setClientForm] = useState({
    servicesLookingFor: [], // Array of selected strings
  });

  // ── PHOTO STATE ────────────────────────────────────────────
  const [photoURL,     setPhotoURL]     = useState(null); // Saved URL from Firestore
  const [photoFile,    setPhotoFile]    = useState(null); // New file selected by user
  const [photoPreview, setPhotoPreview] = useState(null); // Local preview before upload

  // Upload progress percentage (0-100), null when not uploading
  const [uploadProgress, setUploadProgress] = useState(null);

  // ── UI STATE ───────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState({ text: '', type: '' });

  // ── AUTH CHECK ─────────────────────────────────────────────
  // Runs once on mount. If no user is logged in, redirect to /login
  // If user is logged in, load their profile data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadProfileData(user.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  // ── LOAD PROFILE DATA ──────────────────────────────────────
  // Fetches the user's Firestore document and populates all form fields
  // doc(db, 'collection', 'documentId') — creates a reference to a specific document
  // getDoc() — fetches the document once (not real-time)
  const loadProfileData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc    = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        // ── Set user type and lock it if already saved ──
        // If userType exists in Firestore, the user has saved before — lock it
        if (data.userType) {
          setUserType(data.userType);
          setUserTypeLocked(true); // Prevent switching after first save
        }

        // ── Populate shared fields ──
        setForm({
          displayName: data.displayName || '',
          bio:         data.bio         || '',
          location:    data.location    || '',
          instagram:   data.instagram   || '',
        });

        // ── Populate professional fields ──
        setProForm({
          website:          data.website          || '',
          yearsInIndustry:  data.yearsInIndustry  || '',
          preferredContact: data.preferredContact || '',
          specialties:      data.specialties      || [],
        });

        // ── Populate client fields ──
        setClientForm({
          servicesLookingFor: data.servicesLookingFor || [],
        });

        // ── Populate photo ──
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

  // ── FIELD HANDLERS ─────────────────────────────────────────

  // Generic handler for shared text fields
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Generic handler for professional-only text/select fields
  const handleProChange = (field) => (e) => {
    setProForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ── PILL TOGGLE HANDLERS ───────────────────────────────────
  // Adds or removes a value from an array field
  // Used for specialties (professional) and servicesLookingFor (client)

  const handleSpecialtyToggle = (specialty) => {
    setProForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty) // Remove if already selected
        : [...prev.specialties, specialty],              // Add if not selected
    }));
  };

  const handleServiceToggle = (service) => {
    setClientForm(prev => ({
      ...prev,
      servicesLookingFor: prev.servicesLookingFor.includes(service)
        ? prev.servicesLookingFor.filter(s => s !== service)
        : [...prev.servicesLookingFor, service],
    }));
  };

  // ── PHOTO HANDLERS ─────────────────────────────────────────

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image must be smaller than 5MB', 'error');
      return;
    }
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error');
      return;
    }

    setPhotoFile(file);
    // URL.createObjectURL creates a temporary local URL for preview
    // without uploading to Firebase yet
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(photoURL || null); // Revert to saved photo if exists
  };

  // ── UPLOAD PHOTO TO FIREBASE STORAGE ──────────────────────
  // Returns a Promise that resolves to the download URL
  // uploadBytesResumable allows us to track upload progress
  const uploadPhoto = (file, userId) => {
    return new Promise((resolve, reject) => {
      const ext        = file.name.split('.').pop();
      const fileName   = `profile_${Date.now()}.${ext}`;
      const storageRef = ref(storage, `profile-pictures/${userId}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        // Called repeatedly during upload with progress info
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(pct);
        },
        // Called if upload fails
        (error) => reject(error),
        // Called when upload completes successfully
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadProgress(null); // Hide progress bar
          resolve(url);
        }
      );
    });
  };

  // ── DELETE OLD PHOTO FROM STORAGE ─────────────────────────
  // Removes the old photo file from Firebase Storage to save space
  // Non-critical — we don't throw if this fails
  const deleteOldPhoto = async (url) => {
    if (!url) return;
    try {
      // Extract the file path from the full Firebase Storage URL
      const filePath = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      await deleteObject(ref(storage, filePath));
    } catch (e) {
      console.error('Could not delete old photo (non-critical):', e);
    }
  };

  // ── SHOW MESSAGE ───────────────────────────────────────────
  // Success messages auto-dismiss after 5 seconds
  // Error messages stay until user takes action
  const showMessage = (text, type) => {
    setMessage({ text, type });
    if (type === 'success') {
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  // ── SAVE PROFILE ───────────────────────────────────────────
  // Handles both creating new documents and updating existing ones
  // setDoc() — creates or completely overwrites a document
  // updateDoc() — only updates specified fields, leaves others unchanged
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      // ── Handle photo upload if a new file was selected ──
      let newPhotoURL = photoURL; // Default to existing photo
      if (photoFile) {
        showMessage('Uploading photo...', 'success');
        newPhotoURL = await uploadPhoto(photoFile, currentUser.uid);
        await deleteOldPhoto(photoURL); // Remove old photo from storage
        setPhotoURL(newPhotoURL);
        setPhotoFile(null); // Clear the file input
      }

      // ── Build the shared profile data object ──
      // These fields are saved for both professionals and clients
      const sharedData = {
        displayName:     form.displayName,
        bio:             form.bio,
        location:        form.location,
        instagram:       form.instagram,
        profilePhotoURL: newPhotoURL || null,
        userType:        userType,
        updatedAt:       serverTimestamp(),
      };

      // ── Add type-specific fields ──
      // Only include relevant fields based on userType
      // This prevents client documents from having empty professional fields
      const typeSpecificData = userType === 'professional'
        ? {
            website:          proForm.website,
            yearsInIndustry:  proForm.yearsInIndustry,
            preferredContact: proForm.preferredContact,
            specialties:      proForm.specialties,
          }
        : {
            servicesLookingFor: clientForm.servicesLookingFor,
          };

      const profileData = { ...sharedData, ...typeSpecificData };

      // ── Check if document exists to decide create vs update ──
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc    = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // ── UPDATE existing document ──
        // updateDoc only modifies the fields we specify
        // Other fields (like createdAt, approved) remain unchanged
        const existingData = userDoc.data();

        // Only write userType if it was missing (older accounts)
        // We never overwrite an existing userType to prevent accidental switches
        if (!existingData.userType) {
          profileData.userType = userType;

          // Backfill approval fields for professionals if missing from old accounts
          if (userType === 'professional' && existingData.approved === undefined) {
            profileData.approved   = false;
            profileData.approvedAt = null;
          }
        } else {
          // userType already set — remove it from update to prevent overwriting
          delete profileData.userType;
        }

        await updateDoc(userDocRef, profileData);
        setUserTypeLocked(true); // Lock type after first successful save
        showMessage('Profile updated successfully!', 'success');

      } else {
        // ── CREATE new document ──
        // This runs if somehow the signup didn't create the doc
        // setDoc creates the document with all fields
        await setDoc(userDocRef, {
          ...profileData,
          email:     currentUser.email,
          approved:  userType === 'professional' ? false : undefined,
          approvedAt: userType === 'professional' ? null : undefined,
          createdAt: serverTimestamp(),
        });
        setUserTypeLocked(true);
        showMessage(
          userType === 'professional'
            ? 'Profile created! Awaiting admin approval.'
            : 'Profile created successfully!',
          'success'
        );
      }
    } catch (error) {
      showMessage('Error saving profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>Update Your Profile</h1>

        {/* Show logged-in email for reference */}
        {currentUser && (
          <p className={styles.loggedIn}>
            Logged in as: <strong>{currentUser.email}</strong>
          </p>
        )}

        {/* Status message (success/error) */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* ── USER TYPE SELECTOR ── */}
          {/* Hidden once saved. Allows user to identify as Professional or Client */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>I am a:</label>

            {userTypeLocked ? (
              // Once locked, show as read-only text
              <p className={styles.lockedType}>
                {userType === 'professional' ? '💼 Professional' : '🙋 Client'}
                <span className={styles.lockedNote}> (cannot be changed after saving)</span>
              </p>
            ) : (
              // Before first save, show radio buttons to choose
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="professional"
                    checked={userType === 'professional'}
                    onChange={() => setUserType('professional')}
                  />
                  💼 Professional
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="client"
                    checked={userType === 'client'}
                    onChange={() => setUserType('client')}
                  />
                  🙋 Client
                </label>
              </div>
            )}
          </div>

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

              {/* Progress bar — only shown during upload */}
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
                <button type="button" onClick={handleRemovePhoto} className={styles.removeBtn}>
                  Remove Picture
                </button>
              )}
            </div>
          </div>

          {/* ── SHARED FIELDS (all users) ── */}
          <FormInput
            label="Display Name"
            id="displayName"
            value={form.displayName}
            onChange={handleChange('displayName')}
            placeholder="Enter your name"
            required={true}
          />

          {/* ── PROFESSIONAL-ONLY FIELDS ── */}
          {/* The && operator conditionally renders these only for professionals */}
          {userType === 'professional' && (
            <>
              {/* Specialties — pill button multi-select */}
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
                      className={styles.pill + (proForm.specialties.includes(specialty) ? ' ' + styles.pillActive : '')}
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
                value={proForm.yearsInIndustry}
                onChange={handleProChange('yearsInIndustry')}
                options={YEARS_OPTIONS}
                required={true}
              />

              <FormSelect
                label="Preferred Way to Connect"
                id="preferredContact"
                value={proForm.preferredContact}
                onChange={handleProChange('preferredContact')}
                options={CONTACT_OPTIONS}
                required={true}
              />
            </>
          )}

          {/* ── CLIENT-ONLY FIELDS ── */}
          {userType === 'client' && (
            <div className={styles.fieldWrapper}>
              <label className={styles.fieldLabel}>
                Services I'm Looking For
              </label>
              <div className={styles.pillGrid}>
                {SERVICES_LOOKING_FOR_OPTIONS.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={styles.pill + (clientForm.servicesLookingFor.includes(service) ? ' ' + styles.pillActive : '')}
                  >
                    {service}
                  </button>
                ))}
              </div>
              <p className={styles.hint}>Click to select/deselect</p>
            </div>
          )}

          {/* ── SHARED FIELDS CONTINUED ── */}
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

          {/* Website — professional only */}
          {userType === 'professional' && (
            <FormInput
              label="Website"
              id="website"
              type="url"
              value={proForm.website}
              onChange={handleProChange('website')}
              placeholder="https://yourwebsite.com"
            />
          )}

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