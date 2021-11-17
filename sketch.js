let windowSize = 0.9;
let dexelSize = 40;
let ui = 10;

let distanceToEdgeX;
let distanceToEdgeY;
let dexels = [];
let counter = 0;
let columns = 0;
let rows = 0;
let frame = 0;
let varInArr = 4;
let level = 0;
let playButton;
let font;
let gameState = -1;
let gameOpen = "none";
let set = false;
let snake = [];

let colorPalette = [];

let myUser;
let direction;
let projectiles = [];
let enemies = [];
let spaceBetweenEnemies = 1;

function preload() {
  font = loadFont("./assets/Orbitron-VariableFont_wght.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  colorPalette[0] = color("#174267"); //Deep Blue
  colorPalette[1] = color("#F98070"); //Light Salmon
  colorPalette[2] = color("#F8F3EC"); //Paper
  colorPalette[3] = color("#8ED1C0"); //Light Aqua
  colorPalette[4] = color("#37AA9C"); //Dark Aqua

  frameRate(30);
  frame++;
  //setupGrid(dexelSize, windowSize);
  //myUser = new User(find("x", 1, rows - 2), find("y", 1, rows - 2), dexelSize);
  //print('User Start = ' + find('i',0,rows-1));
}

function draw() {
  switch (gameState) {
    case -1: //Settings Screen
      background(colorPalette[0]);
      fill(163, 214, 245);
      noStroke();
      //
      fill("green");
      rect((width / ui) * 4, (height / ui) * 1, (width / ui) * 1.5, (height / ui) * 1);
      rect((width / ui) * 4, (height / ui) * 4, (width / ui) * 1.5, (height / ui) * 1);

      fill("yellow");
      rect((width / ui) * 6, (height / ui) * 1, (width / ui) * 1.5, (height / ui) * 1);
      rect((width / ui) * 6, (height / ui) * 4, (width / ui) * 1.5, (height / ui) * 1);

      fill("red");
      rect((width / ui) * 8, (height / ui) * 1, (width / ui) * 1.5, (height / ui) * 1);
      rect((width / ui) * 8, (height / ui) * 4, (width / ui) * 1.5, (height / ui) * 1);
      //
      //
      fill(0);
      noStroke();
      textSize(height / (2*ui));
      textFont(font);
      //textAlign(LEFT, CENTER);
      //
      text(
        "Difficulty",
        (width / ui) * 1,
        (height / ui) * 1,
        (width / ui) * 3,
        (height / ui) * 2
      );
      text(
        "UI Scale",
        (width / ui) * 1,
        (height / ui) * 4,
        (width / ui) * 3,
        (height / ui) * 2
      );
      break;

    /////////////////////////////////////////////////////////////////////////////////

    case 0: //Title Screen
      background(colorPalette[0]);
      fill(0);
      noStroke();
      textSize(100);
      textFont(font);
      text("My Game Title", width / 2, height / 3);
      textSize(45);
      playButton = new button(
        "Play",
        width / 2,
        height / 2,
        75,
        10,
        25,
        colorPalette[4],
        colorPalette[3]
      );
      playButton.display();

      break;

    /////////////////////////////////////////////////////////////////////////////////

    case 1: //main menu
      background(colorPalette[0]);
      fill(163, 214, 245);
      noStroke();
      rect((width / 10) * 1, (height / 10) * 1, width / 3, (height / 10) * 2);
      rect((width / 10) * 1, (height / 10) * 4, width / 3, (height / 10) * 2);
      rect((width / 10) * 1, (height / 10) * 7, width / 3, (height / 10) * 2);
      fill(0);
      textAlign(CENTER);
      text(
        "Space Invaders",
        (width / 10) * 1,
        (height / 10) * 1.75,
        width / 3,
        (height / 10) * 2
      );
      text(
        "Snake",
        (width / 10) * 1,
        (height / 10) * 4.75,
        width / 3,
        (height / 10) * 2
      );
      text(
        "Tetris?",
        (width / 10) * 1,
        (height / 10) * 7.75,
        width / 3,
        (height / 10) * 2
      );
      break;

    ///////////////////////////////////////////////////////////////////////////////

    case 2: //Space Invaders
      background(colorPalette[0]);
      setupGrid(dexelSize, windowSize);
      myUser = new User(find("x", 1, rows - 2), find("y", 1, rows - 2), dexelSize);
      showGrid();
      if (gameOpen == "Snake") {
        set = false;
        gameOpen = "Space Invaders";
      }
      if (!set) {
        enemies.splice(0, enemies.length);
        //sets enemies on the board
        for (iY = 1; iY < 12; iY += spaceBetweenEnemies + 3) {
          for (iX = 1; iX < columns - 1; iX += spaceBetweenEnemies + 1) {
            enemies.push(
              new Enemy(find("x", iX, iY), find("y", iX, iY), dexelSize, 1)
            );
          }
        }
        print("Enemies = " + enemies.length);
        set = true;
      }

      //display the user
      myUser.display("spaceInvaders");
      //display all enemies
      for (i = 0; i < enemies.length; i++) {
        enemies[i].display();
      }
      //move enemies and check edges of window
      if (frame % 5 == 0) {
        for (i = 0; i < enemies.length; i++) {
          enemies[i].moveX();
          enemies[i].checkEdge();
        }
      }
      //display, move, and check edge for projectiles
      for (i2 = 0; i2 < projectiles.length; i2++) {
        projectiles[i2].move();
        projectiles[i2].checkHit();
      }
      frame++;
      //print(frame);
      break;

    /////////////////////////////////////////////////////////////////////////////

    case 3: //Snake
      background(colorPalette[0]);
      setupGrid(dexelSize, windowSize);
      showGrid();
      if (gameOpen == "Space Invaders") {
        set = false;
        gameOpen = "Snake";
      }
      if (!set) {
        enemies.splice(0, enemies.length);
        snake.splice(0, snake.length);
        let enemyX = int(random(1, columns));
        let enemyY = int(random(1, rows));
        enemies.push(
          new Enemy(
            find("x", enemyX, enemyY),
            find("y", enemyX, enemyY),
            dexelSize,
            1
          )
        );
        //
        let userX = int(random(1, columns));
        let userY = int(random(1, rows));
        snake.push(new User(find("x", userX, userY), find("y", userX, userY)));
        snake.push(
          new User(find("x", userX, userY), find("y", userX, userY + 1))
        );
        snake.push(
          new User(find("x", userX, userY), find("y", userX, userY + 1))
        );
        set = true;
      }

      //display the current enemy
      enemies[0].display();

      //move and display the user
      for (s = 0; s < snake.length; s++) {
        snake[s].display("snake");
      }

      if (frame % 10 == 0) {
        snake[snake.length - 1].move(direction);
        snake[snake.length - 1].checkHit(direction);
      }
      frame++;
      break;
  }
}

function mousePressed() {
  switch (gameState) {
    case 0:
      if (
        mouseX > playButton.x &&
        mouseX < playButton.x + playButton.w &&
        mouseY > playButton.y &&
        mouseY < playButton.y + playButton.h
      ) {
        gameState = 1;
      }
      break;
    case 1:
      if (
        mouseX > (width / 10) * 1 &&
        mouseY > (height / 10) * 1 &&
        mouseX < width / 10 + width / 3 &&
        mouseY < (height / 10) * 3
      ) {
        gameState = 2;
      }
      if (
        mouseX > (width / 10) * 1 &&
        mouseY > (height / 10) * 4 &&
        mouseX < width / 10 + width / 3 &&
        mouseY < (height / 10) * 6
      ) {
        gameState = 3;
      }
      if (
        mouseX > (width / 10) * 1 &&
        mouseY > (height / 10) * 7 &&
        mouseX < width / 10 + width / 3 &&
        mouseY < (height / 10) * 9
      ) {
        gameState = 3;
      }

      break;
    case 2:
      break;
    case 3:
      break;
  }
}

function keyPressed() {
  switch (gameState) {
    case 0:
      if (keyCode == RETURN || keyCode == ENTER) {
        gameState = 1;
        print(gameState);
      }
      break;
    case 1:
      if (keyCode == ESCAPE) {
        gameState = 0;
      }
      break;
    case 2:
      if (keyCode == ESCAPE) {
        gameState = 1;
        gameOpen = "Space Invaders";
      }
      if (keyCode == 32) {
        projectiles.push(new Projectile(myUser.x, myUser.y));
        //print(projectiles);
        //print(myUser);
        //print(enemies);
      }
      if (keyCode == LEFT_ARROW) {
        myUser.stepLeft();
        //print(myUser.x + " , " + myUser.y);
      }
      if (keyCode == RIGHT_ARROW) {
        myUser.stepRight();
        //print(myUser.x + " , " + myUser.y);
      }
      break;
    case 3:
      if (keyCode == ESCAPE) {
        gameState = 1;
        gameOpen = "Snake";
      }
      if (keyCode == RIGHT_ARROW && direction != "left") {
        direction = "right";
      }
      if (keyCode == LEFT_ARROW && direction != "right") {
        direction = "left";
      }
      if (keyCode == UP_ARROW && direction != "down") {
        direction = "up";
      }
      if (keyCode == DOWN_ARROW && direction != "up") {
        direction = "down";
      }
      break;
  }
}

function setupGrid(blockSize, gridSize) {
  stroke(0, 0, 0);
  strokeWeight(1);
  noFill();
  distanceToEdgeX = Math.ceil(
    ((width - width * gridSize + 1) / blockSize) * blockSize
  );
  distanceToEdgeY = Math.ceil(
    ((height - height * gridSize + 1) / blockSize) * blockSize
  );

  //Creating the grid

  //set y to the distance from the edge, if y less than grid height, add another row
  for (
    let y = distanceToEdgeY;
    y <= height - distanceToEdgeY;
    y = y + blockSize
  ) {
    //set x to the distance from the edge, if x less than grid width, add another column
    for (
      let x = distanceToEdgeX;
      x <= width - distanceToEdgeX;
      x = x + blockSize
    ) {
      columns++;
      stroke(20);
      rect(x, y, blockSize, blockSize);
      fill(0);
      noStroke();
      textSize(8);
      textAlign(CENTER, CENTER);
      dexels.push(counter, x, y, counter);
      text(counter, x + blockSize / 2, y + blockSize / 2);
      counter++;
      noFill();
    }
    rows++;
  }

  columns = columns / rows;
  print(columns + " columns and " + rows + " rows.");
  //print(dexels);

  //outlining the inner grid
  stroke(0);
  rectMode(CORNER);
  rect(
    distanceToEdgeX,
    distanceToEdgeY,
    Math.ceil((width - distanceToEdgeX * 2 + 1) / blockSize) * blockSize,
    Math.ceil((height - distanceToEdgeY * 2 + 1) / blockSize) * blockSize
  );
}

function showGrid(blockSize = dexelSize) {
  //set y to the distance from the edge, if y less than grid height, add another row
  for (
    let y = distanceToEdgeY;
    y <= height - distanceToEdgeY;
    y = y + blockSize
  ) {
    //set x to the distance from the edge, if x less than grid width, add another column
    for (
      let x = distanceToEdgeX;
      x <= width - distanceToEdgeX;
      x = x + blockSize
    ) {
      stroke(206, 235, 251);
      fill(163, 214, 245);
      rect(x, y, blockSize, blockSize);
    }
  }
  stroke(0);
  noFill();
  rectMode(CORNER);
  rect(
    distanceToEdgeX,
    distanceToEdgeY,
    Math.ceil((width - distanceToEdgeX * 2 + 1) / blockSize) * blockSize,
    Math.ceil((height - distanceToEdgeY * 2 + 1) / blockSize) * blockSize
  );
}

function find(cord, column, row) {
  if (cord == "i") {
    return dexels[(column + row * columns) * varInArr];
  }
  if (cord == "x") {
    return dexels[(column + row * columns) * varInArr + 1];
  }
  if (cord == "y") {
    return dexels[(column + row * columns) * varInArr + 2];
  }
}

class Enemy {
  constructor(x, y, size, speed) {
    this.x = x; //store x in this.x, specific to each enemy
    this.y = y; //store y in this.y, specific to each enemy
    this.w = size;
    this.h = size;
    this.speed = speed;
  }

  moveX() {
    //each frame add the car's speed to its x position
    this.x = this.x + dexelSize * this.speed;
  }

  moveY() {
    //each frame, add the car's speed to its y position
    this.y = this.y + dexelSize * 2;
  }

  checkEdge() {
    if (this.x + dexelSize >= width - distanceToEdgeX) {
      this.moveY();
      this.speed = this.speed * -1;
    }
    if (this.x <= distanceToEdgeX) {
      this.moveY();
      this.speed = this.speed * -1;
    }
    if (this.y > height - distanceToEdgeY - dexelSize) {
      noLoop();
    }
  }

  display() {
    fill(238, 250 - (this.y / height) * 250, 250 - (this.y / height) * 250);
    stroke(238, 50, 51);
    rect(this.x, this.y, this.w, this.h);
  }
}

class User {
  constructor(x, y, size = dexelSize) {
    this.x = x;
    this.y = y;
    this.w = size;
    this.h = size;
  }

  move(dir = "up") {
    switch (dir) {
      case "up":
        if (this.y > distanceToEdgeY) {
          snake.push(new User(this.x, this.y - this.h));
          snake.splice(0, 1);
        }
        break;

      case "down":
        if (this.y < height - distanceToEdgeY - dexelSize) {
          snake.push(new User(this.x, this.y + this.h));
          snake.splice(0, 1);
        }
        break;

      case "left":
        if (this.x > distanceToEdgeX) {
          snake.push(new User(this.x - this.w, this.y));
          snake.splice(0, 1);
        }
        break;

      case "right":
        if (this.x < width - distanceToEdgeX - dexelSize) {
          snake.push(new User(this.x + this.w, this.y));
          snake.splice(0, 1);
        }
        break;
    }
  }

  stepLeft() {
    if (this.x > distanceToEdgeX + dexelSize) {
      this.x = this.x - this.w;
    }
  }

  stepRight() {
    if (this.x < width - distanceToEdgeX - dexelSize * 2) {
      this.x = this.x + this.w;
    }
  }

  checkHit(dir) {
    for (let i = snake.length - 2; i >= 0; i--) {
      if (this.x == snake[i].x && this.y == snake[i].y) {
        noLoop();
      }
    }

    if (this.x == enemies[0].x && this.y == enemies[0].y) {
      switch (dir) {
        case "down":
          if (this.y > distanceToEdgeY) {
            snake.splice(
              snake.length - 1,
              0,
              new User(this.x, this.y - this.h)
            );
          }
          break;

        case "up":
          if (this.y < height - distanceToEdgeY - dexelSize) {
            snake.splice(
              snake.length - 1,
              0,
              new User(this.x, this.y + this.h)
            );
          }
          break;

        case "right":
          if (this.x > distanceToEdgeX) {
            snake.splice(
              snake.length - 1,
              0,
              new User(this.x - this.w, this.y)
            );
          }
          break;

        case "left":
          if (this.x < width - distanceToEdgeX - dexelSize) {
            snake.splice(
              snake.length - 1,
              0,
              new User(this.x + this.w, this.y)
            );
          }
          break;
      }
    }
  }

  display(game) {
    switch (game) {
      case "snake":
        fill(108, 116, 118);
        stroke(240, 236, 235);
        rect(this.x, this.y, this.w, this.h);
        break;

      case "spaceInvaders":
        fill(108, 116, 118);
        stroke(240, 236, 235);
        rect(this.x, this.y, this.w, this.h);

        rect(this.x - this.w, this.y, this.w, this.h);
        rect(this.x + this.w, this.y, this.w, this.h);
        rect(this.x, this.y - this.h, this.w, this.h);
        break;
    }
  }
}

class Projectile {
  constructor(x = myUser.x, y = myUser.y) {
    this.x = x;
    this.y = y;
  }

  move() {
    this.y = this.y - dexelSize;
  }

  checkHit() {
    for (i = 0; i < enemies.length; i++) {
      if (this.x == enemies[i].x && this.y == enemies[i].y) {
        enemies.splice(i, 1);
        this.x = 0;
        this.y = 0;
      }
    }
    this.display();
  }

  display() {
    //print(distanceToEdgeX + " , " + distanceToEdgeY);
    if (this.x > distanceToEdgeX && this.y > distanceToEdgeY) {
      //if inside the gameboard display object
      fill(0, 250, 0);
      rect(this.x, this.y, dexelSize, dexelSize);
    } else {
      for (i = 0; i < projectiles.length; i++) {
        //find projectile in array and remove
        if (projectiles[i].x == this.x && projectiles[i].y == this.y) {
          projectiles.splice(i, 1);
        }
      }
    }
  }
}

class button {
  constructor(string, xcord, ycord, fontSize, stroke, r, pcol, scol) {
    this.text = string;
    this.x = xcord;
    this.y = ycord;
    this.size = fontSize;
    this.ref = font.textBounds(this.text, this.x, this.y, this.size);
    this.w = this.ref.w;
    this.h = this.ref.h;
    this.stroke = stroke;
    this.r = r;
    this.pColor = pcol;
    this.sColor = scol;
    this.x = xcord - this.ref.w / 2;
    this.y = ycord - this.ref.h / 2;
  }

  display() {
    //fill(0);
    //stroke(0);
    //rect(this.ref.x, this.ref.y, this.w, this.h);
    //shadow rect
    fill(0, 0, 0, 15);
    noStroke();
    rect(
      this.x - this.stroke / 2,
      this.y + (this.h / 6) * 2,
      this.w + this.stroke,
      this.h,
      0,
      0,
      this.r,
      this.r
    );

    //depth rect
    fill(this.pColor);
    strokeWeight(this.stroke);
    stroke(this.pColor);
    rect(this.x, this.y + this.h / 6, this.w, this.h, this.r);

    //top rect
    fill(this.sColor);
    stroke(this.pColor);
    rect(this.x, this.y, this.w, this.h, this.r);

    //text
    fill(this.pColor);
    noStroke();
    textAlign(CENTER);
    text(this.text, this.x + this.w / 2, this.y + (this.h / 10) * 4);
  }
}
