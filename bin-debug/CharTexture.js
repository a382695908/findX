var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aw;
(function (aw) {
    var CharTexture = (function (_super) {
        __extends(CharTexture, _super);
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
        CharTexture.prototype.genTxtImg = function (w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_with) {
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
            ctx.font = font;
            ctx.textAlign = align;
            ctx.lineWidth = 3;
            ctx.textBaseline = 'middle';
            var rgbas = rgba.split(";");
            var txts = txt.split("\n");
            var minH = h / txts.length / 2;
            for (var idx = 0; idx < txts.length; idx++) {
                if (idx + 1 <= rgbas.length && rgbas[idx].length > 3) {
                    ctx.fillStyle = rgbas[idx];
                }
                if (align == 'left') {
                    ctx.fillText(txts[idx], 0, minH * (1 + 2 * idx));
                }
                else if (align == 'center') {
                    ctx.fillText(txts[idx], w / 2, minH * (1 + 2 * idx));
                }
                else if (align == 'right') {
                    ctx.fillText(txts[idx], w, minH * (1 + 2 * idx));
                }
            }
            this._txtImgData = ctx.getImageData(0, 0, w, h);
            return this._txtImgData;
        };
        CharTexture.prototype.upload = function (context3D) {
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
        CharTexture.prototype.buildCheckerboard = function () {
            if (!this._pixelArray && this._txtImgData) {
                this._pixelArray = new Uint8Array(this._width * this._height * 4);
                for (var y = 0; y < this._height; y++) {
                    for (var x = 0; x < this._width; x++) {
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
})(aw || (aw = {}));
