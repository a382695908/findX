var CreateView3D = (function () {
    function CreateView3D(width, height) {
        var _this = this;
        if (width === void 0) { width = 800; }
        if (height === void 0) { height = 600; }
        this._time = 0;
        this._delay = 0;
        this._timeDate = null;
        this._view3D = null;
        this._viewPort = null;
        this._cameraCtl = null;
        this._viewPort = new egret3d.Rectangle(0, 0, width, height);
        egret3d.Egret3DDrive.requstContext3D(DeviceUtil.getGPUMode, this._viewPort, function () { return _this.onInit3D(); });
    }
    var d = __define,c=CreateView3D,p=c.prototype;
    p.onInit3D = function () {
        var _this = this;
        this._view3D = new egret3d.View3D(this._viewPort);
        this._cameraCtl = new egret3d.LookAtController(this._view3D.camera3D, new egret3d.Object3D());
        this._cameraCtl.setEyesLength(1000);
        this.onView3DInitComplete();
        this._time = new Date().getTime();
        requestAnimationFrame(function () { return _this.onUpdate(); });
    };
    p.onView3DInitComplete = function () {
    };
    p.onUpdate = function () {
        var _this = this;
        this._timeDate = new Date();
        this._delay = this._timeDate.getTime() - this._time;
        this._time = this._timeDate.getTime();
        this._cameraCtl.update();
        this._view3D.renden(this._time, this._delay);
        requestAnimationFrame(function () { return _this.onUpdate(); });
    };
    return CreateView3D;
})();
egret.registerClass(CreateView3D,'CreateView3D');
