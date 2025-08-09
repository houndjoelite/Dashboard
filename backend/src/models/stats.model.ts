import { RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface SiteStats extends RowDataPacket {
  totalVisitors: number;
  totalAlerts: number;
  totalActions: number;
  totalMessages: number;
  statsByDate: Array<{
    date: string;
    visitors: number;
    alerts: number;
    actions: number;
    messages: number;
  }>;
}

export const getSiteStats = async (startDate?: string, endDate?: string): Promise<SiteStats> => {
  try {
    // Vérifier si les tables existent
    const [tables] = await pool.query<RowDataPacket[]>(
      `SELECT TABLE_NAME 
       FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = 'apjv_admin' 
       AND TABLE_NAME IN ('visitors', 'alerts', 'actions', 'contact_messages')`
    );

    const existingTables = tables.map(t => t.TABLE_NAME);
    
    // Créer des parties de requête conditionnelles
    const hasVisitors = existingTables.includes('visitors');
    const hasAlerts = existingTables.includes('alerts');
    const hasActions = existingTables.includes('actions');
    const hasMessages = existingTables.includes('contact_messages');

    // Requête pour les totaux généraux
    const totalsQuery = [
      hasVisitors ? '(SELECT COUNT(*) FROM apjv_admin.visitors) as totalVisitors' : '0 as totalVisitors',
      hasAlerts ? '(SELECT COUNT(*) FROM apjv_admin.alerts) as totalAlerts' : '0 as totalAlerts',
      hasActions ? '(SELECT COUNT(*) FROM apjv_admin.actions) as totalActions' : '0 as totalActions',
      hasMessages ? '(SELECT COUNT(*) FROM apjv_admin.contact_messages) as totalMessages' : '0 as totalMessages'
    ].join(',');

    const [totals] = await pool.query<RowDataPacket[]>(
      `SELECT ${totalsQuery}`
    );

    // Requête pour les statistiques par date
    let dailyStats: RowDataPacket[] = [];
    
    // Si on a au moins une table avec des dates, on peut faire des statistiques par date
    if (hasVisitors || hasAlerts || hasActions || hasMessages) {
      // Créer une table temporaire avec toutes les dates
      let dateQuery = `
        WITH RECURSIVE date_series AS (
          SELECT CURDATE() - INTERVAL 29 DAY as date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM date_series
          WHERE date < CURDATE()
        )
        SELECT 
          ds.date as date,
          ${hasVisitors ? '(SELECT COUNT(DISTINCT v.id) FROM apjv_admin.visitors v WHERE DATE(v.created_at) = ds.date) as visitors,' : '0 as visitors,'}
          ${hasAlerts ? '(SELECT COUNT(*) FROM apjv_admin.alerts a WHERE DATE(a.created_at) = ds.date) as alerts,' : '0 as alerts,'}
          ${hasActions ? '(SELECT COUNT(*) FROM apjv_admin.actions ac WHERE DATE(ac.created_at) = ds.date) as actions,' : '0 as actions,'}
          ${hasMessages ? '(SELECT COUNT(*) FROM apjv_admin.contact_messages cm WHERE DATE(cm.created_at) = ds.date) as messages' : '0 as messages'}
        FROM date_series ds
        WHERE 1=1
      `;

      const params: (string | undefined)[] = [];
      
      if (startDate && endDate) {
        dateQuery += ' AND ds.date BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }
      
      dateQuery += ' ORDER BY ds.date DESC';
      
      [dailyStats] = await pool.query<RowDataPacket[]>(dateQuery, params);
    }

    return {
      totalVisitors: Number(totals[0].totalVisitors) || 0,
      totalAlerts: Number(totals[0].totalAlerts) || 0,
      totalActions: Number(totals[0].totalActions) || 0,
      totalMessages: Number(totals[0].totalMessages) || 0,
      statsByDate: dailyStats.map(stat => ({
        date: stat.date,
        visitors: Number(stat.visitors) || 0,
        alerts: Number(stat.alerts) || 0,
        actions: Number(stat.actions) || 0,
        messages: Number(stat.messages) || 0,
      })),
    } as SiteStats;
  } catch (error) {
    console.error('Error fetching site stats:', error);
    throw error;
  }
};
