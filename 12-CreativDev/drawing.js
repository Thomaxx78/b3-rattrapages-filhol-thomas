let particles = [];
let viscositySlider, densitySlider, turbulenceSlider, speedSlider;
let colorPicker, clearButton, saveButton, brushTypeSelector;
let brushSizeSlider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background(255);

    viscositySlider = createSlider(0, 0.1, 0.02, 0.01);
    viscositySlider.position(10, 30);
    viscositySlider.style('width', '200px');
    createLabel("Longueur d'animation", 10, 10);

    densitySlider = createSlider(0, 1, 0.5, 0.1);
    densitySlider.position(10, 80);
    densitySlider.style('width', '200px');
    createLabel('Densité', 10, 60);

    turbulenceSlider = createSlider(0, 1, 0.5, 0.1);
    turbulenceSlider.position(10, 130);
    turbulenceSlider.style('width', '200px');
    createLabel('Turbulence', 10, 110);

    speedSlider = createSlider(0, 10, 1, 0.1);
    speedSlider.position(10, 180);
    speedSlider.style('width', '200px');
    createLabel("Vitesse d'animation", 10, 160);

    colorPicker = createColorPicker('#ff0000');
    colorPicker.position(10, 220);
    createLabel('Couleur', 10, 200);

    brushTypeSelector = createSelect();
    brushTypeSelector.position(10, 270);
    brushTypeSelector.option('Rond');
    brushTypeSelector.option('Carré');
    brushTypeSelector.selected('Rond');
    createLabel('Type de dessin', 10, 250);

    brushSizeSlider = createSlider(5, 50, 15, 1);
    brushSizeSlider.position(10, 320);
    brushSizeSlider.style('width', '200px');
    createLabel('Epaisseur', 10, 300);

    clearButton = createButton('Tout effacer');
    clearButton.position(10, 370);
    clearButton.mousePressed(() => background(255));

    saveButton = createButton('Télécharger');
    saveButton.position(10, 400);
    saveButton.mousePressed(() => saveCanvas('myPainting', 'png'));
}

function draw() {
    let viscosity = viscositySlider.value();
    let density = densitySlider.value();
    let turbulence = turbulenceSlider.value();
    let speed = speedSlider.value();
    let brushSize = brushSizeSlider.value();
    let brushType = brushTypeSelector.value();
    let color = colorPicker.color();

    if (mouseIsPressed && mouseX > 220) {
        particles.push(new FluidParticle(mouseX, mouseY, viscosity, density, turbulence, speed, brushSize, brushType, color));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].applyFluidity();
        particles[i].update();
        particles[i].display();
        if (particles[i].isOffScreen()) {
            particles.splice(i, 1);
        }
    }
}

class FluidParticle {
    constructor(x, y, viscosity, density, turbulence, speed, brushSize, brushType, color) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(speed);
        this.acc = createVector(0, 0);
        this.lifespan = 255;
        this.size = brushSize;
        this.viscosity = viscosity;
        this.density = density;
        this.turbulence = turbulence;
        this.brushType = brushType;
        this.color = color;
    }

    applyFluidity() {
        let drag = this.vel.copy().mult(-1).normalize().mult(this.vel.magSq() * this.viscosity);
        this.acc.add(drag);

        let noiseFactor = noise(this.pos.x * this.turbulence, this.pos.y * this.turbulence);
        this.acc.add(p5.Vector.random2D().mult(noiseFactor * this.density));
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifespan -= 2;
    }

    display() {
        fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
        if (this.brushType === 'Rond') {
            ellipse(this.pos.x, this.pos.y, this.size, this.size);
        } else if (this.brushType === 'Carré') {
            rect(this.pos.x, this.pos.y, this.size, this.size);
        }
    }

    isOffScreen() {
        return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height || this.lifespan < 0;
    }
}

function createLabel(text, x, y) {
    let label = createDiv(text);
    label.position(x, y);
    label.class('control-label');
}