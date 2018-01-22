/**
 * Created by Seth on 11/22/2016.
 */

function SHMDemo() {
    /**
     * PhysicObject prototype is used as a template for objects that have a position and velocity. This class comes with
     * some convenient methods for Objects that may need to move around.
     * @param {Number} x position of this PhysicsObject. Defaults to 0 if not set.
     * @param {Number} y position of this PhysicsObject. Defaults to 0 if not set.
     * @param {Number} dx instantaneous x velocity of this PhysicsObject.
     * Defaults to 0 if not set.
     * @param {Number} dy instantaneous y velocity of this PhysicsObject.
     * Defaults to 0 if not set.
     * @constructor Creates a new PhysicsObject.
     */
    function PhysicsObject(x, y, dx, dy) {
        this.x = x || 0;
        this.y = y || 0;
        this.dx = dx || 0;
        this.dy = dy || 0;

        /**
         * Move this physics object by increasing the values of x and y based on the values of dx and dy respectively
         * with correction based on the time that the frame took to render. If dx and dy are constant, x and y
         * should increase by dx and dy respectively in one second.
         * @param {number} frameLength Length of time, in seconds, that this frame took to render. Should be small
         * (under ~.025) to keep the simulation accurate.
         */
        this.move = function (frameLength) {
            if(frameLength > .025)
                frameLength = .025;          //Prevents low framerate from breaking the simulation's accuracy
            this.x += this.dx * frameLength;
            this.y += this.dy * frameLength;
        };

        /**
         * Get the distance squared between this @PhysicsObject and argument @PhysicsObject.
         * @param {PhysicsObject} other PhysicsObject to find the distance squared from to this.
         * @return {number} distance squared between this @PhysicsObject and other @PhysicsObject.
         */
        this.getDistanceSquared = function (other) {
            return (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y);
        };
    }

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var date = new Date();
    var lastTime = date.getTime();
    var thisTime = lastTime;
    var oscillator;
    var spinner;

    /**
     * Draws the spring for the oscillator on the canvas.
     * @param xInitial {number} starting x coordinate of the spring.
     * @param yInitial {number} starting y coordinate of the spring.
     */
    function drawOscillatorSpring(xInitial, yInitial){
        moveTo(xInitial, yInitial);
        for(var i = 0; i < 10; i++) {
            context.moveTo(xInitial, yInitial);
            yInitial += (oscillator.y - oscillator.centerY + oscillator.amplitude) / 20;
            if (i % 2 == 0) {
                context.lineTo(xInitial - 10, yInitial);
                context.moveTo(xInitial - 10, yInitial)
            }
            else {
                context.lineTo(xInitial + 10, yInitial);
                context.moveTo(xInitial + 10, yInitial);
            }
            yInitial += (oscillator.y - oscillator.centerY + oscillator.amplitude) / 20;
            context.lineTo(xInitial, yInitial);
        }
        context.stroke();
        context.closePath();
    }

    /**
     * Draws the oscillator on the canvas. Calls drawOscillatorSpring internally to draw the oscillator spring.
     */
    function drawOscillator() {
        context.beginPath();
        context.rect(oscillator.x, oscillator.y, oscillator.width, oscillator.height);
        context.rect(oscillator.centerX - oscillator.width / 2,
            oscillator.centerY - oscillator.amplitude - oscillator.height,
            oscillator.width * 2, oscillator.height);
        context.fillStyle = "grey";
        context.fill();
        drawOscillatorSpring(oscillator.centerX + oscillator.width / 2, oscillator.centerY - oscillator.amplitude);
    }

    /**
     * Draws the spinner object on the canvas.
     */
    function drawSpinner() {
        context.beginPath();
        context.arc(spinner.x, spinner.y, spinner.radius, 0, Math.PI * 2, false);
        context.moveTo(spinner.centerX + 10, spinner.centerY);
        context.arc(spinner.centerX, spinner.centerY, 10, 0, Math.PI * 2, false);
        context.fillStyle = "#0095DD";
        context.fill();
        context.moveTo(spinner.centerX, spinner.centerY);
        context.lineTo(spinner.x, spinner.y);
        context.stroke();
        context.closePath();
    }

    /**
     * Updates the position and velocity of the oscillator. Takes the time that the current frame took to render
     * to correct for unequal fram lengths.
     * @param frameLength {number} length in seconds that the current frame took to render. This number should be small
     * (under ~.025) to keep the simulation accurate.
     */
    function updateOscillatorVelocityAndPosition(frameLength) {
        oscillator.dy -= (oscillator.y - oscillator.centerY) * oscillator.omegaSquared * frameLength;
        oscillator.move(frameLength);
    }

    /**
     * Updates the velocity and position of the Spinner. Takes the time that the current frame took to render
     * to correct for unequal frame lengths.
     * @param frameLength {number} length in seconds that the current frame took to render. This number should be small
     * (under ~.025) to keep the simulation accurate.
     */
    function updateSpinnerVelocityAndPosition(frameLength) {
        spinner.dy -= (spinner.y - spinner.centerY) * spinner.omegaSquared * frameLength;
        spinner.dx -= (spinner.x - spinner.centerX) * spinner.omegaSquared * frameLength;
        spinner.move(frameLength);
    }

    /**
     * Updates the current velocities and positions of the oscillator and spinner for the next animation frame.
     * If the animation is lagging, i.e, not rendering a new frame at least once every fortieth second, the positions
     * are not updated.
     */
    function updatePositionsAndVelocities() {
        date = new Date();
        thisTime = date.getTime();
        var frameLength = (thisTime - lastTime) * .001;
        if(frameLength > .025) {                      //prevents lag that makes the simulation unrealistic.
            lastTime = thisTime;
            return;
        }
        updateOscillatorVelocityAndPosition(frameLength);
        updateSpinnerVelocityAndPosition(frameLength);
        lastTime = thisTime;
    }

    /**
     * Draws all the objects in the simulation.
     */
    function drawAllObject() {
        drawOscillator();
        drawSpinner();
    }

    /**
     * Draws next animation frame. Also performs necessary calculations to find the positions of the objects in this
     * animation frame.
     */
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);       //Clear current frame.
        updatePositionsAndVelocities();                             //updates positions of all objects to be drawn.
        drawAllObject();                                            //Draw next frame.
        requestAnimationFrame(draw);
    }

    /**
     * Updates the amplitudes and angular velocities of the oscillator and spinner based on the values that the user
     * put into the input boxes.
     */
    this.update = function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 150;
        context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
        /*Update oscillator and spinner based on canvas size*/
        oscillator = new PhysicsObject(canvas.width / 3 - canvas.width / 21, canvas.height / 2 - canvas.height / 43);
        oscillator.width = 120;
        oscillator.height = 60;
        oscillator.centerX = oscillator.x;
        oscillator.centerY = oscillator.y;

        spinner = new PhysicsObject(canvas.width * 2 / 3, canvas.height / 2);
        spinner.radius = 30;
        spinner.centerX = spinner.x;
        spinner.centerY = spinner.y;

        /*
        Get amplitudes.
         */
        oscillator.amplitude = parseInt(document.getElementById("oscillatorAmplitude").value);
        spinner.amplitude = parseInt(document.getElementById("spinnerAmplitude").value);
        if(isNaN(oscillator.amplitude)) {
            oscillator.amplitude = 100;
            document.getElementById("oscillatorAmplitude").value = 100;
        }
        else if(oscillator.amplitude > 200) {
            oscillator.amplitude = 200;
            document.getElementById("oscillatorAmplitude").value = 200;
        }
        else if(oscillator.amplitude < 1) {
            oscillator.amplitude = 1;
            document.getElementById("oscillatorAmplitude").value = 1;
        }
        if(isNaN(spinner.amplitude)) {
            spinner.amplitude = 100;
            document.getElementById("spinnerAmplitude").value = 100;
        }
        else if(spinner.amplitude > 200) {
            spinner.amplitude = 200;
            document.getElementById("spinnerAmplitude").value = 200;
        }
        else if(spinner.amplitude < 1) {
            spinner.amplitude = 1;
            document.getElementById("spinnerAmplitude").value = 1;
        }

        oscillator.y = oscillator.centerY;
        spinner.y = spinner.centerY;
        spinner.x = spinner.centerX + spinner.amplitude;
        spinner.dx = 0;

        /*
        Get angular velocities.
         */
        oscillator.omegaSquared = Math.pow(parseInt(document.getElementById("oscillatorOmega").value), 2) / 2500;
        spinner.omegaSquared = Math.pow(parseInt(document.getElementById("spinnerOmega").value), 2) / 2500;
        if(isNaN(oscillator.omegaSquared)){
            oscillator.omegaSquared = 4;
            document.getElementById("oscillatorOmega").value = 100;
        }
        else if(oscillator.omegaSquared > 100){
            oscillator.omegaSquared = 100;
            document.getElementById("oscillatorOmega").value = 500;
        }

        if(isNaN(spinner.omegaSquared)){
            spinner.omegaSquared = 4;
            document.getElementById("spinnerOmega").value = 100;
        }
        else if(spinner.omegaSquared > 100){
            spinner.omegaSquared = 100;
            document.getElementById("spinnerOmega").value = 500;
        }

        oscillator.dy = oscillator.amplitude * Math.sqrt(oscillator.omegaSquared);
        spinner.dy = spinner.amplitude * Math.sqrt(spinner.omegaSquared);
    };

    this.update.call();
    draw();
}
var demo = new SHMDemo();