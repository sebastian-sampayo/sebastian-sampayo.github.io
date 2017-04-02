/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Cone
\*****************************************************************************/
/*
 * Clase Cone
 * -----------
 *
 *  Genera la estructura cónica de las sillas voladoras a partir de revolucionar
 * una recta inclinada, desplazada del origen.
 *
 */

// ******************************************************* //
// Hijo de Object 3D
Swing_Carousel_NS.Cone = function (N) {
  this.cols = 2; // Cantidad de puntos del perfil
  Object3D.call(this, N, this.cols);
  // Inicializo los buffers:
  this.init();
};

inheritPrototype(Swing_Carousel_NS.Cone, Object3D);

Swing_Carousel_NS.Cone.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  var profile = new Profile2D(this.cols);
  profile.init();
  profile.position_buffer = [
    8, 1.25, 0,
    1, 0,    0
  ];
  profile.normal_buffer = [];
  var normal = [7, -39.2, 0];
  vec3.normalize(normal);
  for (var i = 0; i < this.cols; i++) {
    profile.normal_buffer.pushVec3(normal);
  };

  var body = revolutionize(profile, this.rows, 2*Math.PI);

  this.position_buffer = body.position.slice();
  this.normal_buffer = body.normal.slice();
};
// ******************************************************* //
