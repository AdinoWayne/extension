var modifyDOM = (params) => {
    var simpleLoop = (arrTime, numLoop = 0) => {
        var yt_player = document.querySelector('video');
        var currentTime = yt_player.currentTime;
        var startTime =  arrTime[0][0];
        var endTime = arrTime[0][1];
        if (arrTime.length > numLoop) {
            startTime =  arrTime[numLoop][0];
            endTime = arrTime[numLoop][1];
        } else {
            numLoop = 0
        }
        var suitableTimeout = endTime - startTime
        console.log(currentTime);
        console.log(startTime);
        console.log(endTime);
        if (currentTime <= startTime || currentTime > endTime){
            yt_player.currentTime = startTime
        } else {
            suitableTimeout = endTime - currentTime
        }
        setTimeout(function () {
            numLoop += 1;
            simpleLoop(arrTime, numLoop)
        }, suitableTimeout * 1000)
    }
    simpleLoop(params)
}

chrome.runtime.onMessage.addListener(message=>{
    if (message.myVar) {
        modifyDOM(message.myVar);
    }
});