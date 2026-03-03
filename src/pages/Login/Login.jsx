// LOGIN PAGE
// Toggles between Sign In and Sign Up modes.
// Uses Firebase Auth for email/password and Google sign-in.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

import { auth, googleProvider } from '../../firebase/config';
import FormInput from '../../components/FormInput/FormInput';
import Button    from '../../components/Button/Button';
import styles    from './Login.module.css';

function Login() {
  // Toggle between sign in / sign up
  const [isSignUp, setIsSignUp] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
  });

  // Error message shown below form
  const [error, setError] = useState('');

  // Loading state — disables buttons while Firebase is working
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // Generic field handler
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError(''); // clear error on any change
  };

  // Toggle between sign in and sign up — reset form and errors
  const handleToggle = () => {
    setIsSignUp(prev => !prev);
    setForm({ firstName: '', lastName: '', email: '', password: '' });
    setError('');
  };

  // Validate fields before submitting
  const validate = () => {
    if (isSignUp && !form.firstName.trim()) return 'First name is required';
    if (isSignUp && !form.lastName.trim())  return 'Last name is required';
    if (!form.email.trim())                 return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email))  return 'Enter a valid email';
    if (!form.password)                     return 'Password is required';
    if (form.password.length < 8)           return 'Password must be at least 8 characters';
    return null; // null = no errors
  };

  // Email/password submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      if (isSignUp) {
        // Create new account
        const userCredential = await createUserWithEmailAndPassword(
          auth, form.email, form.password
        );
        // Set display name from first + last name
        await updateProfile(userCredential.user, {
          displayName: `${form.firstName} ${form.lastName}`,
        });
      } else {
        // Sign in to existing account
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      // onAuthStateChanged will detect login and redirect to /
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in handler
  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged handles redirect
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Convert Firebase error codes to human-readable messages
  const friendlyError = (code) => {
    switch (code) {
      case 'auth/user-not-found':      return 'No account found with this email';
      case 'auth/wrong-password':      return 'Incorrect password';
      case 'auth/email-already-in-use':return 'An account with this email already exists';
      case 'auth/weak-password':       return 'Password must be at least 8 characters';
      case 'auth/invalid-email':       return 'Invalid email address';
      case 'auth/popup-closed-by-user':return 'Google sign-in was cancelled';
      default:                         return 'Something went wrong. Please try again.';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>{isSignUp ? 'Create Account' : 'Sign In'}</h1>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* First + Last name only shown in Sign Up mode */}
          {isSignUp && (
            <>
              <FormInput
                label="First Name"
                id="firstName"
                value={form.firstName}
                onChange={handleChange('firstName')}
                placeholder="First Name"
              />
              <FormInput
                label="Last Name"
                id="lastName"
                value={form.lastName}
                onChange={handleChange('lastName')}
                placeholder="Last Name"
              />
            </>
          )}

          <FormInput
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="Enter email address"
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Enter password"
          />

          {/* Error message */}
          {error && <p className={styles.errorText}>{error}</p>}

          {/* Toggle button */}
          <button
            type="button"
            onClick={handleToggle}
            className={styles.toggleButton}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>

          {/* Submit button */}
          <Button
            label={loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            type="submit"
            disabled={loading}
          />

          {/* Divider */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className={styles.googleButton}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className={styles.googleIcon}
            />
            Continue with Google
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;