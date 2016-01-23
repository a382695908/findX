class CreateBaseEnv {
    protected _time: number = 0;
    protected _delay: number = 0;
    protected _timeDate: Date = null;
    protected _timeStart:Date = new Date();
    protected _view3D: egret3d.View3D = null;
    protected _viewPort: egret3d.Rectangle = null;
    protected _cameraCtl: egret3d.LookAtController = null;

    protected _boxTexture : egret3d.SkyTexture;
    protected _starTexture: egret3d.TextureBase = null;
    protected _woodTexture: egret3d.TextureBase = null;

    public constructor() {
        this._viewPort = new egret3d.Rectangle(0, 0, document.body.clientWidth ,document.body.clientHeight);
        if ( document.getElementById("egret3D") ){
            document.getElementById("egret3D").style["pointer-events"] = "none";
        }
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode, this._viewPort, () => this.onInit3D());
    }

    protected onInit3D(): void {
        this._view3D = new egret3d.View3D(this._viewPort);

        this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        this._cameraCtl.setEyesLength(1000);

        this.onView3DInitComplete();

        egret3d.AssetsManager.getInstance().setRootURL("resource/");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/bk.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/fr.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/lf.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/rt.png");
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/up.png"); // 只支持Y轴旋转，不需要顶／底纹理
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/dn.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("star.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("wood64.jpg");
        egret3d.AssetsManager.getInstance().addEventListener(egret3d.Event3D.EVENT_LOAD_COMPLETE,(e: egret3d.Event3D) => this.onLoadComplete(e));
        egret3d.AssetsManager.getInstance().startLoad();
    }

    protected onView3DInitComplete(): void {
    }

    protected onLoadComplete(e: egret3d.Event3D): void {

        let sky_f: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/fr.png");
        let sky_b: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/bk.png");
        let sky_l: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/lf.png");
        let sky_r: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/rt.png");
        //let sky_u: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/up.png"); // 只支持Y轴旋转，不需要顶／底纹理
        //let sky_d: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/dn.png");
        let skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(sky_f,sky_b,sky_l,sky_r,sky_l,sky_r);
        let sky: egret3d.Sky = new egret3d.Sky(skyTexture);
        this._view3D.sky = sky;

        this._woodTexture = egret3d.AssetsManager.getInstance().findTexture("wood64.jpg");
        this._starTexture = egret3d.AssetsManager.getInstance().findTexture("star.jpg");

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
