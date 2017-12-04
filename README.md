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

| Description                                                                                        | Name                     | Default                      |
|----------------------------------------------------------------------------------------------------|--------------------------|------------------------------|
| Set width of Pixel                                                                                 | xSize                    | 48                           |
| Set height of Pixel                                                                                | ySize                    | 48                           |
| How many steps there are between full fill and the beginning of the wave. Add as many as you like. | steps                    | [0.1, 0.1, 0.3, 0.5, 0.5, 1] |
| Color of the wave                                                                                  | color                    | #305EFF                      |
| Time in s the screen needs to fill.                                                                | speedIn                  | 0.7                          |
| Time in s the screen needs to empty.                                                               | speedOut                 | 0.7                          |
| Position top of the canvas element                                                                 | canvasTop                | 0                            |
| Position left of the canvas element                                                                | canvasLeft               | 0                            |
| Sets the z-Index for the canvas element                                                            | zIndex                   | 99999                        |
| This is a function that sets a given size for different devices. (*add values)                     | autoCalculateSquaresSize | false                        |
| Add a delay in s before animation out runs.                                                        | delayMiddle              | 0                            |

## Full Example

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
<script src="js/blueWave.js"></script>

var bluewave = new BlueWave({
    canvasTop: 0
});

function start () {console.log('start')}
function middle () {console.log('middle')}
function end () {console.log('end')}

document.getElementById('startImage').addEventListener('click', function() {
    bluewave.start(start, middle, end);
})
```
