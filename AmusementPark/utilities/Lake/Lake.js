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

var Lake_NS = {};

function Lake (N, curve, high) {
  this.high = high;
  this.curve = new Object();
  this.set_curve(curve);
  this.rows = N;
  this.cols = this.curve.fun.length/3;
  Object3D.call(this, this.rows, this.cols);
  // Inicializo los buffers:
  this.init();
  
//  gl_draw_mode = gl.TRIANGLE_FAN;
};

inheritPrototype(Lake, Object3D);  
  
// Setear la Curva
// La entrada debe ser un objeto curva, con atributos:
// curve.fun
// curve.df1
// curve.df2
// al mismo estilo de la función extruir()
// Se copia dentro del Namespace para q la usen todos los componentes (global al módulo)
Lake.prototype.set_curve = function(curve) {
  this.curve.fun = curve.fun.slice();
  this.curve.df1 = curve.df1.slice();
  this.curve.df2 = curve.df2.slice();

  // En este caso no es necesario copiarlo al "namespace"...
  Lake_NS.curve = new Object();
  Lake_NS.curve.fun = curve.fun.slice();
  Lake_NS.curve.df1 = curve.df1.slice();
  Lake_NS.curve.df2 = curve.df2.slice();
};

Lake.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];
  this.tangent_buffer = [];

  var profile = new Profile2D(this.cols);
  profile.init();
  profile.position_buffer = this.curve.fun.slice();
  
  // Para obtener las normales primero calculo la 1a derivada.
  if (this.curve.df1 === undefined) {
    var df = tangent_function(this.curve.fun, true);
  } else {
    var df = this.curve.df1.slice();
  };
  
  // En vez de utilizar la 2a derivada, defino que la normal será siempre
  // apuntando en +y = [0,1,0], y por lo tanto calculo la binormal a partir 
  // del producto entre la tangente y la normal.
  var normal_aux = [0,1,0];
  var binormal_aux = [];
  df2 = [];
  for (var i = 0; i < this.cols; i++) {
    vec3.cross(normal_aux, [df[3*i], df[3*i+1], df[3*i+2]], binormal_aux);
    df2.pushVec3(binormal_aux);
  };
  
  profile.normal_buffer = df2.slice();
  
  // Por alguna razón la función extruir() no me rota correctamente el perfil 
  // Quizas es un problema de orientación inicial de la binormal.
  profile.rotate(-Math.PI/2, [1, 0 , 0]);
  
  var line = new Object();
  line.fun = [];
  var y = 0;
  // Genero la recta de extrusión, x=0, z=0, 0<y<h
  for (var i = 0; i < this.rows-1; i++) {
    y = i*this.high/(this.rows-2);
    line.fun.pushVec3([0, y, 0]);
  };

  var body = extrude(profile, line);
  
  // tapa de arriba:
  // Esto se puede mejorar para que sea más bien una malla de puntos,
  // ya que al poner solamente los puntos en el centro se genera 
  // un efecto de "rayos concéntricos".
  var cover = [];
  var cover_normal = [];
  for (var i = 0; i < this.cols; i++) {
    cover.pushVec3([0, this.high, 0]);
    cover_normal.pushVec3([0, 1, 0]);
  };

  this.position_buffer = body.position.concat(cover);
  this.normal_buffer = body.normal.concat(cover);
  
  // Tangentes:
  for (var i = 0; i < this.rows-1; i++) {
    this.tangent_buffer = this.tangent_buffer.concat(df);
  }
  for (var i = 0; i < this.cols; i++) {
    this.tangent_buffer.pushVec3([1, 0, 0]);
  }
  
  for (var i = 0; i < this.position_buffer.length; i+=3) {
    this.texture_coord_buffer.push(this.position_buffer[i]);
    this.texture_coord_buffer.push(this.position_buffer[i+2]);   
  }; 
  
};
// ******************************************************* //
