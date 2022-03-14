#version 400 core

layout (location = 0) in vec3 vPos;
layout (location = 1) in vec3 vNormal;
layout (location = 2) in vec2 vTexCoord;
layout (location = 3) in vec4 vTangent;
layout (location = 4) in vec4 vJoints;
layout (location = 5) in vec4 vWeights;

#define LIGHT_NUM_MAX 7
#define BONE_NUM_MAX  100

struct Light {

    int type;

    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    
    vec3 position;

	float spot_falloff;
	float spot_innerAngle;
	float spot_outerAngle;

	float const_Att;
	float linear_Att;
	float quadratic_Att;
};

// ------------------- UNIFORM -------------------
uniform Light uLight[LIGHT_NUM_MAX];
uniform int uLightNum;

uniform mat4 uBoneMtx[BONE_NUM_MAX];
uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

uniform vec3 uViewPos;
// --------------------- OUT ---------------------
out OUT_IN_VARIABLES {
	vec2 texUV;
	vec3 fragPos;
	vec3 tan_lightPos[LIGHT_NUM_MAX];
	vec3 tan_viewPos;
	vec3 tan_surfacePos;
	vec3 normal;
} outVar;

void main()
{
    outVar.fragPos = vec3(model * vec4(vPos, 1.0));   
    mat3 normalMatrix = transpose(inverse(mat3(model)));
    outVar.normal = vNormal;   
    outVar.texUV = vTexCoord;
    
    vec3 T = normalize(normalMatrix * vTangent.rgb);
    vec3 N = normalize(normalMatrix * vNormal);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T) * vTangent.w;
    
    mat3 TBN = transpose(mat3(T, B, N));
	
	for (int i = 0; i < uLightNum; i++)
		outVar.tan_lightPos[i] = TBN * uLight[i].position;


    outVar.tan_viewPos	  = TBN * uViewPos;
    outVar.tan_surfacePos = TBN * outVar.fragPos;
    
    ivec4 joints = ivec4(vJoints.x, vJoints.y, vJoints.z, vJoints.w);
    mat4 skinMtx = vWeights.x * uBoneMtx[joints.x] + vWeights.y * uBoneMtx[joints.y] + vWeights.z * uBoneMtx[joints.z] + vWeights.w * uBoneMtx[joints.w];

    vec4 totalPosition = vec4(0.0f);
    for(int i = 0 ; i < 4 ; i++)
    {
        if(joints[i] == -1) 
            continue;

        vec4 localPosition = uBoneMtx[joints[i]] * vec4(vPos, 1.0f);
        totalPosition += localPosition * vWeights[i];
        //vec3 localNormal = mat3(uBoneMtx[joints[i]]) * norm;
    }
        
    mat4 viewModel = view * model;
    gl_Position = proj * viewModel * totalPosition;
    
}