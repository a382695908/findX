class CreateSky extends CreateView3D {
    protected _boxTexture : egret3d.SkyTexture;
    public constructor() {
        super();
    }

    protected onView3DInitComplete(): void {
        var fimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t1");
        var bimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t2");
        var limg:HTMLImageElement = <HTMLImageElement>document.getElementById("t3");
        var rimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t4");
        var uimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t5");
        var dimg:HTMLImageElement = <HTMLImageElement>document.getElementById("t6");

        var front:egret3d.TextureBase = new egret3d.TextureBase(); front.imageData= fimg;
        var back:egret3d.TextureBase  = new egret3d.TextureBase(); back.imageData = bimg;
        var left:egret3d.TextureBase  = new egret3d.TextureBase(); left.imageData = limg;
        var right:egret3d.TextureBase = new egret3d.TextureBase(); right.imageData= rimg;
        var up:egret3d.TextureBase    = new egret3d.TextureBase(); up.imageData   = uimg;
        var down:egret3d.TextureBase  = new egret3d.TextureBase(); down.imageData = dimg;
        var skyTexture: egret3d.SkyTexture = new egret3d.SkyTexture(front, back,
                                                                    left, right,
                                                                    up, down);
        this._view3D.sky = new egret3d.Sky(skyTexture);
    }
}
