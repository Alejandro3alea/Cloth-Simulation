#version 400 core

layout (location = 0) in vec3 vPos;

// ------------------- UNIFORM -------------------
uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

// --------------------- OUT ---------------------

void main()
{
    gl_Position = proj * view * model * vec4(vPos, 1.0);
}