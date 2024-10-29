/**
 * Util qui va servir à sanitize les inputs reçus
 * Ce qui va permettre d'éviter un maximum les injections SQL
 *
 * @param {Object} data - Données récupérées des inputs
 * @param {Array<string>} allowedFields -  Liste des champs autorisés
 * @returns {Object} - Données nettoyées ne contenant que les champs autorisés
 */

const sanitizeInput = (data, allowedFields) => {
  const sanitized = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      sanitized[field] = data[field];
    }
  });
  return sanitized;
};

module.exports = sanitizeInput;
