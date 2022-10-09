class Tools {
    static loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source); // Send the source to the shader object
        gl.compileShader(shader); // Compile the shader program
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static initShaderProgram(gl, vsSource, fsSource) {
        //加载顶点着色器、片段着色器
        const vertexShader = Tools.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = Tools.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        //创建着色器程序
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        //链接
        gl.linkProgram(shaderProgram);

        return shaderProgram;
    }

    static initBuffers(gl, positions, colors, indices, normals) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        //为颜色创建缓冲区
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // 3.索引缓冲区
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            color: colorBuffer,
            index: indexBuffer,
            normal: normalBuffer,
            indices: indices,
        }
    }

    static initTextBuffers(gl, positions, indices0, indices1, indices2, indices3, indices4, indices5, normals, TextCoord) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
        const TextureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, TextureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TextCoord), gl.STATIC_DRAW);

        // 索引缓冲区
        const indexBuffer0 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer0);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices0), gl.STATIC_DRAW);

        // 索引缓冲区
        const indexBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer1);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices1), gl.STATIC_DRAW);

        // 索引缓冲区
        const indexBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.STATIC_DRAW);

        // 索引缓冲区
        const indexBuffer3 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer3);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices3), gl.STATIC_DRAW);
        
        // 索引缓冲区
        const indexBuffer4 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer4);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices4), gl.STATIC_DRAW);

        // 索引缓冲区
        const indexBuffer5 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer5);
        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices5), gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            index0: indexBuffer0,
            index1: indexBuffer1,
            index2: indexBuffer2,
            index3: indexBuffer3,
            index4: indexBuffer4,
            index5: indexBuffer5,
            normal: normalBuffer,
            TextCoord: TextureBuffer,
        }
    }

    static initOneCube(gl, center, size, color) {
        const positions = [];
        const colors = [];
        const indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];
        {
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);

            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);

            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);

            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);

            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);

            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            colors.push(color[0], color[1], color[2], color[3]);
        }
        const normals = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
        ]);
        const buffers = Tools.initBuffers(gl, positions, colors, indices, normals);
        return buffers;
    }

    static initTextCube(gl, center, size) {
        const positions = [];
        {
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);

            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);

            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);

            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);

            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] + size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);

            positions.push(center[0] + size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] + size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] + size[1] / 2); positions.push(center[2] - size[2] / 2);
            positions.push(center[0] - size[0] / 2); positions.push(center[1] - size[1] / 2); positions.push(center[2] - size[2] / 2);
        }
        const normals = new Float32Array([
            // front face
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // right face
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // top face
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // left face
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,

            // bottom face
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // back face
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0
        ]);

        const TextCoord = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ];
        
        const indices0 = [0, 1, 2, 0, 2, 3]; // front face
        const indices1 = [16, 17, 18, 16, 18, 19]; // right face
        const indices2 = [8, 9, 10, 8, 10, 11]; //top face
        const indices3 = [20, 21, 22, 20, 22, 23]; // left face
        const indices4 = [12, 13, 14, 12, 14, 15]; // bottom face
        const indices5 = [4, 5, 6, 4, 6, 7]; // back face

        const buffers = Tools.initTextBuffers(gl, positions, indices0, indices1, indices2, indices3, indices4, indices5, normals, TextCoord);
        return buffers;
    }

    static initTextures(gl, filepath, index) {
        var texture = gl.createTexture(); // Create texture
        var image = new Image(); // Create a image
        image.onload = function () { Tools.loadTexture(gl, texture, image, index); };
        image.src = filepath;
        return true;
    }

    static loadTexture(gl, texture, image, index) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        if (index == 0) gl.activeTexture(gl.TEXTURE0);
        if (index == 1) gl.activeTexture(gl.TEXTURE1);
        if (index == 2) gl.activeTexture(gl.TEXTURE2);
        if (index == 3) gl.activeTexture(gl.TEXTURE3);
        if (index == 4) gl.activeTexture(gl.TEXTURE4);
        if (index == 5) gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      }

    static draw(gl, programInfo, buffers, modelMatrix, viewMatrix, projectionMatrix, lightColor, lightPosition, eye, ambientLight, roughness, fresnel) {
        //为webGL设置从缓冲区抽取位置数据的属性值，将其放入着色器信息
        {
            const numComponents = 3;//每次取出3个数值
            const type = gl.FLOAT;//取出数据为浮点数类型
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }
        //为webGL设置从缓冲区抽取法向量数据的属性值，将其放入着色器信息
        {
            const numComponents = 3;//每次取出3个数值
            const type = gl.FLOAT;//取出数据为浮点数类型
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.normal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.normal);
        }
        //为webGL设置从缓冲区抽取颜色数据的属性值，将其放入着色器信息
        {
            const numComponents = 4;//每次取出4个数值
            const type = gl.FLOAT;//取出数据为浮点数类型
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

        //webGL使用此程序进行绘制
        gl.useProgram(programInfo.program);

        // 设置着色器的uniform型变量
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.viewMatrix,
            false,
            viewMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelMatrix,
            false,
            modelMatrix);
        const reverseModelMat = mat4.create();
        mat4.invert(reverseModelMat, modelMatrix);
        mat4.transpose(reverseModelMat, reverseModelMat);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.reverseModelMatrix,
            false,
            reverseModelMat);
        gl.uniform3fv(
            programInfo.uniformLocations.lightColor,
            lightColor);
        gl.uniform3fv(
            programInfo.uniformLocations.lightPosition,
            lightPosition);
        gl.uniform3fv(
            programInfo.uniformLocations.eyePosition,
            eye);
        gl.uniform3fv(
            programInfo.uniformLocations.ambient,
            ambientLight);
        gl.uniform1f(
            programInfo.uniformLocations.roughness,
            roughness);
        gl.uniform1f(
            programInfo.uniformLocations.fresnel,
            fresnel);
        {
            const offset = 0;
            const type = gl.UNSIGNED_SHORT;
            const vertexCount = buffers.indices.length;
            //按连续的三角形方式以此按点绘制
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    static draw_text(gl, programInfo, buffers, modelMatrix, viewMatrix, projectionMatrix, lightColor, lightPosition, eye, ambientLight, roughness, fresnel, Rotation) {
        // 旋转动作
        mat4.rotate(modelMatrix,  // destination matrix
            modelMatrix,  // matrix to rotate
            Rotation,     // amount to rotate in radians
            [0, 1, 0]);       // axis to rotate around (Y));
        //为webGL设置从缓冲区抽取位置数据的属性值，将其放入着色器信息
        {
            const numComponents = 3;//每次取出3个数值
            const type = gl.FLOAT;//取出数据为浮点数类型
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }
        //为webGL设置从缓冲区抽取法向量数据的属性值，将其放入着色器信息
        {
            const numComponents = 3;//每次取出3个数值
            const type = gl.FLOAT;//取出数据为浮点数类型
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.normal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.normal);
        }
        //为webGL设置从缓冲区抽取纹理坐标数据的属性值，将其放入着色器信息
        {
            const numComponents = 2;//每次取出2个数值
            const type = gl.FLOAT;//取出数据为浮点数类型
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.TextCoord);
            gl.vertexAttribPointer(
              programInfo.attribLocations.TextCoord,
              numComponents,
              type,
              normalize,
              stride,
              offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.TextCoord);
        }

        //webGL使用此程序进行绘制
        gl.useProgram(programInfo.program);

        // 设置着色器的uniform型变量
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.viewMatrix,
            false,
            viewMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelMatrix,
            false,
            modelMatrix);
        const reverseModelMat = mat4.create();
        mat4.invert(reverseModelMat, modelMatrix);
        mat4.transpose(reverseModelMat, reverseModelMat);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.reverseModelMatrix,
            false,
            reverseModelMat);
        gl.uniform3fv(
            programInfo.uniformLocations.lightColor,
            lightColor);
        gl.uniform3fv(
            programInfo.uniformLocations.lightPosition,
            lightPosition);
        gl.uniform3fv(
            programInfo.uniformLocations.eyePosition,
            eye);
        gl.uniform3fv(
            programInfo.uniformLocations.ambient,
            ambientLight);
        gl.uniform1f(
            programInfo.uniformLocations.roughness,
            roughness);
        gl.uniform1f(
            programInfo.uniformLocations.fresnel,
            fresnel);
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index0);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index1);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index2);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index3);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index4);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index5);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
    }
    
    static setModelMatrix(translation, rotation) {
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix,     // destination matrix
          modelMatrix,     // matrix to translate
          translation);  // amount to translate
        mat4.rotate(modelMatrix,  // destination matrix
          modelMatrix,  // matrix to rotate
          rotation.rad,     // amount to rotate in radians
          rotation.axis);       // axis to rotate around (Z)
        return modelMatrix;
    }

    static setProjectionMatrix(gl) {
        const fieldOfView = 60 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix,
          fieldOfView,
          aspect,
          zNear,
          zFar);
        return projectionMatrix;
    }

    static allClear(gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
  export default Tools