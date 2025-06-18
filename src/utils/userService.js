// User Service for handling registration and user data

import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-endpoint.com';
const API_ENDPOINTS = {
  register: '/api/users/register',
  validate: '/api/users/validate'
};

// Local Storage Keys
const STORAGE_KEYS = {
  USER_DATA: 'bizFeasibilityUser',
  SESSION_TOKEN: 'bizFeasibilityToken'
};

// User Registration Service
export const userService = {
  // Register new user
  async registerUser(userData) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: new Date()
      });
      
      // Store user data in localStorage after successful Firebase registration
      const userDataWithId = {
        ...userData,
        userId: docRef.id,
        createdAt: new Date().toISOString()
      };
      this.storeUserData(userDataWithId);
      
      return { success: true, data: userDataWithId };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  // Store user data in localStorage
  storeUserData(userData) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  },

  // Get user data from localStorage
  getUserData() {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Check if user is registered
  isUserRegistered() {
    const userData = this.getUserData();
    if (!userData) return false;
    
    // Validate required fields
    return !!(userData.nama && userData.email && userData.phone && userData.domisili);
  },

  // Clear user data (logout)
  clearUserData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  },

  // Update user data
  updateUserData(updates) {
    try {
      const currentData = this.getUserData();
      if (!currentData) return false;
      
      const updatedData = { ...currentData, ...updates };
      this.storeUserData(updatedData);
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  },

  // Save full report (user + wizard data)
  async saveFullReport(email, reportData) {
    try {
      const docRef = await addDoc(collection(db, 'userReports'), {
        email,
        ...reportData,
        createdAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving full report:', error);
      return { success: false, error };
    }
  }
};

// Validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation for Indonesian numbers
  isValidPhone(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Name validation
  isValidName(name) {
    return name.trim().length >= 2;
  },

  // Location validation
  isValidLocation(location) {
    return location.trim().length >= 3;
  }
};

// Analytics and tracking
export const analyticsService = {
  // Track user registration
  trackRegistration(userData) {
    try {
      // In production, send to your analytics service
      console.log('Analytics: User registered', {
        email: userData.email,
        location: userData.domisili,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  // Track wizard usage
  trackWizardStep(step, data) {
    try {
      const userData = userService.getUserData();
      console.log('Analytics: Wizard step completed', {
        userId: userData?.userId,
        step,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
};

// Export default for convenience
export default userService; 