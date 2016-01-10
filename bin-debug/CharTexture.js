var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        function CharTexture(w, h, txt, font, rgba, bg_rgba, frame_rgba, frame_with) {
            _super.call(this);
            this._width = 32;
            this._height = 32;
            this._width = w;
            this._height = h;
            this._txt = txt;
            this.genTxtImg(this._width, this._height, this._txt, font, rgba, bg_rgba, frame_rgba, frame_with);
            this.buildCheckerboard();
            this.mimapData = new Array();
            this.mimapData.push(new egret3d.MipmapData(this._pixelArray, this._width, this._height));
        }
        /**
         * @language zh_CN
         */
        CharTexture.createCharTexture = function (w, h, txt, font, rgba, bg_rgba, frame_rgba, frame_with) {
            CharTexture.texture = new CharTexture(w, h, txt, font, rgba, bg_rgba, frame_rgba, frame_with);
            aw.CharTexture.texture.upload(egret3d.Egret3DDrive.context3D);
        };
        CharTexture.prototype.genTxtImg = function (w, h, txt, font, rgba, bg_rgba, frame_rgba, frame_with) {
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
            ctx.textAlign = 'center';
            ctx.lineWidth = 3;
            ctx.textBaseline = 'middle';
            ctx.fillText(txt, w / 2, h / 2);
            this._txtImgData = ctx.getImageData(0, 0, w, h);
            return this._txtImgData;
        };
        /**
         * @language zh_CN
         * 上传贴图数据给GPU
         * @param context3D
         */
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
                    for (var x = this._width - 1; x >= 0; x--) {
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 0] = this._txtImgData.data[((this._width - y - 1) * this._width + (this._width - 1 - x)) * 4 + 0];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 1] = this._txtImgData.data[((this._width - y - 1) * this._width + (this._width - 1 - x)) * 4 + 1];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 2] = this._txtImgData.data[((this._width - y - 1) * this._width + (this._width - 1 - x)) * 4 + 2];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 3] = this._txtImgData.data[((this._width - y - 1) * this._width + (this._width - 1 - x)) * 4 + 3];
                    }
                }
            }
        };
        CharTexture.texture = null;
        return CharTexture;
    })(egret3d.TextureBase);
    aw.CharTexture = CharTexture;
})(aw || (aw = {}));
