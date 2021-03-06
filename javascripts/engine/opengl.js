//Initialize an openGL context
function InitializeWebGL(canvas, vsShader, fsShader) {
  gl = null;
  
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}
  
  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }
  
  if(gl){
  	gl.viewportWidth = canvas.width;
  	gl.viewportHeight = canvas.height;
  }  
  
  InitializeShaders(gl, vsShader, fsShader);
  
  return gl;
}

//Initialize shaders
function LoadShader(glCanvas,id)
{
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = glCanvas.createShader(glCanvas.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = glCanvas.createShader(glCanvas.VERTEX_SHADER);
	} else {
		return null;
	}

	glCanvas.shaderSource(shader, str);
	glCanvas.compileShader(shader);

	if (!glCanvas.getShaderParameter(shader, glCanvas.COMPILE_STATUS)) {
		alert(glCanvas.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function InitializeShaders(glCanvas,vsShader, fsShader)
{
	var fragmentShader = LoadShader(glCanvas,fsShader);
	var vertexShader = LoadShader(glCanvas,vsShader);
	
	glCanvas.shaderProgram = glCanvas.createProgram();
	
	glCanvas.attachShader(glCanvas.shaderProgram,vertexShader);
	glCanvas.attachShader(glCanvas.shaderProgram,fragmentShader);
	glCanvas.linkProgram(glCanvas.shaderProgram);
	
	if(!glCanvas.getProgramParameter(glCanvas.shaderProgram,glCanvas.LINK_STATUS)) {
		alert("Could not initialize shaders");
	}
	
	glCanvas.useProgram(glCanvas.shaderProgram);
	
	glCanvas.shaderProgram.vertexPositionAttribute = glCanvas.getAttribLocation(glCanvas.shaderProgram,"aVertexPosition");
	glCanvas.enableVertexAttribArray(glCanvas.shaderProgram.vertexPositionAttribute);
			
	glCanvas.shaderProgram.resolution = gl.getUniformLocation(glCanvas.shaderProgram,"uResolution");
	glCanvas.uniform2f(glCanvas.shaderProgram.resolution,glCanvas.viewportWidth,glCanvas.viewportHeight);
	
	glCanvas.shaderProgram.objects = gl.getUniformLocation(glCanvas.shaderProgram,"objects");
	glCanvas.shaderProgram.objectDefinitions = gl.getUniformLocation(glCanvas.shaderProgram,"objectDefinitions");
	glCanvas.shaderProgram.objectMaterials = gl.getUniformLocation(glCanvas.shaderProgram,"objectMaterials");
	glCanvas.shaderProgram.objectMaterialsExtended = gl.getUniformLocation(glCanvas.shaderProgram,"objectMaterialsExtended");
	
	glCanvas.shaderProgram.lights = gl.getUniformLocation(glCanvas.shaderProgram,"lights");
	glCanvas.shaderProgram.lightMaterials = gl.getUniformLocation(glCanvas.shaderProgram,"lightMaterials");
	
	glCanvas.shaderProgram.numObjects = gl.getUniformLocation(glCanvas.shaderProgram,"numObjects");
	glCanvas.shaderProgram.numLights = gl.getUniformLocation(glCanvas.shaderProgram,"numLights");
	glCanvas.shaderProgram.objectTextureSize = gl.getUniformLocation(glCanvas.shaderProgram,"objectTextureSize");
	glCanvas.shaderProgram.lightTextureSize = gl.getUniformLocation(glCanvas.shaderProgram,"lightTextureSize");
	glCanvas.shaderProgram.antiAliasing = gl.getUniformLocation(glCanvas.shaderProgram,"antiAliasing");
  glCanvas.shaderProgram.lensTexture = gl.getUniformLocation(glCanvas.shaderProgram, "lens");
		
	InitializeResources(glCanvas);
}

function InitializeResources(glCanvas)
{

}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
 // Set the parameters so we can render any size image.
	
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
  //gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}


