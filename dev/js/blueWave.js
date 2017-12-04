/* eslint-disable */

function BlueWave(settings) {
	this.animationSettings = {
		xSize: settings.xSize || 48,
		ySize: settings.ySize || 48,
		steps: settings.steps || [0.1, 0.1, 0.3, 0.5, 0.5, 1],
		color: settings.color || "#305EFF",
		zIndex: settings.zIndex || 99999,
		speedIn: settings.speedIn || 0.7, //0.5
		speedOut: settings.speedOut || 0.7, //0.5
		canvasTop: settings.canvasTop || 0,
		canvasLeft: settings.canvasLeft || 0,
		autoCalculateSquaresSize: settings.autoCalculateSquaresSize || false,
		delayMiddle: settings.delayMiddle || 0
	}

	this.size = {
		scaleRatio: window.devicePixelRatio||1,
		w: 0,
		h: 0
	};

	this.calculatedSettings = {
		currentDistance: 0,
		lastDraw: 0,
		blockRun: false,
		ending: false
	};

	this.addCanvas();
	this.eventListeners();

	this.resizeCanvas();
	// this.calculateSquaresSize();
	// this.calculateSettings();
}

BlueWave.prototype.addCanvas = function () {
	var canv = document.createElement('canvas');
	canv.id = 'blueWave';
	canv.style.zIndex = this.animationSettings.zIndex;
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

BlueWave.prototype.start = function(callbackStart, callbackMiddle, callbackEnd) {
	if (this.calculateSettings.blockRun) {return}
	this.calculateSettings.blockRun = true;

	if (callbackStart) {callbackStart()};

	//reset values
	this.resizeCanvas();
	this.calculateSquaresSize();
	this.calculateSettings();
	this.calculatedSettings.currentDistance = 0;
	this.calculatedSettings.lastDraw = 0;

	let coloumnsString = this.calculatedSettings.coloumns + this.animationSettings.steps.length;
	coloumnsString = coloumnsString.toString();
	var self = this;

	this.animation = TweenLite.to(this.calculatedSettings, this.animationSettings.speedIn, {currentDistance:`+=${coloumnsString}`,
				 		onUpdate:this.updateHandlerRunIn, onUpdateParams:[self, true],
				 		onComplete:this.completeHandlerStart, onCompleteParams:[self, callbackMiddle, callbackEnd],
				 		ease: Power0.easeNone});
}

BlueWave.prototype.end = function(callbackEnd) {
	//reset values
	this.calculatedSettings.currentDistance = 0;
	this.calculatedSettings.lastDraw = 0;

	this.calculatedSettings.ending = true;

	let coloumnsString = this.calculatedSettings.coloumns + this.animationSettings.steps.length;
	coloumnsString = coloumnsString.toString();
	var self = this;

	this.animation = TweenLite.to(this.calculatedSettings, this.animationSettings.speedOut, {currentDistance:`+=${coloumnsString}`,
				 		onUpdate:this.updateHandlerRunIn, onUpdateParams:[self, false],
				 		onComplete:this.completeHandlerEnd, onCompleteParams:[self, callbackEnd],
				 		ease: Power0.easeNone});
}

BlueWave.prototype.updateHandlerRunIn = function(scope, addRectangles) {
	var distance = Math.round(scope.calculatedSettings.currentDistance);
	
	if (distance > scope.calculatedSettings.lastDraw) {
		scope.calculatedSettings.lastDraw = distance;
		scope.spawnPixels(distance, addRectangles);
	}	
}

BlueWave.prototype.completeHandlerStart = function(scope, callbackMiddle, callbackEnd) {
	if (callbackMiddle) {callbackMiddle()};

	//call animation out
	setTimeout(function() {scope.end(callbackEnd);}, scope.animationSettings.delayMiddle*1000);
	
}

BlueWave.prototype.completeHandlerEnd = function(scope, callbackEnd) {
	if (callbackEnd) {callbackEnd()};
	scope.calculateSettings.blockRun = false;
	scope.calculatedSettings.ending = false;
}

BlueWave.prototype.spawnPixels = function(xStep, addRectangles) {
	this.ctx.fillStyle = this.animationSettings.color;

	for (let i = 0; i < this.animationSettings.steps.length; i++) {
		
		this.calculatedSettings.rowArray = this.shuffleArray(this.calculatedSettings.rowArray); //shuffle
		let maxElements = Math.ceil(this.animationSettings.steps[i] * this.calculatedSettings.rows);
		let rowArray = this.calculatedSettings.rowArray.slice(0, maxElements);

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
	this.resize = this.resizeFunctions.bind(this);
	window.addEventListener('resize', this.resize);
	// window.addEventListener('resize', this.resizeFunctions);

	this.debounceF = this.debounce(function() {
		console.log('debounce function got called');
		this.resizeCanvas();
		this.calculateSquaresSize();
		this.calculateSettings();

		if (this.animation) {this._progress = this.animation.progress();}
		this.animation.kill();
		console.log(this.calculatedSettings.ending);

		//rebuild animation with new values
		if (this.calculatedSettings.ending) {
			console.log('started End');
			this.end();
			this.animation.seek(this._progress*this.animationSettings.speedOut);
		} else {
			this.calculatedSettings.blockRun = false; //otherwise start won't run
			this.start();
			this.animation.seek(this._progress*this.animationSettings.speedIn);
			console.log('started Start');
		}

		
		console.log(this._progress);

		if (this.calculatedSettings.ending) {this.fill()};

		this.animation.play();
		console.log("animation got restarted")
	}, 250);
}

BlueWave.prototype.resizeFunctions = function () {
	if (!this.calculateSettings.blockRun) {return}
	this.animation.pause();
	//debouncer
	this.debounceF();
}

BlueWave.prototype.debounce = function (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

BlueWave.prototype.fill = function () {
	if (this.calculateSettings.blockRun) {
    	this.ctx.fillStyle = this.animationSettings.color;
    	this.ctx.fillRect(0,0,this.size.w,this.size.h);
    	console.log(this.size.w);
    }
}

BlueWave.prototype.resizeCanvas = function () {
	this.size.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.size.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.canvas.width = this.size.w * this.size.scaleRatio;
    this.canvas.height = this.size.h * this.size.scaleRatio;

    this.canvas.style.width = this.size.w+'px';
    this.canvas.style.height = this.size.h + 'px';

    this.ctx.scale(this.size.scaleRatio, this.size.scaleRatio);  
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






