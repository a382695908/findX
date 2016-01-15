var aw;
(function (aw) {
    /**
     * @language zh_CN
    * @class aw.CharTexture
    * @classdesc
    * 棋盘格纹理
    */
    var CharTexture = (function (_super) {
        __extends(CharTexture, _super);
        /**
         * @language zh_CN
         */
        function CharTexture(w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_with) {
            if (w === void 0) { w = 32; }
            if (h === void 0) { h = 32; }
            if (txt === void 0) { txt = "Test info."; }
            if (align === void 0) { align = "center"; }
            if (font === void 0) { font = "60px 楷体"; }
            if (rgba === void 0) { rgba = "rgba(255,0,0,1)"; }
            if (bg_rgba === void 0) { bg_rgba = "rgba(200,200,200,1)"; }
            if (frame_rgba === void 0) { frame_rgba = "rgba(255,0,0,1)"; }
            if (frame_with === void 0) { frame_with = 2; }
            _super.call(this);
            this._width = 32;
            this._height = 32;
            this._width = w;
            this._height = h;
            this._txt = txt;
            this.genTxtImg(this._width, this._height, this._txt, align, font, rgba, bg_rgba, frame_rgba, frame_with);
            this.buildCheckerboard();
            this.mimapData = new Array();
            this.mimapData.push(new egret3d.MipmapData(this._pixelArray, this._width, this._height));
        }
        var d = __define,c=CharTexture,p=c.prototype;
        /**
         * @language zh_CN
         */
        CharTexture.createCharTexture = function (w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_with) {
            if (w === void 0) { w = 32; }
            if (h === void 0) { h = 32; }
            if (txt === void 0) { txt = "Test info."; }
            if (font === void 0) { font = "60px 楷体"; }
            if (rgba === void 0) { rgba = "rgba(255,0,0,1)"; }
            if (bg_rgba === void 0) { bg_rgba = "rgba(200,200,200,1)"; }
            if (frame_rgba === void 0) { frame_rgba = "rgba(255,0,0,1)"; }
            if (frame_with === void 0) { frame_with = 2; }
            CharTexture.texture = new CharTexture(w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_with);
            aw.CharTexture.texture.upload(egret3d.Egret3DDrive.context3D);
        };
        p.genTxtImg = function (w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_with) {
            var cvs = document.createElement("canvas");
            var ctx = cvs.getContext("2d");
            cvs.width = w;
            cvs.height = h;
            cvs = document.createElement("canvas");
            ctx = cvs.getContext("2d");
            cvs.width = w;
            cvs.height = h;
            ctx.fillStyle = bg_rgba;
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = frame_rgba;
            ctx.lineWidth = frame_with;
            ctx.strokeRect(0, 0, w, h);
            ctx.fillStyle = rgba;
            ctx.font = font;
            ctx.textAlign = align;
            ctx.lineWidth = 3;
            ctx.textBaseline = 'middle';
            var txts = txt.split("\n");
            for (var idx = 0; idx < txts.length; idx++) {
                if (align == 'left') {
                    ctx.fillText(txts[idx], 0, h / txts.length / 2 * (1 + 2 * idx));
                }
                else if (align == 'center') {
                    ctx.fillText(txts[idx], w / 2, h / txts.length / 2 * (1 + 2 * idx));
                }
                else if (align == 'right') {
                    ctx.fillText(txts[idx], w, h / txts.length / 2 * (1 + 2 * idx));
                }
            }
            this._txtImgData = ctx.getImageData(0, 0, w, h);
            return this._txtImgData;
        };
        /**
         * @language zh_CN
         * 上传贴图数据给GPU
         * @param context3D
         */
        p.upload = function (context3D) {
            if (!this.texture) {
                this.texture = context3D.creatTexture2D();
                this.texture.gpu_border = 0;
                this.texture.gpu_internalformat = egret3d.InternalFormat.PixelArray;
                this.texture.gpu_colorformat = egret3d.Egret3DDrive.ColorFormat_RGBA8888;
                this.texture.mipmapDatas = this.mimapData;
                this.useMipmap = false;
                context3D.upLoadTextureData(0, this.texture);
            }
        };
        p.buildCheckerboard = function () {
            if (!this._pixelArray && this._txtImgData) {
                this._pixelArray = new Uint8Array(this._width * this._height * 4);
                for (var y = 0; y < this._height; y++) {
                    for (var x = 0; x < this._width; x++) {
                        //this._pixelArray[(y * (this._width * 4) + x * 4) + 0] = this._txtImgData.data[((this._width-y-1) * this._width + (this._width-1-x))*4 + 0];
                        //this._pixelArray[(y * (this._width * 4) + x * 4) + 1] = this._txtImgData.data[((this._width-y-1) * this._width + (this._width-1-x))*4 + 1];
                        //this._pixelArray[(y * (this._width * 4) + x * 4) + 2] = this._txtImgData.data[((this._width-y-1) * this._width + (this._width-1-x))*4 + 2];
                        //this._pixelArray[(y * (this._width * 4) + x * 4) + 3] = this._txtImgData.data[((this._width-y-1) * this._width + (this._width-1-x))*4 + 3];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 0] = this._txtImgData.data[(y * (this._width * 4) + x * 4) + 0];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 1] = this._txtImgData.data[(y * (this._width * 4) + x * 4) + 1];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 2] = this._txtImgData.data[(y * (this._width * 4) + x * 4) + 2];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 3] = this._txtImgData.data[(y * (this._width * 4) + x * 4) + 3];
                    }
                }
            }
        };
        CharTexture.texture = null;
        return CharTexture;
    })(egret3d.TextureBase);
    aw.CharTexture = CharTexture;
    egret.registerClass(CharTexture,'aw.CharTexture');
})(aw || (aw = {}));
