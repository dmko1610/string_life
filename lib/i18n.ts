import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '@/locales/en.json';
import ru from '@/locales/ru.json';

const translations = { en, ru };

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = getLocales()[0].languageCode || 'en';

export const KEYS = {
  DASHBOARD: {
    TITLE: 'Dashboard.title',
    DELETE_QUESTION: 'Dashboard.delete.question',
    DELETE_CONFIRM: 'Dashboard.delete.confirm',
    DELETE_BUTTON: 'Dashboard.delete.delete_button',
    CANCEL_BUTTON: 'Dashboard.delete.cancel_button',
  },
  ADD_INSTRUMENT: {
    TITLE: 'AddInstrument.title',
    PLACEHOLDER: 'AddInstrument.placeholder',
    REPL_LABEL: 'AddInstrument.repl_label',
    SAVE_BUTTON: 'AddInstrument.save_button',
  },
  INSTRUMENT: {
    REPL_LABEL: 'Instrument.repl_label',
    DAYS_SINCE_LABEL: 'Instrument.days_since_label',
    PLAY_TIME_LABEL: 'Instrument.play_time_label',
    END_TIME_LABEL: 'Instrument.end_time_label',
  },
  LABELS: {
    electro: 'Labels.electro',
    bass: 'Labels.bass',
    ukulele: 'Labels.ukulele',
    acoustic: 'Labels.acoustic',
  },
};

export default i18n;
