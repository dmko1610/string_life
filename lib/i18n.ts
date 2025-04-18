import { I18n } from "i18n-js";
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import { getLocales } from "expo-localization";

const translations = { en, ru };

const i18n = new I18n(translations);

i18n.locale = getLocales()[0].languageCode ?? 'en';

export default i18n;
