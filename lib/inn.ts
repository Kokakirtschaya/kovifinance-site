// Валидация ИНН — чистые функции, без секретов и сети.
// Импортируется и на клиенте (форма), и на сервере (Checko-проверка).

/** Только цифры, максимум 12 знаков. */
export function normalizeInn(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 12);
}

/** Проверка контрольной суммы ИНН: 10 знаков (юрлицо) или 12 (ИП/физлицо). */
export function isValidInn(inn: string): boolean {
  if (!/^(\d{10}|\d{12})$/.test(inn)) return false;
  const d = inn.split("").map(Number);
  const csum = (coefs: number[]) =>
    (coefs.reduce((sum, c, i) => sum + c * d[i], 0) % 11) % 10;

  if (inn.length === 10) {
    return csum([2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[9];
  }
  const c11 = csum([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[10];
  const c12 = csum([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[11];
  return c11 && c12;
}
