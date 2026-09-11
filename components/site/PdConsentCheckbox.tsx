type Props = {
  id: string;
  name?: string;
  className?: string;
};

export default function PdConsentCheckbox({
  id,
  name = "pdConsent",
  className = "",
}: Props) {
  return (
    <label htmlFor={id} className={`flex items-start gap-2.5 text-xs leading-relaxed text-muted ${className}`}>
      <input
        id={id}
        name={name}
        type="checkbox"
        value="on"
        required
        className="mt-0.5 size-4 shrink-0 accent-brand"
      />
      <span>
        Я даю согласие на обработку персональных данных в соответствии с{" "}
        <a
          href="/confidentiality"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-ink"
        >
          Политикой обработки персональных данных
        </a>
      </span>
    </label>
  );
}
