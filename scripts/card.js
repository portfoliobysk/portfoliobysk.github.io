const cardLists = document.querySelectorAll('.cards');

cardLists.forEach((el) => {
	let isDown = false;
	let startX = 0;
	let startScrollLeft = 0;
	let moved = 0;

	el.addEventListener('pointerdown', (e) => {
		if (e.button !== 0) return;

		isDown = true;
		moved = 0;
		el.classList.add('is-dragging');
		el.setPointerCapture(e.pointerId);

		startX = e.clientX;
		startScrollLeft = el.scrollLeft;
	});

	el.addEventListener('pointermove', (e) => {
		if (!isDown) return;

		const dx = e.clientX - startX;
		moved = Math.max(moved, Math.abs(dx));
		el.scrollLeft = startScrollLeft - dx;
	});

	const end = () => {
		isDown = false;
		el.classList.remove('is-dragging');
	};

	el.addEventListener('pointerup', end);
	el.addEventListener('pointercancel', end);
	el.addEventListener('pointerleave', end);

	// ドラッグしてたらクリックを無効化
	el.addEventListener(
		'click',
		(e) => {
			if (moved > 5) e.preventDefault();
		},
		true
	);
});
