class CreateView3D {
    protected _time: number = 0;
    protected _delay: number = 0;
    protected _timeDate: Date = null;
    protected _timeStart:Date = new Date();
    protected _view3D: egret3d.View3D = null;
    protected _viewPort: egret3d.Rectangle = null;
    protected _cameraCtl: egret3d.LookAtController = null;

    protected _boxTexture : egret3d.SkyTexture;

    public constructor() {
        //this._viewPort = new egret3d.Rectangle(0, 0, document.body.clientWidth ,document.body.clientHeight - 20);
        this._viewPort = new egret3d.Rectangle(0, 0, 600, 800);
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode, this._viewPort, () => this.onInit3D());
    }

    protected onInit3D(): void {
        this._view3D = new egret3d.View3D(this._viewPort);

        this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        this._cameraCtl.setEyesLength(1000);

        this.onView3DInitComplete();
        this._time = new Date().getTime();
        requestAnimationFrame(() => this.onUpdate());
    }

    protected onView3DInitComplete(): void {
        let fimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t1");
        let bimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t2");
        let limg:HTMLImageElement = <HTMLImageElement>document.getElementById("t3");
        let rimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t4");
        let uimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t5");
        let dimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t6");

        let front:egret3d.TextureBase = new egret3d.TextureBase(); front.imageData= fimg;
        let back:egret3d.TextureBase  = new egret3d.TextureBase(); back.imageData = bimg;
        let left:egret3d.TextureBase  = new egret3d.TextureBase(); left.imageData = limg;
        let right:egret3d.TextureBase = new egret3d.TextureBase(); right.imageData= rimg;
        let up:egret3d.TextureBase    = new egret3d.TextureBase(); up.imageData   = uimg;
        let down:egret3d.TextureBase  = new egret3d.TextureBase(); down.imageData = dimg;
        let skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(front, back,
                                                                    left, right,
                                                                    up, down);
        this._view3D.sky = new egret3d.Sky(skyTexture);
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
