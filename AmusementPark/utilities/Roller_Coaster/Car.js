/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Car
\*****************************************************************************/
/*
 * Clase Car
 * -----------
 *
 *  Recibe :
 *  N: la cantidad de filas de la malla de la trompa
 *  high: la altura del coche.
 */

Roller_Coaster_NS.Car = function (N, high) {
 this.high = high;
 
 // Terna de referencia:
 this.ref_normal = [1,0,0];
 this.ref_up = [0,1,0];
 
 this.base = new Rectangle(1.5, 1);
 this.side = new Rectangle(1.5, high);
 this.back = new Rectangle(1, high);
 this.front = new Wonder_Wheel_NS.Kickstand(N, high, .5*high, .5, 1);
 this.seat = new Swing_Carousel_NS.Chair();
 
 this.base.makePlane();
 this.side.makePlane();
 this.back.makePlane();  
 
 this.seat.setColor(1, 1, .1);
 
 this.front.setSpecular(2);
 this.side.setSpecular(10);
 this.back.setSpecular();
 this.seat.setSpecular();
  
 this.side.initTexture("Textures/Metal/plate-diffuse.jpg", "Textures/Metal/plate-normal.jpg");
 this.front.initTexture("Textures/Metal/plate-diffuse.jpg", "Textures/Metal/plate-normal.jpg");
 this.back.initTexture("Textures/Metal/plate-diffuse.jpg", "Textures/Metal/plate-normal.jpg");
 this.seat.initTexture("Textures/Chesterfield.png", "Textures/Chesterfield-normal-map.png");
 this.seat.setColorFactor(0.3);
 
};

Roller_Coaster_NS.Car.prototype.setColor = function (r, g, b) {
  this.base.setColor(r, g, b);
  this.side.setColor(r, g, b);
  this.back.setColor(r, g, b);    
  this.front.setColor(r, g, b);
};

Roller_Coaster_NS.Car.prototype.draw = function (m) {
  var m1 = mat4.create();
  
  // Base
  mat4.identity(m1);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);  
  mat4.multiply(m, m1, m1);
  this.base.draw(m1);

  // Back
  mat4.identity(m1);
  mat4.translate(m1, [-.75, this.high/2, 0]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);  
  mat4.multiply(m, m1, m1);
  this.back.draw(m1);

  // Side 1
  mat4.identity(m1);
  mat4.translate(m1, [0, this.high/2, 0.5]);
  mat4.multiply(m, m1, m1);
  this.side.draw(m1);
  
  // Side 2
  mat4.identity(m1);
  mat4.translate(m1, [0, this.high/2, -0.5]);
  mat4.multiply(m, m1, m1);
  this.side.draw(m1);
  
  // Front
  mat4.identity(m1);
  mat4.translate(m1, [.75, this.high/2, 0]);
  mat4.rotate(m1, -Math.PI/2, [0, 0, 1]);  
  mat4.multiply(m, m1, m1);
  this.front.draw(m1);
  
  // Seat Back
  mat4.identity(m1);
  mat4.translate(m1, [-.7, 0.05, 0]);
  mat4.multiply(m, m1, m1);
  this.seat.draw(m1);
  
  // Seat Front
  mat4.identity(m1);
  mat4.translate(m1, [0, 0.05, 0]);
  mat4.multiply(m, m1, m1);
  this.seat.draw(m1);
  
};

// ******************************************************* //
