import { body } from 'express-validator';

export const createAlertValidation = [
  // Titre - obligatoire, entre 5 et 255 caractères
  body('title')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Le titre doit contenir entre 5 et 255 caractères'),
    
  // Description - obligatoire, minimum 20 caractères
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('La description doit contenir au moins 20 caractères'),
    
  // Catégorie - optionnelle
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La catégorie ne doit pas dépasser 100 caractères'),
    
  // Urgence - optionnelle avec des valeurs spécifiques
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Niveau d\'urgence invalide'),
    
  // Preuves - optionnelles
  body('evidence')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description des preuves ne doit pas dépasser 1000 caractères'),
    
  // Anonymat - booléen optionnel (peut être une chaîne 'true'/'false' ou un booléen)
  body('anonymous')
    .optional()
    .isIn(['true', 'false', true, false])
    .withMessage('La valeur d\'anonymat doit être un booléen')
    .customSanitizer(value => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    }),
    
  // Nom du rapporteur - requis si non anonyme
  body('name')
    .if((value, { req }) => {
      const isAnonymous = req.body.anonymous === 'true' || req.body.anonymous === true;
      return !isAnonymous;
    })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    
  // Contact - validation conditionnelle (requis si non anonyme)
  body('contact')
    .if((value, { req }) => {
      const isAnonymous = req.body.anonymous === 'true' || req.body.anonymous === true;
      return !isAnonymous;
    })
    .trim()
    .notEmpty()
    .withMessage('Un contact est requis lorsque l\'alerte n\'est pas anonyme')
    .custom((value) => {
      // Vérifie si c'est un email valide ou un numéro de téléphone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^[0-9\s\-\+\(\)]{10,20}$/.test(value);
      
      if (!isEmail && !isPhone) {
        throw new Error('Le contact doit être un email valide ou un numéro de téléphone');
      }
      return true;
    })
];
