import { useI18n } from '@/context/I18nContext';
import i18n from '@/lib/i18n';

export function useTranslation() {
  const { locale } = useI18n();

  return {
    t: i18n.t.bind(i18n),
    locale,
  };
}
