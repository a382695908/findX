class CreateBox extends CreateSky{
    protected _boxInfo : any = {};
    protected _boxBak  : any = {};
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
        this.textureComplete();
        super.onView3DInitComplete();
    }


    private textureComplete() {
        var lightGroup: egret3d.LightGroup = new egret3d.LightGroup();
        var directLight: egret3d.DirectLight = new egret3d.DirectLight(new egret3d.Vector3D(100, 100, 100));
        directLight.diffuse = 0xaaaaaa;
        lightGroup.addDirectLight(directLight);

        var rnd: number = Math.floor( Math.random() * this._boxCnt );

        for (var idx:number = 0; idx < this._boxCnt; ++idx){
            var box : egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, (e: egret3d.Event3D) => this.onPickupBox(e));
            //box.addEventListener(egret3d.Event3D.TOUCH_START, (e: egret3d.Event3D) => this.onPickupBox(e));
            box.material.lightGroup = lightGroup;
            this._view3D.addChild3D(box);

            if ( idx == rnd ){
                aw.CharTexture.createCharTexture(64, 64, "夭", '60px 楷体', 'rgba(255, 0, 0, 1)', 'rgba(200, 200, 200, 1)', 'rgba(255, 0, 0, 1)', 3);
            }
            else{
                aw.CharTexture.createCharTexture(64, 64, "天", '60px 楷体', 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 255, 1)', 3);
            }

            box.material.diffuseTexture = aw.CharTexture.texture;

            var bi = {"box" : box, 'id': box.id, 'idx': idx };


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


            this._boxInfo[box.id] = bi;
            this._boxBak[box.id]  = bi;
        }

        this._cameraCtl.setEyesLength(3000);
    }

    protected onUpdate(): void {
        super.onUpdate();
        for(var id in this._boxInfo ){
            var bi = this._boxInfo[id];
            if ( bi == null ) continue;

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

    protected onPickupBox(e: egret3d.Event3D): void {
        console.log("click obj");
        if ( this._boxInfo[ e.currentTarget.id ] == null ){
            this._boxInfo[ e.currentTarget.id ] = this._boxBak[ e.currentTarget.id ];
            console.log("obj is empty:" + e.currentTarget.id);
            console.log();
        }
        else{
            this._boxInfo[ e.currentTarget.id ] = null;
            console.log("got obj:" + e.currentTarget.id);
        }
    }
} 
