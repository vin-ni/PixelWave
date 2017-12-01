/* eslint-disable */

function BlueWave() {
	this.animationSettings = {
		xSize: 20,
		ySize: 20,
		speed: 2,
		steps: 0.01, //in Percent
		easing: null,
		spawnSpeed: 1,
		color: "#305EFF"
	}

	this.size = {
		scaleRatio: window.devicePixelRatio||1,
		w: 0,
		h: 0
	};

	this.calculatedSettings = {
		currentDistance: -1,
		lastDraw: 0
	};

	this.addCanvas();
	this.eventListeners();

	this.resize();
	this.calculateSettings();

	this.spawnPixels(-0);
	// this.runIn();
}

BlueWave.prototype.addCanvas = function () {
	var canv = document.createElement('canvas');
	canv.id = 'blueWave';
	canv.style.zIndex = '99999';
	canv.style.pointerEvents = "none";
	canv.style.display = 'block';
	document.body.appendChild(canv);
	this.canvas = canv;
	this.ctx = this.canvas.getContext("2d");
}

BlueWave.prototype.calculateSettings = function() {
	//anzahl an coloumns ↓↓↓↓
	this.calculatedSettings.coloumns = Math.ceil(this.size.w / this.animationSettings.xSize);
	//anzahl an linien →
	//				   →
	//				   →
	this.calculatedSettings.rows = Math.ceil(this.size.h / this.animationSettings.ySize);

	var n = this.calculatedSettings.rows;
	this.calculatedSettings.rowArray = Array.apply(null, {length: n}).map(Number.call, Number);
	this.calculatedSettings.rowArray = this.shuffleArray(this.calculatedSettings.rowArray);
}

BlueWave.prototype.runIn = function() {
	let coloumnsString = this.calculatedSettings.coloumns + 6;
	coloumnsString = coloumnsString.toString();
	var self = this;

	TweenLite.to(this.calculatedSettings, 50, {currentDistance:`+=${coloumnsString}`, onUpdate:this.updateHandlerRunIn, onUpdateParams:[self], ease: Power0.easeNone});
	// TweenLite.ticker.addEventListener("tick", self.drawCanvas, self);
	// TweenLite.ticker.fps(20);
}

BlueWave.prototype.updateHandlerRunIn = function(scope) {

	var distance = Math.ceil(scope.calculatedSettings.currentDistance);
	console.log(distance);
	if (distance > scope.calculatedSettings.lastDraw) {
		
		scope.calculatedSettings.lastDraw = distance;
		scope.spawnPixels(distance);

	}
	
	
}

BlueWave.prototype.drawCanvas = function() {
	console.log("ticker");
}


BlueWave.prototype.spawnPixels = function(xStep) {
	this.ctx.fillStyle = this.animationSettings.color;
	
	// let steps = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
	let steps = [0.1, 0.3, 0.5, 0.7, 1];

	for (let i = 0; i < steps.length; i++) {
		
		this.calculatedSettings.rowArray = this.shuffleArray(this.calculatedSettings.rowArray); //shuffle
		let maxElements = Math.ceil(steps[i] * this.calculatedSettings.rows);
		let rowArray = this.calculatedSettings.rowArray.slice(0, maxElements);
		// console.log(maxElements);
		// console.log(rowArray);

		for (let j = 0; j < rowArray.length; j++) {
			let randomX = (xStep-i) * this.animationSettings.xSize;
			let randomY = rowArray[j] * this.animationSettings.ySize;
			this.ctx.fillRect(randomX,randomY,this.animationSettings.xSize,this.animationSettings.ySize);
		}
	}

	//fill all previous Pixels
	// this.ctx.fillStyle = "#00f9ff";
	let lastStep = (xStep - (steps.length + 1))*this.animationSettings.xSize;
	this.ctx.fillRect(0,0, lastStep, this.size.h);
}

BlueWave.prototype.shuffleArray = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

BlueWave.prototype.eventListeners = function () {
	this.resize = this.resize.bind(this);
	window.addEventListener('resize', this.resize);
}

BlueWave.prototype.resize = function () {
	console.log('resizing');

	this.size.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.size.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.canvas.width = this.size.w * this.size.scaleRatio;
    this.canvas.height = this.size.h * this.size.scaleRatio;

    this.canvas.style.width = this.size.w+'px';
    this.canvas.style.height = this.size.h + 'px';

    this.ctx.scale(this.size.scaleRatio, this.size.scaleRatio);

    //everything gets blue if you resize while the animation happens;
}






