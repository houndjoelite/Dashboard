import { Request, Response } from 'express';
import { getSiteStats } from '../models/stats.model';

export const getStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await getSiteStats(
      startDate as string,
      endDate as string
    );
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
};
