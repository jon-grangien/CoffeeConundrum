precision highp float;

varying vec2 vTextureCoord;
uniform vec2 u_screenSize;
uniform float u_radius;
uniform float u_time;
uniform vec3 u_color_one;
uniform vec3 u_color_two;

float MAX_TIME = 0.49;

//vec3 color_black = vec3(0.0, 0.0, 0.0);
//vec3 color_red = vec3(0.4, 0.0, 0.0);

void main() {
    vec2 uv = vTextureCoord / vec2(u_radius / u_screenSize.x, u_radius / u_screenSize.y);
    float centerDistance = distance(vec2(0.5, 0.5), uv);

    if (u_time > MAX_TIME || centerDistance > 0.5) {
        return;
    }

    if (centerDistance > u_time * 7.0) {
        gl_FragColor = vec4(mix(u_color_one, u_color_two, smoothstep(0.0, 0.7, u_time / MAX_TIME)), 1.0);
    }

    // DEBUG
    // Use with lifespan 2000 in Zap.ts
    //gl_FragColor = vec4(mix(u_color_one, u_color_two, smoothstep(0.0, 1.0, u_time / 1.2)), 1.0);

    return;
}
