const KEY = 'notify';
const DATA = 'timeData';
chrome.runtime.onInstalled.addListener( () => {
	chrome.contextMenus.create({
		id: KEY,
		title: "Get Time!", 
		contexts:["video"]
	});
});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
	if ( KEY === info.menuItemId ) {
		chrome.tabs.executeScript({
			code: `(${() => {
			  const el = document.querySelector('video');
			  return {
				time: el.currentTime,
				duration: el.duration,
			  };
			}})()`
		}, results => {
			const info = results && results[0];
			notify( info.time );
		});

	}
} );

const notify = time => {
	chrome.storage.local.get( [DATA], data => {
		let arr = data[DATA] || [];
		arr.push(Number(time));
		arr.sort((a, b) => a - b)
		chrome.storage.local.set({ [DATA]: arr });
	} );
};