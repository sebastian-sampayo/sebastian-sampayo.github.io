/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Wonder_Wheel.Cabin_NS.NS.Side_bottom
\*****************************************************************************/


Wonder_Wheel_NS.Cabin_NS.Side_bottom = function (N) {
  this.rows = N;
  this.cols = 4;
  Object3D.call(this, this.rows, this.cols);
  // Inicializo los buffers:
  this.init();
  this.asd = null;
}

inheritPrototype(Wonder_Wheel_NS.Cabin_NS.Side_bottom, Object3D);

Wonder_Wheel_NS.Cabin_NS.Side_bottom.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  var profile = new Wonder_Wheel_NS.Cabin_NS.Bottom_profile2D();

  var line = new Object();
  line.fun = [];
  var x = 0;
  for (var i = 0; i < this.rows; i++) {
    x = -.5 + i /(this.rows-1);
    //line.fun.pushVec3([x, 0, 0]);
    line.fun.pushVec3([0, x, 0]);
  };
  this.asd = line.fun.slice();
  var body = extrude(profile, line);

  this.position_buffer = body.position.slice();
  this.normal_buffer = body.normal.slice();

};
