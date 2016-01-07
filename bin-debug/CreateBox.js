var CreateBox = (function (_super) {
    __extends(CreateBox, _super);
    function CreateBox() {
        _super.call(this);
        this._boxInfo = {};
        this._boxBak = {};
        this._boxCnt = 12;
        this._mspeed = 10;
        this._rspeed = 1;
        this._width = 600;
        this._height = 600;
        this._depth = 600;
    }
    var d = __define,c=CreateBox,p=c.prototype;
    p.onView3DInitComplete = function () {
        this.textureComplete();
        _super.prototype.onView3DInitComplete.call(this);
    };
    p.textureComplete = function () {
        var _this = this;
        var lightGroup = new egret3d.LightGroup();
        var directLight = new egret3d.DirectLight(new egret3d.Vector3D(100, 100, 100));
        directLight.diffuse = 0xaaaaaa;
        lightGroup.addDirectLight(directLight);
        var rnd = Math.floor(Math.random() * this._boxCnt);
        for (var idx = 0; idx < this._boxCnt; ++idx) {
            var box = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, function (e) { return _this.onPickupBox(e); });
            //box.addEventListener(egret3d.Event3D.TOUCH_START, (e: egret3d.Event3D) => this.onPickupBox(e));
            box.material.lightGroup = lightGroup;
            this._view3D.addChild3D(box);
            if (idx == rnd) {
                aw.CharTexture.createCharTexture(64, 64, "夭", '60px 楷体', 'rgba(255, 0, 0, 1)', 'rgba(200, 200, 200, 1)', 'rgba(255, 0, 0, 1)', 3);
            }
            else {
                aw.CharTexture.createCharTexture(64, 64, "天", '60px 楷体', 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 255, 1)', 3);
            }
            box.material.diffuseTexture = aw.CharTexture.texture;
            var bi = { "box": box, 'id': box.id, 'idx': idx };
            bi['moveX'] = Math.random() * this._mspeed + 1;
            bi['moveY'] = Math.random() * this._mspeed + 1;
            bi['moveZ'] = Math.random() * this._mspeed + 1;
            bi['rotationX'] = Math.random() * this._rspeed + 1;
            bi['rotationY'] = Math.random() * this._rspeed + 1;
            bi['rotationZ'] = Math.random() * this._rspeed + 1;
            bi['box'].rotationX = bi['rotationX'] * 10;
            bi['box'].rotationY = bi['rotationY'] * 10;
            bi['box'].rotationZ = bi['rotationZ'] * 10;
            bi['box'].moveRight((Math.random() * 2 - 1) * this._width / 2);
            bi['box'].moveUp((Math.random() * 2 - 1) * this._height / 2);
            bi['box'].moveForward((Math.random() * 2 - 1) * this._depth / 2);
            this._boxInfo[box.id] = bi;
            this._boxBak[box.id] = bi;
        }
        this._cameraCtl.setEyesLength(3000);
    };
    p.onUpdate = function () {
        _super.prototype.onUpdate.call(this);
        for (var id in this._boxInfo) {
            var bi = this._boxInfo[id];
            if (bi == null)
                continue;
            //bi['box'].rotationX += bi['rotationX'];
            //bi['box'].rotationY += bi['rotationY'];
            //bi['box'].rotationZ += bi['rotationZ'];
            bi['box'].moveRight(bi['moveX']);
            bi['box'].moveUp(bi['moveY']);
            bi['box'].moveForward(bi['moveY']);
            if (bi['box'].x < -this._width || bi['box'].x > this._width) {
                bi['moveX'] = -bi['moveX'];
            }
            if (bi['box'].y < -this._height || bi['box'].y > this._height) {
                bi['moveY'] = -bi['moveY'];
            }
            if (bi['box'].x < -this._depth || bi['box'].x > this._depth) {
                bi['moveZ'] = -bi['moveZ'];
            }
        }
    };
    p.onPickupBox = function (e) {
        console.log("click obj");
        if (this._boxInfo[e.currentTarget.id] == null) {
            this._boxInfo[e.currentTarget.id] = this._boxBak[e.currentTarget.id];
            console.log("obj is empty:" + e.currentTarget.id);
            console.log();
        }
        else {
            this._boxInfo[e.currentTarget.id] = null;
            console.log("got obj:" + e.currentTarget.id);
        }
    };
    return CreateBox;
})(CreateSky);
egret.registerClass(CreateBox,'CreateBox');
