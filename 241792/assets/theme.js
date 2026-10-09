// Apply before the page paints; remember the choice across all three pages.
let theme = 'dark';
try { theme = localStorage.getItem('connecTheme') === 'light' ? 'light' : 'dark'; } catch {}
document.documentElement.dataset.bsTheme = theme;
function updateThemeButton() {
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-pressed', document.documentElement.dataset.bsTheme === 'dark');
  });
}
function toggleTheme() {
  const next = document.documentElement.dataset.bsTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.bsTheme = next;
  try { localStorage.setItem('connecTheme', next); } catch {}
  updateThemeButton();
}
document.addEventListener('DOMContentLoaded', updateThemeButton);
