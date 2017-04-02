// Ejemplo de Objeto compuesto
// Uso:
//    var ejes = null;
//    ejes = new asd();
//    ejes.draw(m);

function AxisHelper () {
  this.radius = 1;
  this.high = 10;
  var N = 10; 
  this.c1 = new Cilinder(N, N, this.radius, this.high);
  this.c2 = new Cilinder(N, N, this.radius, this.high);
  this.c3 = new Cilinder(N, N, this.radius, this.high);
  this.c1.setColor(1,0,0); // x = R
  this.c2.setColor(0,1,0); // y = G
  this.c3.setColor(0,0,1); // z = B

}

AxisHelper.prototype.draw = function(m) {
  var m1 = mat4.create();
  mat4.identity(m1);
  mat4.translate(m1, [this.high/2,0,0]);
  mat4.rotate(m1, Math.PI/2, [0,1,0]);
  mat4.multiply(m, m1, m1);
  // T(h/2,0,0) * RotY(90)
  this.c1.draw(m1);
  var m2 = mat4.create();
  mat4.identity(m2);
  mat4.translate(m2, [0,this.high/2,0]);
  mat4.rotate(m2, Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.multiply(m, m2, m2);
  this.c2.draw(m2);
  var m3 = mat4.create();
  mat4.identity(m3);
  mat4.translate(m3, [0,0,this.high/2]);
  //mat4.rotate(m3, Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.multiply(m, m3, m3);
  this.c3.draw(m3);
}
