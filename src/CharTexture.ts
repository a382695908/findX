module aw {

     /**
      * @language zh_CN
     * @class aw.CharTexture
     * @classdesc
     * 棋盘格纹理
     */
    export class CharTexture extends egret3d.TextureBase {

        /**
         * @language zh_CN
         */

        public static createCharTexture (w:number=32, h:number=32, txt: string="Test info.", align: string, font:string="60px 楷体", rgba:string="rgba(255,0,0,1)", 
                                            bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_with:number=2) {
            CharTexture.texture = new CharTexture(w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_with);
            aw.CharTexture.texture.upload(egret3d.Egret3DDrive.context3D);
        }

        public static texture: CharTexture = null;

        private _width: number = 32;
        private _height: number = 32;
        private _pixelArray: Uint8Array;
        private _txt: string;
        private _txtImgData: ImageData;

        public genTxtImg(w:number, h:number, txt: string, align: string, font:string, rgba:string, bg_rgba:string, frame_rgba:string, frame_with:number): ImageData {
            var cvs: HTMLCanvasElement = document.createElement("canvas");
            var ctx: CanvasRenderingContext2D = cvs.getContext("2d");
            cvs.width  = w; cvs.height = h;
            cvs = document.createElement("canvas");
            ctx = cvs.getContext("2d");
            cvs.width  = w; cvs.height = h;

            ctx.fillStyle = bg_rgba;
            ctx.fillRect(0,0,w,h);

            ctx.fillStyle = frame_rgba;
            ctx.lineWidth = frame_with;
            ctx.strokeRect(0,0,w,h);

            ctx.font = font;
            ctx.textAlign = align;
            ctx.lineWidth =3;
            ctx.textBaseline = 'middle';
            var rgbas: Array<string> = rgba.split(";");
			var txts: Array<string> = txt.split("\n");
			for(var idx:number = 0; idx < txts.length; idx++){
                if ( idx+1 <= rgbas.length && rgbas[idx].length > 3 ){
                    ctx.fillStyle = rgbas[idx];
                }

				if ( align == 'left' ){
            		ctx.fillText( txts[idx],   0,   h/txts.length/2 * (1+2*idx) );
				}
				else if ( align == 'center' ){
            		ctx.fillText( txts[idx],   w/2, h/txts.length/2 * (1+2*idx) );
				}
				else if ( align == 'right' ){
            		ctx.fillText( txts[idx],   w,   h/txts.length/2 * (1+2*idx) );
				}
			}

            this._txtImgData = ctx.getImageData(0, 0, w, h);
            return this._txtImgData;
        }


        /**
         * @language zh_CN
         */
        constructor(w:number=32, h:number=32, txt: string="Test info.", align: string="center", font:string="60px 楷体", rgba:string="rgba(255,0,0,1)", 
                    bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_with:number=2) {
            super();

            this._width = w; this._height= h; this._txt = txt;
            this.genTxtImg(this._width, this._height, this._txt, align, font, rgba, bg_rgba, frame_rgba, frame_with);

            this.buildCheckerboard();

            this.mimapData = new Array<egret3d.MipmapData>();
            this.mimapData.push(new egret3d.MipmapData(this._pixelArray, this._width, this._height));

        }

        /**
         * @language zh_CN
         * 上传贴图数据给GPU
         * @param context3D 
         */
        public upload(context3D: egret3d.Context3D) {
            if (!this.texture) {
                this.texture = context3D.creatTexture2D();
                this.texture.gpu_border = 0; 
                this.texture.gpu_internalformat = egret3d.InternalFormat.PixelArray;
                this.texture.gpu_colorformat = egret3d.Egret3DDrive.ColorFormat_RGBA8888;
                this.texture.mipmapDatas = this.mimapData;
                this.useMipmap = false;
                context3D.upLoadTextureData(0, this.texture);
            }
        }

        private buildCheckerboard(): void {
            if (!this._pixelArray && this._txtImgData) {
                this._pixelArray = new Uint8Array(this._width * this._height * 4);
                for (var y: number = 0; y < this._height  ; y++) {
                    for (var x: number = 0; x < this._width ; x++) {
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
        }
    }
}
