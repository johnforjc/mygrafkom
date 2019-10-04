(function() {

    var canvas, gl, program, nKiri, nKanan;

    glUtils.SL.init({ callback:function() { main(); } });
  
    function main() {
      // Get canvas element and check if WebGL enabled
      canvas = document.getElementById("glcanvas");
      gl = glUtils.checkWebGL(canvas);
  
      initGlSize();
  
      // Initialize the shaders and program
      var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
          fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
          program = glUtils.createProgram(gl, vertexShader, fragmentShader);
      gl.useProgram(program);

      var gambarKiri=1.00;
      var gambarKiriUniformLocation = gl.getUniformLocation(program, 'gambarKiri');
      gl.uniform1f(gambarKiriUniformLocation, gambarKiri);
      
      var thetaUniformLocation = gl.getUniformLocation(program, 'theta');
      var theta = 0;
      gl.uniform1f(thetaUniformLocation, theta);
      
      var scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
      var scaleX = 1.0;
      gl.uniform1f(scaleXUniformLocation, scaleX);
      
      var scaleYUniformLocation = gl.getUniformLocation(program, 'scaleY');
      var scaleY = 1.0;
      gl.uniform1f(scaleYUniformLocation, scaleY);

      nKiri = bufferSebelahKiri(gl);
      nKanan = bufferSebelahKanan(gl);
  
      resizer();

      function initGlSize() {


        var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
        // Fullscreen if not set
        if (width) {
          gl.maxWidth = width;
        }
        if (height) {
          gl.maxHeight = height;
        }
      }

      function render(){
        theta+=0.0053;
        gl.uniform1f(thetaUniformLocation, theta);

        gl.clearColor(0.364, 0.305, 1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gambarKiri = 1.00;
        gl.uniform1f(gambarKiriUniformLocation, gambarKiri);
        gl.drawArrays(gl.LINE_LOOP, 0, nKiri);

        if (scaleX >= 1.0) melebar = -1.0;
        else if (scaleX <= -1.0) melebar = 1.0;
        scaleX += 0.0053 * melebar;
        gl.uniform1f(scaleXUniformLocation, scaleX);

        gambarKiri = 0.00;
        gl.uniform1f(gambarKiriUniformLocation, gambarKiri);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, nKanan);

        requestAnimationFrame(render);
      }
    
      function draw() {
        gl.clearColor(0.364, 0.305, 1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gambarKiri = 1.00;
        gl.uniform1f(gambarKiriUniformLocation, gambarKiri);
        gl.drawArrays(gl.LINE_LOOP, 0, nKiri);
        gambarKiri = 0.00;
        gl.uniform1f(gambarKiriUniformLocation, gambarKiri);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, nKanan);
  
        render();
      }
  
      function bufferSebelahKiri() {
        var vertices=[];
        var garis=[
          // -0.40 , -0.20,
          // -0.40 , +0.40,
          // -0.25 , +0.40,
          // -0.25 , +0.50,
          // -0.65 , +0.50,
          // -0.65 , +0.40,
          // -0.50 , +0.40,
          // -0.50 , -0.20,
          0.05    ,   -0.35,
          0.05    ,   0.25,
          0.2	    ,   0.25,
          0.2	    ,   0.35,
          -0.2    ,   0.35,
          -0.2    ,   0.25,
          -0.05   ,   0.25,
          -0.05   ,   -0.35,
        ];
        
        var vertexBuffer = gl.createBuffer(),
          lingkaran1 = [], lingkaran2=[];
  
        for (var i=90.0; i<=270; i+=1) {
          var j = i * Math.PI / 180;
          var vert1 = [
            Math.sin(j)*0.1-0.15,
            Math.cos(j)*0.1-0.35,
          ];
          lingkaran1=lingkaran1.concat(vert1);
  
          var vert2 = [
            Math.sin(j)*0.2-0.15,
            Math.cos(j)*0.2-0.35,
          ];
          vert2.reverse();
          lingkaran2=lingkaran2.concat(vert2);
        }
        lingkaran2.reverse();
        lingkaran1=lingkaran1.concat(lingkaran2);
        vertices=vertices.concat(garis);
        vertices=vertices.concat(lingkaran1);
        
        var n = vertices.length / 2;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        var vPositionKiri = gl.getAttribLocation(program, 'vPositionKiri');
        gl.enableVertexAttribArray(vPositionKiri);
        gl.vertexAttribPointer(vPositionKiri, 2, gl.FLOAT, false, 0, 0);
    
        return n;
      }
  
      function bufferSebelahKanan() {
        var vertices=[];
        var bagian_atas=[
          // +0.40 , +0.50,
          // +0.40 , +0.40,
          // +0.70 , +0.40,
          // +0.70 , +0.50,
          // +0.40 , +0.50,

          -0.15 , +0.30,
          -0.15 , +0.20,
          +0.15 , +0.20,
          +0.15 , +0.30,
          -0.15 , +0.30,
        ];
  
        var bagian_tegak=[
          // +0.50 , +0.50,
          // +0.60 , +0.50,
          // +0.60 , -0.20,
          // +0.50 , -0.20,
          // +0.50 , +0.50,

          -0.05 , +0.30,
          +0.05 , +0.30,
          +0.05 , -0.40,
          -0.05 , -0.40,
          -0.05 , +0.30,
        ];
        
        var vertexBuffer = gl.createBuffer(),
          lingkaran =[];
  
        for (var i=90.0; i<=270; i+=1) {
          var j = i * Math.PI / 180;
          var vert1 = [
            Math.sin(j)*0.2-0.15,
            Math.cos(j)*0.2-0.40,
          ];
          lingkaran=lingkaran.concat(vert1);
  
          var vert2 = [
            Math.sin(j)*0.1-0.15,
            Math.cos(j)*0.1-0.40,
          ];
          lingkaran=lingkaran.concat(vert2);
        }
        bagian_atas=bagian_atas.concat(bagian_tegak);
        vertices=vertices.concat(bagian_atas);
        vertices=vertices.concat(lingkaran);
        
        var n = vertices.length / 2;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        var vPositionKanan = gl.getAttribLocation(program, 'vPositionKanan');
        gl.enableVertexAttribArray(vPositionKanan);
        gl.vertexAttribPointer(vPositionKanan, 2, gl.FLOAT, false, 0, 0);
    
        return n;
      }
    
      function resizer() {
    
        var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
        if (!width || width < 0) {
          canvas.width = window.innerWidth;
          gl.maxWidth = window.innerWidth;
        }
        if (!height || height < 0) {
          canvas.height = window.innerHeight;
          gl.maxHeight = window.innerHeight;
        }
    
        var min = Math.min.apply( Math, [gl.maxWidth, gl.maxHeight, window.innerWidth, window.innerHeight]);
        canvas.width = min;
        canvas.height = min;
    
        gl.viewport(0, 0, canvas.width, canvas.height);
    
        draw();
      }
    
      window.addEventListener('resize', resizer);
    }
  
  })();