/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Wonder_Wheel_NS.Cabin_NS.Bottom_profile2D
\*****************************************************************************/


Wonder_Wheel_NS.Cabin_NS.Bottom_profile2D = function() {
  Profile2D.call(this, 4);
  // Esto es para poder dibujarlo solo
  this.gl_draw_mode = gl.TRIANGLE_FAN;
  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Wonder_Wheel_NS.Cabin_NS.Bottom_profile2D, Profile2D);

Wonder_Wheel_NS.Cabin_NS.Bottom_profile2D.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  this.position_buffer = [
    0, 0, 0,
    15/32, 0, 0, 
    .5, 0.4, 0,
    .5, 0.6, 0
  ];

  var aux = [1, -0.3125, 0];
  vec3.normalize(aux);
  this.normal_buffer = [
    0, 1, 0,
    aux[0], aux[1], aux[0],
    aux[0], aux[1], aux[0],
    1, 0, 0
  ];

  this.ref_up = [0, 1, 0];

};
