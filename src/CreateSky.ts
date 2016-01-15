class CreateSky extends CreateView3D {
    protected _boxTexture : egret3d.SkyTexture;
    public constructor() {
        super();
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
}
