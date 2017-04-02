/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Sphere
\*****************************************************************************/

// Clase Sphere.
// Se construye a partir de revolucionar media vuelta un círculo.
// Es hija de Object3D con lo cual hereda todo lo básico
// Se crea el objeto en base a una malla de NxM.

function Sphere (N,M, radius) {
  Object3D.call(this, N, M);
  this.radius = radius;

  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Sphere, Object3D);

// ******* Crea el Sphere ******** //
Sphere.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];
  this.tangent_buffer = [];

//  // Modo Revolución
//  var profile = new Circle(this.cols, this.radius);

//  var body = revolutionize(profile, this.rows, Math.PI);

//  this.position_buffer = body.position.slice();

//  this.normal_buffer = body.normal.slice();
  
  var latNumber;
  var longNumber;
  this.latitudeBands = this.rows-1;
  this.longitudeBands = this.cols-1;

  for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / this.latitudeBands;
      var sinTheta = this.radius*Math.sin(theta);
      var cosTheta = this.radius*Math.cos(theta);

      for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
          var phi = longNumber * 2 * Math.PI / this.longitudeBands;
          var sinPhi = Math.sin(phi);
          var cosPhi = Math.cos(phi);

          var x = cosPhi * sinTheta;
          var y = cosTheta;
          var z = sinPhi * sinTheta;
//          var u = 0.0 - (longNumber / this.longitudeBands);
//          var v = 1.0 - (latNumber / this.latitudeBands);
          var u = (this.longitudeBands - longNumber)/this.longitudeBands;
//          var u = longNumber/this.longitudeBands*2;
          var v = (this.latitudeBands - latNumber)/this.latitudeBands;

          this.position_buffer.push(x);
          this.position_buffer.push(y);
          this.position_buffer.push(z);
          
          this.texture_coord_buffer.push(u);
          this.texture_coord_buffer.push(v);

          var aux = [x, y, z];
          vec3.normalize(aux);
          this.normal_buffer.pushVec3(aux);

          var tangent = [z, y, -x];
          vec3.normalize(tangent);
          this.tangent_buffer.pushVec3(tangent);

      }
  }

}
