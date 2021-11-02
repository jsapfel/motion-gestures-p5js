## Recognizing motion gestures on iPhones (iOS 13+) with p5.js.

## Try out at: https://preview.p5js.org/jsapfel/present/k4Jr4iPa1

## Gestures:

1. Circle/spiral
	- Move phone in a smooth circle/spiral motion, covering a full 360 degrees.
	- For circles in the phone's XY plane only.
	- Super fast and super slow circles don't count (to minimize accidental activation)
2. Shake
	- Two quick back-and-forths or flicks of wrist while holding phone.
	- Only considers phone's X and Y accelerations.
	- Robust against accidental activation, but may be activated by one big shake.
