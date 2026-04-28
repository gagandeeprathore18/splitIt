const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return obj.trim();
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === 'object') {
    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      // Block MongoDB operator injection: keys starting with $ or containing .
      if (key.startsWith('$') || key.includes('.')) {
        continue; // silently drop dangerous keys
      }
      clean[key] = sanitizeObject(value);
    }
    return clean;
  }

  return obj;
};

const sanitize = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

export default sanitize;
