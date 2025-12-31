/**
 * Human-readable logger with timestamps
 * Supports optional metadata objects for detailed logging
 */

const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
};

const formatMetadata = (metadata) => {
  if (!metadata || typeof metadata !== 'object') return '';
  return '\n  ' + JSON.stringify(metadata, null, 2).split('\n').join('\n  ');
};

const logger = {
  info: (message, metadata) => {
    const timestamp = getTimestamp();
    const meta = formatMetadata(metadata);
    console.log(`[${timestamp}] [INFO] ${message}${meta}`);
  },

  warn: (message, metadata) => {
    const timestamp = getTimestamp();
    const meta = formatMetadata(metadata);
    console.warn(`[${timestamp}] [WARN] ${message}${meta}`);
  },

  error: (message, metadata) => {
    const timestamp = getTimestamp();
    const meta = formatMetadata(metadata);
    console.error(`[${timestamp}] [ERROR] ${message}${meta}`);
  }
};

module.exports = logger;
