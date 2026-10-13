/**
 * Soma um período de cobrança a uma data, conforme o intervalo do preço.
 *
 * Usado só quando não há assinatura para consultar: o caminho normal pega o fim
 * do período/trial que o próprio Stripe já calculou.
 *
 * Atenção ao fim de mês do JavaScript: 31/01 + 1 mês vira 03/03, não 28/02.
 */
export function addInterval(from: Date, interval: string | null | undefined): Date | null {
  const end = new Date(from);

  if (interval === 'year') {
    end.setFullYear(end.getFullYear() + 1);
  } else if (interval === 'month') {
    end.setMonth(end.getMonth() + 1);
  } else {
    return null;
  }

  return end;
}
