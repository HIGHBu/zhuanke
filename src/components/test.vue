<template>
<div>
    <canvas id="glcanvas" width="640" height="480"></canvas>
</div>
</template>

<script>
    import Tool from "../lib/tools";

    export default {
        data() {
            return {};
        },
        mounted() {
            //无纹理顶点着色器
            const vsSource = `
                attribute vec4 aVertexColor; //颜色属性，用四维向量表示（第四维无意义，用于计算）
                attribute vec4 aVertexPosition; //位置属性，用四维向量表示（第四维无意义，用于计算）
                attribute vec4 aNormal; //法向量

                uniform mat4 uProjectionMatrix;  //投影矩阵，用于定位投影
                uniform mat4 uViewMatrix;  //视角矩阵，用于定位观察位置
                uniform mat4 uModelMatrix;  //模型矩阵，用于定位模型位置
                uniform mat4 uReverseModelMatrix; //模型矩阵的逆转置

                varying vec4 v_Color;       //颜色varying类变量,用于向片段着色器传递颜色属性
                varying vec3 v_Normal;
                varying vec4 v_Position;

                void main() {
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;  //点坐标位置
                //法向量进行归一化
                v_Normal = normalize(vec3(uReverseModelMatrix * aNormal));
                //变化后的坐标 -> 世界坐标
                v_Position = uModelMatrix * aVertexPosition;
                v_Color = aVertexColor;        //点的颜色
                }
            `;

            //定义无纹理片段着色器
            const fsSource = `
                precision mediump float;
                uniform vec3 uLightColor; //光颜色强度
                uniform vec3 uLightPosition; //光源位置
                uniform vec3 uEyePosition;  //观察位置
                uniform vec3 uAmbientLight; // 环境光
                uniform float roughness;
                uniform float fresnel;//镜面反射的两个参数 
                
                varying vec3 v_Normal;
                varying vec4 v_Position;
                varying vec4 v_Color;

                float beckmannDistribution(
                    float ndoth,
                    float m){
                        float val=exp((ndoth*ndoth - 1.0)/(m*m*ndoth*ndoth))/(3.14159265*m*m*ndoth*ndoth*ndoth*ndoth);
                        return max(val,0.0);
                }
                float cookTorranceSpecular(
                    vec3 lightDirection,
                    vec3 viewDirection,
                    vec3 surfaceNormal,
                    float roughness,
                    float fresnel){
                        float VdotN = max(dot(viewDirection,surfaceNormal),0.0);
                        float LdotN = max(dot(lightDirection,surfaceNormal),0.0);

                        //Half angle vector
                        vec3 H= normalize(lightDirection + viewDirection);

                        //Geometric term
                        float NdotH = max(dot(surfaceNormal,H),0.0);
                        float VdotH = max(dot(viewDirection,H),0.000001);
                        float x = 2.0 * NdotH / VdotH;
                        float G= min(1.0,min(x * VdotN ,x * LdotN));

                        //Distribution term
                        float D= beckmannDistribution(NdotH,roughness);

                        //Fresnel term
                        float F=pow(1.0 - VdotN,fresnel);

                        //Multiply terms and done
                        return G*F*D / max(3.14159265 *VdotN *LdotN, 0.000001);
                }
                void main() {
                    //视线方向并归一化
                    vec3 viewDirection = normalize(uEyePosition - vec3(v_Position));
                    //光线方向并归一化
                    vec3 lightDirection = normalize(uLightPosition - vec3(v_Position));
                    //计算cos入射角 当角度大于90 说明光照在背面 赋值为0
                    float nDotLight = max(dot(lightDirection, v_Normal), 0.0);
                    //计算漫反射光颜色
                    vec3 diffuse = uLightColor * v_Color.rgb * nDotLight;
                    // 环境反射光颜色
                    vec3 ambient = uAmbientLight * v_Color.rgb;
                    float power = cookTorranceSpecular(
                        lightDirection,
                        viewDirection,
                        v_Normal,
                        roughness,
                        fresnel);
                    vec3 temp=diffuse + ambient;
                    temp[0]=max(temp[0]+power,0.0);
                    temp[1]=max(temp[1]+power,0.0);
                    temp[2]=max(temp[2]+power,0.0);
                    gl_FragColor = vec4(temp, v_Color.a);
                }
            `;

            //定义纹理顶点着色器
            const vsSource_text = `
                attribute vec4 aVertexColor; //颜色属性，用四维向量表示（第四维无意义，用于计算）
                attribute vec4 aVertexPosition; //位置属性，用四维向量表示（第四维无意义，用于计算）
                attribute vec4 aNormal; //法向量
                attribute vec2 aTextCoord; //纹理

                uniform mat4 uProjectionMatrix;  //投影矩阵，用于定位投影
                uniform mat4 uViewMatrix;  //视角矩阵，用于定位观察位置
                uniform mat4 uModelMatrix;  //模型矩阵，用于定位模型位置
                uniform mat4 uReverseModelMatrix; //模型矩阵的逆转置

                varying vec3 v_Normal;
                varying vec4 v_Position;
                varying vec2 v_TextCoord;

                void main() {
                    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;  //点坐标位置
                    //法向量进行归一化
                    v_Normal = normalize(vec3(uReverseModelMatrix * aNormal));
                    //变化后的坐标 -> 世界坐标
                    v_Position = uModelMatrix * aVertexPosition;
                    v_TextCoord = aTextCoord;
                }
            `;

            //定义纹理片段着色器
            const fsSource_text = `
                precision mediump float;
                uniform sampler2D uSampler;
                uniform vec3 uLightColor; //光颜色强度
                uniform vec3 uLightPosition; //光源位置
                uniform vec3 uEyePosition;  //观察位置
                uniform vec3 uAmbientLight; // 环境光
                uniform float roughness;
                uniform float fresnel;//镜面反射的两个参数 
                
                varying vec3 v_Normal;
                varying vec4 v_Position;
                varying vec2 v_TextCoord;
            
                float beckmannDistribution(
                    float ndoth,
                    float m){
                        float val=exp((ndoth*ndoth - 1.0)/(m*m*ndoth*ndoth))/(3.14159265*m*m*ndoth*ndoth*ndoth*ndoth);
                        return max(val,0.0);
                }
                float cookTorranceSpecular(
                    vec3 lightDirection,
                    vec3 viewDirection,
                    vec3 surfaceNormal,
                    float roughness,
                    float fresnel){
                        float VdotN = max(dot(viewDirection,surfaceNormal),0.0);
                        float LdotN = max(dot(lightDirection,surfaceNormal),0.0);
            
                        //Half angle vector
                        vec3 H= normalize(lightDirection + viewDirection);
            
                        //Geometric term
                        float NdotH = max(dot(surfaceNormal,H),0.0);
                        float VdotH = max(dot(viewDirection,H),0.000001);
                        float x = 2.0 * NdotH / VdotH;
                        float G= min(1.0,min(x * VdotN ,x * LdotN));
            
                        //Distribution term
                        float D= beckmannDistribution(NdotH,roughness);
            
                        //Fresnel term
                        float F=pow(1.0 - VdotN,fresnel);
            
                        //Multiply terms and done
                        return G*F*D / max(3.14159265 *VdotN *LdotN, 0.000001);
                }
                void main() {
                    //纹理作为颜色传入
                    vec4 v_Color=texture2D(uSampler,v_TextCoord);
                    //视线方向并归一化
                    vec3 viewDirection = normalize(uEyePosition - vec3(v_Position));
                    //光线方向并归一化
                    vec3 lightDirection = normalize(uLightPosition - vec3(v_Position));
                    //计算cos入射角 当角度大于90 说明光照在背面 赋值为0
                    float nDotLight = max(dot(lightDirection, v_Normal), 0.0);
                    //计算漫反射光颜色
                    vec3 diffuse = uLightColor * v_Color.rgb * nDotLight;
                    // 环境反射光颜色
                    vec3 ambient = uAmbientLight * v_Color.rgb;
                    float power = cookTorranceSpecular(
                        lightDirection,
                        viewDirection,
                        v_Normal,
                        roughness,
                        fresnel);
                    vec3 temp=diffuse + ambient;
                    gl_FragColor = vec4(temp, v_Color.a);
                }
            `;

            //获取上下文对象
            const canvas = document.querySelector("#glcanvas");
            const gl = canvas.getContext("webgl");
            //检测WebGL支持
            if (!gl) {
                console.error("浏览器不支持WebGL");
                return;
            }
            const shaderProgram = Tool.initShaderProgram(gl, vsSource, fsSource);
            const shaderProgram_text = Tool.initShaderProgram(gl, vsSource_text, fsSource_text);
            
            //收集着色器程序会用到的所有信息
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                    vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
                    normal: gl.getAttribLocation(shaderProgram, 'aNormal'),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                    viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
                    modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
                    reverseModelMatrix: gl.getUniformLocation(shaderProgram, 'uReverseModelMatrix'),
                    lightColor: gl.getUniformLocation(shaderProgram, 'uLightColor'),
                    eyePosition: gl.getUniformLocation(shaderProgram, 'uEyePosition'),
                    lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
                    ambient: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
                    roughness: gl.getUniformLocation(shaderProgram, 'roughness'),
                    fresnel: gl.getUniformLocation(shaderProgram, 'fresnel'),
                },
            };

            //收集纹理着色器程序会用到的所有信息
            const programInfo_text = {
                program: shaderProgram_text,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram_text, 'aVertexPosition'),
                    normal: gl.getAttribLocation(shaderProgram_text, 'aNormal'),
                    TextCoord: gl.getAttribLocation(shaderProgram_text, 'aTextCoord'),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram_text, 'uProjectionMatrix'),
                    viewMatrix: gl.getUniformLocation(shaderProgram_text, 'uViewMatrix'),
                    modelMatrix: gl.getUniformLocation(shaderProgram_text, 'uModelMatrix'),
                    reverseModelMatrix: gl.getUniformLocation(shaderProgram_text, 'uReverseModelMatrix'),
                    Sampler: gl.getUniformLocation(shaderProgram_text, 'uSampler'),
                    lightColor: gl.getUniformLocation(shaderProgram_text, 'uLightColor'),
                    eyePosition: gl.getUniformLocation(shaderProgram_text, 'uEyePosition'),
                    lightPosition: gl.getUniformLocation(shaderProgram_text, 'uLightPosition'),
                    ambient: gl.getUniformLocation(shaderProgram_text, 'uAmbientLight'),
                    roughness: gl.getUniformLocation(shaderProgram_text, 'roughness'),
                    fresnel: gl.getUniformLocation(shaderProgram_text, 'fresnel'),
                },
            };

            var cube_center = [0, 0, 0];
            var size = [2.0 , 3.5, 2.0];
            var color = [0.0, 0.0, 0.0, 1.0]; // Black
            var rotation = new Object();
            rotation.rad = 0;
            rotation.axis = [0, 0, 1];
            var roughness = 0.3;
            var fresnel = 0.2;
            var eye = [0, 0, 6];
            var target = [0, 0, 0];
            var up = [0, 2, 0];

            const cubeBuffer = Tool.initOneCube(gl, cube_center, size, color);
            const cubeTextBuffer = Tool.initTextCube(gl, cube_center, size);
            Tool.initTextures(gl,"webgl/front.png", 0);
            Tool.initTextures(gl,"webgl/right.png", 1);
            Tool.initTextures(gl,"webgl/up.png", 2);
            Tool.initTextures(gl,"webgl/left.png", 3);
            Tool.initTextures(gl,"webgl/down.png", 4);
            Tool.initTextures(gl,"webgl/back.png", 5);
            Tool.allClear(gl);

            var Rotation = 0.0;
            var then = 0;
            // Draw the scene repeatedly
            function render(now) {
                now *= 0.001;  // convert to seconds
                const deltaTime = now - then;
                then = now;
                Rotation += deltaTime;

                var lightColor = vec3.fromValues(1.0, 1.0, 1.0);
                var ambientLight = vec3.fromValues(1.0, 1.0, 1.0);
                var lightPosition = vec3.fromValues(0.0, 0.0, 0.0);
                var viewMatrix = mat4.create();
                mat4.lookAt(viewMatrix, eye, target, up);

                const modelMatrix = Tool.setModelMatrix([0, 0, 0], rotation);
                const modelMatrix_text = Tool.setModelMatrix([0, 0, 0], rotation);
                const projectionMatrix = Tool.setProjectionMatrix(gl);
                requestAnimationFrame(render);
                // Tool.draw(gl, programInfo, cubeBuffer, modelMatrix, viewMatrix, projectionMatrix, lightColor, lightPosition, eye, ambientLight, roughness, fresnel);
                Tool.draw_text(gl, programInfo_text, cubeTextBuffer, modelMatrix_text, viewMatrix, projectionMatrix, lightColor, lightPosition,  eye, ambientLight, roughness, fresnel, Rotation);
            }
            requestAnimationFrame(render);
        }
    };
</script>

<style scoped>
</style>