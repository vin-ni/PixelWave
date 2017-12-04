# Pixel Wave Page Transition
![Pixel Wave Animation Preview](/dev/img/pixelWave.gif "Pixel Wave Animation Preview")
![Pixel Wave Animation Mobile](/dev/img/pixelWaveMobile1.gif "Pixel Wave Animation Mobile")

## Install
At the bottom of your body:
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
<script src="js/PixelWave-min.js"></script>

var pixelwave = new PixelWave({
    // options like:
    // canvasTop: 0
});
```
## Run Animation
```javascript
pixelwave.start();
```

## Options
When starting the wave you can add callback functions to get executed at certain times:
```javascript
pixelwave.start([runsAtStart], [runsAtMiddle], [runsAtEnd]);
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

## Full Example with options

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
<script src="js/PixelWave-min.js"></script>

var pixelwave = new PixelWave({
    canvasTop: 50, //for a header
    speedIn: 3,
    speedOut: 1,
    autoCalculateSquaresSize: true,
    color: '#000000'   
});

function start () {console.log('start')}
function middle () {console.log('middle')}
function end () {console.log('end')}

document.getElementById('startImage').addEventListener('click', function() {
    pixelwave.start(start, middle, end);
})
```
### Dependencies
Greensockets amazing [gsap](https://greensock.com/gsap). 
### Contribution
If anyone wants to contribute, just fork the project or write me at vinzenz@sansho.studio :)
