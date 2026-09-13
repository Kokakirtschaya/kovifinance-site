export const LOGIN_UNAVAILABLE = "Не получилось отправить письмо. Попробуйте позже.";

export function loginErrorMessage(error?: string | null): string | undefined {
  if (!error) return undefined;
  if (error === "rate_limit") {
    return "Слишком много попыток. Подождите 15 минут перед повторным запросом.";
  }
  return LOGIN_UNAVAILABLE;
}
