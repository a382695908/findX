class E3DBaseEnv extends EUIBaseEnv{
    protected _time: number = 0;
    protected _delay: number = 0;
    protected _timeDate: Date = null;
    protected _view3D: egret3d.View3D = null;
    protected _viewPort: egret3d.Rectangle = null;
    protected _camera3D: egret3d.Camera3D = null;
    protected _cameraCtl: CameraHoverController= null;
    //protected _cameraCtl: egret3d.LookAtController = null;

    protected _boxTexture : egret3d.SkyTexture;
    protected _starTexture: egret3d.TextureBase = null;
    protected _woodTexture: egret3d.TextureBase = null;
    protected _timeStart:Date = new Date();
    
    public constructor(width: number = 800,height: number = 600) {
        super();
        this._viewPort = new egret3d.Rectangle(0,0,width,height);
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode,this._viewPort,() => this.onInit3D());
	}
	
    protected onResize(x: number,y: number,width: number,height: number) {
        super.onResize(x,y,width,height);
        this._view3D.resize(0,0,document.body.clientWidth,document.body.clientHeight);
        this.Resize(document.body.clientWidth,document.body.clientHeight);
    }
    protected Resize(w: number,h: number): void{ };
    
    protected onInit3D(): void {
        //创建View3D对象;
        this._camera3D = new egret3d.Camera3D(egret3d.CameraType.perspective);
        this._camera3D.fieldOfView = 65;

        this._view3D = new egret3d.View3D(this._viewPort, this._camera3D);
        window.addEventListener("resize",() => this.resize());
        this.resize();
        Assets.startLoad();
        
        //egret3d.Debug.instance.isDebug = true ;
        egret3d.Debug.instance.trace("open debug...");
        
        window.onerror = function(message,url,line) {
            egret3d.Debug.instance.trace(message.type);
        }

        window.onwaiting = function(e) {
            egret3d.Debug.instance.trace(e.type);
        }
    }
    
    private touchStart(e) {
        alert("11111");
    }
    protected onView3DInitComplete(): void {
    }

    public start3D() {
        //window.addEventListener("touchstart",(e) => this.touchStart(e));

        this._cameraCtl = new CameraHoverController(this._view3D.camera3D,null,45,45,200,8,85);
        this._cameraCtl.useEventDis(this.rect);
        this._cameraCtl.lookAtPosition = new egret3d.Vector3D(0,10,0);
        this._cameraCtl.minDistance = 80;
        this._cameraCtl.maxDistance = 524;

        //this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        //this._cameraCtl.useEventDis(this.rect);
        //this._cameraCtl.lookAtPosition = new egret3d.Vector3D(0, 0, 0);
        //this._cameraCtl.setEyesLength(3000);

        let sky_f: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/fr.jpg");
        let sky_b: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/bk.jpg");
        let sky_l: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/lf.jpg");
        let sky_r: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/rt.jpg");
        // 只支持Y轴旋转，不需要顶／底纹理
        let sky_u: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/up.jpg"); 
        let sky_d: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/dn.jpg");
        let skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(sky_f,sky_b,sky_l,sky_r,sky_l,sky_r);
        let sky: egret3d.Sky = new egret3d.Sky(skyTexture);
        this._view3D.sky = sky;

        this._woodTexture = egret3d.AssetsManager.getInstance().findTexture("wood64.jpg");
        this._starTexture = egret3d.AssetsManager.getInstance().findTexture("star64.jpg");

        this.onView3DInitComplete();
        
        this._timeDate = new Date();
        window.requestAnimationFrame(() => this.onUpdate());
    }

    protected onUpdate(): void {

        this._timeDate = new Date();

        this._delay = this._timeDate.getTime() - this._time;

        this._time = this._timeDate.getTime();

        this._cameraCtl.update();

        this._view3D.update(this._time,this._delay);

        requestAnimationFrame(() => this.onUpdate());
    }
}
