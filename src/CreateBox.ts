class CreateBox extends CreateSky{
    protected _boxInfo : any = {};
    protected _boxBak  : any = {};
    protected _boxCnt : number = 12;
    protected _mspeed : number = 1;
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
        directLight.diffuse = 0xFFFFFF;
        lightGroup.addDirectLight(directLight);

        var rnd: number = Math.floor( Math.random() * this._boxCnt );

        for (var idx:number = 0; idx < this._boxCnt; ++idx){
            var box : egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.mousePickEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, (e: egret3d.Event3D) => this.onPickupBox(e));
            box.addEventListener(egret3d.Event3D.TOUCH_START, (e: egret3d.Event3D) => this.onPickupBox(e));
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

            bi['moveX']     = (Math.random()*2-1) * this._mspeed;
            bi['moveY']     = (Math.random()*2-1) * this._mspeed;
            bi['moveZ']     = (Math.random()*2-1) * this._mspeed;
            if (bi['moveX']==0) {bi['moveX']= this._mspeed;};
            if (bi['moveY']==0) {bi['moveY']= this._mspeed;};
            if (bi['moveZ']==0) {bi['moveZ']= this._mspeed;};

            bi['rotationX'] = (Math.random()*2-1) * this._rspeed;
            bi['rotationY'] = (Math.random()*2-1) * this._rspeed;
            bi['rotationZ'] = (Math.random()*2-1) * this._rspeed;

            bi['box'].rotationX = bi['rotationX'];
            bi['box'].rotationY = bi['rotationY'];
            bi['box'].rotationZ = bi['rotationZ'];

            this._boxInfo[box.id] = bi;
            this._boxBak[box.id]  = bi;
        }

        aw.CharTexture.createCharTexture(128,128,"测试.", "32px 宋体", "rgba(255,0,0,1)", "rgba(0,0,0,0)", "rgba(0,0,0,0)", 0);
        var hud: egret3d.HUD = new egret3d.HUD();
        hud.texture = aw.CharTexture.texture;
        this._view3D.addHUD( hud );

        this._cameraCtl.setEyesLength(3000);
    }

    protected onUpdate(): void {
        super.onUpdate();
        return;
        for(var id in this._boxInfo ){
            var bi = this._boxInfo[id];
            if ( bi == null ) continue;

            bi['box'].rotationX += bi['rotationX'];
            bi['box'].rotationY += bi['rotationY'];
            bi['box'].rotationZ += bi['rotationZ'];

            bi['box'].x += bi['moveX'];
            bi['box'].y += bi['moveY'];
            bi['box'].z += bi['moveZ'];

            if ( bi['box'].x < -this._width || bi['box'].x > this._width ){
                bi['moveX'] = -bi['moveX']
            }
            if ( bi['box'].y < -this._height || bi['box'].y > this._height ){
                bi['moveY'] = -bi['moveY']
            }
            if ( bi['box'].z < -this._depth || bi['box'].z > this._depth ){
                bi['moveZ'] = -bi['moveZ']
            }
        }
    }

    protected onPickupBox(e: egret3d.Event3D): void {
        if ( this._boxInfo[ e.currentTarget.id ] == null ){
            this._boxInfo[ e.currentTarget.id ] = this._boxBak[ e.currentTarget.id ];
        }
        else{
            this._boxInfo[ e.currentTarget.id ] = null;
        }
    }
} 
