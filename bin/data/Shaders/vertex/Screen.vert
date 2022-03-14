#version 430 core

layout (location = 0) in vec3 vPos;
layout (location = 2) in vec2 vTexCoords;

// --------------------- OUT ---------------------
out vec2 texUV;

void main()
{
	texUV = vTexCoords;
	gl_Position = vec4(vPos, 1.0f);
}