# Pixel Wave Transition


## Install
At the bottom of your body:
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
<script src="js/blueWave.js"></script>

var bluewave = new BlueWave({
    // options like:
    // canvasTop: 0
});
```
## Run Animation
```javascript
bluewave.start();
```

## Options
When starting the wave you can add callbackfunctions to get executed:
```javascript
bluewave.start([runsAtStart], [runsAtMiddle], [runsAtEnd]);
```

You can pass these options while you init the wave:

| Name          | Does          | Default   |
| ------------- |:-------------:| ---------:|
| col 3 is      | right-aligned | $1600     |
| col 2 is      | centered      |   $12     |
| zebra stripes | are neat      |    $1     |


## Full Example

```javascript
function start () {
    console.log('start');
}

function middle () {
    console.log('middle');
}

function end () {
    console.log('end');
}

var bluewave = new BlueWave({
    canvasTop: 0
});

document.getElementById('startImage').addEventListener('click', function() {
    bluewave.start(start, middle, end);
})
```
