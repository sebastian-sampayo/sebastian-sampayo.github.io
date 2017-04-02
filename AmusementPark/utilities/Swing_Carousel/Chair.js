/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Chair
\*****************************************************************************/
/*
 * Clase Chair
 * -----------
 *
 *
 */

Swing_Carousel_NS.Chair = function () {
  this.seat = new Rectangle(1,1);
  this.back = new Rectangle(1,1);

  this.seat.makePlane();
  this.back.makePlane();
};

Swing_Carousel_NS.Chair.prototype.setColor = function (r, g, b) {
  this.seat.setColor(r, g, b);
  this.back.setColor(r, g, b);
};

Swing_Carousel_NS.Chair.prototype.setColorFactor = function (colorFactor) {
  this.seat.setColorFactor(colorFactor);
  this.back.setColorFactor(colorFactor);
};

Swing_Carousel_NS.Chair.prototype.setSpecular = function (shininess, r, g, b) {
  this.seat.setSpecular(shininess, r, g, b);
  this.back.setSpecular(shininess, r, g, b);  
};

Swing_Carousel_NS.Chair.prototype.initTexture = function (texture_file, normal_map_file, reflection_map_file) {
  this.seat.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.back.initTexture(texture_file, normal_map_file, reflection_map_file);
};

Swing_Carousel_NS.Chair.prototype.draw = function (m) {
  var m1 = mat4.create();

  // Asiento
  mat4.identity(m1);
  mat4.translate(m1, [.5, 0, 0]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.seat.draw(m1);

  // Respaldo
  mat4.identity(m1);
  mat4.translate(m1, [0, .5, 0]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.back.draw(m1);
};

