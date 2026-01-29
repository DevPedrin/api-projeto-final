function gerarCodigo(cpf) {
  // Pega ano atual
  const ano = new Date().getFullYear();

  // Extrai os 2 últimos dígitos do CPF (ignorando pontos e hífen)
  const cpfLimpo = cpf.replace(/\D/g, "");
  const doisDigitos = cpfLimpo.slice(-2);

  // Gera número aleatório de 4 dígitos (0000 a 9999)
  const aleatorio = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  // Monta resultado final
  return `${ano}${doisDigitos}${aleatorio}`;
}

// Exemplo:
console.log(gerarCodigo("098.671.391-47"));