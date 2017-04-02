/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Profile2D
\*****************************************************************************/
/*
 *  Clase para perfiles en 2 dimensiones
 *  ------------------------------------
 *  Atributos:
 *  ----------
 *  - length (cantidad de vértices)
 *  - position_buffer
 *  - normal_buffer
 *  - ref_normal 
 *  - ref_up
 *
 *  Métodos:
 *  --------
 *  - translate(vec3)
 *  - rotate(angle, axis)
 *  - scale(vec3)
 *
 *  No crea ningún buffer. Cada hijo lo hará a su manera en su constructor
 *   y seteará 'length'.
 *  Por defecto, pone la normal en el eje z positivo, y el up en el eje y positivo.
*/
/*
 * Modificada para que sea hija de Object3D y si se quiere poder dibujarla por si sola
 */
function Profile2D(M) {
  Object3D.call(this, 1, M);
  this.length = M;
  // Cambiar donde dice position por position_buffer
  // idem normal
  // this.position = [];
  // this.normal = [];
  this.ref_normal = [0, 0, 1];
  this.ref_up = [0, 1, 0];
};

inheritPrototype(Profile2D, Object3D);

// Translación del perfil.
// Solo aplica a la posición
Profile2D.prototype.translate = function( pos ) {
  var m = mat4.create();
  mat4.identity(m);
  mat4.translate(m, pos);
  this.transform( m, this.position_buffer );
};

// Rotación del perfil
// Aplica a la posición y a la normal
Profile2D.prototype.rotate = function ( angle, axis ) {
  var m = mat4.create();
  mat4.identity(m);
  mat4.rotate(m, angle, axis);
  this.transform( m, this.position_buffer );
  this.transform( m, this.normal_buffer );
  this.transform( m, this.tangent_buffer );
};

// Escalado del perfil
// Solo aplica a la posición
Profile2D.prototype.scale = function( factors ) {
  var m = mat4.create();
  mat4.identity(m);
  mat4.scale(m, factors);
  this.transform( m, this.position_buffer );
};

// Aplica la transformación "matrix" a cada punto del buffer del argumento.
Profile2D.prototype.transform = function( matrix, buffer ) {
  for (var i = 0; i < this.length*3; i += 3) {
    var p = [buffer[i], 
             buffer[i+1], 
             buffer[i+2]];
    mat4.multiplyVec3(matrix, p, p);
    buffer[i] = p[0];
    buffer[i+1] = p[1];
    buffer[i+2] = p[2];
  };
  // Llamo nuevamente a la función que linkea los buffers para que actualice.
  this.setupWebGLBuffers();
};

//// Aplica la transformación "matrix" a cada punto del buffer de posición.
//Profile2D.prototype.transform_position = function( matrix ) {
//  for (var i = 0; i < this.length*3; i += 3) {
//    var p = [this.position_buffer[i], 
//             this.position_buffer[i+1], 
//             this.position_buffer[i+2]];
//    mat4.multiplyVec3(matrix, p, p);
//    this.position_buffer[i] = p[0];
//    this.position_buffer[i+1] = p[1];
//    this.position_buffer[i+2] = p[2];
//  };
//  // Llamo nuevamente a la función que linkea los buffers para que actualice.
//  this.setupWebGLBuffers();
//};

//// Aplica la transformación "matrix" a cada punto del buffer de normales.
//Profile2D.prototype.transform_normal = function( matrix ) {
//  for (var i = 0; i < this.length*3; i += 3) {
//    var p = [this.normal_buffer[i], 
//             this.normal_buffer[i+1], 
//             this.normal_buffer[i+2]];
//    mat4.multiplyVec3(matrix, p, p);
//    this.normal_buffer[i] = p[0];
//    this.normal_buffer[i+1] = p[1];
//    this.normal_buffer[i+2] = p[2];
//  };
//  // Llamo nuevamente a la función que linkea los buffers para que actualice.
//  this.setupWebGLBuffers();
//};
