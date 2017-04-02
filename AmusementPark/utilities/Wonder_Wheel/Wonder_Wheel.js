/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Wonder Wheel
\*****************************************************************************/
/*
 * Clase Wonder Wheel
 * -----------
 *
 *
 */

// Namespace para encapsular todos los componentes del Wonder_Wheel
var Wonder_Wheel_NS = {};

Wonder_Wheel_NS.radius = 5.5; // Radio de la noria
Wonder_Wheel_NS.depth = 2.5; // Profundidad de la rued
Wonder_Wheel_NS.high = 8.2; // Altura del eje de rotación
Wonder_Wheel_NS.thickness = 0.2; // Grosor de los caños
Wonder_Wheel_NS.radius_i = 2; // Radio de la rueda interna
Wonder_Wheel_NS.N_cabins = 7; // Cantidad de cabinas
Wonder_Wheel_NS.N_arms = 15; // Cantidad de caños radiales


function Wonder_Wheel (N, M) {
  // Todas estas constantes podrían ir en el Namespace
  // así es más fácil de parametrizar.
  this.depth = 2.5; // Profundidad de la rueda
  this.radius = 5.5; // Radio dela noria
  this.high = 8.2; // Altura del eje de rotación

  this.speed = 0;
  this.spin = 0;

  this.CameraMatrix = mat4.create();
  this.camera_pos = null;
  this.camera_center = null;
  this.camera_up = null;

  this.base = new Wonder_Wheel_NS.Base(N, M);
  this.wheel = new Wonder_Wheel_NS.Wheel(N, M);
  
};

// Método para setear la velocidad del carrusel
// (velocidad angular, en radianes)
Wonder_Wheel.prototype.setSpeed = function(speed) {
  this.speed = speed;
};


// Con esta función le voy pasando el tiempo en 'segundos'
// y actualizo la posición del top.
Wonder_Wheel.prototype.update = function(t) {
  if (this.speed == 0 || this.speed == null) {
    return ;
  };
  if (this.forward) {
    this.spin = this.speed * t;
  } else {
    this.spin = -this.speed * t;
  };
  this.wheel.spin = this.spin;
  this.base.spin = this.spin;
};

// Método para frenar el movimiento del carrito
Wonder_Wheel.prototype.stop = function() {
  this.setSpeed(0);
};

Wonder_Wheel.prototype.draw = function(m) {
  var m1 = mat4.create();

  // Base
  mat4.identity(m1);
  mat4.multiply(m, m1, m1);
  this.base.draw(m1);

  // Rueda
  mat4.identity(m1);
  mat4.translate(m1, [0, this.high, 0]);
  mat4.multiply(m, m1, m1);
  this.wheel.draw(m1);

};
