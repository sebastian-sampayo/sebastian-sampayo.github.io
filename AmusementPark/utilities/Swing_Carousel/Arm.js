/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Arm
\*****************************************************************************/
/*
 * Clase Arm
 * -----------
 *
 *  Cada brazo se compone del tensor que sostiene a la silla y de la silla.
 *  Cada tensor se compone de 3 cables.
 *
 */

Swing_Carousel_NS.Arm = function (N, M) {
  this.cable1 = new Swing_Carousel_NS.Cable(N, M, 0.05, 7);
  var N2 = Math.round(N/7);
  this.cable2 = new Swing_Carousel_NS.Cable(N2, M, 0.05, 1);
  this.cable3 = new Swing_Carousel_NS.Cable(N2, M, 0.05, 1);

  this.chair = new Swing_Carousel_NS.Chair();

  this.chair.setColor(1, 1, .1);
  this.chair.initTexture("Textures/Chesterfield.png", "Textures/Chesterfield-normal-map.png");
  this.chair.setColorFactor(0.3);
  this.chair.setSpecular();
};

Swing_Carousel_NS.Arm.prototype.setColor = function (r, g, b) {
  this.chair.setColor(r, g, b);
};

Swing_Carousel_NS.Arm.prototype.draw = function (m) {
  var m1 = mat4.create();
  mat4.identity(m1);
  mat4.multiply(m, m1, m1);
  this.cable1.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [0, -7, 0]); 
  mat4.rotate(m1, -0.38, [0, 0, 1]);
  mat4.multiply(m, m1, m1);
  this.cable2.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [0, -7, 0]); 
  mat4.rotate(m1, 0.38, [0, 0, 1]);
  mat4.multiply(m, m1, m1);
  this.cable3.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [0, -8.9, 0]); 
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.chair.draw(m1);

};

// ******************************************************* //
// Cable
// En principio utilizamos un cilindro simplemente
Swing_Carousel_NS.Cable = function (N, M, radius, high) {
  // Object3D.call(this, N, M);
  this.radius = radius;
  this.high = high;
  this.c = new Cilinder(N, M, radius, high);
  this.c.setColor(.2, .2, .2);
  this.c.setSpecular(1);
  this.c.setReflectionFactor(0.1);
  // // Inicializo los buffers:
  // this.init();
};

Swing_Carousel_NS.Cable.prototype.draw = function (m) {
  var m1 = mat4.create();
  mat4.identity(m1);
  mat4.translate(m1, [0, -this.high/2, 0]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.c.draw(m1);
};

