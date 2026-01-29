export function gerarMatricula(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, "");
  const doisDigitos = cpfLimpo.slice(-2);
  const aleatorio = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  const ano = new Date().getFullYear();

  return `${ano}${aleatorio}${doisDigitos}`;
}

