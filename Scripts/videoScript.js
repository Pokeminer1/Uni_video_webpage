document.addEventListener ("DOMContentLoaded", initialiseWebPage);

function initialiseWebPage(){
	//
	//constants and variables
	//
	const playButton = document.getElementById("playPause");
	const muteButton = document.getElementById("mute");
	const scrubSlider = document.getElementById("seekBar");
	const volumeSlider = document.getElementById("volumeBar");
	const volumeValue = document.getElementById("volumeValue");
	const timeElapsed = document.getElementById("timeElapsed");
	const timeRemaining = document.getElementById("timeRemaining");
	const playbackSpeed = document.getElementById("playbackSpeed");
	const myVideo = document.querySelector("video");
	let lastVolume;
	let currentTab = true;
	let playState = false;
	//
	//event listeners
	//
	playButton.addEventListener("click", playPauseVideo);
	myVideo.addEventListener("click", playPauseVideo);
	playButton.addEventListener("click", setStartVol);
	muteButton.addEventListener("click", muteUnmuteVideo);
	scrubSlider.addEventListener("input", scrubVideo);
	volumeSlider.addEventListener("input", changeVolume);
	myVideo.addEventListener("timeupdate", movePlaySlider);
	playbackSpeed.addEventListener("change", updateSpeed);
	document.addEventListener("keydown", haveABreakdown);
	document.addEventListener("visibilitychange", tabInTabOut);
	//
	//set default volume
	//
	document.getElementsByTagName('video').volume = 0.5;

	//
	//functions
	//
	function playPauseVideo(){
		if (myVideo.paused === true){
			myVideo.play();
			playButton.innerHTML = "Pause";
			playState = true;
		} else {
			myVideo.pause();
			playButton.innerHTML = "Play";
			playState = false;
		}
	}

	function muteUnmuteVideo(){
		if (myVideo.muted === false)
		{
			lastVolume = myVideo.volume;
			myVideo.muted = true;
			volumeSlider.value = 0;
			muteButton.innerHTML = "Unmute";
		}
		else
		{
			myVideo.muted = false;
			myVideo.volume = lastVolume;
			volumeSlider.value = lastVolume*10;
			muteButton.innerHTML = "Mute";
		}
	}

	function scrubVideo(){
		const scrubTime = myVideo.duration * (scrubSlider.value/100);
		myVideo.currentTime = scrubTime;
	}

	function movePlaySlider(){
		scrubSlider.value = (myVideo.currentTime/myVideo.duration)*100;
		timeElapsed.innerHTML = formatTime(myVideo.currentTime);
		timeRemaining.innerHTML = formatTime(myVideo.duration - myVideo.currentTime);
	}

	function formatTime(t){
		let m = Math.floor(t/60);
		let s = Math.floor(t%60);

		if(m<10){
			m= "0" + m.toString();
		}
		if(s<10){
			s = "0" + s.toString();
		}

		return m + ":" + s;
	}

	function changeVolume(){
		myVideo.volume = volumeSlider.value/10;
		volumeValue.innerHTML = volumeSlider.value;
	}

	function updateSpeed(){
		myVideo.playbackRate = playbackSpeed.options[playbackSpeed.selectedIndex].value;
	}

	function haveABreakdown(){
		if(event.keyCode === 87 || event.keyCode === 38){
			volumeSlider.stepUp(1);
			changeVolume();
		}
		if(event.keyCode === 83 || event.keyCode === 40){
			volumeSlider.stepDown(1);
			changeVolume();
		}
		if(event.keyCode === 68 || event.keyCode === 39){
			myVideo.currentTime += 10;
		}
		if(event.keyCode === 65 || event.keyCode === 37){
			myVideo.currentTime -= 10;
		}
		if(event.keyCode === 80 || event.keyCode === 32){
			playPauseVideo();
		}
		if(event.keyCode === 77){
			muteUnmuteVideo();
		}
	}

	function setStartVol(){
		if(myVideo.currentTime<=1){
			myVideo.changeVolume = 0.5;
		}
	}

	function tabInTabOut(){
		currentTab = !currentTab;
		if(currentTab == false){
			myVideo.pause();
		}
		if(currentTab == true && playState == true){
			playPauseVideo();
		}
	}
}