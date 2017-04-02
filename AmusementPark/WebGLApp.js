/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Código de la aplicación principal de WebGL
\*****************************************************************************/
/*
 * En este archivo se definen las funciones principales de la aplicación WebGL.
 *
 */
//<script type="text/javascript" src="WebGLApp.js"></script>


// ----------------------------------------------------------- //

    // Matrices de Vista (cámara), Modelo y Proyección
    var CameraMatrix = mat4.create();
    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    // Tiempo
    var t = 0;

    // Cámara
    // Camera.mode : 0: Orbital, 1: Montaña Rusa, 2: Primera Persona
    var camera = {mode:0, pos:[0,10,60], center:[0,0,0], up:[0,1,0]};

    // Posición de la cámara en primera persona (FPV)
    var player = {x:0, y:2, z:0, normal:[-1,0,0], up:[0,1,0]};

    // Posición inicial para la camara orbital:
    mouse.pitch = mouse.factorAngular/8;
    mouse.yaw = -mouse.factorAngular/4;
    
    // Posición del Sol
    sun_pos = [-500, 500, 0];
//    sun_pos = [-1, 1, 0];
//    sun_pos = [20, 0, 0];    

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setViewProjectionMatrix() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.ViewMatrixUniform, false, CameraMatrix);  
        // Además agrego una matriz para transformar las normales a coordenadas
        // de Vista/Cámara:
        var aux = mat3.create();
        mat4.toInverseMat3(CameraMatrix, aux);
        mat3.transpose(aux);
        gl.uniformMatrix3fv(shaderProgram.NViewMatrixUniform, false, aux);      
    }



    /* ******************************************************* */
    function setupSceneLights() {
        /////////////////////////////////////////////////////
        // Configuración de la luz
        // Se inicializan las variables asociadas con la Iluminación
        var lighting;
        lighting = true;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);       
        var lightPosition = sun_pos.slice();
        // Esta linea creo q me cambia la luz al mover la cámara
//        mat4.multiplyVec3(CameraMatrix, lightPosition); // ESTO TIENE Q SER VEC4 ??
        // Transformo la posición de la luz a coordenadas de vista:
        lightPosition.push(1);
        mat4.multiplyVec4(CameraMatrix, lightPosition);
        lightPosition.pop();
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightPosition);       
    }

    /* ******************************************************* */
    function setupSceneCamera() {
        /////////////////////////////////////////////////////
        // Definimos la ubicación de la camara
        // La forma de interpretar esto es que las transformaciones de esta matriz
        // se aplican a la escena, y esto es la ¿inversa? de lo que se le aplicaría
        // a la cámara?
        var m_rot = mat4.create();
        var m_trans = mat4.create();
        
        mat4.identity(m_rot);
        mat4.identity(m_trans);
        mat4.identity(CameraMatrix);
        
        mat4.rotate(m_rot, mouse.pitch, [1, 0, 0]);         
        mat4.rotate(m_rot, mouse.yaw, [0, 1, 0]);    
        mat4.translate(m_trans, [0, 0, mouse.zoom]);        
        
        // Cámara Orbital
        if (camera.mode == 0) {
          mat4.translate(m_trans, [0, -10, -90]); // Posición inicial (de la escena)
          mat4.multiply(m_trans, m_rot, CameraMatrix);
        };

        // Carrito de Montaña Rusa
        if (camera.mode == 1) {
          if (roller_coaster.camera_pos != null) {
            var aux = mat4.create();
            aux.set(roller_coaster.CameraMatrix);
            mat4.multiply(m_trans, m_rot, CameraMatrix);
            mat4.multiply(CameraMatrix, aux, CameraMatrix);
          };
        };

        // First Person View, libre
        if (camera.mode == 2) {
          if (mouse.zoom < 0 ) {
            mouse.zoom = 0;
            mat4.identity(m_trans);
          };

          camera.pos = [player.x, player.y, player.z];
          var m_yaw = mat4.create();
          var m_pitch = mat4.create();
          mat4.identity(m_yaw);
          mat4.identity(m_pitch);
          
          // Parto de un modelo de jugador mirando a ref_normal con ref_up
          var ref_normal = [1,0,0];
          var ref_up = [0,1,0];
          mat4.rotate(m_yaw, -mouse.yaw, ref_up);
          var normal = [];
          mat4.multiplyVec3(m_yaw, ref_normal, normal);
          camera.up = ref_up.slice();
          var right = [];
          vec3.cross(normal, ref_up, right);
          mat4.rotate(m_pitch, -mouse.pitch, right);
          mat4.multiplyVec3(m_pitch, ref_up, camera.up);
          mat4.multiplyVec3(m_pitch, normal, normal);
          vec3.add(normal, camera.pos, camera.center);
          player.normal = normal.slice();
          player.up = camera.up.slice();

          CameraMatrix = mat4.lookAt(camera.pos, camera.center, camera.up);
          mat4.multiply(m_trans, CameraMatrix, CameraMatrix);
          
        };
        
        setViewProjectionMatrix();
    }; // setupSceneCamera()
    /* ******************************************************** */

    var w1 = 0;

    // Esto se debe poder leer de forma más simple, a más alto nivel
    // que llame a funciones tipo "dibujarTierra()", "ConfigurarLuz()"
    function drawScene() {
        handleKeys()
	
        // Se configura el vierport dentro de área ¨canvas¨. en este caso se utiliza toda 
        // el área disponible
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		
        // Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Se configura la matriz de proyección
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, .4, 10000.0, pMatrix);

        // Definimos la ubicación de la camara
        setupSceneCamera();	
        // Configuración de la luz
        setupSceneLights();	
        
        // Dibujo los objetos
        
        // Configuramos la iluminación ambiente para los objetos a dibujar
        gl.uniform3f(shaderProgram.ambientColorUniform, 0.1, 0.1, 0.1 );
        gl.uniform3f(shaderProgram.directionalDiffuseColorUniform, 0.8, 0.8, 0.8);
        
        
        var carousel_pos = [20, 0, 0];
        var wheel_pos = [-20, 0, -20];
        var roller_coaster_pos = [-30, 0, 20];
        
        var m1 = mat4.create();
        var m2 = mat4.create();
        
        // Swing Carousel
        mat4.identity(m1);
        mat4.translate(m1, carousel_pos);
        // Con esta función el arranque es suave.
        var w = 1/2 * Math.atan(t/4);
        carousel.setSpeed(w);        
        carousel.update(t);
        carousel.draw(m1);
        
        // Wonder Wheel
        mat4.identity(m1);
        mat4.translate(m1, wheel_pos);
        // Con esta función el arranque es suave.
        wheel.setSpeed(w/4);
        wheel.update(t);
        wheel.draw(m1);
        
        // Roller Coaster
        mat4.identity(m1);
        mat4.translate(m1, roller_coaster_pos);
        mat4.rotate(m1, -Math.PI/4, [0, 1, 0]);
        roller_coaster.update(t*FPS/10);
        roller_coaster.draw(m1);
        
        
        // Suelo
        mat4.identity(m1);
        mat4.rotate(m1, -Math.PI/2, [1, 0,0]);
        earth.draw(m1);

        // Cielo
        // Apago la luz:
        gl.uniform1i(shaderProgram.useLightingUniform, false);
        
        mat4.identity(m1);
        mat4.rotate(m1, t*2*Math.PI/5000, [0, 1, 0]);
        mat4.rotate(m1, -Math.PI/2, [0, 1, 0]);
        sky.draw(m1);
       
       // Vuelvo a prender la luz:
        gl.uniform1i(shaderProgram.useLightingUniform, true);
        
        
        // Lago 
        // Le doy un poco de brillo propio
        gl.uniform3f(shaderProgram.ambientColorUniform, .3, .3, .3 );
        gl.uniform3f(shaderProgram.directionalDiffuseColorUniform, 0.8, 0.8, 0.8);
        mat4.identity(m1);
        mat4.translate(m1, [-100, 0, 0]);
        mat4.translate(m1, [0, 0.1, 0]);
        mat4.scale(m1, [10, 1, 10]);
        lake.draw(m1);
        
    }; // drawScene()


    var FPS = 25; // Frames per Second ~aprox
    function tick() {
        requestAnimFrame(tick);
        t += 1/FPS;
        drawScene();
        gl.uniform1f(shaderProgram.timeUniform, t);
    }

    // Objetos de la escena
    var sky = null;
    var earth = null;
    var sun = null;
    var carousel = null;
    var wheel = null;
    var roller_coaster = null;
    var lake = null;
    
    var test = null;
    var test2 = null;
    
    var sky_dome = "Textures/Sky/SkyDome-Cloud-Medium-Early.png";
    
    function initWorldObjects() {
        // ----------------------------------------------- //
        // Swing Carousel
        carousel = new Swing_Carousel(30, 30);

        // Wonder Wheel
        wheel = new Wonder_Wheel(30, 30, 5.5, 8.2);
  
        // Roller Coaster
        // Genero la curva
        var N = 3000;
        var curve = new Object();
        curve.fun = [];
        curve.df1 = []
        curve.df2 = [];

        var control_points = [[-20,0,-10], [-10,30,-10], [0,0,-10], [5,15,-10],
                              [10,30,-10], [20,0,-10], [35,1,0],
                              [20,0,10], [10,30,10], [0,0,10],
                              [-10,30,10], [-20,0,10], [-35,1,0],
                              [-40,15,-10], [-40,30,0], [-40,15,10],
                              [-25,5,0]];

        curve.fun = CurvaBSpline3Periodica(N, control_points);
        curve.df1 = CurvaBSpline3Derivada1Periodica(N, control_points); // La diferencia con tangent_function es muy leve
        curve.df2 = tangent_function(curve.df1, true);
      //  curve.df2 = CurvaBSpline3Derivada2Periodica(this.rows, control_points);
        // Agrego último punto coincidente con el primero para continuidad.
        curve.df2[N*3-3] = curve.df2[0];
        curve.df2[N*3-2] = curve.df2[1];
        curve.df2[N*3-1] = curve.df2[2];
        roller_coaster = new Roller_Coaster(10, curve);
        // Configuro la velocidad del carrito:
        // FPR = Frames por revolución (= en cuantos frames da una vuelta completa)
        roller_coaster.FPR = 100;
        
        // Lago
        // Genero la curva
        var N_lake = 900;
        var curve_lake = new Object();
        curve_lake.fun = [];
        curve_lake.df1 = []
        curve_lake.df2 = [];
        var lake_control_points = [ [5,0,0], [8,0,10], [-2,0,10], [-3,0,5],
                                    [-10,0,-2], [-12,0,-5], [-10,0,-8], [-8,0,-8],
                                    [0,0,-15], [4,0,-8], [8,0,-10], ];
        curve_lake.fun = CurvaBSpline3Periodica(N, lake_control_points);
        curve_lake.df1 = CurvaBSpline3Derivada1Periodica(N, lake_control_points);
        curve_lake.df2 = tangent_function(curve_lake.df1, true);
        // Agrego último punto coincidente con el primero para continuidad.
        curve_lake.df2[N*3-3] = curve_lake.df2[0];
        curve_lake.df2[N*3-2] = curve_lake.df2[1];
        curve_lake.df2[N*3-1] = curve_lake.df2[2];
        
//        lake = new Lake(10, curve_lake, .5);
        lake = new Lake2(curve_lake, .5);
        //lake.setColor(46/256, 94/256, 100/256);
        lake.initTexture("Textures/Water/water2-diffuse.jpg", "Textures/Water/water2-normal.jpg", sky_dome);
        lake.setSpecular();
        lake.setReflectionFactor(.5);
        lake.useWaterFX = true;
        lake.setTextureCoordFactor([.75, .75]);
        
          
        // Cielo
        sky = new Dome(60, 100, 1000);
        sky.initTexture(sky_dome);

        ejes = new AxisHelper();
        
        // Suelo
        earth = new Rectangle(2000, 2000);
        earth.setTextureCoordFactor([35, 35]);
        earth.makePlane();
        earth.initTexture("Textures/Grass/nature_grass_512_diffuse.jpg", "Textures/Grass/nature_grass_512_normal.jpg");           

        // ------------------------------------------------- //
    }


    function webGLStart() {
        var canvas = document.getElementById("TP2");
        initGL(canvas);
        initShaders();
        initWorldObjects();
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }
