const pageBody = document.querySelector('.j-page-body');
const burger = document.querySelector('.j-burger');

burger.addEventListener('click', (e) => {
	e.preventDefault();
	burger.classList.toggle('is-active');
	pageBody.classList.toggle('is-open-menu');
})
