import { getDashboardDataService } from '../services/dashboardService.js';

export async function getDashboardDataController(req, res, next) {
  try {
    const data = await getDashboardDataService();
    return res.status(200).json({ success: true, data });
  } catch(error) {
    next(error)
  }
}