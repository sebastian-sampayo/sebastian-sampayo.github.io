/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Lake
\*****************************************************************************/
/*
 * Clase Lake
 * -----------
 *
 *  El constructor recibe:
 *  - La cantidad de filas de extrusión (N)
 *  - El objeto curva (curve.fun, curve.df1, etc)
 *  - La altura del lago.
 */

var Lake2_NS = {};

function Lake2 (curve, high) {
  this.high = high;
  this.curve = new Object();
  this.set_curve(curve);
  this.rows = 1;
  this.cols = this.curve.fun.length/3;
  Object3D.call(this, this.rows, this.cols);
  // Inicializo los buffers:
  this.init();
  
  this.gl_draw_mode = gl.TRIANGLE_FAN;
};

inheritPrototype(Lake2, Object3D);  
  
// Setear la Curva
// La entrada debe ser un objeto curva, con atributos:
// curve.fun
// curve.df1
// curve.df2
// al mismo estilo de la función extruir()
// Se copia dentro del Namespace para q la usen todos los componentes (global al módulo)
Lake2.prototype.set_curve = function(curve) {
  this.curve.fun = curve.fun.slice();
  this.curve.df1 = curve.df1.slice();
  this.curve.df2 = curve.df2.slice();

  // En este caso no es necesario copiarlo al "namespace"...
  Lake2_NS.curve = new Object();
  Lake2_NS.curve.fun = curve.fun.slice();
  Lake2_NS.curve.df1 = curve.df1.slice();
  Lake2_NS.curve.df2 = curve.df2.slice();
};

Lake2.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];
  this.tangent_buffer = [];

  this.position_buffer = this.curve.fun.slice();
  
  for (var i = 0; i < this.position_buffer.length; i+=3) {
    this.texture_coord_buffer.push(this.position_buffer[i]);
    this.texture_coord_buffer.push(this.position_buffer[i+2]);   
    
    this.normal_buffer.pushVec3([0, 1, 0]);
    this.tangent_buffer.pushVec3([1, 0, 0]);
  }; 

};
// ******************************************************* //
