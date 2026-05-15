export function initI18n() {
  const btnDe = document.getElementById('lang-de');
  const btnEn = document.getElementById('lang-en');
  if (!btnDe || !btnEn) return;

  const elements = document.querySelectorAll('[data-i18n-de], [data-i18n-en]');
  
  // Get saved language or default to German
  let currentLang = localStorage.getItem('club199_lang') || 'de';

  const langBg = document.getElementById('lang-bg');

  const updateUI = (lang) => {
    // Update active state on buttons
    if (lang === 'en') {
      btnEn.classList.remove('text-white/50', 'hover:text-white');
      btnEn.classList.add('text-brand-black');
      btnDe.classList.remove('text-brand-black');
      btnDe.classList.add('text-white/50', 'hover:text-white');
      if (langBg) langBg.style.transform = 'translateX(42px)';
    } else {
      btnDe.classList.remove('text-white/50', 'hover:text-white');
      btnDe.classList.add('text-brand-black');
      btnEn.classList.remove('text-brand-black');
      btnEn.classList.add('text-white/50', 'hover:text-white');
      if (langBg) langBg.style.transform = 'translateX(0)';
    }

    // Animate text swap
    elements.forEach(el => {
      // Fade out
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
      
      setTimeout(() => {
        // Swap text
        const newText = el.getAttribute(`data-i18n-${lang}`);
        if (newText) {
          el.innerHTML = newText;
        }
        // Fade in
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200);
    });
  };

  // Initial load
  updateUI(currentLang);

  // Bind events
  btnDe.addEventListener('click', () => {
    if (currentLang === 'de') return;
    currentLang = 'de';
    localStorage.setItem('club199_lang', 'de');
    updateUI('de');
  });

  btnEn.addEventListener('click', () => {
    if (currentLang === 'en') return;
    currentLang = 'en';
    localStorage.setItem('club199_lang', 'en');
    updateUI('en');
  });
}
