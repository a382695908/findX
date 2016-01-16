var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CreateBox = (function (_super) {
    __extends(CreateBox, _super);
    function CreateBox() {
        _super.call(this);
        this._dtDriver = null;
        this._boxInfo = {};
        this._boxBak = {};
        this._xBoxIds = [];
        this._width = 600;
        this._height = 800;
        this._depth = 400;
        this._hudW = 128;
        this._hudH = 128;
        this._hudFont = "24px 宋体";
        this._hudAlign = "left";
        this._hudColor = "rgba(255,0,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
        this._hudBgColor = "rgba(0,0,0,0)";
        this._hudFrmBgColor = "rgba(0,0,0,0)";
        this._hudFrmW = 0;
        this._boxTxtureW = 64;
        this._boxTxtureH = 64;
        this._boxTxtureFont = "60px 楷体";
        this._boxTxtureAlign = "center";
        this._boxTxtureColor = "rgba(0,0,255,1)";
        this._boxTxtureBgColor = "rgba(200,200,200,1)";
        this._boxTxtureFrmBgColor = "rgba(0,0,255,1)";
        this._boxTxtureFrmW = 3;
        this._width = this._viewPort.width;
        this._height = this._viewPort.height;
        this._depth = this._viewPort.width;
        this._dtDriver = new aw.FindXDataDriver();
    }
    Object.defineProperty(CreateBox.prototype, "dataDrive", {
        get: function () {
            return this._dtDriver;
        },
        enumerable: true,
        configurable: true
    });
    CreateBox.prototype.onView3DInitComplete = function () {
        this.textureComplete();
        _super.prototype.onView3DInitComplete.call(this);
        confirm(this._dtDriver.startTips);
    };
    CreateBox.prototype.textureComplete = function () {
        var _this = this;
        var lightGroup = new egret3d.LightGroup();
        var directLight = new egret3d.DirectLight(new egret3d.Vector3D(100, 100, 100));
        directLight.diffuse = 0xAAAAAA;
        lightGroup.addDirectLight(directLight);
        for (var idx = 0; idx < this._dtDriver.totalObjCnt; ++idx) {
            var box = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, function (e) { return _this.onPickupBox(e); });
            box.addEventListener(egret3d.Event3D.TOUCH_START, function (e) { return _this.onPickupBox(e); });
            box.material.lightGroup = lightGroup;
            this._view3D.addChild3D(box);
            if (this._xBoxIds.length < this._dtDriver.XObjCnt) {
                aw.CharTexture.createCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsFind, this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
                this._xBoxIds.push(box.id);
            }
            else {
                var n = Math.random() > 0.5 ? 1 : 0;
                aw.CharTexture.createCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsPool[n], this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
            }
            box.material.diffuseTexture = aw.CharTexture.texture;
            var bi = { "box": box, 'id': box.id, 'idx': idx };
            bi['moveX'] = (Math.random() * 2 - 1) * this._dtDriver.moveSpeed;
            bi['moveY'] = (Math.random() * 2 - 1) * this._dtDriver.moveSpeed;
            bi['moveZ'] = (Math.random() * 2 - 1) * this._dtDriver.moveSpeed;
            if (bi['moveX'] == 0) {
                bi['moveX'] = this._dtDriver.moveSpeed;
            }
            ;
            if (bi['moveY'] == 0) {
                bi['moveY'] = this._dtDriver.moveSpeed;
            }
            ;
            if (bi['moveZ'] == 0) {
                bi['moveZ'] = this._dtDriver.moveSpeed;
            }
            ;
            bi['rotationX'] = (Math.random() * 2 - 1) * this._dtDriver.rotateSpeed;
            bi['rotationY'] = (Math.random() * 2 - 1) * this._dtDriver.rotateSpeed;
            bi['rotationZ'] = (Math.random() * 2 - 1) * this._dtDriver.rotateSpeed;
            bi['box'].rotationX = bi['rotationX'];
            bi['box'].rotationY = bi['rotationY'];
            bi['box'].rotationZ = bi['rotationZ'];
            this._boxInfo[box.id] = bi;
            this._boxBak[box.id] = bi;
        }
        this._hud = new egret3d.HUD();
        var lostTime = this._time - this._dtDriver.startTime;
        var tips = " 目标:" + this._dtDriver.charsFind + "\n 计时:" + (Math.floor(lostTime / 100) / 10).toString()
            + "\n 等级:" + this._dtDriver.level.toString() + "\n 积分:" + this._dtDriver.points;
        aw.CharTexture.createCharTexture(this._hudW, this._hudH, tips, this._hudAlign, this._hudFont, this._hudColor, this._hudBgColor, this._hudFrmBgColor, this._hudFrmW);
        this._hud.texture = aw.CharTexture.texture;
        this._view3D.addHUD(this._hud);
        this._cameraCtl.setEyesLength(3500);
    };
    CreateBox.prototype.onUpdate = function () {
        _super.prototype.onUpdate.call(this);
        this._dtDriver.update();
        if (!this._dtDriver.IsRunning) {
            switch (this._dtDriver.OverReason) {
                case aw.GameOverReason.USER_WIN:
                    alert("恭喜， 你成功了!");
                    break;
                case aw.GameOverReason.TIME_OVER:
                    alert("Time lost all, Game Over!");
                    break;
                case aw.GameOverReason.USER_FAILED:
                    alert("哈哈， you are a loser!");
                    break;
                default:
                    alert(":(， something wrong!");
                    ;
            }
            if (true === confirm(this._dtDriver.startTips)) {
                this.dataDrive.startGame();
                console.log("Start game again.");
            }
            else {
                console.log("Give up play again, leave away.");
            }
            return;
        }
        for (var id in this._boxInfo) {
            var bi = this._boxInfo[id];
            if (bi == null)
                continue;
            bi['box'].rotationX += bi['rotationX'];
            bi['box'].rotationY += bi['rotationY'];
            bi['box'].rotationZ += bi['rotationZ'];
            bi['box'].x += bi['moveX'];
            bi['box'].y += bi['moveY'];
            bi['box'].z += bi['moveZ'];
            if (bi['box'].x < -this._width || bi['box'].x > this._width) {
                bi['moveX'] = -bi['moveX'];
            }
            if (bi['box'].y < -this._height || bi['box'].y > this._height) {
                bi['moveY'] = -bi['moveY'];
            }
            if (bi['box'].z < -this._depth || bi['box'].z > this._depth) {
                bi['moveZ'] = -bi['moveZ'];
            }
        }
        var tips = " 目标:" + this._dtDriver.charsFind + "\n 计时:" + (this._dtDriver.lostSeconds10 / 10).toString()
            + "\n 等级:" + this._dtDriver.level.toString() + "\n 积分:" + this._dtDriver.points;
        aw.CharTexture.createCharTexture(this._hudW, this._hudH, tips, this._hudAlign, this._hudFont, this._hudColor, this._hudBgColor, this._hudFrmBgColor, this._hudFrmW);
        this._hud.texture = aw.CharTexture.texture;
    };
    CreateBox.prototype.onPickupBox = function (e) {
        if (this._boxInfo[e.currentTarget.id] == null) {
            this._boxInfo[e.currentTarget.id] = this._boxBak[e.currentTarget.id];
        }
        else {
            for (var idx = 0; idx < this._xBoxIds.length; idx++) {
                if (e.currentTarget.id == this._xBoxIds[idx]) {
                    this._boxInfo[e.currentTarget.id] = null;
                    this._dtDriver.addPickedXCnt();
                    this._dtDriver.updatePoints();
                    break;
                }
            }
        }
    };
    return CreateBox;
})(CreateSky);
