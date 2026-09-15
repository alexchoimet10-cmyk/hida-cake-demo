// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Popup RDV (sans création de compte)
const rdvModal = document.getElementById('rdvModal');
const rdvOverlay = document.getElementById('rdvOverlay');
const rdvClose = document.getElementById('rdvClose');

function openRdvModal() {
  rdvModal.classList.add('is-open');
  rdvModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('rdv-modal-open');
}
function closeRdvModal() {
  rdvModal.classList.remove('is-open');
  rdvModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('rdv-modal-open');
}
document.querySelectorAll('.js-open-rdv').forEach(btn => {
  btn.addEventListener('click', openRdvModal);
});
rdvOverlay.addEventListener('click', closeRdvModal);
rdvClose.addEventListener('click', closeRdvModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && rdvModal.classList.contains('is-open')) closeRdvModal();
});

// Formulaire RDV (popup)
// NOTE: pour recevoir réellement les demandes par email, crée un compte gratuit sur
// https://formspree.io, récupère ton "form ID" et remplace YOUR_FORM_ID ci-dessous.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const rdvForm = document.getElementById('rdvForm');
const rdvFormNote = document.getElementById('rdvFormNote');

rdvForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = rdvForm.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;

  if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
    rdvFormNote.textContent = "Formulaire pas encore connecté — voir le commentaire dans script.js pour activer l'envoi d'emails (Formspree, gratuit).";
    rdvFormNote.style.color = '#B23B3B';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours...';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(rdvForm),
    });
    if (res.ok) {
      rdvForm.reset();
      rdvFormNote.textContent = 'Merci ! Votre demande a bien été envoyée, on vous recontacte rapidement.';
      rdvFormNote.style.color = '#2FAE60';
    } else {
      throw new Error('Request failed');
    }
  } catch (err) {
    rdvFormNote.textContent = "Une erreur est survenue, réessayez ou appelez-nous directement.";
    rdvFormNote.style.color = '#B23B3B';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});
