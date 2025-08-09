import { Request, Response } from 'express';
import { createAlert, getAlerts, updateAlertStatus, deleteAlert } from '../controllers/alert.controller';
import pool from '../config/database';
import { Alert } from '../types/alert.types';

// Mock de la base de données
jest.mock('../config/database');

const mockQuery = pool.execute as jest.Mock;

describe('Alert Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      })
    };
    responseObject = {};
    jest.clearAllMocks();
  });

  describe('createAlert', () => {
    it('devrait créer une nouvelle alerte', async () => {
      const testAlert: Partial<Alert> = {
        content: 'Test alerte',
        is_anonymous: true
      };

      mockRequest.body = testAlert;
      mockRequest.ip = '127.0.0.1';
      mockRequest.headers = { 'user-agent': 'test-agent' };

      // Mock de l'insertion en base de données
      mockQuery.mockResolvedValueOnce([{ insertId: 1 }]);
      
      // Mock de la récupération de l'alerte créée
      mockQuery.mockResolvedValueOnce([[
        { 
          id: 1, 
          ...testAlert, 
          created_at: new Date().toISOString(),
          processed_by: null,
          processed_by_name: null
        }
      ]]);

      await createAlert(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.success).toBe(true);
      expect(responseObject.data).toHaveProperty('id', 1);
      expect(responseObject.data.content).toBe('Test alerte');
    });
  });

  describe('getAlerts', () => {
    it('devrait retourner la liste des alertes', async () => {
      const testAlerts = [
        { 
          id: 1, 
          content: 'Alerte 1', 
          is_anonymous: true,
          status: 'pending',
          created_at: new Date().toISOString(),
          processed_by: null,
          processed_by_name: null
        }
      ];

      mockQuery.mockResolvedValueOnce([testAlerts]);
      
      await getAlerts(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.success).toBe(true);
      expect(Array.isArray(responseObject.data)).toBe(true);
      expect(responseObject.data[0]).toHaveProperty('id', 1);
    });
  });

  describe('updateAlertStatus', () => {
    it('devrait mettre à jour le statut d\'une alerte', async () => {
      const alertId = '1';
      const newStatus = 'published';
      
      mockRequest.params = { id: alertId };
      mockRequest.body = { status: newStatus };
      (mockRequest as any).user = { id: 1 }; // Admin user

      // Mock de la mise à jour
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
      
      // Mock de la récupération de l'alerte mise à jour
      mockQuery.mockResolvedValueOnce([[
        { 
          id: 1, 
          content: 'Test alerte',
          is_anonymous: true,
          status: newStatus,
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          processed_by: 1,
          processed_by_name: 'Admin'
        }
      ]]);

      await updateAlertStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.success).toBe(true);
      expect(responseObject.data.status).toBe(newStatus);
      expect(responseObject.data.processed_by).toBe(1);
    });
  });

  describe('deleteAlert', () => {
    it('devrait supprimer une alerte', async () => {
      const alertId = '1';
      mockRequest.params = { id: alertId };

      // Mock de la suppression
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await deleteAlert(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.success).toBe(true);
      expect(responseObject.message).toBe('Alerte supprimée avec succès');
    });
  });
});
