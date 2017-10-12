precision highp float;

varying vec2 vTextureCoord;
uniform float u_angle;
uniform vec2 u_resolution;
uniform vec2 u_screenSize;
uniform float u_radius;

vec2 resolution = vec2(1.0, 1.0);
vec3 full_green = vec3(0.2, 0.8, 0.2);
vec3 filling_color = vec3(0.8, 0.4, 0.1);
float pi = 3.1415926;
float to_degrees = 57.2958; // 180 / pi

void main() {
    vec2 uv = vTextureCoord / vec2(u_radius / u_screenSize.x, u_radius / u_screenSize.y);
    float centerDistance = distance(uv, vec2(0.5, 0.5));

    // Rotate the coordinates 90 degrees counter clockwise because
    // we want to see the circle rotate based on upwards being 0/100%.
    // Reflect about y-axis to see clockwise spin
    float sin_factor = sin(-pi/2.0);
    float cos_factor = cos(-pi/2.0);
    uv = vec2(uv.x - 0.5, uv.y - 0.5);                                  // translate to origin
    uv = mat2(cos_factor, sin_factor, -sin_factor, cos_factor) * uv;    // rotate
    uv = vec2(uv.x, -uv.y);                                             // simple relfection
    uv = vec2(uv.x + 0.5, uv.y + 0.5);                                  // translate back

    // Frag is in circle
    if (centerDistance < 0.5 ) {

        // Circle full
        if (u_angle >= 359.5) {
            gl_FragColor = centerDistance > 0.43 ? vec4(1.0) : vec4(full_green, 1.0); // white border
            return;
        }

        //
        //
        //     c   ---|
        //      ---   |  a
        //  _==_______|
        //      b
        //
        float a = abs(uv.y - 0.5);
        float b = abs(uv.x - 0.5);
        float c = sqrt((a * a) + (b * b));

        float c_angle = asin(a/c);       // computed angle (rad) of pixel in unit circle
        c_angle = c_angle * to_degrees;  // convert to degrees

        if (uv.x < 0.5 && uv.y > 0.5)    // 2nd quadrant
            c_angle = 180.0 - c_angle;
        if (uv.x < 0.5 && uv.y <= 0.5)   // 3rd quadrant
            c_angle = 180.0 + c_angle;
        if (uv.x > 0.5 && uv.y < 0.5)    // 4th quadrant
            c_angle = 360.0 - c_angle;

        // Frag contained in angle
        if (c_angle > u_angle) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.2);
        }
        else {
            float color_factor = u_angle / 360.0;
            gl_FragColor = vec4(mix(filling_color, full_green, smoothstep(0.0, 1.0, color_factor)), 1.0);
        }

        return;
    }
}
