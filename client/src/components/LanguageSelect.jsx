import { useLanguage } from "../context/useLanguage";

function LanguageSelect() {
  const { language, changeLanguage } = useLanguage();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Choose language</span>
      <span aria-hidden="true">文</span>
      <select
        value={language}
        onChange={(event) => changeLanguage(event.target.value)}
        className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none"
      >
        <option value="en" className="text-slate-900">English</option>
        <option value="hi" className="text-slate-900">हिन्दी</option>
        <option value="mr" className="text-slate-900">मराठी</option>
      </select>
    </label>
  );
}

export default LanguageSelect;
