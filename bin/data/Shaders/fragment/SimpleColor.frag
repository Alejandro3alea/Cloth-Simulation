#version 400 core

// --------------------- OUT --------------------
out vec4 FragColor;

// ------------------- UNIFORM ------------------
uniform vec3 uColor;

void main()
{
    FragColor = vec4(uColor, 1.0);
}