#version 440 core

// --------------------- IN ---------------------
in vec3 texUV;

// --------------------- OUT --------------------
layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec4 TestColor;
layout(location = 2) out vec4 BrightColor;

uniform samplerCube uSkybox;

void main()
{
   FragColor = texture(uSkybox, texUV);
   TestColor = vec4(0, 0, texture(uSkybox, texUV).b, 1);
   BrightColor = vec4(0, texture(uSkybox, texUV).g, 0, 1);
}