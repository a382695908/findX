class CreateBaseEnv {
    protected _time: number = 0;
    protected _delay: number = 0;
    protected _timeDate: Date = null;
    protected _timeStart:Date = new Date();
    protected _view3D: egret3d.View3D = null;
    protected _viewPort: egret3d.Rectangle = null;
    protected _camera3D: egret3d.Camera3D = null;
    protected _cameraCtl: egret3d.LookAtController = null;
    //protected _cameraCtl: egret3d.HoverController = null;

    protected _boxTexture : egret3d.SkyTexture;
    protected _starTexture: egret3d.TextureBase = null;
    protected _woodTexture: egret3d.TextureBase = null;
    protected _resizeTime: number = -1;

    public constructor() {
        this.initView();
        egret3d.AssetsManager.getInstance().addEventListener(egret3d.Event3D.EVENT_LOAD_PROGRESS, (e: egret3d.Event3D) => this.progress(e));

        this._viewPort = new egret3d.Rectangle(0, 0, document.body.clientWidth ,document.body.clientHeight);
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode, this._viewPort, () => this.onInit3D());
    }

    public removeLoadingBar(){
        let ui = document.getElementById("mask");
        if ( ui ) {
            document.body.style.backgroundColor = "#000000";
            //console.log("remove:");
            //console.log(ui);
            document.body.removeChild(ui);
            console.log("Remove loading mask ok.");

            let cvses = document.getElementsByTagName("canvas");
            for(let idx = 0; idx < cvses.length; idx++ ) {
                //if ( document.getElementById("egret3D") ){
                if ( cvses[idx].getAttribute('id') == "egret3D" ){
                    document.getElementById("egret3D").style["pointer-events"] = "none";
                }
                else{
                    //console.log("remove:");
                    //console.log(cvses[idx]);
                    cvses[idx].parentNode.removeChild(cvses[idx]);
                }
            }

            let div = document.getElementsByClassName("egret-player");
			div[0]['style']['height'] = "100%";	
        }
        else{
            console.warn("Loading mask was not there.");
        }
    }

    private progress(e: egret3d.Event3D) {
        let loading = document.getElementById("loading");
        let progressDiv = document.getElementById("loadingtiao");
        let percent = egret3d.AssetsManager.getInstance().loadCompleteNumber / egret3d.AssetsManager.getInstance().loadTotalNumber;
		if ( loading && progressDiv ) {
			console.log("loading progress:" + percent.toFixed(4) );
        	let value = Math.floor(percent * 100);
        	let width = Math.floor(loading.clientWidth * percent);

        	(document.getElementById("percent")).innerHTML = "Loading......" + (value > 100 ? 100 : value) + "% ......";

        	progressDiv.style.width = (width > loading.clientWidth ? loading.clientWidth : width) + 'px';
			if ( percent >= 1) { 
				//setTimeout(() => this.removeLoadingBar(),600);
			 }
		}
		else{
			console.log("loading progress:" + percent.toFixed(4) + ", but UI not ready.");
		}
    }

    private initView(): void {
        let w = document.body.clientWidth;
        let mask = document.createElement("div");
        mask.id = "mask";
        mask.style.position = "absolute";
        mask.style.width = "100%";
        mask.style.height = "100%";
        mask.style.backgroundColor = "#545454";
        mask.style.zIndex = '100';
        document.body.appendChild(mask)

        let div = document.createElement("div");
        div.id = "loading";
        div.style.position = 'absolute';
        div.style.width = w * 0.5 + "px";
        div.style.top = '40%';
        div.style.left = (w - w * 0.5) * 0.5 + "px";

        document.body.style.backgroundColor = "#545454";
        mask.appendChild(div);

        let loadingcao = document.createElement("div");
        loadingcao.id = "loadingcao";
        loadingcao.style.borderRadius = "15px 15px 15px 15px";
        loadingcao.style.backgroundColor = '#404040';
        loadingcao.style.width = div.clientWidth + 'px';
        loadingcao.style.height = '5px';
        loadingcao.style.position = 'absolute';
        loadingcao.style.top = 100 + 'px';

        let loadingtiao = document.createElement("div");
        loadingtiao.id = "loadingtiao";
        loadingtiao.style.borderRadius = "15px 15px 15px 15px";
        loadingtiao.style.backgroundColor = '#ffffff';
        loadingtiao.style.height = '5px';
        loadingtiao.style.position = 'absolute';
        loadingtiao.style.top = 100 + 'px';


        let textWidth = 150;
        let percent = document.createElement("div");
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

    }

    protected onResize() {
        if(this._resizeTime == -1) {
            this._resizeTime = setTimeout(() => this.setResize(),300);
        }
    }

    private setResize() {
        clearTimeout(this._resizeTime);
        this._resizeTime = -1;
        this._view3D.resize(0,0, document.body.clientWidth, document.body.clientHeight);
        this.Resize(document.body.clientWidth, document.body.clientHeight);

        var w = document.body.clientWidth;

        var mask = document.getElementById("mask");
        if(mask) {
            var div = document.getElementById("loading");
            div.style.width = w * 0.5 + "px";
            div.style.top = "40%";
            div.style.left = (w - w * 0.5) * 0.5 + "px";
        }
    }
    protected Resize(w: number, h: number ) {}; // 用于子类重载，实现业务层的UI变动

    protected onInit3D(): void {
        this._camera3D = new egret3d.Camera3D(egret3d.CameraType.perspective);
        this._camera3D.fieldOfView = 65;
        this._view3D = new egret3d.View3D(this._viewPort, this._camera3D);
        window.addEventListener("resize",() => this.onResize());

        this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        //this._cameraCtl.eyesPosition = new egret3d.Vector3D(0, 0, -this._view3D.width * 2);
        this._cameraCtl.lookAtPosition = new egret3d.Vector3D(0, 0, 0);
        this._cameraCtl.setEyesLength(3000);

        //this._cameraCtl = new egret3d.HoverController(this._view3D.camera3D,null,0,30);
        //this._cameraCtl.distance = 1500;

        egret3d.AssetsManager.getInstance().setRootURL("resource/");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/bk.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/fr.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/lf.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/rt.jpg");
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/up.jpg"); // 只支持Y轴旋转，不需要顶／底纹理
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/dn.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("star64.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("wood64.jpg");
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky.jpg");

        egret3d.AssetsManager.getInstance().addEventListener(egret3d.Event3D.EVENT_LOAD_COMPLETE,(e: egret3d.Event3D) => this.onLoadComplete(e));
        egret3d.AssetsManager.getInstance().startLoad();

    }


    protected onView3DInitComplete(): void {
    }

    protected onLoadComplete(e: egret3d.Event3D): void {
        setTimeout(this.removeLoadingBar, 1000);
	

        let sky_f: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/fr.jpg");
        let sky_b: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/bk.jpg");
        let sky_l: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/lf.jpg");
        let sky_r: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/3/rt.jpg");
        // 只支持Y轴旋转，不需要顶／底纹理
        //let sky_u: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/up.jpg"); 
        //let sky_d: egret3d.TextureBase = egret3d.AssetsManager.getInstance().findTexture("sky/dn.jpg");
        let skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(sky_f,sky_b,sky_l,sky_r,sky_l,sky_r);
        let sky: egret3d.Sky = new egret3d.Sky(skyTexture);
        this._view3D.sky = sky;

        this._woodTexture = egret3d.AssetsManager.getInstance().findTexture("wood64.jpg");
        this._starTexture = egret3d.AssetsManager.getInstance().findTexture("star64.jpg");

        this.onView3DInitComplete();

        this._time = new Date().getTime();
        requestAnimationFrame(() => this.onUpdate());
    }
    
    protected onUpdate(): void {

        this._timeDate = new Date();

        this._delay = this._timeDate.getTime() - this._time;

        this._time = this._timeDate.getTime();

        this._cameraCtl.update();

        this._view3D.update(this._time, this._delay);

        requestAnimationFrame(() => this.onUpdate());
    }
}
