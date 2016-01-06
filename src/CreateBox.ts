class CreateBox extends CreateSky{
    protected _boxInfo : any = {};
    protected _boxCnt : number = 12;
    protected _mspeed : number = 10;
    protected _rspeed : number = 1;

    protected _width  : number = 600;
    protected _height : number = 600;
    protected _depth  : number = 600;

    public constructor() {
        super();
    }

    protected onView3DInitComplete(): void {
        super.onView3DInitComplete();

        var textureLoad: egret3d.TextureLoader = new egret3d.TextureLoader("resource/chars/chars.jpg");
        textureLoad.addEventListener(egret3d.Event3D.EVENT_LOAD_COMPLETE,(e: egret3d.Event3D) => this.textureComplete(e));
        textureLoad.load();
    }


    private textureComplete(e: egret3d.Event3D) {
        var loader: egret3d.TextureLoader = <egret3d.TextureLoader>e.data; 

        var lightGroup: egret3d.LightGroup = new egret3d.LightGroup();
        var directLight: egret3d.DirectLight = new egret3d.DirectLight(new egret3d.Vector3D(80, 80, 80));
        directLight.diffuse = 0xaaaaaa;
        lightGroup.addDirectLight(directLight);

        for (var idx = 0; idx < this._boxCnt; ++idx){
            var box : egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            var bi = {"box" : box };
            bi['box'].isCheckBox = true;
            bi['box'].material.diffuseTexture = loader.texture;

            bi['moveX']     = Math.random() * this._mspeed + 1;
            bi['moveY']     = Math.random() * this._mspeed + 1;
            bi['moveZ']     = Math.random() * this._mspeed + 1;

            bi['rotationX'] = Math.random() * this._rspeed + 1;
            bi['rotationY'] = Math.random() * this._rspeed + 1;
            bi['rotationZ'] = Math.random() * this._rspeed + 1;


            bi['box'].rotationX = bi['rotationX']*10;
            bi['box'].rotationY = bi['rotationY']*10;
            bi['box'].rotationZ = bi['rotationZ']*10;

            bi['box'].moveRight(   (Math.random() * 2 - 1) * this._width/2 );
            bi['box'].moveUp(      (Math.random() * 2 - 1) * this._height/2 );
            bi['box'].moveForward( (Math.random() * 2 - 1) * this._depth/2 );

            box.material.lightGroup = lightGroup;
            this._view3D.addChild3D(box);

            this._boxInfo[idx] = bi;
        }


        this._cameraCtl.setEyesLength(3000);
    }

    protected onUpdate(): void {
        super.onUpdate();
        for(var idx in this._boxInfo ){
            var bi = this._boxInfo[idx];

            //bi['box'].rotationX += bi['rotationX'];
            //bi['box'].rotationY += bi['rotationY'];
            //bi['box'].rotationZ += bi['rotationZ'];

            bi['box'].moveRight( bi['moveX'] );
            bi['box'].moveUp( bi['moveY'] );
            bi['box'].moveForward( bi['moveY'] );

            if ( bi['box'].x < -this._width || bi['box'].x > this._width ){
                bi['moveX'] = -bi['moveX']
            }
            if ( bi['box'].y < -this._height || bi['box'].y > this._height ){
                bi['moveY'] = -bi['moveY']
            }
            if ( bi['box'].x < -this._depth || bi['box'].x > this._depth ){
                bi['moveZ'] = -bi['moveZ']
            }
        }
    }
} 
