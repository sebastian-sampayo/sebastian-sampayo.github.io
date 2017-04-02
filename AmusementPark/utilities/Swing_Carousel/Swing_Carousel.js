/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Swing Carousel
\*****************************************************************************/
/*
 * Clase Swing Carousel
 * -----------
 *
 * Atributos
 * ---------
 */

// "Namespace" para encapsular todos los componentes del Swing_Carousel
var Swing_Carousel_NS = {};

function Swing_Carousel (N, M) {
  this.cols = M;

  this.spin = 0;
  this.pitch = 0;
  this.yaw = 0;
  this.speed = 0;
  this.forward = true;
  this.Ap = 20 * Math.PI/180; // Amplitud según pitch
  this.wp = this.speed/3; // Velocidad según pitch
  this.wy = this.speed/5; // Velocidad según yaw
  this.B = 1;

  this.CameraMatrix = mat4.create();
  this.camera_pos = null;
  this.camera_center = null;
  this.camera_up = null;

  this.column = new Swing_Carousel_NS.Column(N);
  this.ball = new Sphere(N, M, 1); // Articulación entre columna y top
  this.top = new Swing_Carousel_NS.Top(N, M);

  this.column.setColor(.5, .5, .5); 
  this.ball.setColor(.7, .7, .7);
  
  this.column.initTexture("Textures/Metal/column.jpg", undefined, sky_dome);
  this.column.setColorFactor(.1);
  this.column.setSpecular(2);
  this.column.setReflectionFactor(0.1);
  
};

// Método para setear la velocidad del carrusel
// (velocidad angular, en radianes)
Swing_Carousel.prototype.setSpeed = function(speed) {
  this.speed = speed;
  this.wp = this.speed/3;
  this.wy = this.speed/5;
  this.top.theta = Math.atan(this.B*this.speed);
};


// Con esta función le voy pasando el tiempo en 'segundos'
// y actualizo la posición del top.
Swing_Carousel.prototype.update = function(t) {
  if (this.speed == 0 || this.speed == null) {
    return ;
  };
  if (this.forward) {
    this.spin = this.speed * t;
    this.yaw = -this.wy * t;
  } else {
    this.spin = -this.speed * t;
    this.yaw = this.wy * t;
  };
  this.pitch = this.Ap * Math.sin(this.wp * t);
};

// Método para frenar el movimiento del carrito
Swing_Carousel.prototype.stop = function() {
  this.setSpeed(0);
};

Swing_Carousel.prototype.draw = function(m) {
  var m1 = mat4.create();
  var m_rot = mat4.create();
  
  // Columna
  mat4.identity(m1);
  mat4.multiply(m, m1, m1);
  this.column.draw(m1);

  // Esfera
  mat4.identity(m1);
  mat4.translate(m1, [0, 10, 0]);
  mat4.multiply(m, m1, m1);
  this.ball.draw(m1);

  // Top
  mat4.identity(m1);
  mat4.translate(m1, [0, 10, 0]);
  mat4.rotate(m1, this.yaw , [0, 1, 0]);
  mat4.rotate(m1, this.pitch , [0, 0, 1]);
  mat4.rotate(m1, this.spin , [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.top.draw(m1);

};
