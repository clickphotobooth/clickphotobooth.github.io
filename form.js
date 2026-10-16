// Paste the Web app URL from the Apps Script deployment between the quotes.
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzu06s_9l-h5QrcuXrzZwfh2pZcJ3UsWE_Q5C51TyVFEt6zm9h6Fwx2b55VecC-aBk5/exec';

const form = document.querySelector('#booking-form');
const button = form.querySelector('.submit');
const error = form.querySelector('.form-error');
const whatsappLink = 'https://wa.me/447471077589?text=Hi%20Click!%20I%27d%20love%20to%20ask%20about%20your%20photo%20booth.';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.hidden = true;

  if (!SHEET_ENDPOINT) {
    showError();
    return;
  }

  button.disabled = true;
  button.textContent = 'SENDING...';
  try {
    // Only show "Thank you" once the sheet confirms it saved the row.
    const response = await fetch(SHEET_ENDPOINT, { method: 'POST', body: new URLSearchParams(new FormData(form)) });
    const result = await response.json();
    if (!result.ok) throw new Error('Sheet did not save the row');
    form.closest('.form-panel').innerHTML = `
      <div class="success">
        <span class="success-icon" aria-hidden="true">✓</span>
        <h3>Thank you!</h3>
        <p>We've got your details and will be in touch on WhatsApp soon.</p>
      </div>`;
  } catch {
    button.disabled = false;
    button.textContent = 'SEND MY DETAILS';
    showError();
  }
});

function showError() {
  error.innerHTML = `Sorry, that didn't send. Please message us on <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer">WhatsApp</a> instead.`;
  error.hidden = false;
}
