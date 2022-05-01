const start = document.getElementById( 'notify-button' );
const reset = document.getElementById( 'notify-reset' );
const lists = document.getElementById( 'notify-list' );

const KEY = 'notify';
const DATA = 'timeData';

function createDishes(name) {
	let li = document.createElement("li");
	li.textContent = name;
	return li;
}

chrome.storage.local.get( [DATA], data => {
	let value = data[DATA] || [];
	const menu = document.querySelector(".list");
	menu.innerHTML = '';
	value.forEach((x) => menu.appendChild(createDishes(x)));
} );

chrome.storage.onChanged.addListener( ( changes, namespace ) => {
	if ( changes[DATA] ) {
		let value = changes[DATA].newValue || [];
		const menu = document.querySelector(".list");
		menu.innerHTML = '';
		value.forEach((x) => menu.appendChild(createDishes(x)));
	}
});

reset.addEventListener( 'click', () => {
	chrome.storage.local.clear();
} );

start.addEventListener( 'click', () => {
	chrome.storage.local.get( [DATA], data => {
		let arr = data[DATA];
		if (arr.length % 2 !== 0) {
			return;
		}
		const params = arr.reduce(
			(previousValue, currentValue) => {
				if (previousValue.length > 0) {
					var a = previousValue[previousValue.length - 1];
					if (a.length == 1) {
						previousValue[previousValue.length - 1][1] = currentValue
					} else {
						previousValue.push([currentValue])
					}
				} else {
					previousValue.push([currentValue])
				}
				return previousValue;
			},
			[]
		);
		// chrome.tabs.executeScript({
		// 	code: '(' + modifyDOM + ')(' + params +');'
		// }, results => {});
		chrome.tabs.query({active: true, currentWindow: true}, tabs => {
			chrome.tabs.executeScript(tabs[0].id,{file: '/myScript.js'},()=>{
				chrome.tabs.sendMessage(tabs[0].id,{myVar:params});
			});
		});
	} );
} );

function removeItem(e) {
	var tgt = e.target;
	tgt.closest('li').remove();
	return false;
}

lists.onclick = removeItem;