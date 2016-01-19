class CreateBaseEnv {
    protected _time: number = 0;
    protected _delay: number = 0;
    protected _timeDate: Date = null;
    protected _timeStart:Date = new Date();
    protected _view3D: egret3d.View3D = null;
    protected _viewPort: egret3d.Rectangle = null;
    protected _cameraCtl: egret3d.LookAtController = null;

    protected _boxTexture : egret3d.SkyTexture;

    public constructor() {
        this._viewPort = new egret3d.Rectangle(0, 0, document.body.clientWidth ,document.body.clientHeight - 20);
        //if ( document.getElementById("egret3D") != "undefined" ){
            document.getElementById("egret3D").style["pointer-events"] = "none";
        //}
    
        //this._viewPort = new egret3d.Rectangle(0, 0, 300, 400);
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode, this._viewPort, () => this.onInit3D());
    }

    protected onInit3D(): void {
        this._view3D = new egret3d.View3D(this._viewPort);

        this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        this._cameraCtl.setEyesLength(1000);

        this.onView3DInitComplete();

        egret3d.AssetsManager.getInstance().setRootURL("resource/");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/cloudy_noon_BK.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/cloudy_noon_FR.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/cloudy_noon_LF.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/cloudy_noon_RT.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/cloudy_noon_UP.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/cloudy_noon_DN.png");
        egret3d.AssetsManager.getInstance().addEventListener(egret3d.Event3D.EVENT_LOAD_COMPLETE,(e: egret3d.Event3D) => this.onLoadComplete(e));
        egret3d.AssetsManager.getInstance().startLoad();
    }

    protected onView3DInitComplete(): void {
    }

    protected onLoadComplete(e: egret3d.Event3D): void {

        var sky_f: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/cloudy_noon_FR.png");
        var sky_b: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/cloudy_noon_BK.png");
        var sky_l: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/cloudy_noon_LF.png");
        var sky_r: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/cloudy_noon_RT.png");
        var sky_u: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/cloudy_noon_UP.png");
        var sky_d: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/cloudy_noon_DN.png");
        var skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(sky_f,sky_b,sky_l,sky_r,sky_u,sky_d);
        var sky: egret3d.Sky = new egret3d.Sky(skyTexture);
        this._view3D.sky = sky;

        this._time = new Date().getTime();
        requestAnimationFrame(() => this.onUpdate());
    }
    
    protected onUpdate(): void {

        this._timeDate = new Date();

        this._delay = this._timeDate.getTime() - this._time;

        this._time = this._timeDate.getTime();

        this._cameraCtl.update();

        this._view3D.renden(this._time, this._delay);

        requestAnimationFrame(() => this.onUpdate());
    }
}
