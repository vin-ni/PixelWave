/* eslint-disable */

function BlueWave(settings) {
	this.animationSettings = {
		xSize: settings.xSize || 48,
		ySize: settings.ySize || 48,
		steps: settings.steps || [0.1, 0.1, 0.3, 0.5, 0.5, 1],
		color: settings.color || "#305EFF",
		speedIn: settings.speedIn || 0.5,
		speedOut: settings.speedOut || 0.5,
		canvasTop: settings.canvasTop || 0,
		canvasLeft: settings.canvasLeft || 0,
		autoCalculateSquaresSize: settings.autoCalculateSquaresSize || true
	}

	this.size = {
		scaleRatio: window.devicePixelRatio||1,
		w: 0,
		h: 0
	};

	this.calculatedSettings = {
		currentDistance: 0,
		lastDraw: 0,
		blockRerun: false,
	};

	this.addCanvas();
	this.eventListeners();

	this.resize();
	this.calculateSquaresSize();
	this.calculateSettings();
	

	var self = this;
	// setTimeout(function() {self.runIn();}, 1000);
	// self.runIn();
}

BlueWave.prototype.addCanvas = function () {
	var canv = document.createElement('canvas');
	canv.id = 'blueWave';
	canv.style.zIndex = '99999';
	canv.style.pointerEvents = "none";
	canv.style.display = 'block';
	canv.style.position = 'fixed';
	canv.style.top = `${this.animationSettings.canvasTop}px`;
	canv.style.left = `${this.animationSettings.canvasLeft}px`;

	document.body.appendChild(canv);
	this.canvas = canv;
	this.ctx = this.canvas.getContext("2d");
}

BlueWave.prototype.calculateSettings = function() {
	//amount coloumns ↓↓↓↓
	this.calculatedSettings.coloumns = Math.ceil(this.size.w / this.animationSettings.xSize);
	//amount linien →
	//				→
	//				→
	this.calculatedSettings.rows = Math.ceil(this.size.h / this.animationSettings.ySize);

	var n = this.calculatedSettings.rows;
	this.calculatedSettings.rowArray = Array.apply(null, {length: n}).map(Number.call, Number);
}

BlueWave.prototype.start = function(functionToExecute) {
	if (this.calculateSettings.blockRerun) {return}
	this.calculateSettings.blockRerun = true;

	//reset values
	this.calculatedSettings.currentDistance = 0;
	this.calculatedSettings.lastDraw = 0;

	let coloumnsString = this.calculatedSettings.coloumns + this.animationSettings.steps.length;
	coloumnsString = coloumnsString.toString();
	var self = this;

	this.animation = TweenLite.to(this.calculatedSettings, this.animationSettings.speedIn, {currentDistance:`+=${coloumnsString}`,
				 		onUpdate:this.updateHandlerRunIn, onUpdateParams:[self, true],
				 		onComplete:this.completeHandlerStart, onCompleteParams:[self, functionToExecute],
				 		ease: Power0.easeNone});
}

BlueWave.prototype.end = function() {
	//reset values
	this.calculatedSettings.currentDistance = 0;
	this.calculatedSettings.lastDraw = 0;

	let coloumnsString = this.calculatedSettings.coloumns + this.animationSettings.steps.length;
	coloumnsString = coloumnsString.toString();
	var self = this;

	this.animation = TweenLite.to(this.calculatedSettings, this.animationSettings.speedOut, {currentDistance:`+=${coloumnsString}`,
				 		onUpdate:this.updateHandlerRunIn, onUpdateParams:[self, false],
				 		onComplete:this.completeHandlerEnd, onCompleteParams:[self],
				 		ease: Power0.easeNone});
}

BlueWave.prototype.updateHandlerRunIn = function(scope, addRectangles) {
	var distance = Math.round(scope.calculatedSettings.currentDistance);
	
	if (distance > scope.calculatedSettings.lastDraw) {
		scope.calculatedSettings.lastDraw = distance;
		scope.spawnPixels(distance, addRectangles);
	}	
}

BlueWave.prototype.completeHandlerStart = function(scope, functionToExecute) {
	scope.end();

	//run passed function from outside
	if (functionToExecute) {
		functionToExecute();
	}
}

BlueWave.prototype.completeHandlerEnd = function(scope) {
	scope.calculateSettings.blockRerun = false;
}

BlueWave.prototype.spawnPixels = function(xStep, addRectangles) {
	this.ctx.fillStyle = this.animationSettings.color;

	for (let i = 0; i < this.animationSettings.steps.length; i++) {
		
		this.calculatedSettings.rowArray = this.shuffleArray(this.calculatedSettings.rowArray); //shuffle
		let maxElements = Math.ceil(this.animationSettings.steps[i] * this.calculatedSettings.rows);
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
	let lastStep = (xStep - (this.animationSettings.steps.length - 1))*this.animationSettings.xSize;
	if (addRectangles) {
		this.ctx.fillRect(0,0, lastStep, this.size.h);
	} else {
		this.ctx.clearRect(0,0, lastStep, this.size.h);
	}	
	
}


BlueWave.prototype.setBlueWavePosition = function(x, y) {
	this.animationSettings.canvasTop = y;
	this.animationSettings.canvasLeft = x;
	this.canvas.style.top = `${this.animationSettings.canvasTop}px`;
	this.canvas.style.left = `${this.animationSettings.canvasLeft}px`;
}

BlueWave.prototype.calculateSquaresSize = function() {
	if (this.animationSettings.autoCalculateSquaresSize) {
		if (this.size.w >= 1600) {
			this.animationSettings.xSize = 48;
			this.animationSettings.ySize = 48;			
		} else if (this.size.w >= 1200) {
			this.animationSettings.xSize = 42;
			this.animationSettings.ySize = 42;			
		} else if (this.size.w >= 960) {
			this.animationSettings.xSize = 36;
			this.animationSettings.ySize = 36;			
		} else {
			this.animationSettings.xSize = 30;
			this.animationSettings.ySize = 30;
		}
	}
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


// =================== SANTAS LITTLE HELPERS =================== //

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






