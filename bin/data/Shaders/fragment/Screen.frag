#version 430 core

// --------------------- IN ---------------------
in vec2 texUV;

// --------------------- OUT --------------------
out vec4 FragColor;

// ------------------- UNIFORM ------------------
layout(location = 0) uniform sampler2D uTextureData;

void main()
{
	FragColor = vec4(texture(uTextureData, texUV).rgb, 1.0);
}