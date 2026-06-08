export function formatMoney(value: number) {
  return `Q ${value.toLocaleString("es-GT", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}`;
}

export function parseMoneyInput(value: string) {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}
