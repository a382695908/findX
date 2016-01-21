namespace aw {
     /**
      * @language zh_CN
     * @class aw.CharTexture
     * @classdesc
     * 字符纹理
     */
    export class CharTexture extends egret3d.TextureBase {

        /**
         * @language zh_CN
         */
        public static CreateCharTexture (w:number=32, h:number=32, txt: string="Test info.", align: string, font:string="60px 楷体", rgba:string="rgba(255,0,0,1)", 
                                            bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2) {
            CharTexture.texture = new CharTexture(w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_width);
            aw.CharTexture.texture.Upload(egret3d.Egret3DDrive.context3D);
        }

        public static texture: CharTexture = null;

        private _width: number = 32;
        private _height: number = 32;
        private _pixelArray: Uint8Array;
        private _txt: string;

        public static GenTxtImg(w:number, h:number, txt: string, align: string, font:string, rgba:string, bg_rgba:string, frame_rgba:string, frame_width:number): ImageData {
            let cvs: HTMLCanvasElement = document.createElement("canvas");
            let ctx: CanvasRenderingContext2D = cvs.getContext("2d");
            cvs.width  = w; cvs.height = h;
            cvs = document.createElement("canvas");
            ctx = cvs.getContext("2d");
            cvs.width  = w; cvs.height = h;

            ctx.fillStyle = bg_rgba;
            ctx.fillRect(0,0,w,h);

            ctx.fillStyle = frame_rgba;
            ctx.lineWidth = frame_width;
            ctx.strokeRect(0,0,w,h);

            ctx.font = font;
            ctx.textAlign = align;
            ctx.lineWidth =4;
            ctx.textBaseline = 'middle';
            let rgbas: Array<string> = rgba.split(";");
			let txts: Array<string> = txt.split("\n");
			let minH : number = h/txts.length/2;
			for(let idx:number = 0; idx < txts.length; idx++){
                let txtW = ctx.measureText( txts[idx] ).width; // TODO： 根据文字宽度自动调整 纹理大小

                if ( idx+1 <= rgbas.length && rgbas[idx].length > 3 ){
                    ctx.fillStyle = rgbas[idx];
                }
				if ( align == 'left' ){
            		ctx.fillText( txts[idx],   0,   minH * (1+2*idx) );
				}
				else if ( align == 'center' ){
            		ctx.fillText( txts[idx],   w/2, minH * (1+2*idx) );
				}
				else if ( align == 'right' ){
            		ctx.fillText( txts[idx],   w,   minH * (1+2*idx) );
				}
			}

            return ctx.getImageData(0, 0, w, h);
        }


        /**
         * @language zh_CN
         */
        constructor(w:number=32, h:number=32, txt: string="Test info.", align: string="center", font:string="60px 楷体", rgba:string="rgba(255,0,0,1)", 
                    bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2) {
            super();

            this._width = w; this._height= h; this._txt = txt;
            let txtImgData: ImageData = aw.CharTexture.GenTxtImg(this._width, this._height, this._txt, align, font, rgba, bg_rgba, frame_rgba, frame_width);

            this.BuildCheckerboard(txtImgData);

            this.mimapData = new Array<egret3d.MipmapData>();
            this.mimapData.push(new egret3d.MipmapData(this._pixelArray, this._width, this._height));

        }

        /**
         * @language zh_CN
         * 上传贴图数据给GPU
         * @param context3D 
         */
        public Upload(context3D: egret3d.Context3D) {
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

        private BuildCheckerboard(txtImgData: ImageData = null): void {
            if (!this._pixelArray && txtImgData) {
                this._pixelArray = new Uint8Array(this._width * this._height * 4);
                for (let y: number = 0; y < this._height  ; y++) {
                    for (let x: number = 0; x < this._width ; x++) {
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 0] = txtImgData.data[(y * (this._width * 4) + x * 4) + 0];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 1] = txtImgData.data[(y * (this._width * 4) + x * 4) + 1];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 2] = txtImgData.data[(y * (this._width * 4) + x * 4) + 2];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 3] = txtImgData.data[(y * (this._width * 4) + x * 4) + 3];
                    }
                }
            }
        }
    }

    export class PercenterTexture extends egret3d.TextureBase {

        /**
         * @language zh_CN
         */
        public static CreatePercentrTexture (w:number=8, h:number=64, up:number=1, down:number=2, multi:number=100, fixed_cnt:number=1, 
                                            rgba:string="rgba(255,0,0,1)", bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2, 
                                            tip:boolean=true, tip_rgba:string="rgba(255,0,0,1)", align: string, font:string="60px 楷体") {
            PercenterTexture.texture = new PercenterTexture(w, h, up, down, multi, fixed_cnt, 
                                                            rgba, bg_rgba, frame_rgba, frame_width, tip, tip_rgba, align, font);
            aw.PercenterTexture.texture.Upload(egret3d.Egret3DDrive.context3D);
        }

        public static texture: PercenterTexture = null;

        private _width: number = 32;
        private _height: number = 32;
        private _up: number = 32;
        private _down: number = 32;
        private _pixelArray: Uint8Array;
        private _txt: string;

        public static GenPercentImg(w:number, h:number, up:number, down:number, multi:number, fixed_cnt:number, 
                                    rgba:string, bg_rgba:string, frame_rgba:string, frame_width:number, tip:boolean, tip_rgba:string, align:string, font:string): ImageData {
            let cvs: HTMLCanvasElement = document.createElement("canvas");
            let ctx: CanvasRenderingContext2D = cvs.getContext("2d");
            cvs.width  = w; cvs.height = h;
            cvs = document.createElement("canvas");
            ctx = cvs.getContext("2d");
            cvs.width  = w; cvs.height = h;

            // 边框
            if ( frame_width > 0 ){
                ctx.fillStyle = frame_rgba;
                ctx.lineWidth = frame_width;
                ctx.strokeRect( 0, 0, w, h);
            }

            // 背景
            ctx.fillStyle = bg_rgba;
            ctx.fillRect( 0, 0, w, h);

            // 进度条
            let ratio:number = up / down;
            let drawW:number = w * ratio;

            ctx.fillStyle = rgba;
            ctx.fillRect( 0, 0, drawW, h);


            if ( tip ){
                ctx.font = font;
                ctx.textAlign = align;
                ctx.lineWidth = 2;
                ctx.textBaseline = 'middle';
                ctx.fillStyle = tip_rgba;

                let percent:string = ( ratio * multi ).toFixed( fixed_cnt );

			    	if ( align == 'left' ){
                		ctx.fillText( percent,   0,   h/2 );
			    	}
			    	else if ( align == 'center' ){
                		ctx.fillText( percent,   w/2, h/2 );
			    	}
			    	else if ( align == 'right' ){
                		ctx.fillText( percent,   w,   h/2 );
			    	}
            }

            return ctx.getImageData(0, 0, w, h);
        }


        /**
         * @language zh_CN
         */
        constructor(w:number=32, h:number=32, up:number=1, down:number=2, multi:number=100, fixed_cnt:number=1, 
                    rgba:string="rgba(255,0,0,1)", bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2, 
                    tip:boolean=true, tip_rgba:string="rgba(255,0,0,1)", align: string="center", font:string="60px 楷体") {
            super();

            this._width = w; this._height= h;
            this._up = up; this._down= down;
            let txtImgData: ImageData = aw.PercenterTexture.GenPercentImg(this._width, this._height, this._up, this._down, multi, fixed_cnt,
                                                                         rgba, bg_rgba, frame_rgba, frame_width, 
                                                                         tip, tip_rgba, align, font);

            this.BuildCheckerboard(txtImgData);

            this.mimapData = new Array<egret3d.MipmapData>();
            this.mimapData.push(new egret3d.MipmapData(this._pixelArray, this._width, this._height));

        }

        /**
         * @language zh_CN
         * 上传贴图数据给GPU
         * @param context3D 
         */
        public Upload(context3D: egret3d.Context3D) {
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

        private BuildCheckerboard(txtImgData: ImageData = null): void {
            if (!this._pixelArray && txtImgData) {
                this._pixelArray = new Uint8Array(this._width * this._height * 4);
                for (let y: number = 0; y < this._height  ; y++) {
                    for (let x: number = 0; x < this._width ; x++) {
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 0] = txtImgData.data[(y * (this._width * 4) + x * 4) + 0];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 1] = txtImgData.data[(y * (this._width * 4) + x * 4) + 1];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 2] = txtImgData.data[(y * (this._width * 4) + x * 4) + 2];
                        this._pixelArray[(y * (this._width * 4) + x * 4) + 3] = txtImgData.data[(y * (this._width * 4) + x * 4) + 3];
                    }
                }
            }
        }
    }


    // TODO: 优化效率，减少重复生成
     /**
      * @language zh_CN
     * @class aw.HUD
     * @classdesc
     * 动态字符HUD
     */
    export class HUD extends egret3d.HUD {
        private _txtrW: number = 32;
        private _txtrH: number = 32;
        private _txtrTxt: string = "白鹭";
        private _txtrAlign: string = "center";
        private _txtrFont: string = "24px 宋体";
        private _txtrColor: string = "rgba(255,0,0,1)";
        private _txtrBgColor: string = "rgba(0,0,0,0)";
        private _txtrFrmColor: string = "rgba(255,0,0,1)";
        private _txtrFrmW: number = 2;

        public SetCharTexture(w:number=32, h:number=32, txt: string="Test info.", align: string, font:string="60px 楷体", rgba:string="rgba(255,0,0,1)", 
                                            bg_rgba:string="rgba(255,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2) {
            this._txtrW = w;
            this._txtrH = h;
            this.width = w;
            this.height = h;

            this._txtrTxt = txt;
            this._txtrAlign = align;
            this._txtrFont = font;
            this._txtrColor = rgba;
            this._txtrBgColor = bg_rgba;
            this._txtrFrmColor = frame_rgba;
            this._txtrFrmW = frame_width;

            aw.CharTexture.CreateCharTexture(this._txtrW, this._txtrH, this._txtrTxt, this._txtrAlign, this._txtrFont, 
                                        this._txtrColor, this._txtrBgColor, this._txtrFrmColor, this._txtrFrmW);
            this.texture = aw.CharTexture.texture;
        }

        public UpdateTextureString( str: string ) {
            this._txtrTxt = str;
            aw.CharTexture.CreateCharTexture(this._txtrW, this._txtrH, this._txtrTxt, this._txtrAlign, this._txtrFont, 
                                        this._txtrColor, this._txtrBgColor, this._txtrFrmColor, this._txtrFrmW);
            this.texture = aw.CharTexture.texture;
        }
    }

    export class ProgressHUD extends egret3d.HUD {
        private _txtrW: number = 32;
        private _txtrH: number = 32;
        private _txtrUp: number = 32;
        private _txtrDown: number = 32;
        private _multi = 1;
        private _fixedCnt = 1;

        private _txtrColor: string = "rgba(255,0,0,1)";
        private _txtrBgColor: string = "rgba(0,0,0,0)";
        private _txtrFrmColor: string = "rgba(255,0,0,1)";
        private _txtrFrmW: number = 2;

        private _tip: boolean = true;
        private _tipAlign: string = "center";
        private _tipFont: string = "24px 宋体";
        private _tipColor: string = "rgba(255,0,0,1)";

        public SetProgress(w:number=32, h:number=32, up:number=1, down:number=2, multi:number=100, fixed_cnt:number=1, 
                    rgba:string="rgba(255,0,0,1)", bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2, 
                    tip:boolean=true, tip_rgba:string="rgba(255,0,0,1)", align: string="center", font:string="60px 楷体") {
            this._txtrW = w;
            this._txtrH = h;
            this._txtrUp = up;
            this._txtrDown = down;
            this._multi = multi;
            this._fixedCnt = fixed_cnt;

            this._txtrColor = rgba;
            this._txtrBgColor = bg_rgba;
            this._txtrFrmColor = frame_rgba;
            this._txtrFrmW = frame_width;

            this._tip = tip;
            this._tipColor = tip_rgba;
            this._tipAlign = align;
            this._tipFont = font;

            aw.PercenterTexture.CreatePercentrTexture(this._txtrW, this._txtrH, this._txtrUp, this._txtrDown, this._multi, this._fixedCnt, 
                                        this._txtrColor, this._txtrBgColor, this._txtrFrmColor, this._txtrFrmW,
                                        this._tip, this._tipColor, this._tipAlign, this._tipFont);
            this.texture = aw.PercenterTexture.texture;

            this.width = this._txtrW;
            this.height = this._txtrH;
        }

        public UpdateProgress( up:number, down:number, rgba:string, tip: boolean ) {
            if (this._txtrUp == up && this._txtrDown == down && this._txtrColor == rgba && this._tip == tip ){
                return;
            }
            this._txtrUp = up;
            this._txtrDown = down;
            this._txtrColor = rgba;
            this._tip = tip;
            aw.PercenterTexture.CreatePercentrTexture(this._txtrW, this._txtrH, this._txtrUp, this._txtrDown, this._multi, this._fixedCnt, 
                                        this._txtrColor, this._txtrBgColor, this._txtrFrmColor, this._txtrFrmW,
                                        this._tip, this._tipColor, this._tipAlign, this._tipFont);
            this.texture = aw.PercenterTexture.texture;
        }
    }
}
