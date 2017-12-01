/* eslint-disable */

function BlueWave() {
	this.animationSettings = {
		xSize: 30,
		ySize: 30,
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
		currentDistance: 0,
		lastDraw: 0
	};

	this.addCanvas();
	this.eventListeners();

	this.resize();
	this.calculateSettings();

	var self = this;
	// setTimeout(function() {self.runIn();}, 1000);
	// self.runIn();
	document.getElementById('startImage').addEventListener('click', function() {
		self.runIn();
	})
	
}

BlueWave.prototype.addCanvas = function () {
	var canv = document.createElement('canvas');
	canv.id = 'blueWave';
	canv.style.zIndex = '99999';
	canv.style.pointerEvents = "none";
	canv.style.display = 'block';
	canv.style.position = 'fixed';
	canv.style.top = 0;
	canv.style.left = 0;

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
	let coloumnsString = this.calculatedSettings.coloumns + 14;
	coloumnsString = coloumnsString.toString();
	var self = this;

	TweenLite.to(this.calculatedSettings, 1, {currentDistance:`+=${coloumnsString}`,
				 onUpdate:this.updateHandlerRunIn, onUpdateParams:[self, true],
				 onComplete:this.completeHandlerRunIn, onCompleteParams:[self],
				 ease: Power0.easeNone});
	// TweenLite.ticker.addEventListener("tick", self.drawCanvas, self);
	// TweenLite.ticker.fps(20);
}

BlueWave.prototype.updateHandlerRunIn = function(scope, addRectangles) {
	var distance = Math.round(scope.calculatedSettings.currentDistance);
	
	if (distance > scope.calculatedSettings.lastDraw) {
		// console.log(distance);
		
		scope.calculatedSettings.lastDraw = distance;
		scope.spawnPixels(distance, addRectangles);
	}	
}

BlueWave.prototype.completeHandlerRunIn = function(scope) {
	document.getElementById('startImage').style.display = 'none'
	scope.runOut();
}


BlueWave.prototype.runOut = function() {
	//reset values
	this.calculatedSettings.currentDistance = -2;
	this.calculatedSettings.lastDraw = -2;

	let coloumnsString = this.calculatedSettings.coloumns + 46;
	coloumnsString = coloumnsString.toString();
	var self = this;

	TweenLite.to(this.calculatedSettings, 1.8, {currentDistance:`+=${coloumnsString}`,
				 onUpdate:this.updateHandlerRunIn, onUpdateParams:[self, false],
				 ease: Power0.easeNone});
	// TweenLite.ticker.fps(20);
}











BlueWave.prototype.spawnPixels = function(xStep, addRectangles) {
	

	// this.resize();
	this.ctx.fillStyle = this.animationSettings.color;

	if (!addRectangles) { //fill all on out
		// this.ctx.fillRect(0,0, this.size.w, this.size.h)
	}
	
	// let steps = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
	let steps = [0.1, 0.1, 0.3, 0.5, 0.5, 1];

	for (let i = 0; i < steps.length; i++) {
		
		this.calculatedSettings.rowArray = this.shuffleArray(this.calculatedSettings.rowArray); //shuffle
		let maxElements = Math.ceil(steps[i] * this.calculatedSettings.rows);
		let rowArray = this.calculatedSettings.rowArray.slice(0, maxElements);
		// console.log(maxElements);
		// console.log(rowArray);

		for (let j = 0; j < rowArray.length; j++) {
			let randomX = (xStep-i) * this.animationSettings.xSize;
			let randomY = rowArray[j] * this.animationSettings.ySize;
			if (addRectangles) {
				this.ctx.fillRect(randomX,randomY,this.animationSettings.xSize,this.animationSettings.ySize);
			} else {
				this.ctx.clearRect(randomX,randomY,this.animationSettings.xSize,this.animationSettings.ySize);
			}
			
		}
	}

	//fill all previous Pixels
	// this.ctx.fillStyle = "#00f9ff";
	let lastStep = (xStep - (steps.length - 1))*this.animationSettings.xSize;
	if (addRectangles) {
		this.ctx.fillRect(0,0, lastStep, this.size.h);
	} else {
		this.ctx.clearRect(0,0, lastStep, this.size.h);
	}	
	
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
	// console.log('resizing');

	this.size.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.size.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.canvas.width = this.size.w * this.size.scaleRatio;
    this.canvas.height = this.size.h * this.size.scaleRatio;

    this.canvas.style.width = this.size.w+'px';
    this.canvas.style.height = this.size.h + 'px';

    this.ctx.scale(this.size.scaleRatio, this.size.scaleRatio);

    //everything gets blue if you resize while the animation happens;
}






