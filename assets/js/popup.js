const start = document.getElementById( 'notify-button' );
const reset = document.getElementById( 'notify-reset' );
const lists = document.getElementById( 'notify-list' );

const KEY = 'notify';
const DATA = 'timeData';

function simpleLoop(arrTime, numLoop = 0) {
    var yt_player = document.getElementById("movie_player");
    var currentTime = yt_player.getCurrentTime();
    var startTime =  arrTime[0][0];
    var endTime = arrTime[0][1];
    if (arrTime.length > numLoop) {
		startTime =  arrTime[numLoop][0];
		endTime = arrTime[numLoop][1];
    } else {
		numLoop = 0
	}
    var suitableTimeout = endTime - startTime
    if (currentTime <= startTime || currentTime > endTime){
        yt_player.seekTo(startTime)
    } else {
        suitableTimeout = endTime - currentTime
    }
    setTimeout(function () {
        numLoop += 1;
        simpleLoop(arrTime, numLoop)
    }, suitableTimeout * 1000)
}

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
				if (previousValue.length > 1) {
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
		simpleLoop(params, 0);
	} );
} );

function removeItem(e) {
	var tgt = e.target;
	tgt.closest('li').remove();
	return false;
}

lists.onclick = removeItem;