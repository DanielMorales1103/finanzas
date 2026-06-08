const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthKey(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const monthName = MONTH_NAMES[(month || 1) - 1] ?? monthKey;

  return `${monthName} ${year}`;
}
