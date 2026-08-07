// Buyer Led Representation — script.js

document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion
  var faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) {
        answer.hidden = expanded;
      }
    });
  });

  // Lead form — AJAX submit to Formspree
  var form = document.getElementById('lead-form');
  if (form) {
    var formCard = document.getElementById('form-card');
    var successEl = document.getElementById('form-success');
    var errorEl = document.getElementById('form-error');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      errorEl.classList.add('hidden');

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.classList.add('hidden');
            successEl.classList.remove('hidden');
            successEl.focus();
          } else {
            return response.json().then(function (data) {
              throw new Error(
                (data && data.errors && data.errors.map(function (e) { return e.message; }).join(', ')) ||
                  'Something went wrong. Please try again.'
              );
            });
          }
        })
        .catch(function (err) {
          errorEl.textContent = err.message || 'Something went wrong. Please try again, or email conorwolfin@gmail.com directly.';
          errorEl.classList.remove('hidden');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Book My Free Consultation';
        });
    });
  }
});
