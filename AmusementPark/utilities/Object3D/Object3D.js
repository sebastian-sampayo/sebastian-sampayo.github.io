/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Object3D
\*****************************************************************************/

// Objeto 3D genérico
// Posee el método para generar el index_buffer[] que es igual sea cual
// sea la forma del objeto, por lo tanto la heredan sus hijos. (esto es 
// en caso de renderizar con TRIANGLE_STRIP. En caso de renderizar de otra
// forma se debe sobrescribir el método "generateIndeces(N,M)" y el valor del
// atributo gl_draw_mode).
// La función initBuffers() genera una malla plana de NxM. Este método
// debe ser sobrescrito en cada hijo para adoptar la forma requerida.
// En cada hijo se debe llamar a la función init() para inicializar
// los buffers en el constructor.
// Uso:
// var asd = new Object3D(N,M);
// asd.setColor(r,g,b);
// asd.draw();
// TODO: 
//  - Texturas.

//<script type="text/javascript" src="Object3D/Object3D.js"></script>
// ---------------------------------------------------------------------- //
    // ----- Object3D.js  ------ //
    function Object3D(N, M) {
        this.rows = N;
        this.cols = M;
        
        this.position_buffer = null;
        this.normal_buffer = null;
        this.tangent_buffer = null;
        this.texture_coord_buffer = null;
        this.index_buffer = null;

        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_texture_coord_buffer = null;
        this.webgl_index_buffer = null;
        this.webgl_tangent_buffer = null;
        
        // Inicialización sin texturas
        this.texture = null;
        this.normal_map = null;
        
        // Shaders:
        this.useTextures = false;
        this.useNormalMap = false;
        this.useSpecular = false;
        this.useReflectionMap = false;
        this.useWaterFX = false;
        this.useColor = false;


        // Colores: (iniciales)
        this.r = .5;
        this.g = .5;
        this.b = .5;
        // Coeficiente de cantidad de color (que se combina con textura)
        this.colorFactor = 0.5;
        // Especular
        this.specularR = .8;
        this.specularG = .8;
        this.specularB = .8;
        this.shininess = 32.0;
        // Factor de reflexión
        this.reflectionFactor = 0.5;
        // Factor de escala para coordenadas de texturas
        this.textureCoordFactor = [1, 1];
        
        // Esto es para decirle como interpretar el index_buffer:
        // Por defecto, TS (Triangle strip)
        this.gl_draw_mode = gl.TRIANGLE_STRIP;
    }

        Object3D.prototype.setColor = function(red, green, blue) {
          this.r = red;
          this.g = green;
          this.b = blue;
          this.useColor = true;
        }
        
        Object3D.prototype.setColorFactor = function(colorFactor) {
          this.colorFactor = colorFactor;
        }
        
        Object3D.prototype.setSpecular = function(shininess, r, g, b) {
          this.useSpecular = true;
          if (shininess != undefined) {
            this.shininess = shininess;
          }
          if (r != undefined) {  
            this.specularR = r;
            this.specularG = g;
            this.specularB = b;
          }          
        }
        
        Object3D.prototype.setReflectionFactor = function(reflectionFactor) {
          this.reflectionFactor = reflectionFactor;
        }
        
        Object3D.prototype.setTextureCoordFactor = function(factor) {
          this.textureCoordFactor = factor.slice();
        }

        Object3D.prototype.initTexture = function(texture_file, normal_map_file, reflection_map_file) {
            // Color difuso (textura)
            if (texture_file != undefined) {
              var aux_texture = gl.createTexture();
              this.texture = aux_texture;
              this.texture.image = new Image();
              
              var thisPtr = this;

              this.texture.image.onload = function () {
                     thisPtr.handleLoadedTexture(thisPtr.texture);
              }
              this.texture.image.src = texture_file;
              
              this.useTextures = true;
            }
            
            // Mapa de normales
            if (normal_map_file != undefined) {
              var aux_normal_map = gl.createTexture();
              this.normal_map = aux_normal_map;
              this.normal_map.image = new Image();
              
              var thisPtr = this;
              
              this.normal_map.image.onload = function () {
                thisPtr.handleLoadedTexture(thisPtr.normal_map);
              }
              this.normal_map.image.src = normal_map_file;
              
              this.useNormalMap = true;
            }
            
            // Mapa de reflexión
            if (reflection_map_file != undefined) {
              var aux_reflection_map = gl.createTexture();
              this.reflection_map = aux_reflection_map;
              this.reflection_map.image = new Image();
              
              var thisPtr = this;
              
              this.reflection_map.image.onload = function () {
                thisPtr.handleLoadedTexture(thisPtr.reflection_map);
              }
              this.reflection_map.image.src = reflection_map_file;
              
              this.useReflectionMap = true;
            }
            
            // Linkeo los buffers de WebGL
            this.setupWebGLBuffers();
        }
        
       
        // --------- Depende de las texturas del demo ---------- //
// Cuando veamos texturas veo que hacer con esto
        Object3D.prototype.handleLoadedTexture = function(texture) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D, null);
        }
// ----------------------------------------------------------- //    

       
    /*
      Función para generar los índices del arreglo "index_buffer"
      correspondientes al recorrido TS (Triangle Strip) de una grilla
      de NxM.
    */
        /*************************************/
        Object3D.prototype.generateIndeces = function(N, M) {
          var i, j, k;
          //this.index_buffer = [];
          var a = [];

          /* Validación de la entrada */
          if (N<1 || M<1)
            return null;

          /* Caso de una línea */
          if (N == 1 || M == 1) {
            for (i=0; i<((N==1)?M:N); i++)
              a.push(i);
            return a;
          }

          for(p=0, k=1; k<=N; p++, k++) {
            // Sub-Recorrido "ascendente"
            for(i=p, j=p+M; i-p<M; i++, j++) { 
              a.push(i);
              a.push(j);
            }
            k++;
            if (k==N)
              return a;

            // Sub-Recorrido "descendente"
            p += 2*M-1;
            for(i=p, j=p+M; p-i<M; i--, j--) {
              a.push(i);
              a.push(j);
            }
          }

          return a;

        }
        /*************************************/


        // En la clase Object3D se genera una malla plana de N por M puntos y 
        // dimensiones 1x1 en el Plano XY, con sistema de referencia en el 
        // centro del plano, por defecto.
        // En las clases hijas (esfera, plano, cilindro, etc) se generan los buffers específicos.
        Object3D.prototype.initBuffers = function(){

            this.position_buffer = [];
            this.normal_buffer = [];

            for (var i = 0.0; i < this.rows; i++) { 
               for (var j = 0.0; j < this.cols; j++) {

                   // Para cada vértice definimos su posición
                   // como coordenada (x, y, z=0)
                   var x = -0.5 + j/(this.cols-1);
                   var y = 0.5 + i/(this.rows-1);
                   var z = 0;
                   this.position_buffer.push(x);
                   this.position_buffer.push(y);
                   this.position_buffer.push(z);
                                          
               };
            };
            this.normal_buffer = this.position_buffer.slice();
        }

        // Creación e Inicialización de los buffers a nivel de OpenGL
        Object3D.prototype.setupWebGLBuffers = function() {
            this.webgl_normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
            this.webgl_normal_buffer.itemSize = 3;
            this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

            this.webgl_texture_coord_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
            this.webgl_texture_coord_buffer.itemSize = 2;
            this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

            this.webgl_position_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
            this.webgl_position_buffer.itemSize = 3;
            this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

            this.webgl_index_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
            this.webgl_index_buffer.itemSize = 1;
            this.webgl_index_buffer.numItems = this.index_buffer.length;
            
            this.webgl_tangent_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
            this.webgl_tangent_buffer.itemSize = 3;
            this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;
        }

        // Inicializo los buffers:
        Object3D.prototype.init = function() {
            this.nullTextures();
            this.initBuffers();
            this.index_buffer = this.generateIndeces(this.rows, this.cols);
            this.setupWebGLBuffers();
        }
        
        // Creo unas coordenadas de textura genéricas nulas
        Object3D.prototype.nullTextures = function() {
          // Mapa de textura básico
          this.texture_coord_buffer = [];
          for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
              var u = j/(this.cols-1);
              var v = i/(this.rows-1);
              this.texture_coord_buffer.pushVec2([u, v]);
            };
          };
          
          // Tangente nula:
          this.tangent_buffer = [];
          for (var i = 0; i < (this.rows * this.cols); i++) {
            this.tangent_buffer.pushVec3([0, 0, 0]);
          };
          
        };

        // Dibujado
        Object3D.prototype.draw = function(modelMatrix){
            // Matriz uniform para transformar normales
            gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
            var normalMatrix = mat3.create();
            mat4.toInverseMat3(modelMatrix, normalMatrix);
            mat3.transpose(normalMatrix);
            gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
            
            // Para dibujar en el color principal:
            gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
            
            // Si usa color:
            gl.uniform1i(shaderProgram.useColorUniform, this.useColor);
            gl.uniform1f(shaderProgram.colorFactorUniform, this.colorFactor);
            // Si usa texturas:
            gl.uniform1i(shaderProgram.useTexturesUniform, this.useTextures);
            gl.uniform2f(shaderProgram.textureCoordFactorUniform, this.textureCoordFactor[0],
                                                                  this.textureCoordFactor[1]);
            // Si usa mapa de normales:
            gl.uniform1i(shaderProgram.useNormalMap, this.useNormalMap);
            // Si usa reflejo especular:
            gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, this.useSpecular);
            if (this.useSpecular) {
              gl.uniform1f(shaderProgram.materialShininessUniform, this.shininess);
              gl.uniform3f(shaderProgram.directionalSpecularColorUniform, this.specularR, 
                                                                          this.specularG, 
                                                                          this.specularB ); 
            };
            // Si usa mapa de reflexión:
            gl.uniform1i(shaderProgram.useReflectionMap, this.useReflectionMap);
            if (this.useReflectionMap) {
              gl.uniform1f(shaderProgram.reflectionFactorUniform, this.reflectionFactor);
            } else {
              gl.uniform1f(shaderProgram.reflectionFactorUniform, 0.0);
//              if (this.rows == 1 && this.texture != null) {
//                console.log(this.texture.image.src);  
//              }            
            }
            // Si usa efecto para el agua:
            gl.uniform1i(shaderProgram.useWaterFX, this.useWaterFX);
            
            // Se configuran los buffers que alimentarán el pipeline
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

            // Textura, Mapa de Normales y Mapa de reflexión
            gl.uniform1i(shaderProgram.textureColorUniform, 0);
            gl.uniform1i(shaderProgram.textureNormalUniform, 1);
            gl.uniform1i(shaderProgram.textureReflectionUniform, 2);
                        
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            if (this.useNormalMap) {
              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, this.normal_map);
            }
            if (this.useReflectionMap) {
              gl.activeTexture(gl.TEXTURE2);
              gl.bindTexture(gl.TEXTURE_2D, this.reflection_map);
            }
              
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
            gl.drawElements(this.gl_draw_mode, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
            /////////////////////////////////
        }
        
    //}
 // ---------------------------------------------------------------------- //
