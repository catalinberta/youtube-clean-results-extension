import './App.css';
import { useEffect, useState } from 'react';
import Switch from 'react-switch';

function App() {
	const [enableRelatedState, setEnableRelatedState] = useState(false);
	const [enableShortsState, setEnableShortsState] = useState(false);
	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });

		chrome.storage.local.get(
			['enableShorts', 'enableRelated'],
			function (value) {
				setEnableShortsState(!!value.enableShorts);
				setEnableRelatedState(!!value.enableRelated);

				tabs.forEach((tab) => {
					!value.enableShorts &&
						chrome.tabs.sendMessage(tab.id!, 'disableShorts');
					!value.enableRelated &&
						chrome.tabs.sendMessage(tab.id!, 'disableRelated');
				});
			},
		);
	};

	const onEnableRelatedChange = async (checked: boolean) => {
		setEnableRelatedState(checked);
		const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });
		tabs.forEach((tab) => {
			if (checked) {
				chrome.tabs.sendMessage(tab.id!, 'enableRelated');
			} else {
				chrome.tabs.sendMessage(tab.id!, 'disableRelated');
			}
		});
		chrome.storage.local.set({ enableRelated: checked });
	};

	const onEnableShortsChange = async (checked: boolean) => {
		setEnableShortsState(checked);
		const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });
		tabs.forEach((tab) => {
			if (checked) {
				chrome.tabs.sendMessage(tab.id!, 'enableShorts');
			} else {
				chrome.tabs.sendMessage(tab.id!, 'disableShorts');
			}
		});
		chrome.storage.local.set({ enableShorts: checked });
	};

	return (
		<>
			<h1>YouTube Clean Results</h1>
			<div className="switch">
				<span>Show Related Results</span>
				<Switch
					onChange={onEnableRelatedChange}
					checked={enableRelatedState}
				/>
			</div>
			<div className="switch">
				<span>Show Shorts Reel</span>
				<Switch
					onChange={onEnableShortsChange}
					checked={enableShortsState}
				/>
			</div>
		</>
	);
}

export default App;
