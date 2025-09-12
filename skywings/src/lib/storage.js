import CryptoJS from 'crypto-js';

/**
 * Storage utility for handling localStorage with type safety, error handling, and encryption
 */

const STORAGE_PREFIX = 'skywings_';
const ENCRYPTION_KEY = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'default-encryption-key';

// List of keys that should be encrypted
const ENCRYPTED_KEYS = [
  'auth_token',
  'refresh_token',
  'user_data',
  'token_expiry'
];

/**
 * Encrypt data
 * @param {string} data - Data to encrypt
 * @returns {string} Encrypted data
 */
const encrypt = (data) => {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return data; // Return original data if encryption fails
  }
};

/**
 * Decrypt data
 * @param {string} data - Data to decrypt
 * @returns {string} Decrypted data
 */
const decrypt = (data) => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8) || data; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption failed:', error);
    return data; // Return original data if decryption fails
  }
};

/**
 * Check if a key should be encrypted
 * @param {string} key - The key to check
 * @returns {boolean} True if the key should be encrypted
 */
const shouldEncrypt = (key) => {
  const baseKey = key.replace(STORAGE_PREFIX, '');
  return ENCRYPTED_KEYS.includes(baseKey);
};

/**
 * Get an item from localStorage
 * @param {string} key - The key to get
 * @param {*} [defaultValue=null] - Default value if the item doesn't exist
 * @returns {*|null} The stored value or defaultValue
 */
const getItem = (key, defaultValue = null) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    let item = localStorage.getItem(storageKey);
    
    if (item === null) return defaultValue;
    
    // Decrypt if needed
    if (shouldEncrypt(storageKey)) {
      item = decrypt(item);
    }
    
    try {
      return JSON.parse(item);
    } catch (e) {
      // If not valid JSON, return as is
      return item;
    }
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage
 * @param {string} key - The key to set
 * @param {*} value - The value to store (will be stringified)
 * @returns {boolean} True if successful, false otherwise
 */
const setItem = (key, value) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    let item = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Encrypt if needed
    if (shouldEncrypt(storageKey)) {
      item = encrypt(item);
    }
    
    localStorage.setItem(storageKey, item);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} True if successful, false otherwise
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
    return false;
  }
};

// Add a method to safely clear only our app's data
const clearAppData = () => {
  try {
    const keysToRemove = [];
    
    // Find all keys with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all keys with our prefix
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing app data from localStorage:', error);
    return false;
  }
};

/**
 * Clear all items with the storage prefix from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
const clear = () => {
  try {
    // Only remove items with our prefix
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage', error);
    return false;
  }
};

/**
 * Get a namespaced storage object
 * @param {string} namespace - The namespace to use
 * @returns {Object} An object with storage methods scoped to the namespace
 */
const createNamespace = (namespace) => {
  const prefix = `${namespace}:`;
  
  return {
    get: (key, defaultValue = null) => getItem(prefix + key, defaultValue),
    set: (key, value) => setItem(prefix + key, value),
    remove: (key) => removeItem(prefix + key),
    clear: () => {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(STORAGE_PREFIX + prefix)) {
            localStorage.removeItem(key);
          }
        });
        return true;
      } catch (error) {
        console.error(`Error clearing namespace: ${namespace}`, error);
        return false;
      }
    },
  };
};

// Export the storage utility
const storage = {
  get: getItem,
  set: setItem,
  remove: removeItem,
  clear: clearAppData, // Use our safer clear implementation
  clearAll: clear, // Keep original clear as clearAll
  createNamespace,
  
  // Add encryption utilities for external use if needed
  _encrypt: encrypt,
  _decrypt: decrypt,
  
  // Add a method to migrate existing unencrypted data
  migrateToEncrypted: () => {
    try {
      const keysToMigrate = [];
      
      // Find all keys that should be encrypted but might not be
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(STORAGE_PREFIX)) {
          const baseKey = key.replace(STORAGE_PREFIX, '');
          if (ENCRYPTED_KEYS.includes(baseKey)) {
            keysToMigrate.push(key);
          }
        }
      }
      
      // Re-save each key to ensure it's encrypted
      keysToMigrate.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          // If the value doesn't look encrypted, re-save it
          if (value && !value.startsWith('U2FsdGVkX1')) { // Common CryptoJS prefix
            const decrypted = JSON.parse(value);
            storage.set(key.replace(STORAGE_PREFIX, ''), decrypted);
          }
        } catch (e) {
          console.error(`Error migrating key ${key}:`, e);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error during data migration:', error);
      return false;
    }
  }
};

// Run migration on storage module load
if (typeof window !== 'undefined') {
  storage.migrateToEncrypted();
}

export default storage;
