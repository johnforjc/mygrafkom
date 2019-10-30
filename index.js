(function(){
    var canvas, gl, program, nWord, pindahX =0.0053, pindahY = 0.0053;

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

        nWord = initWordVertices();

        var scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
        var scaleX = 1.0;
        gl.uniform1f(scaleXUniformLocation, scaleX);

        var constantUniformLocation = gl.getUniformLocation(program, 'constant');
        var constant = 0.5;
        gl.uniform1f(constantUniformLocation, constant);

        var jalanXUniformLocation = gl.getUniformLocation(program, 'jalanX');
        var jalanX = 0.00;
        gl.uniform1f(jalanXUniformLocation, jalanX);

        var jalanYUniformLocation = gl.getUniformLocation(program, 'jalanY');
        var jalanY = 0.00;
        gl.uniform1f(jalanYUniformLocation, jalanY);

        render();
        window.addEventListener('resize', resizer);

        var vertexKiriTerjauh  = -0.15;
        var vertexKananTerjauh = 0.15;
        var vertexAtasTerjauh  = 0.30;
        var vertexBawahTerjauh = -0.6;
        var ukuranTerjauh = 0.5;

        function bounceChecking(){
            // Checking X koordinat
            if(constant*scaleX*vertexKiriTerjauh+jalanX>=ukuranTerjauh)
            {
                jalanX = ukuranTerjauh - constant*scaleX*vertexKiriTerjauh;
                pindahX = -1*pindahX;
            }
            else if(constant*scaleX*vertexKananTerjauh+jalanX>=ukuranTerjauh)
            {
                jalanX = ukuranTerjauh - constant*scaleX*vertexKananTerjauh;
                pindahX = -1*pindahX;
            }
            else if(constant*scaleX*vertexKiriTerjauh+jalanX<= -1*ukuranTerjauh)
            {
                jalanX = (-1 * ukuranTerjauh - constant*scaleX*vertexKiriTerjauh);
                pindahX = -1*pindahX;
            }
            else if(constant*scaleX*vertexKananTerjauh+jalanX<= -1*ukuranTerjauh)
            {
                jalanX = (-1 * ukuranTerjauh - constant*scaleX*vertexKananTerjauh);
                pindahX = -1*pindahX;   
            }

            // Checking Y koordinat
            if(constant * vertexAtasTerjauh +jalanY>=ukuranTerjauh)
            {
                jalanY = ukuranTerjauh - constant*vertexAtasTerjauh;
                pindahY = -1*pindahY;
            }
            else if(constant * vertexBawahTerjauh+jalanY<= -1*ukuranTerjauh)
            {
                jalanY = (-1 * ukuranTerjauh - constant*vertexBawahTerjauh);
                pindahY = -1*pindahY;
            }
        }

        function render(){
            gl.clearColor(0.364, 0.305, 1, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (scaleX >= 1.0) melebar = -1.0;
            else if (scaleX <= -1.0) melebar = 1.0;
            scaleX += 0.0053 * melebar;

            jalanX += pindahX;
            jalanY += pindahY;

            bounceChecking();

            gl.uniform1f(jalanYUniformLocation, jalanY);
            gl.uniform1f(jalanXUniformLocation, jalanX);

            gl.uniform1f(scaleXUniformLocation, scaleX);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, nWord);
    
            requestAnimationFrame(render);
          }
    
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
    
        function initWordVertices() {
            var vertices=[];
            var bagian_atas=[
                -0.15 , +0.30,
                -0.15 , +0.20,
                +0.15 , +0.20,
                +0.15 , +0.30,
                -0.15 , +0.30,
            ];
            
            var bagian_tegak=[
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
            
            var vPosition = gl.getAttribLocation(program, 'vPosition');
            gl.enableVertexAttribArray(vPosition);
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
            
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
        }
    }   
}) ();