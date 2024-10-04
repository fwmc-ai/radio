function deriveKey(salt, secret) {
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += String.fromCharCode(
        ((salt.charCodeAt(i % salt.length) ^ secret.charCodeAt(i % secret.length)) + i) % 256
      );
    }
    return key;
  }
  
  function xorCipher(text, salt, secret) {
    const key = deriveKey(salt, secret);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
  
  function encodeConfig(config) {
    const jsonString = JSON.stringify(config);
    const salt = 'FWMC-AI-RADIO-SALT';
    const secret = 'YOUR-SECRET-KEY';
    const xorResult = xorCipher(jsonString, salt, secret);
    if (typeof btoa === 'function') {
      // Browser environment
      return btoa(xorResult)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    } else {
      // Node.js environment
      return Buffer.from(xorResult).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }
  }
  
  function decodeConfig(encodedConfig) {
    const salt = 'FWMC-AI-RADIO-SALT';
    const secret = 'YOUR-SECRET-KEY';
    const base64Decoded = atob(encodedConfig.replace(/-/g, '+').replace(/_/g, '/'));
    const xorResult = xorCipher(base64Decoded, salt, secret);
    return JSON.parse(xorResult);
  }
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Expose the functions globally in browser
    window.encodeAppConfig = encodeConfig;
    window.decodeAppConfig = decodeConfig;
  } else {
    // Export for Node.js environment
    module.exports = { encodeConfig, decodeConfig };
  }