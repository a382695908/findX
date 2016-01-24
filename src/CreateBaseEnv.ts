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
        this.initView();
		this.progress(5, 100);
    }
	private GoGameInit():void {
		this.progress(8, 100);
        let loading = null;
        let progressDiv = null;
		while (loading == null || progressDiv == null) {
        	loading = document.getElementById("loading");
        	progressDiv = document.getElementById("loadingtiao");
		}
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode, this._viewPort, () => this.onInit3D());
		this.progress(10, 100);
	}
	
    public remove(){
        var ui = document.getElementById("mask");
        document.body.style.backgroundColor = "#000000";
        document.body.removeChild(ui);

        if ( document.getElementById("egret3D") ){
            document.getElementById("egret3D").style["pointer-events"] = "none";
        }
    }
    private progress(up:number, down:number) {
        let loading = document.getElementById("loading");
        let progressDiv = document.getElementById("loadingtiao");
        let percent = up/down;
		if ( loading && progressDiv ) {
			console.log("loading progress:" + percent);
        	let value = Math.floor(percent * 100);
        	let width = Math.floor(loading.clientWidth * percent);

        	(document.getElementById("percent")).innerHTML = "Loading......" + (value > 100 ? 100 : value) + "% ......";

        	progressDiv.style.width = (width > loading.clientWidth ? loading.clientWidth : width) + 'px';
			if ( up >= down) { 
				setTimeout(() => this.remove(),300);
			 }
		}
		else{
			console.log("loading progress:" + percent + ", but UI not ready.");
		}
    }

    private initView(): void {
        var w = document.body.clientWidth;
        var mask = document.createElement("div");
        mask.id = "mask";
        mask.style.position = "absolute";
        mask.style.width = "100%";
        mask.style.height = "100%";
        mask.style.backgroundColor = "#545454";
        mask.style.zIndex = '100';
        document.body.appendChild(mask)
        document.body.appendChild(mask)

        var div = document.createElement("div");
        div.id = "loading";
        div.style.position = 'absolute';
        div.style.width = w * 0.5 + "px";
        div.style.top = '40%';
        div.style.left = (w - w * 0.5) * 0.5 + "px";

        document.body.style.backgroundColor = "#545454";
        mask.appendChild(div);

        var loadingcao = document.createElement("div");
        loadingcao.id = "loadingcao";
        loadingcao.style.borderRadius = "15px 15px 15px 15px";
        loadingcao.style.backgroundColor = '#404040';
        loadingcao.style.width = div.clientWidth + 'px';
        loadingcao.style.height = '5px';
        loadingcao.style.position = 'absolute';
        loadingcao.style.top = 100 + 'px';

        var loadingtiao = document.createElement("div");
        loadingtiao.id = "loadingtiao";
        loadingtiao.style.borderRadius = "15px 15px 15px 15px";
        loadingtiao.style.backgroundColor = '#ffffff';
        loadingtiao.style.height = '5px';
        loadingtiao.style.position = 'absolute';
        loadingtiao.style.top = 100 + 'px';


        var textWidth = 150;
        var percent = document.createElement("div");
        percent.id = "percent";
        percent.style.width = textWidth + "px";
        percent.style.color = "#000000";
        percent.style.position = 'absolute';
        percent.style.left = (div.clientWidth - textWidth) * .5 + "px";
        percent.style.top = 140 + 'px';
        percent.style.textShadow = "#fff 1px 0 2px,#fff 0 1px 2px,#fff -1px 0 2px,#fff 0 -1px 2px";

        div.appendChild(loadingcao);
        div.appendChild(loadingtiao);
        div.appendChild(percent);

		console.log("progress bar init ok");

		this.GoGameInit(); 
    }

    protected onInit3D(): void {
		this.progress(15, 100);
		while ( this._viewPort == null ){
		};
		this.progress(20, 100);
        this._view3D = new egret3d.View3D(this._viewPort);

        this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        this._cameraCtl.eyesPosition = new egret3d.Vector3D(0, 0, -this._view3D.width * 2);
        this._cameraCtl.lookAtPosition = new egret3d.Vector3D(0, 0, 0);
        //this._cameraCtl.setEyesLength(4000);

		this.progress(22, 100);

        this.onView3DInitComplete();

		this.progress(24, 100);
        egret3d.AssetsManager.getInstance().setRootURL("resource/");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/bk.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/fr.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/lf.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/rt.png");
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/up.png"); // 只支持Y轴旋转，不需要顶／底纹理
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/dn.png");
        egret3d.AssetsManager.getInstance().addLoadTexture("star64.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("wood64.jpg");
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky.jpg");

		this.progress(26, 100);

        egret3d.AssetsManager.getInstance().addEventListener(egret3d.Event3D.EVENT_LOAD_COMPLETE,(e: egret3d.Event3D) => this.onLoadComplete(e));
        egret3d.AssetsManager.getInstance().startLoad();

		this.progress(50, 100);
    }

    protected onView3DInitComplete(): void {
    }

    protected onLoadComplete(e: egret3d.Event3D): void {
		this.progress(70, 100);

        let sky_f: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/fr.png");
        let sky_b: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/bk.png");
        let sky_l: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/lf.png");
        let sky_r: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/rt.png");
        let sky_u: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/up.png"); // 只支持Y轴旋转，不需要顶／底纹理
        //let sky_d: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/dn.png");
		this.progress(75, 100);
        let skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(sky_f,sky_b,sky_l,sky_r,sky_l,sky_r);
        let sky: egret3d.Sky = new egret3d.Sky(skyTexture);
        this._view3D.sky = sky;
		this.progress(80, 100);

        this._woodTexture = egret3d.AssetsManager.getInstance().findTexture("wood64.jpg");
        this._starTexture = egret3d.AssetsManager.getInstance().findTexture("star64.jpg");
		this.progress(85, 100);

        //let sky: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky.jpg");
        //let skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(sky,sky,sky,sky,sky,sky);
        //let sky_txtr: egret3d.Sky = new egret3d.Sky(skyTexture);
        //this._view3D.sky = sky_txtr;
		this.progress(90, 100);

        this._time = new Date().getTime();
        requestAnimationFrame(() => this.onUpdate());
		this.progress(100, 100);

        //this.remove();
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
