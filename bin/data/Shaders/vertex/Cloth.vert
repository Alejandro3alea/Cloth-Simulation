#version 400 core

layout (location = 0) in vec3 vPos;
layout (location = 1) in vec2 vTexCoord;
layout (location = 2) in vec3 vNormal;
layout (location = 3) in vec4 vTangent;

#define LIGHT_NUM_MAX 7

// --------------------- OUT ---------------------
out OUT_IN_VARIABLES {
	vec2 texUV;
	vec3 fragPos;
	vec3 tan_lightPos[LIGHT_NUM_MAX];
	vec3 tan_viewPos;
	vec3 tan_surfacePos;
	vec3 normal;
} outVar;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

void main()
{
	outVar.texUV = vTexCoord;
    gl_Position = proj * view * model * vec4(vPos, 1.0);
}