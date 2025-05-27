import { Button } from 'react-native-paper';

import { useI18n } from '@/context/I18nContext';

export default function LanguageSwitcher() {
  const { toggleLocale, locale } = useI18n();

  return (
    <Button mode="outlined" onPress={toggleLocale}>
      {locale === 'en' ? 'RUS' : 'ENG'}
    </Button>
  );
}
