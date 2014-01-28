require([
    "libs/text!shaders/vertex-shader.glsl",
    "libs/text!shaders/fragment-shader.glsl",
    "libs/text!shaders/state-fragment-shader.glsl",
    // "libs/text!shaders/simplex-noise-2D.glsl"
],

function ( VertexShader, FragmentShader, StateFragmentShader ) {

    "use strict";

    var camera, renderer;
    var uniforms, geometry, material, mesh, scene;
    var colorMaterial, colorMesh, colorScene;
    var initStateMaterial, initStateMesh, initStateScene, 
        stateMaterial, stateMesh, stateScene;

    var colorMapPing, colorMapPong,
        stateMapPing, stateMapPong;
    var isInitialized = false;

    init();

    function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set(0, 0, 1);
        camera.lookAt(new THREE.Vector3(0,0,-1));

        scene = new THREE.Scene();
        colorScene = new THREE.Scene();
        initStateScene = new THREE.Scene();
        stateScene = new THREE.Scene();

        colorMapPing = new THREE.WebGLRenderTarget( 
            window.innerWidth,
            window.innerHeight,
            { 
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );

        colorMapPong = new THREE.WebGLRenderTarget( 
            window.innerWidth,
            window.innerHeight,
            { 
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );

        stateMapPing = new THREE.WebGLRenderTarget( 
            window.innerWidth,
            window.innerHeight,
            { 
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );

        stateMapPong = new THREE.WebGLRenderTarget( 
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
            colorMap: { type: "t", value: colorMapPing },
            stateMap: { type: "t", value: stateMapPing }
        };

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: VertexShader,
            fragmentShader: FragmentShader
        });

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        var colorTexture = new THREE.ImageUtils.loadTexture("textures/color-map-init.jpg", {}, function () {
            colorMaterial = new THREE.MeshBasicMaterial({map:colorTexture});

            colorMesh = new THREE.Mesh( geometry, colorMaterial );
            colorScene.add( colorMesh );

            var stateTexture = new THREE.ImageUtils.loadTexture("textures/state-map-init.jpg", {}, function () {

                initStateMaterial = new THREE.MeshBasicMaterial({map:stateTexture});

                initStateMesh = new THREE.Mesh( geometry, initStateMaterial );
                initStateScene.add( initStateMesh );

                stateMaterial = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: VertexShader,
                    fragmentShader: StateFragmentShader
                });

                stateMesh = new THREE.Mesh( geometry, stateMaterial );
                stateScene.add( stateMesh );

                animate();
            });
        });

        var c = document.getElementById("canvas");
        renderer = new THREE.WebGLRenderer({canvas: c});
        // renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0xffffff, 1);
        // document.body.appendChild( renderer.domElement );
    }

    function animate() {

        requestAnimationFrame( animate );

        if(!isInitialized) {

            renderer.render( colorScene, camera, colorMapPing, true );
            renderer.render( initStateScene, camera, stateMapPing, true );

            isInitialized = true;
        }

        // ping-ponging
        var pingOrPong = uniforms.time.value % 2.0;

        var fromColorMap = pingOrPong ? colorMapPong : colorMapPing;
        var toColorMap = pingOrPong ? colorMapPing : colorMapPong;

        var fromStateMap = pingOrPong ? stateMapPong : stateMapPing;
        var toStateMap = pingOrPong ? stateMapPing : stateMapPong;

        uniforms.colorMap.value = fromColorMap;
        uniforms.stateMap.value = fromStateMap;

        // update state (velocity/pressure) map
        renderer.render( stateScene, camera, toStateMap, true );

        // update color map
        renderer.render( scene, camera, toColorMap, true );

        // render to screen
        renderer.render( scene, camera );
        uniforms.time.value += 1.0;
    }

});



