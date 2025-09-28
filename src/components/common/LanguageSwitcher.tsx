import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@styles/scss/LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const languages: any = t('languages', { returnObjects: true });
  const options = useMemo(
    () =>
      Object.keys(languages).map((langKey) => ({
        label: languages[langKey],
        value: langKey.toUpperCase()
      })),
    [languages]
  );
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language.toUpperCase());
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedLanguage(i18n.language.toUpperCase());
  }, [i18n.language]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const changeLanguage = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage.toLowerCase());
    setSelectedLanguage(newLanguage);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.languageSwitcher}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}>
        {selectedLanguage.slice(0, 2)}
      </button>

      <div
        className={[
          styles.popup,
          styles.popupRight,
          styles.popupTop,
          open ? styles.popupActive : ''
        ].join(' ')}
        role="listbox"
        aria-activedescendant={`lang-${selectedLanguage}`}
        tabIndex={-1}>
        {options.map((option) => {
          const active = option.value === selectedLanguage.slice(0, 2).toUpperCase();
          return (
            <div
              key={option.value}
              id={`lang-${option.value}`}
              role="option"
              aria-selected={active}
              className={styles.option}
              onClick={() => changeLanguage(option.value)}>
              <div className={styles.optionLabel}>{option.label}</div>
              {active && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.1972 4.26166C13.4901 4.55456 13.4901 5.02943 13.1972 5.32232L6.78049 11.739C6.4876 12.0319 6.01273 12.0319 5.71983 11.739L2.80317 8.82232C2.51027 8.52943 2.51027 8.05455 2.80317 7.76166C3.09606 7.46877 3.57093 7.46877 3.86383 7.76166L6.25016 10.148L12.1365 4.26166C12.4294 3.96877 12.9043 3.96877 13.1972 4.26166Z"
                    fill="#43A047"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
