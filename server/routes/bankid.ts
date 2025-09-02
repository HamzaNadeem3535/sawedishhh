import express from 'express';
import { body, param } from 'express-validator';
import { BankIDController } from '../controllers/BankIDController';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Initiate BankID authentication
router.post('/auth/initiate',
 
  [
    body('personal_number').matches(/^\d{8}-\d{4}$/).withMessage('Invalid personal number format')
  ],
  validateRequest,
  BankIDController.initiateAuthentication
);

// Initiate BankID signature
router.post('/sign/initiate',
 
  [
    body('personal_number').matches(/^\d{8}-\d{4}$/).withMessage('Invalid personal number format'),
    body('document_id').isUUID().withMessage('Invalid document ID')
  ],
  validateRequest,
  BankIDController.initiateSignature
);

// Check BankID status
router.get('/status/:orderRef',

  [param('orderRef').notEmpty()],
  validateRequest,
  BankIDController.checkStatus
);

// Complete BankID process
router.post('/complete',

  [
    body('order_ref').notEmpty(),
    body('completion_data').isObject()
  ],
  validateRequest,
  BankIDController.completeProcess
);

// Cancel BankID process
router.post('/cancel',
  
  [body('order_ref').notEmpty()],
  validateRequest,
  BankIDController.cancelProcess
);

// Get user's BankID sessions
router.get('/sessions',
  
  BankIDController.getUserSessions
);

export default router;