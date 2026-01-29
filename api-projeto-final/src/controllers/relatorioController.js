import { gerarRelatorioMensalService } from '../services/relatorioService.js';

export async function gerarRelatorioMensalController(req, res, next) {
  try {
    const pdfDoc = await gerarRelatorioMensalService(); // agora é async/await

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-mensal.pdf');

    pdfDoc.pipe(res);

  } catch (error) {
    next(error);
  }
}