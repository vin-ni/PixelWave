/* eslint-disable */

function BlueWave() {
	this.animationSettings = {
		squareSize: 10,
		speed: 2,
		steps: 10,
		easing: null,
		spawnSpeed: 1
	}

	this.size = {};

	this.addCanvas();
	this.eventListeners();

	this.resize();
}

BlueWave.prototype.addCanvas = function () {
	console.log('init')

	var canv = document.createElement('canvas');
	canv.id = 'blueWave';
	canv.style.zIndex = '99999';
	canv.style.pointerEvents = "none";
	document.body.appendChild(canv);
}

BlueWave.prototype.eventListeners = function () {
	this.resize = this.resize.bind(this);
	window.addEventListener('resize', this.resize);
}

BlueWave.prototype.resize = function () {
	console.log('resizing');
}






