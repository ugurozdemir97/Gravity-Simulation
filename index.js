// To create particles and calculate their masses, velocity and size
class Particle {
    
    constructor (color, mass, vector, isStatic) {
        this.color = color;
        this.mass = mass;
        this.isStatic = isStatic;
        this.size = this.getSize();
        this.x = this.positionX(vector);
        this.y = this.positionY(vector);
        this.vx = this.velocityX(vector);
        this.vy = this.velocityY(vector);
        this.collided = false;
        particles.push(this) // Push new particles in particles array
    }

    // Calculate their velocity in X direction at the beginning
    velocityX (vector) {
        if (!vector) {return 0}
        return (vector.startX - vector.endX) * -0.025;
    }

    // Calculate their velocity in y direction at the beginning
    velocityY (vector) {
        if (!vector) {return 0}
        return (vector.startY - vector.endY) * -0.025;  // 0.05 can be changed, it works well though
    }

    // Their x and coordinates at the beginning
    positionX (vector) {
        if (!vector) {return Math.floor(Math.random() * (canvasWidth - 50 + 1)) + 25;}
        return vector.startX;
    }

    // Their y coordinates at the beginning
    positionY (vector) {
        if (!vector) {return Math.floor(Math.random() * (canvasHeight - 50 + 1)) + 25;}
        return vector.startY;
    }

    // Calculate the size of the particle. I want the particles with the mass of 10 to have a radius of 2
    getSize () {
        // So calculate the radius with 4/3πr^3, then find the r value
        return Math.round(Math.cbrt(((this.mass * (4 / 3 * Math.PI * 8) / 10) / (4 / 3 * Math.PI))))  
    }  

    // Compare the particle with all other particles and calculate the forces on the particle
    move (k) {

        for (let i = 0; i < particles.length; i++) {

            // If the particle is not itself
            if (i != k) {
                let dx = this.x - particles[i].x // Distance between x values
                let dy = this.y - particles[i].y // Distance between y values
                let distance = Math.sqrt((dx*dx) + (dy*dy))  // Shortest distance: c^2 = √ a^2 + b^2
                let fx = 0; let fy = 0;  // Force on x and y directions
                
                // Use this to check if there is a collision
                let size = Number(this.size) > Number(particles[i].size) ? Number(this.size) : Number(particles[i].size);

                // If the distance between 2 particles is more than 0, then calculate the force
                if (distance > size) {  

                    // F = G * (m1 + m2) / d^2  > You can change the G value in the constants
                    let F = ((G * ((this.mass * this.mass) + (particles[i].mass * particles[i].mass))) / (distance * distance));  
            
                    fx = (F *  dx) / this.mass;  // Force on x direction
                    fy = (F * dy) / this.mass;  // Force on y direction
 
                } else {
                    if (this.mass <= particles[i].mass && distance < size) {
                        particles[i].mass = Number(particles[i].mass) + Number(this.mass);
                        particles[i].size = particles[i].getSize()
                        particles.splice(particles.indexOf(this), 1);
                        return
                    }
                }

                // Increase the velocity of the particle and move it in that direction
                this.vx += fx; 
                this.vy += fy;
            }

        }

        // If the particle is a static particle
        if (this.isStatic) {return}
        
        this.x += this.vx; this.y += this.vy;
            
        // If you want the particles to bounce off the canvas walls remove the comment lines, these will reverse the direction
        // if (this.x <= 25 || this.x >= (canvasWidth - 25)) {this.vx *= -1} 
        // if (this.y <= 25 || this.y >= (canvasHeight - 25)) {this.vy *= -1}
    }

}

// Constants
const G = -0.0000000667  // G = 0.0000000000667
const canvasWidth = document.getElementsByTagName("article")[0].clientWidth;
const canvasHeight = document.getElementsByTagName("article")[0].clientHeight;
const mouseX = document.getElementsByTagName("aside")[0].clientWidth;
const mouseY = document.getElementsByTagName("header")[0].clientHeight;

// Variables to fill after running the simulation
var particles;

var redMass;
var yellowMass;
var greenMass;
var blueMass;
var whiteMass;

var mouseDown;
var clickX;
var clickY;
var releaseX;
var releaseY;
var currentX;
var currentY;

// Initialize canvas
var spaceCanvas = document.getElementById("space").getContext("2d");
spaceCanvas.canvas.width = canvasWidth;
spaceCanvas.canvas.height = canvasHeight;
spaceCanvas.strokeStyle = "white";
spaceCanvas.lineWidth = 3;
clearCanvas()

// Show range sliders' values
function showValue(i) {i.nextElementSibling.value = i.value}

// Add border to the selected click and drag button
function addBorder(i) {
    // Remove existing border classes
    if (document.getElementsByClassName("border").length != 0) {
        let element = document.getElementsByClassName("border");
        element[0].classList.remove("border")
    }; 

    i.classList.add("border");
}

// Detect mouse click and get x, y coordinates
function clickCoordinates (e) {

    clickX = 0;
    clickY = 0;

    // To check if the simulation is running
    if (redMass) {
        if (e.clientX > (mouseX + 25)) {clickX = e.clientX - mouseX}
        if (e.clientY > (mouseY + 25)) {clickY = e.clientY - mouseY}
        mouseDown = true;
    }
}

// Detect mouse release and get x, y coordinates
function releaseCoordinates (e) {

    mouseDown = false;
    releaseX = 0;
    releaseY = 0;

    // To check if the simulation is running
    if (redMass) {
        if (e.clientX > (mouseX + 25)) {releaseX = e.clientX - mouseX}
        if (e.clientY > (mouseY + 25)) {releaseY = e.clientY - mouseY}
        
        if (clickX && clickY && releaseX && releaseY) {

            let vector = {
                startX: clickX,
                startY: clickY,
                endX: releaseX,
                endY: releaseY
            }
    
            if (document.getElementsByClassName("border").length != 0) {
                let element = document.getElementsByClassName("border");
                switch (element[0].innerHTML) {
                    case "R":
                        new Particle("red", redMass, vector, false)
                        break;
                    case "Y":
                        new Particle("yellow", yellowMass, vector, false)
                        break;
                    case "G":
                        new Particle("green", greenMass, vector, false)
                        break;
                    case "B":
                        new Particle("blue", blueMass, vector, false)
                        break;
                    case "W":
                        new Particle("white", whiteMass, vector, false)
                        break;
                    case "S":
                        new Particle("black", staticMass, vector, true)
                        break;
                };
            };
        }
         
    }
}

function drawArrow () {
    if (document.getElementsByClassName("border").length != 0) {
        spaceCanvas.beginPath();
        spaceCanvas.moveTo(clickX, clickY);
        spaceCanvas.lineTo(currentX, currentY);
        spaceCanvas.stroke()
    }
}

document.addEventListener("mousedown", clickCoordinates);
document.addEventListener("mouseup", releaseCoordinates);
document.onmousemove = (e) => {
    currentX = e.clientX - mouseX;
    currentY = e.clientY - mouseY;
};

// Draw the particle
function draw (x, y, color, size) {
    spaceCanvas.fillStyle = color
    spaceCanvas.beginPath();
    spaceCanvas.arc(x, y, size, 0, 2 * Math.PI)
    spaceCanvas.fill();
}

// Clear the canvas
function clearCanvas () {
    spaceCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
    spaceCanvas.fillStyle = "rgb(6, 0, 60)"
    spaceCanvas.fillRect(0, 0, canvasWidth, canvasHeight)
}

// Update canvas
function updateCanvas () {

    // Calculate the force and velocity of the particles
    for (let i = 0; i < particles.length; i++) {particles[i].move(i)}
    
    // Clear the canvas
    clearCanvas()
    if (mouseDown) {drawArrow()}
    
    // Draw all the particles in their new positions
    for (let i = 0; i < particles.length; i++) {  
        draw(particles[i].x, particles[i].y, particles[i].color, particles[i].size);
    }

    // The requestAnimationFrame() method calls updateCanvas again and again
    requestAnimationFrame(updateCanvas)
}

// Get all the settings and run the simulation
function createAndRun () {

    // Clear the canvas and reset particles
    particles = []

    // Create particles
    let redCount = document.getElementById("randomRed").value;
    let yellowCount = document.getElementById("randomYellow").value;
    let greenCount = document.getElementById("randomGreen").value;
    let blueCount = document.getElementById("randomBlue").value;
    let whiteCount = document.getElementById("randomWhite").value;
    let staticCount = document.getElementById("randomStatic").value;

    // Mass of the particles
    redMass = document.getElementById("redMass").value;
    yellowMass = document.getElementById("yellowMass").value;
    greenMass = document.getElementById("greenMass").value;
    blueMass = document.getElementById("blueMass").value;
    whiteMass = document.getElementById("whiteMass").value;
    staticMass = document.getElementById("staticMass").value;

    // Generate the random particles if any
    for (let i = 0; i < redCount; i++) {new Particle("red", redMass, 0, false)}
    for (let i = 0; i < yellowCount; i++) {new Particle("yellow", yellowMass, 0, false)}
    for (let i = 0; i < greenCount; i++) {new Particle("green", greenMass, 0, false)}
    for (let i = 0; i < blueCount; i++) {new Particle("blue", blueMass, 0, false)}
    for (let i = 0; i < whiteCount; i++) {new Particle("white", whiteMass, 0, false)}
    for (let i = 0; i < staticCount; i++) {new Particle("black", staticMass, 0, true)}

    updateCanvas()
    
}
