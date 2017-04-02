/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Roller Coaster
\*****************************************************************************/
/*
 * Clase Roller Coaster
 * -----------
 *
 * Construye toda la estructura y el carro en su posición correspondiente.
 * 
 * Recibe el constructor:
 *  - M: # de puntos de discretización del perfil circular de cada riel.
 *  - curve: Objeto curva (curve.fun, curve.df1, etc)
 *
 * Atributos
 * ---------
 *  - u: posición del carro en la curva. u = 0-1
 *  - 
 */

// Namespace para encapsular todos los componentes del Roller Coaster
var Roller_Coaster_NS = {};

function Roller_Coaster (M, curve) {
  this.curve = new Object();
  this.set_curve(curve);
  this.cols = M;
  this.rows = this.curve.fun.length/3;
  this.speed = null;
  this.u = null;
  this.forward = true;
  this.FPR = null;
  this.CameraMatrix = mat4.create();
  this.camera_pos = null;
  this.camera_center = null;
  this.camera_up = null;

//  this.prev_binormal = [0,0,0];
  
  this.rails = new Roller_Coaster_NS.Rails(M);
  // Auxiliar para calcular el espaciado entre columnas
  var N = curve.fun.length/3;
  // delta = N/X, X = # de columnas
  this.columns = new Roller_Coaster_NS.Columns(M,M, .25, N/20);
  this.unions = new Roller_Coaster_NS.Unions(.5, .16, .1, N/80);
  this.car = new Roller_Coaster_NS.Car(M, 0.6);

  this.car.setColor(130/256, 0, 0);

  // Versión 2 de la extrusión:
  // this.prev_binormal = this.car.ref_up
  this.binormal_0 = [0,1,0];
  this.prev_binormal = this.binormal_0;
};

// Setear la Curva
// La entrada debe ser un objeto curva, con atributos:
// curve.fun
// curve.df1
// curve.df2
// al mismo estilo de la función extruir()
// Se copia dentro del Namespace para q la usen todos los componentes (global al módulo)
Roller_Coaster.prototype.set_curve = function(curve) {
  this.curve.fun = curve.fun.slice();
  this.curve.df1 = curve.df1.slice();
  this.curve.df2 = curve.df2.slice();

  Roller_Coaster_NS.curve = new Object();
  Roller_Coaster_NS.curve.fun = curve.fun.slice();
  Roller_Coaster_NS.curve.df1 = curve.df1.slice();
  Roller_Coaster_NS.curve.df2 = curve.df2.slice();
};


// Con esta función le voy pasando el tiempo en 'frames'
// y actualizo la posición en la curva.
// La función utilizada permite que u varíe ciclicamente de 0 a 1,
// a una velocidad de FPR cuadros por revolución de la curva.
Roller_Coaster.prototype.update = function(frame) {
  if (this.FPR == 0 || this.FPR == null) {
    return ;
  };
  var prev_u = this.u;
  if (this.forward) {
    this.u = (frame % this.FPR)/this.FPR;
    // Cuando da una vuelta, corrijo la binormal
    if (this.u < prev_u) {
      this.prev_binormal = this.binormal_0;
    };
  } else {
    this.u = 1 - (frame % this.FPR)/this.FPR;
    // Cuando da una vuelta, corrijo la binormal
    if (this.u > prev_u) {
      this.prev_binormal = this.binormal_0;
    };
  };
};

// Método para frenar el movimiento del carrito
Roller_Coaster.prototype.stop = function() {
  this.FPR = 0;
};

Roller_Coaster.prototype.draw = function(m) {
  var m1 = mat4.create();
  var m_rot = mat4.create();
  mat4.identity(m1);
  mat4.multiply(m, m1, m1);
  // Los rieles y las columnas quedan según su modelo.
  this.rails.draw(m1);
  this.columns.draw(m1);
  this.unions.draw(m1);

  // ---- Movimiento del carro ----
  // N: Cantidad de puntos de la curva
  var N = this.curve.fun.length/3;
  // i: Índice del punto de la curva correspondiente a 'u'
  var i = Math.round(this.u * N);

  // Posición final del auto en el espacio
  var p = [ this.curve.fun[3*i],
            this.curve.fun[3*i+1],
            this.curve.fun[3*i+2] ];
  var m_trans = mat4.create();
  mat4.identity(m_trans);
  mat4.translate(m_trans, p);

  // Orientación del carro
  // Sistema de referencia del carro
  var triplet = new Object();
  triplet.x = this.car.ref_normal.slice();
  triplet.y = this.car.ref_up.slice();
  triplet.z = [];
  vec3.cross(triplet.x, triplet.y, triplet.z);
  // Matriz de cambio de base de la terna de referencia del carro a la base canónica
  var Cpe = mat4.createFromRowsVec3(triplet.x, triplet.y, triplet.z);
  // Sistema de referencia de la curva
  // Tangente:
  var df_i = [ this.curve.df1[3*i],
               this.curve.df1[3*i+1], 
               this.curve.df1[3*i+2] ];
  // Binormal:             
  // Versión 2:
  var normal_aux = [];
  var binormal = [];
  vec3.cross(df_i, this.prev_binormal, normal_aux);
  vec3.normalize(normal_aux);
  vec3.cross(normal_aux, df_i, binormal);
  vec3.normalize(binormal);
   // En caso de que la segunda derivada de 0 tomo el valor anterior
   if ((binormal[0] == 0 || isNaN(binormal[0])) &&
       (binormal[1] == 0 || isNaN(binormal[1])) &&
       (binormal[2] == 0 || isNaN(binormal[2])) ) {
       binormal = this.prev_binormal.slice();
   };

  // Actualizo el valor previo
  this.prev_binormal = binormal.slice();
  //normal <= tangente x binormal
  var normal = [];
  vec3.cross(df_i, binormal, normal);
  // m <= Cambio de base(df, binormal, normal)
  // de canónica a terna de la curva
  var Cef = mat4.createFromColsVec3(df_i, binormal, normal);

  mat4.identity(m1),
  mat4.multiply(Cpe, m1, m1);
  mat4.multiply(Cef, m1, m1);
  m_rot.set(m1); // almaceno la rotación
  mat4.multiply(m_trans, m1, m1);
  mat4.multiply(m, m1, m1);
  this.car.draw(m1);

  // Armo la matriz de Vista en Primera persona:
  var m_view = mat4.create();
  var m_t_p = mat4.create();
  var p_cam = [];
  var t_up = [];
  var center = [];

  // Posición de la cámara
  // Centrada en el eje del carrito, elevada en 2 unidades
  p_cam = this.car.ref_up.slice();
  vec3.scale(p_cam, 2*this.car.high);
  mat4.multiplyVec3(m1,p_cam, p_cam);
  // Punto al que mira
  center = this.car.ref_normal.slice();
  vec3.scale(center,12);
  mat4.multiplyVec3(m1, center, center);
  // Arriba
  // Acá hay un problema. Se necesita la orientación del vehículo
  // Si la matriz de entrada 'm' se compone de rotaciones y translaciones, 
  // se debe multiplicar únicamente por las rotaciones, y no por las translaciones...
  // Para quedarme con las rotaciones, hago 0 la última columna.
  var m_aux = mat4.create(m);
  m_aux[12] = 0;
  m_aux[13] = 0;
  m_aux[14] = 0;
  mat4.multiply(m_aux, m_rot, m_rot);
  mat4.multiplyVec3(m_rot, this.car.ref_up, t_up);

  m_view = mat4.lookAt(p_cam, center, t_up); 
  this.CameraMatrix.set(m_view);
  this.camera_pos = p_cam.slice();
  this.camera_center = center.slice();
  this.camera_up = t_up.slice();
};
