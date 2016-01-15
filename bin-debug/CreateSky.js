var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CreateSky = (function (_super) {
    __extends(CreateSky, _super);
    function CreateSky() {
        _super.call(this);
    }
    CreateSky.prototype.onView3DInitComplete = function () {
        var fimg = document.getElementById("t1");
        var bimg = document.getElementById("t2");
        var limg = document.getElementById("t3");
        var rimg = document.getElementById("t4");
        var uimg = document.getElementById("t5");
        var dimg = document.getElementById("t6");
        var front = new egret3d.TextureBase();
        front.imageData = fimg;
        var back = new egret3d.TextureBase();
        back.imageData = bimg;
        var left = new egret3d.TextureBase();
        left.imageData = limg;
        var right = new egret3d.TextureBase();
        right.imageData = rimg;
        var up = new egret3d.TextureBase();
        up.imageData = uimg;
        var down = new egret3d.TextureBase();
        down.imageData = dimg;
        var skyTexture = new egret3d.SkyTexture(front, back, left, right, up, down);
        this._view3D.sky = new egret3d.Sky(skyTexture);
    };
    return CreateSky;
})(CreateView3D);
