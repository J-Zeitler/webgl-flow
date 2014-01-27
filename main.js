require([
    "libs/text!shaders/vertex-shader.glsl",
    "libs/text!shaders/fragment-shader.glsl",
    "libs/text!shaders/init-fragment-shader.glsl",
    "libs/text!shaders/simplex-noise-2D.glsl"
],

function ( VertexShader, FragmentShader, InitFragmentShader, Noise ) {

    "use strict";

    var camera, renderer;
    var uniforms, geometry, material, mesh, scene;
    var initMaterial, initMesh, initScene;
    var directionalLight;
    var map1, map2;
    var isInitialized = false;

    init();

    function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set(0, 0, 1);
        camera.lookAt(new THREE.Vector3(0,0,-1));

        scene = new THREE.Scene();
        initScene = new THREE.Scene();

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
         * mesh
         */     

        geometry = new THREE.PlaneGeometry(3.2, 1.2, 1, 1);
        
        uniforms = {
            time: { type: "f", value: 0.0 },
            map: { type: "t", value: map1 }
        };

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: VertexShader,
            fragmentShader: FragmentShader
        });

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        var texture = new THREE.ImageUtils.loadTexture("colors-texture.jpg", {}, function () {
            initMaterial = new THREE.MeshBasicMaterial({map:texture});

            initMesh = new THREE.Mesh( geometry, initMaterial );
            initScene.add( initMesh );

            animate();
        });

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0xffffff, 1);

        document.body.appendChild( renderer.domElement );
    }

    function animate() {
        requestAnimationFrame( animate );

        if(!isInitialized) {
            // render initial noise texture to map1
            renderer.render( initScene, camera, map1, true );
            isInitialized = true;
        }

        var fromMap = uniforms.time.value % 2.0 ? map2 : map1;
        var toMap = uniforms.time.value % 2.0 ? map1 : map2;

        uniforms.map.value = fromMap;

        // render to texture
        renderer.render( scene, camera, toMap, true );

        // render to screen
        renderer.render( scene, camera );
        uniforms.time.value += 1.0;
    }

});



