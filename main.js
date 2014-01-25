require([
    "libs/text!shaders/vertex-shader.glsl",
    "libs/text!shaders/fragment-shader.glsl"
],

function ( VertexShader, FragmentShader ) {

    "use strict";

    var camera, scene, renderer;
    var uniforms, geometry, material, mesh;
    var directionalLight;
    var map1, map2;

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set(0, 0, -1);
        camera.lookAt(new THREE.Vector3(0,0,0));

        scene = new THREE.Scene();

        map1 = new THREE.WebGLRenderTarget( 
            window.innerWidth,
            window.innerHeight,
            { 
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );

        map2 = new THREE.WebGLRenderTarget( 
            window.innerWidth,
            window.innerHeight,
            { 
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );

        /**
         * Water
         */

        geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        
        uniforms = {
            time: { type: "f", value: 1.0 },
            map1: { type: "t", value: map1 },
            map2: { type: "t", value: map2 }
        };

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: VertexShader,
            fragmentShader: FragmentShader
        });

        mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = Math.PI*3/2;
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0xffffff, 1);

        document.body.appendChild( renderer.domElement );
    }

    function animate() {

        requestAnimationFrame( animate );

        uniforms.time.value += 0.02;

        // render to texture
        renderer.render( scene, camera, map2, true );

        // render to screen
        renderer.render( scene, camera );
    }

});