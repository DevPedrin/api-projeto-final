import PDFDocument from "pdfkit";
import pool from "../db/connection.js";

export async function gerarRelatorioMensalService() {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  try {
    const { rows } = await pool.query(`
      SELECT 
        m.tipo, 
        m.quantidade, 
        m.created_at, 
        u.first_name || ' ' || u.last_name AS usuario,
        p.nome AS produto,
        m.observacao
      FROM movimentos_estoque m
      JOIN users u ON u.id = m.user_id
      JOIN produtos p ON p.id = m.produto_id
      WHERE date_trunc('month', m.created_at) = date_trunc('month', CURRENT_DATE)
      ORDER BY m.created_at
    `);

    // Cabeçalho
    doc.fontSize(16).text('Relatório Mensal de Movimentações', { align: 'center' });
    doc.moveDown(1.5);

    const columns = [
      { label: 'Data', width: 90 },
      { label: 'Produto', width: 100 },
      { label: 'Tipo', width: 50 },
      { label: 'Qtd', width: 50 },
      { label: 'Usuário', width: 120 },
      { label: 'Observação', width: 150 }
    ];

    const startX = doc.x;
    let y = doc.y;

    // Cabeçalho
    doc.font('Helvetica-Bold').fontSize(12);
    let x = startX;
    columns.forEach(col => {
      doc.text(col.label, x, y, { width: col.width });
      x += col.width;
    });

    doc.moveDown(1);
    y = doc.y;
    doc.font('Helvetica').fontSize(11);

    // Função para calcular altura de cada célula
    function getHeight(text, width) {
      return doc.heightOfString(text, { width });
    }

    // Desenhar linhas
    rows.forEach(m => {
      const data = [
        new Date(m.created_at).toLocaleString(),
        m.produto,
        m.tipo,
        m.quantidade,
        m.usuario,
        m.observacao ?? ''
      ];

      // Calcula altura da linha pelo conteúdo mais alto
      const heights = data.map((text, i) => getHeight(text, columns[i].width));
      const rowHeight = Math.max(...heights) + 4; // 4px de padding

      x = startX;
      data.forEach((text, i) => {
        doc.text(text, x, y, { width: columns[i].width });
        x += columns[i].width;
      });

      y += rowHeight;

      // Nova página se necessário
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 30;
      }
    });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    doc.fontSize(12).text('Erro ao gerar relatório', { align: 'center' });
    doc.end();
  }

  return doc;
}
