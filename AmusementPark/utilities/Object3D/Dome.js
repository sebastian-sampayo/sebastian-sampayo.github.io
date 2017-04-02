/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Dome
\*****************************************************************************/

// Clase Dome.
// Igual a la Sphere, pero dibuja la mitad (semi-esfera) y define las 
// coordenadas de textura de otra manera (para usar la foto del cielo deformado en un círculo)
// Es hija de Object3D con lo cual hereda todo lo básico
// Se crea el objeto en base a una malla de NxM.

function Dome (N,M, radius) {
  Object3D.call(this, N, M);
  this.radius = radius;

  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Dome, Object3D);

// ******* Crea el Domo ******** //
Dome.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];
  this.tangent_buffer = [];
  
  var latNumber;
  var longNumber;
  this.latitudeBands = this.rows-1;
  this.longitudeBands = this.cols-1;

  for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / this.latitudeBands /2;
      var sinTheta = this.radius*Math.sin(theta);
      var cosTheta = this.radius*Math.cos(theta);

      for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
          var phi = longNumber * 2 * Math.PI / this.longitudeBands;
          var sinPhi = Math.sin(phi);
          var cosPhi = Math.cos(phi);

          var x = cosPhi * sinTheta;
          var y = cosTheta;
          var z = sinPhi * sinTheta;
          
          var u = .5 + theta/Math.PI * cosPhi;
          var v = .5 + theta/Math.PI * sinPhi;

          this.position_buffer.push(x);
          this.position_buffer.push(y);
          this.position_buffer.push(z);
          
          this.texture_coord_buffer.push(u);
          this.texture_coord_buffer.push(v);

          var aux = [-x, -y, -z];
          vec3.normalize(aux);
          this.normal_buffer.pushVec3(aux);

          var tangent = [z, y, -x];
          vec3.normalize(tangent);
          this.tangent_buffer.pushVec3(tangent);

      }
  }

}
