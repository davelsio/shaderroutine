float noise3d( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );

	vec3 u = f*f*(3.0-2.0*f);

  float s1 = dot( hash3d( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) );
  float s2 = dot( hash3d( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) );
  float s3 = dot( hash3d( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) );
  float s4 = dot( hash3d( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) );
  float s5 = dot( hash3d( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) );
  float s6 = dot( hash3d( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) );
  float s7 = dot( hash3d( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) );
  float s8 = dot( hash3d( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) );

  float px1 = mix( s1, s2, u.x);
  float px2 = mix( s3, s4, u.x);
  float px3 = mix( s5, s6, u.x);
  float px4 = mix( s7, s8, u.x);

  return mix( mix( px1, px2, u.y), mix( px3, px4, u.y), u.z );
}
