namespace aw {

    // 暂不支持 useMipmap
    export function MergeCharTexture( bgTxtr: egret3d.TextureBase, ftTxtr: aw.CharTexture ): egret3d.TextureBase {
		if ( bgTxtr == null || ftTxtr == null ) { 
			console.error( bgTxtr); 
			console.error( ftTxtr); 
			return;
		};
        if ( bgTxtr.width==ftTxtr.width && bgTxtr.height==ftTxtr.height && ftTxtr.colorFormat==bgTxtr.colorFormat ) { 
            /// 目前仅支持 Egret3DDrive.ColorFormat_RGBA8888, 当前E3D源码里未对 TextureBase.colorFormat 赋值
            let bgImgDt: ImageData = null;
            if ( bgTxtr.imageData ) {  // 图片
                egret3d.TextureUtil.regist( );
                let cvs: HTMLCanvasElement = egret3d.TextureUtil.getTextureData( bgTxtr.imageData );
                bgImgDt = cvs.getContext("2d").getImageData( 0, 0, bgTxtr.width, bgTxtr.height );
				//console.log("Background is image format texture");
            }
            else if ( bgTxtr.mimapData.length > 0 && bgTxtr.mimapData[0].width==ftTxtr.width && bgTxtr.mimapData[0].height==ftTxtr.height ) { // 内存像素
                bgImgDt.width = bgTxtr.mimapData[0].width;
                bgImgDt.height= bgTxtr.mimapData[0].height;
                for (let y: number = 0; y < bgImgDt.width; y++) {
                    for (let x: number = 0; x < bgImgDt.height; x++) {
                        bgImgDt.data[(y * (bgImgDt.width * 4) + x * 4) + 0] = bgTxtr.mimapData[0].data[(y * (bgImgDt.width * 4) + x * 4) + 0];
                        bgImgDt.data[(y * (bgImgDt.width * 4) + x * 4) + 1] = bgTxtr.mimapData[0].data[(y * (bgImgDt.width * 4) + x * 4) + 1];
                        bgImgDt.data[(y * (bgImgDt.width * 4) + x * 4) + 2] = bgTxtr.mimapData[0].data[(y * (bgImgDt.width * 4) + x * 4) + 2];
                        bgImgDt.data[(y * (bgImgDt.width * 4) + x * 4) + 3] = bgTxtr.mimapData[0].data[(y * (bgImgDt.width * 4) + x * 4) + 3];
					}
				}
				//console.log("Background is pixel format texture");
            }
            else{
                console.error( "Unsurported backgrand texture." );
                return bgTxtr;
            }

            let ftImgDt:Uint8Array = ftTxtr.PixelArray;
            if ( bgImgDt && ftImgDt && bgImgDt.data.length==ftImgDt.length ) {
				// merge texture image data
                for (let y: number = 0; y < bgTxtr.width; y++) {
                    for (let x: number = 0; x < bgTxtr.height; x++) {
                        bgImgDt.data[(y*(bgImgDt.width*4)+x*4)+0] += ftImgDt[(y*(ftTxtr.width*4)+x*4)+3]/255 * ftImgDt[(y*(ftTxtr.width*4)+x*4)+0];
                        bgImgDt.data[(y*(bgImgDt.width*4)+x*4)+1] += ftImgDt[(y*(ftTxtr.width*4)+x*4)+3]/255 * ftImgDt[(y*(ftTxtr.width*4)+x*4)+1];
                        bgImgDt.data[(y*(bgImgDt.width*4)+x*4)+2] += ftImgDt[(y*(ftTxtr.width*4)+x*4)+3]/255 * ftImgDt[(y*(ftTxtr.width*4)+x*4)+2];
                        bgImgDt.data[(y*(bgImgDt.width*4)+x*4)+3] = 255;
                    }
                }
				// change merged image data format( number[] to Uint8Array )
				let tmpArray : Uint8Array = new Uint8Array(bgImgDt.width * bgImgDt.height * 4);
                for (let y: number = 0; y < bgImgDt.width; y++) {
                    for (let x: number = 0; x < bgImgDt.height; x++) {
                        tmpArray[(y*(bgImgDt.width*4)+x*4)+0] = bgImgDt.data[(y*(ftTxtr.width*4)+x*4)+0];
                        tmpArray[(y*(bgImgDt.width*4)+x*4)+1] = bgImgDt.data[(y*(ftTxtr.width*4)+x*4)+1];
                        tmpArray[(y*(bgImgDt.width*4)+x*4)+2] = bgImgDt.data[(y*(ftTxtr.width*4)+x*4)+2];
                        tmpArray[(y*(bgImgDt.width*4)+x*4)+3] = bgImgDt.data[(y*(ftTxtr.width*4)+x*4)+3];
                    }
                }

				// Create texute
            	let mimapData: Array<egret3d.MipmapData> = new Array<egret3d.MipmapData>();
            	mimapData.push(new egret3d.MipmapData(tmpArray, bgImgDt.width, bgImgDt.height));
        		let retTxtr: egret3d.TextureBase = new egret3d.CheckerboardTexture();
            	retTxtr.texture = egret3d.Egret3DDrive.context3D.creatTexture2D();
                if ( retTxtr.texture ) {
                    retTxtr.texture.width = bgTxtr.width;
                    retTxtr.texture.height = bgTxtr.height;
            	    retTxtr.texture.gpu_border = 0; 
            	    retTxtr.texture.gpu_internalformat = egret3d.InternalFormat.PixelArray;
            	    retTxtr.texture.gpu_colorformat = egret3d.Egret3DDrive.ColorFormat_RGBA8888;
            	    retTxtr.texture.mipmapDatas = mimapData;
            	    retTxtr.useMipmap = false;
            	    egret3d.Egret3DDrive.context3D.upLoadTextureData(0, retTxtr.texture);
                    //console.log(`merged texute width: ${retTxtr.texture.width}, height: ${retTxtr.texture.height}`);
        		    return retTxtr;
                }
                else {
                    console.error("some thing error-wen create merged texture context3D.creatTexture2D().");
        		    return bgTxtr;
                }
            }
            else{
                console.error("some thing error.");
                let lg: string = `Background image data(${bgImgDt}) or front image data(${ftImgDt}) error.`;
                console.error(lg);
                if ( bgImgDt && ftImgDt ) {
                    lg = `Background image data len ${bgImgDt.data.length} != front image data len ${ftImgDt.length}.`;
                }
            }
        }
        else{
            console.error("The two texture cannot be merged, because width, height, color format not same.");
        }
        return bgTxtr;
    }

     /**
      * @language zh_CN
     * @class aw.CharTexture
     * @classdesc
     * 字符纹理
     */
    export class CharTexture extends egret3d.TextureBase {

        public static CreateCharTexture (w:number=32, h:number=32, txt: string="Test info.", align: string, font:string="60px 楷体", rgba:string="rgba(255,0,0,1)", 
                                            bg_rgba:string="rgba(200,200,200,1)", frame_rgba:string="rgba(255,0,0,1)", frame_width:number=2) {
            CharTexture.texture = new CharTexture(w, h, txt, align, font, rgba, bg_rgba, frame_rgba, frame_width);
            aw.CharTexture.texture.Upload(egret3d.Egret3DDrive.context3D);
        }

        public static texture: CharTexture = null;

        private _width: number = 32;
        private _height: number = 32;
        private _pixelArray: Uint8Array = null;
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

            this.BuildCheckerboard(txtImgData);  // 将图像数据写入 数组

            this.mimapData = new Array<egret3d.MipmapData>();
            this.mimapData.push(new egret3d.MipmapData(this._pixelArray, this._width, this._height));

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

        public get PixelArray(): Uint8Array {
            return this._pixelArray;
        }
    }

     /**
      * @language zh_CN
     * @class aw.CharTexture
     * @classdesc
     * 进度条纹理
     */
    export class PercenterTexture extends egret3d.TextureBase {

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

        public get PixelArray(): Uint8Array {
            return this._pixelArray;
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

     /**
      * @language zh_CN
     * @class aw.HUD
     * @classdesc
     * 进度条HUD
     */
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
    export function regWeixin(wx_debug:boolean, wx_appid:string, wx_ts:number, wx_str:string, 
								wx_sig:string, wx_title:string, wx_desc:string, wx_link:string, wx_img:string) {
        console.log("Reg weixin here."); 
        /// 通过config接口注入权限验证配置
        if(typeof(wx) != 'undefined' && wx && typeof(wx_appid) != 'undefined') {
        	let bodyConfig: BodyConfig = new BodyConfig();
        	bodyConfig.debug = wx_debug;
        	bodyConfig.appId = wx_appid;
        	bodyConfig.timestamp = wx_ts;
        	bodyConfig.nonceStr = wx_str;
        	bodyConfig.signature = wx_sig;
        	bodyConfig.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo'];
            wx.config(bodyConfig);
            wx.ready(function() {
///-------------------------------------------
            /// 在这里调用微信相关功能的 API
                console.log('weixin ready');
                let timelineMsg: BodyMenuShareTimeline = new BodyMenuShareTimeline();
                console.log('weixin menu share time line');
                timelineMsg.title = wx_title + " - 快来试试你的手机能玩微信3D游戏不?";
                timelineMsg.link = wx_link;
                timelineMsg.imgUrl = wx_img;
                //timelineMsg.type = 'link';
                //timelineMsg.desc = '猴年大吉,恭喜发财.';
                timelineMsg.trigger = function (res) { console.log('用户点击发送给朋友.'); }    
                timelineMsg.success = function (res) { console.log('已分享到朋友圈.'); };
                timelineMsg.fail = function (res) { console.log('已取消分享到朋友圈.'); };
                timelineMsg.cancel = function (res) { console.log(JSON.stringify(res)); };
                wx.onMenuShareTimeline(timelineMsg);

                let appMsg: BodyMenuShareAppMessage = new BodyMenuShareAppMessage();
                console.log('weixin menu share app');
                appMsg.title = wx_title;
                appMsg.link = wx_link;
                appMsg.imgUrl = wx_img;
                appMsg.desc = wx_desc;
                appMsg.type = 'link';
                appMsg.dataUrl = '';
                appMsg.success = function (res) { console.log('已分享给朋友.'); };
                appMsg.fail = function (res) { console.log('已取消分析给朋友.'); };
                appMsg.trigger = function (res) { console.log('用户点击发送给朋友.'); }    
                appMsg.cancel = function (res) { console.log(JSON.stringify(res));};
                wx.onMenuShareAppMessage(appMsg);

                let qqMsg: BodyMenuShareQQ = new BodyMenuShareQQ();
                console.log('weixin menu share');
                qqMsg.title = wx_title;
                qqMsg.link = wx_link;
                qqMsg.imgUrl = wx_img;
                qqMsg.desc = wx_desc;
                qqMsg.type = 'link';
                //qqMsg.dataUrl = "";
                //qqMsg.complete = function(){};
                qqMsg.trigger = function (res) { console.log('用户点击发送给朋友.'); }    
                qqMsg.success = function (res) { console.log('已分享到QQ.'); };
                qqMsg.fail = function (res) { console.log('已取消分享到QQ.'); };
                qqMsg.cancel = function (res) { console.log(JSON.stringify(res)); };
                wx.onMenuShareQQ(qqMsg);

                //wx.onMenuShareQZone({
                //    title: wx_title, // 分享标题
                //    link: wx_link, // 分享链接
                //    imgUrl: wx_img, // 分享图标
                //    desc: wx_desc, // 分享描述
                //    //type = 'link';
                //    success: function () { 
                //        console.log('用户点击发送给QQ空间.');
                //    },
                //    cancel: function () { 
                //        console.log('用户取消发送给QQ空间.');
                //    }
                //});

                let qzoneMsg: BodyMenuShareWeibo = new BodyMenuShareWeibo();
                qzoneMsg.title = wx_title; // 分享标题
                qzoneMsg.link = wx_link; // 分享链接
                qzoneMsg.imgUrl = wx_img; // 分享图标
                qzoneMsg.desc = wx_desc; // 分享描述
                //type = 'link';
                qzoneMsg.complete=function (res) { console.log('用户点击发送给腾讯微博.'); };
                qzoneMsg.success=function (res) { console.log('用户点击发送给腾讯微博.'); };
                qzoneMsg.cancel=function (res) { console.log('用户取消发送给腾讯微博.'); }
                wx.onMenuShareWeibo( qzoneMsg );
///-------------------------------------------
            });
            wx.error(function() {
                console.log("初始化微信接口失败。");
            });
        }
        else{
            console.log("未找到微信接口。");
        }
    }

    export function regNest(nt_debug: boolean, nt_appid: number, nt_version:number): boolean {
		return true;
	}
}
