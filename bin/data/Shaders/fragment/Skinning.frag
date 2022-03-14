#version 400 core

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1
#define SPOT_LIGHT 2

#define LIGHT_NUM_MAX 7

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

struct Material
{
	vec4 color;
	sampler2D diffuse;
	sampler2D normal;
	sampler2D specular;
	sampler2D oclussion;
	sampler2D emissive;
	
	bool isUsingSampler;
	bool isUsingNormalSampler;
	bool isUsingSpecularSampler;
};

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

// ------------------- UNIFORM ------------------
uniform Light uLight[LIGHT_NUM_MAX];
uniform int uLightNum;

uniform vec3 uViewPos;

uniform Material uMaterial;

uniform bool uUsingNormals;

void main()
{
	vec3 diffuseTexel = uMaterial.isUsingSampler ? texture(uMaterial.diffuse, inVar.texUV).rgb : uMaterial.color.rgb;
	vec3 specularTexel = uMaterial.isUsingSpecularSampler ? vec3(texture(uMaterial.specular, inVar.texUV).b) : vec3(1,1,1);
	vec3 normalTexel = texture(uMaterial.normal, inVar.texUV).rgb;
	normalTexel = normalize(normalTexel * 2.0f - 1.0f);
	vec3 currNormal = uMaterial.isUsingNormalSampler ? normalTexel : inVar.normal;
	vec3 fragPos = uMaterial.isUsingNormalSampler ? inVar.tan_surfacePos : inVar.fragPos;
	vec3 viewPos = uMaterial.isUsingNormalSampler ? inVar.tan_viewPos : uViewPos;

	vec3 finalColor = vec3(0.0f, 0.0f, 0.0f);
   
	if (!uUsingNormals)
	{
		FragColor = vec4(diffuseTexel, 1.0);
		return;
	}

	for (int i = 0; i < uLightNum; i++)
	{
		vec3 lightPos = uMaterial.isUsingNormalSampler ? inVar.tan_lightPos[i] : uLight[i].position;

		// ambient
		vec3 ambient = uLight[i].ambient.rgb * diffuseTexel;
  		
		// diffuse
		vec3 lightDir = normalize(lightPos - fragPos);
		float diff = max(dot(lightDir, currNormal), 0.0);
		vec3 diffuse = diff * uLight[i].diffuse.rgb * diffuseTexel;

		// specular
		vec3 viewDir = normalize(viewPos - fragPos);
		vec3 reflectDir = reflect(-lightDir, currNormal);
		vec3 halfwayDir = normalize(lightDir + viewDir);  
		float spec = pow(max(dot(currNormal, halfwayDir), 0.0), 32.0);

		vec3 specular = spec * uLight[i].specular.rgb * specularTexel;
		
		finalColor += ambient + diffuse + specular;
	}
    
    FragColor = vec4(finalColor, 1.0);
}