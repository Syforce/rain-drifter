$(() => {
	function initVideoEvents() {
		const videos = $('.media video');

		for (let i = 0; i < videos.length; i++) {
			addVideoEvents($(videos[i]));
		}
		// $('.gallery').on('mouseenter', 'video', (event) => {
		// 	event.target.play();
		// });

		// $('.gallery').on('mouseleave', 'video', (event) => {
		// 	event.target.pause();
		// 	event.target.currentTime = 0;
		// });

		// $('.gallery').on('click', 'video', (event) => {
		// 	const $element = $(event.target);
		// 	const element = event.target;

		// 	$element.attr('controls', true);
		// 	$element.removeAttr('muted');
		// 	$element.removeAttr('loop');

		// 	element.pause();
		// 	element.currentTime = 0;
		// 	element.muted = false;
		// 	$element.attr('src', $element.attr('data-video'));
		// });
	}

	function addVideoEvents($video) {
		$video.on('mouseenter', (event) => {
			event.target.play();
		});

		$video.on('mouseleave', (event) => {
			event.target.pause();
			event.target.currentTime = 0;
		});

		$video.on('click', (event) => {
			event.target.pause();
			event.target.currentTime = 0;

			$video.off('mouseenter');
			$video.off('mouseleave');

			$video.removeAttr('muted');
			$video.removeAttr('loop');

			$video.attr('controls', true);
			$video.attr('src', $video.attr('data-video'));

			event.target.muted = false;
			event.target.play();

			$video.off('click');
		});
	}

	initVideoEvents();
});