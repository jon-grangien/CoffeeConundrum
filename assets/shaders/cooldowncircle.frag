precision highp float;

varying vec2 vTextureCoord;
uniform float u_angle;
uniform vec2 u_resolution;
uniform vec2 u_screenSize;
uniform float u_radius;

vec2 resolution = vec2(1.0, 1.0);

void main() {
    vec2 uv = vTextureCoord / vec2(u_radius / u_screenSize.x, u_radius / u_screenSize.y);
    float centerDistance = distance(uv, vec2(0.5, 0.5));

    if (centerDistance < 0.5 ) {
        gl_FragColor = vec4(0.2, 0.8, 0.2, 1.0);
        return;
    }

    // Debug
    else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
}
