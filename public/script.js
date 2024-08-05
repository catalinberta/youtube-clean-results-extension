function runCleanUp() {
	console.log('Running cleanup by default');
	chrome.storage.local.get(
		['enableShorts', 'enableRelated'],
		function (value) {
			!value.enableShorts && disableShorts();
			!value.enableRelated && disableRelated();
		},
	);
}
function disableShorts() {
	console.log('Running disableShorts()');
	const prevStyleEl = document.getElementById(
		'youtubeCleanResults_disableShorts',
	);
	if (prevStyleEl) return;
	const styleEl = document.createElement('style');
	styleEl.id = 'youtubeCleanResults_disableShorts';
	styleEl.innerHTML = `
		ytd-reel-shelf-renderer {
			display: none !important;
		}
	`;
	document.head.appendChild(styleEl);
}
function enableShorts() {
	console.log('Running enableShorts()');
	const styleEl = document.getElementById(
		'youtubeCleanResults_disableShorts',
	);
	if (styleEl) {
		styleEl.remove();
	}
}
function disableRelated() {
	console.log('Running disableRelated()');
	const prevStyleEl = document.getElementById(
		'youtubeCleanResults_disableRelated',
	);
	if (prevStyleEl) return;
	const styleEl = document.createElement('style');
	styleEl.id = 'youtubeCleanResults_disableRelated';
	styleEl.innerHTML = `
		ytd-shelf-renderer > #dismissible {
			display: none !important;
		}
	`;
	document.head.appendChild(styleEl);
}
function enableRelated() {
	console.log('Running enableRelated()');
	const styleEl = document.getElementById(
		'youtubeCleanResults_disableRelated',
	);
	if (styleEl) {
		styleEl.remove();
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', runCleanUp);
} else {
	console.log(1);
	runCleanUp();
}
chrome.runtime.onMessage.addListener(function (message) {
	console.log('Got message', message);
	if (message === 'enableShorts') {
		enableShorts();
	}
	if (message === 'disableShorts') {
		disableShorts();
	}
	if (message === 'enableRelated') {
		enableRelated();
	}
	if (message === 'disableRelated') {
		disableRelated();
	}
});
