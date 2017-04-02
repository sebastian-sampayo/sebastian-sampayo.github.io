/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Base
\*****************************************************************************/
/*
 * Clase Base
 * -----------
 *
 * Construye la base de la noria: conjunto de 2 pies (2 kickstand) y 1 eje de rotación
 *
 */

Wonder_Wheel_NS.Base = function (N, M) {
  this.depth = Wonder_Wheel_NS.depth;
  this.high = Wonder_Wheel_NS.high;
  
  this.spin = 0;

  this.kickstand1 = new Wonder_Wheel_NS.Kickstand(N, 3, .6, this.high+.3, .25);
  this.axis = new Cilinder(N, M, .2, this.depth*1.5);

  this.kickstand1.setColor(.5, .5, .5);
  this.axis.setColor(.5, .5, .5);
  this.axis.setSpecular(2);
  this.axis.initTexture("Textures/Metal/galvanized_diffuse.jpg", "Textures/Metal/galvanized_normal.jpg", sky_dome);
  this.axis.setReflectionFactor(.1);
};

Wonder_Wheel_NS.Base.prototype.draw = function (m) {
  var m1 = mat4.create();

  // Pie de apoyo 1
  mat4.identity(m1);
  mat4.translate(m1, [0, 0, -this.depth/2 - .3]);
  mat4.multiply(m, m1, m1);
  this.kickstand1.draw(m1);

  // Pie de apoyo 2
  mat4.identity(m1);
  mat4.translate(m1, [0, 0, this.depth/2 + .3]);
  mat4.multiply(m, m1, m1);
  this.kickstand1.draw(m1);

  // Eje de rotación
  mat4.identity(m1);
  mat4.translate(m1, [0, this.high, 0]);
  mat4.rotate(m1, this.spin, [0, 0, 1]);
  mat4.multiply(m, m1, m1);
  this.axis.draw(m1);

};

