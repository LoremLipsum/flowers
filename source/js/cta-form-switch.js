const ctaForm = document.querySelector('.cta__form');
const partialFirst = ctaForm.querySelector('.j-cta-partial-first');
const nextBtn = ctaForm.querySelector('.j-cta-btn-next');
const partialSecond = ctaForm.querySelector('.j-cta-partial-second');
const prevBtn = ctaForm.querySelector('.j-cta-btn-prev');

nextBtn.addEventListener('click', (e) => {
	e.preventDefault();
	partialFirst.classList.remove('is-active');
	partialSecond.classList.add('is-active');
});

prevBtn.addEventListener('click', (e) => {
	e.preventDefault();
	partialFirst.classList.add('is-active');
	partialSecond.classList.remove('is-active');
})
