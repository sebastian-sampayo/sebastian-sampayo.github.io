/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Cabin
\*****************************************************************************/
/*
 * Clase Cabin
 * -----------
 *
 *  Construye la cabina para la noria.
 */
Wonder_Wheel_NS.Cabin_NS = {};

Wonder_Wheel_NS.Cabin = function (N, M) {
  this.high = 2.2;

  this.top = new Wonder_Wheel_NS.Cabin_NS.Top3D(N, Math.PI);
  this.bottom = new Wonder_Wheel_NS.Cabin_NS.Bottom3D(N, Math.PI);
  this.side_top = new Wonder_Wheel_NS.Cabin_NS.Side_top(N);
  this.side_bottom = new Wonder_Wheel_NS.Cabin_NS.Side_bottom(N);
  this.column = new Cilinder(N, M, 0.05, 1.8);

  this.top.setColor(.8, .3, .3);
  this.bottom.setColor(.8, .3, .3);
  this.side_top.setColor(.8, .3, .8);
  this.side_bottom.setColor(.8, .3, .8);
  this.column.setColor(.8, .5, .5);
};

Wonder_Wheel_NS.Cabin.prototype.setColor = function (r, g, b) {
  this.top.setColor(r, g, b);
  this.bottom.setColor(r, g, b);
  this.side_top.setColor(r, g, b);
  this.side_bottom.setColor(r, g, b);
  this.column.setColor(r, g, b);
};

Wonder_Wheel_NS.Cabin.prototype.setSpecular = function(shininess, r, g, b) {
  this.top.setSpecular(shininess, r, g, b);
  this.bottom.setSpecular(shininess, r, g, b);
  this.side_top.setSpecular(shininess, r, g, b);
  this.side_bottom.setSpecular(shininess, r, g, b);  
  this.column.setSpecular(shininess, r, g, b);  
};

Wonder_Wheel_NS.Cabin.prototype.setColorFactor = function(colorFactor) {
  this.top.setColorFactor(colorFactor);
  this.bottom.setColorFactor(colorFactor);
  this.side_top.setColorFactor(colorFactor);
  this.side_bottom.setColorFactor(colorFactor);   
  this.column.setColorFactor(colorFactor);      
};

Wonder_Wheel_NS.Cabin.prototype.initTexture = function(texture_file, normal_map_file, reflection_map_file) {
  this.top.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.bottom.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.side_top.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.side_bottom.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.column.initTexture(texture_file, normal_map_file, reflection_map_file);
};      

Wonder_Wheel_NS.Cabin.prototype.setReflectionFactor = function(reflectionFactor) {
  this.top.setReflectionFactor(reflectionFactor);
  this.bottom.setReflectionFactor(reflectionFactor);
  this.side_top.setReflectionFactor(reflectionFactor);
  this.side_bottom.setReflectionFactor(reflectionFactor);          
  this.column.setReflectionFactor(reflectionFactor);   
};

Wonder_Wheel_NS.Cabin.prototype.draw = function (m) {
  var m1 = mat4.create();

  // Derecha
  mat4.identity(m1);
  mat4.translate(m1, [.5, 0, 0]);
  mat4.rotate(m1, -Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.top.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [.5, -this.high, 0]);
  mat4.rotate(m1, -Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.bottom.draw(m1);

  // Izquierda  
  mat4.identity(m1);
  mat4.translate(m1, [-.5, 0, 0]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.top.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [-.5, -this.high, 0]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.bottom.draw(m1);

  // Frente
  mat4.identity(m1);
  mat4.rotate(m1, -Math.PI/2, [0, 1, 0]);
  mat4.rotate(m1, -Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.side_top.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [0, -2.2, 0]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.rotate(m1, -Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.side_bottom.draw(m1);

  // Atrás
  mat4.identity(m1);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.rotate(m1, -Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.side_top.draw(m1);

  mat4.identity(m1);
  mat4.translate(m1, [0, -2.2, 0]);
  mat4.rotate(m1, -Math.PI/2, [0, 1, 0]);
  mat4.rotate(m1, -Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.side_bottom.draw(m1);  
  
  // Columnas
  var alpha = 0;
  var d = 0.5;
  for (var i = 0; i < 4; i++) {
    alpha = Math.PI/4 + i*Math.PI/2;
    mat4.identity(m1);
    mat4.rotate(m1, Math.PI, [0, 1, 0]);
    mat4.translate(m1, [d*Math.cos(alpha), -1.1, d*Math.sin(alpha)]);
    mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
    mat4.multiply(m, m1, m1);
    this.column.draw(m1);      
  };

};

