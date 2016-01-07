var CreateSky = (function (_super) {
    __extends(CreateSky, _super);
    function CreateSky() {
        _super.call(this);
    }
    var d = __define,c=CreateSky,p=c.prototype;
    p.onView3DInitComplete = function () {
        var skyTexture = new egret3d.SkyTexture(document.getElementById("t1"), document.getElementById("t2"), document.getElementById("t3"), document.getElementById("t4"), document.getElementById("t5"), document.getElementById("t6"));
        this._view3D.sky = new egret3d.Sky(skyTexture);
    };
    return CreateSky;
})(CreateView3D);
egret.registerClass(CreateSky,'CreateSky');
