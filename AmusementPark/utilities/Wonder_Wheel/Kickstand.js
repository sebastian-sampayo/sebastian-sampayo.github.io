/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Kickstand
\*****************************************************************************/
/*
 * Clase Kickstand
 * -----------
 *
 *  Construye un pie de apoyo de forma trapezoidal.
 *
 * TODO: Se puede mejorar la tapa de arriba y las normals de los laterales.
 *
 */

// ******************************************************* //
// Hijo de Object 3D
Wonder_Wheel_NS.Kickstand = function(N, base1, base2, high, depth) {
  this.cols = 10; // Cantidad de puntos del perfil
  this.rows = N;
  this.high = high;
  this.base1 = base1;
  this.base2 = base2;
  this.depth = depth;
  Object3D.call(this, N, this.cols);
  // Inicializo los buffers:
  this.init();
};

inheritPrototype(Wonder_Wheel_NS.Kickstand, Object3D);

Wonder_Wheel_NS.Kickstand.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  var profile = new Rectangle(this.base1, this.depth);
  
  var line = new Object();
  line.fun = [];
  var scale = [];

  var y = 0;
  var x = 0;
  var sf = 1 - this.base2/this.base1;
  for (var i = 0; i < this.rows-2; i++) {
    y = i * this.high / (this.rows-3);
    line.fun.pushVec3([0, y, 0]);
    x = 1 - i*sf / (this.rows-3);
    scale.pushVec3([x, 1, 1]);
  };

  var body = extrude(profile, line, scale);

  this.position_buffer = body.position.slice();
  this.normal_buffer = body.normal.slice();

  // Para la tapa de arriba agrego una última fila de puntos
  // todos en el mismo lugar
  var aux = new Rectangle(this.base2, this.depth);
  aux.makePlane();
  aux.rotate(Math.PI/2, [1, 0, 0]);
  aux.translate([0,this.high, 0]);
  this.position_buffer = this.position_buffer.concat(aux.position_buffer);
  this.normal_buffer = this.normal_buffer.concat(aux.normal_buffer);
  for (var i = 0; i < this.cols; i++) {
    this.position_buffer.pushVec3([0, this.high, 0]);
    this.normal_buffer.pushVec3([0, 1, 0]);
  };
};
// ******************************************************* //
