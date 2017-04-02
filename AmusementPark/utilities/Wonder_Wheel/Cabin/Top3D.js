/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Wonder_Wheel.Cabin_NS.NS.Top3D
\*****************************************************************************/


Wonder_Wheel_NS.Cabin_NS.Top3D = function (N, theta) {
  this.rows = N;
  this.cols = 3;
  this.theta = theta;
  Object3D.call(this, this.rows, this.cols);
  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Wonder_Wheel_NS.Cabin_NS.Top3D, Object3D);

Wonder_Wheel_NS.Cabin_NS.Top3D.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  var profile = new Wonder_Wheel_NS.Cabin_NS.Top_profile2D();

  var body = revolutionize(profile, this.rows, this.theta);

  this.position_buffer = body.position.slice();
  this.normal_buffer = body.normal.slice();

};
