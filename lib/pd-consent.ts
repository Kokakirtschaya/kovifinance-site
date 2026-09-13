// Меняя текст галочки или связанную Политику, выпускайте новую версию согласия.
// Уже выданные версии не переиспользуем: CRM хранит снимок текста каждой заявки.
export const PD_CONSENT = {
  version: "2026-09-13.1",
  prefix: "Я даю согласие на обработку персональных данных в соответствии с",
  policyLabel: "Политикой обработки персональных данных",
  policyPath: "/confidentiality",
  policyUrl: "https://kovifinance.ru/confidentiality",
  policyVersion: "2026-09-11",
} as const;

export const PD_CONSENT_TEXT = `${PD_CONSENT.prefix} ${PD_CONSENT.policyLabel}`;

/** Время получения согласия сервером, а не присланное браузером время клика. */
export function createLeadConsent(requestId: string, now = new Date()) {
  return {
    accepted: true as const,
    method: "checkbox" as const,
    requestId,
    acceptedAt: now.toISOString(),
    version: PD_CONSENT.version,
    text: PD_CONSENT_TEXT,
    policyUrl: PD_CONSENT.policyUrl,
    policyVersion: PD_CONSENT.policyVersion,
  };
}

export type LeadConsent = ReturnType<typeof createLeadConsent>;
