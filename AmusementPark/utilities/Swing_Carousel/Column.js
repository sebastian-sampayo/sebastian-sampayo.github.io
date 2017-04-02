/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Column
\*****************************************************************************/
/*
 * Clase Column
 * -----------
 *
 *
 */

// ******************************************************* //
// Hijo de Object 3D
Swing_Carousel_NS.Column = function (N) {
  this.cols = 10; // Cantidad de puntos del perfil
  Object3D.call(this, N, this.cols);
  // Inicializo los buffers:
  this.init();
};

inheritPrototype(Swing_Carousel_NS.Column, Object3D);

Swing_Carousel_NS.Column.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  var profile = new Profile2D(this.cols);
  profile.init();
  profile.position_buffer = [
    1,   10,   0,
    1,    6,   0,
    1,    6,   0,
    1.25, 5.5, 0,
    1.25, 5.5, 0,
    1.25, 4,   0,
    1.25, 4,   0,
    1.5,  3,   0,
    1.5,  3,   0,
    1.5,  0,   0
  ];
  profile.normal_buffer = [];
  var normal = [];
  for (var i = 0; i < this.cols; i++) {
    if (i == 2 || i == 3) {
      normal = [1, 1, 0];
      vec3.normalize(normal);
      profile.normal_buffer.pushVec3(normal);
    } else if (i == 6 || i == 7) {
      normal = [1, 0.08333, 0];
      vec3.normalize(normal);
      profile.normal_buffer.pushVec3(normal);
    } else {
    profile.normal_buffer.pushVec3([1, 0, 0]);
    };
  };

  var body = revolutionize(profile, this.rows, 2*Math.PI);

  this.position_buffer = body.position.slice();
  this.normal_buffer = body.normal.slice();
  
  // Swap entre coordenadas u y v de textura
  var aux = this.texture_coord_buffer.slice();
  for (var i = 0; i < this.texture_coord_buffer.length; i+=2) {
    this.texture_coord_buffer[i] = aux[i+1];
    this.texture_coord_buffer[i+1] = aux[i];
  }
};
// ******************************************************* //
