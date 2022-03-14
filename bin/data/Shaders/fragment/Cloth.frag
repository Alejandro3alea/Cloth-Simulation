#version 400 core

#define LIGHT_NUM_MAX 7

// --------------------- IN ---------------------
in OUT_IN_VARIABLES {
	vec2 texUV;
	vec3 fragPos;
	vec3 tan_lightPos[LIGHT_NUM_MAX];
	vec3 tan_viewPos;
	vec3 tan_surfacePos;
	vec3 normal;
} inVar;

// --------------------- OUT --------------------
out vec4 FragColor;

void main()
{
    FragColor = vec4(inVar.texUV, 0.0, 1.0);
}