/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Rectangle
    Construye un Rectángulo plano en el plano XY.
\*****************************************************************************/

// En vez de heredar del Trapecio, la rehacemos con 10 puntos
// para así modelar mejor las normales. (Provisoriamente hasta
// que cambiemos el modelo del trapecio de forma general.
// Si se quiere dibujar el rectangulo por si solo, como un plano
// utilizar previamente al dibujado la función makePlane().
function Rectangle (base, high) {
  //Trapezium_iso.call(this, base, base, high);
  var M = 10;
  Profile2D.call(this, M);
  this.base = base;
  this.high = high;
  // Esto es para poder dibujarlo solo
  this.gl_draw_mode = gl.TRIANGLE_FAN;
  // Inicializo los buffers:
  this.init();

  this.scale([this.base/2, this.high/2, 1]);
  
//  this.texture_coord_buffer = [];
//  for (var i = 0; i < this.position_buffer.length; i+=3) {
//    this.texture_coord_buffer.push(this.position_buffer[i]);
//    this.texture_coord_buffer.push(this.position_buffer[i+1]);    
//  };
//  this.setupWebGLBuffers();
}

// inheritPrototype(Rectangle, Trapezium_iso);
inheritPrototype(Rectangle, Profile2D);

// Este método transforma las normales de modo que al dibujar
// el rectangulo por si solo (como un plano), todas apunten 
// en la misma dirección (ortogonal al plano, +Z)
Rectangle.prototype.makePlane = function() {
  this.tangent_buffer = [];
  for (var i = 0; i < this.position_buffer.length/3; i++) {
    this.normal_buffer[3*i] = 0;
    this.normal_buffer[3*i+1] = 0;
    this.normal_buffer[3*i+2] = 1;
    this.tangent_buffer.pushVec3([0, 1, 0]);
  };
  // Llamo nuevamente a la función que linkea los buffers para que actualice.
  this.setupWebGLBuffers();
};

Rectangle.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];  

  this.position_buffer = [
    1, -1, 0,
    1, -1, 0,
    1, 1, 0,
    1, 1, 0,
    -1, 1, 0,
    -1, 1, 0,
    -1, -1, 0,
    -1, -1, 0,
    1, -1, 0,
    1, -1, 0
  ];

  this.normal_buffer = [
    0, -1, 0,
    1, 0, 0,
    1, 0, 0,
    0, 1, 0,
    0, 1, 0,
    -1, 0, 0,
    -1, 0, 0,
    0, -1, 0,
    0, -1, 0,
    1, 0, 0
  ];
  
  for (var i = 0; i < this.position_buffer.length; i+=3) {
    this.texture_coord_buffer.push(this.position_buffer[i]);
    this.texture_coord_buffer.push(this.position_buffer[i+1]);    
  };
};
