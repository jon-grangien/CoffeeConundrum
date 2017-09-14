precision highp float;

varying vec2 vTextureCoord;
uniform vec2 u_resolution;
uniform vec2 u_screenSize;
uniform float u_radius;
uniform float u_time;

vec2 resolution = vec2(1.0, 1.0);

void main() {
    vec2 uv = vTextureCoord / vec2(u_radius / u_screenSize.x, u_radius / u_screenSize.y);

    //vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float centerDistance = distance(uv, vec2(0.5, 0.5));

    float variance = 0.03 * sin(0.03 * u_time);

    if (centerDistance - variance < 0.5) {
        gl_FragColor = vec4(0.7, 0.5, 0.8, 1.0);
        return;
    }

    //else {
    //    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    //    return;
    //}
}
