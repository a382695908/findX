class CreateGame extends CreateBaseEnv{
    protected _dtDriver: aw.FindXDataDriver = null;
    private _uiReady: boolean = false;

    protected _boxInfo : any = {};		//实时操作的盒子存储
    protected _boxBak  : any = {};      //生产队盒子的原始备份
    protected _deadBox : any = {"cnt": 0, 'box':{} }; //记录已经拾取的对象
    protected _xBoxIds : number[] = []; //记录特殊字符，点击时比较判断

	// 盒子活动的空间大小
    protected _width  : number = 600;
    protected _height : number = 800;
    protected _depth  : number = 400;
    protected _widthR : number = 0.8;
    protected _heightR: number = 0.5;
    protected _depthR : number = 0.6;

	// 展示信息的HUD(Head UP Display)
    private _hud : aw.HUD = null;
    private _hudW: number = 256;
    private _hudH: number = 64;
    private _hudFont: string = "20px 楷体";
    private _hudAlign: string = "left";
    private _hudColor: string = "rgba(255,0,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
    private _hudBgColor: string="rgba(0,0,0,0)";
    private _hudFrmBgColor: string="rgba(0,0,0,0)";
    private _hudFrmW: number=0;

    // 进度信息的HUD(Head Up Display)
    private _hudPer : aw.ProgressHUD;
    private _hudPerW: number = 256;
    private _hudPerH: number = 8;
    private _hudPerMulti: number = 100;
    private _hudPerFixedCnt: number = 2;
    private _hudPerColor: string = "rgba(255,0,0,0.5)";
    private _hudPerBgColor: string = "rgba(100, 100, 100, 0.3)";
    private _hudPerFrmColor: string = "rgba(255, 255, 0, 1)";
    private _hudPerFrmW: number = 1;
    private _hudPerTip: boolean = false;
    private _hudPerTipColor: string = "rgba(255,0,0,1)";
    private _hudPerTipAlign: string = "center";
    private _hudPerTipFont: string = "24px 楷体";

	// 交互信息的HUD(Head UP Display)
    private _hudInter : aw.HUD;
    private _hudInterW: number = 256;
    private _hudInterH: number = 64;
    private _hudInterFont: string = "24px 楷体";
    private _hudInterAlign: string = "center";
    private _hudInterColor: string = "rgba(0,255,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
    private _hudInterBgColor: string="rgba( 0, 88, 0, 0.8)";
    private _hudInterFrmBgColor: string="rgba(0,0,0,1)";
    private _hudInterFrmW: number=0;


	//盒子上的字符纹理
    protected _boxTxtureW: number = 64;
    protected _boxTxtureH: number = 64;
    protected _boxTxtureFont: string = "50px 宋体";
    protected _boxTxtureAlign: string = "center";
    protected _boxTxtureColor: string = "rgba(0,   255,   0, 1)";
    protected _boxTxtureBgColor: string="rgba(230, 230,  230, 1)";
    protected _boxTxtureFrmBgColor: string="rgba(   0,   0, 255,  1)";
    protected _boxTxtureFrmW: number=2;

    private _lightGroup: egret3d.LightGroup = null;

    public constructor() {
        super();
        this._width  = this._viewPort.width;
        this._height = this._viewPort.height;
        this._depth  = this._viewPort.width;

        this._dtDriver = new aw.FindXDataDriver();
        this._uiReady = false;

    }

    public get dataDriver() :aw.FindXDataDriver {
        return this._dtDriver;
    }

    protected onView3DInitComplete(): void {
        this.textureComplete();

        if (this._cameraCtl) this._cameraCtl.setEyesLength( (this._depth+this._width+this._height)/1.0 );
        //this._cameraCtl.setEyesLength(3000);
        console.log("textureComplete...");
    }

    protected Resize(w: number, h: number) {
        this._width  = w;
        this._height = h;
        this._depth  = w
		if (this._hud) this._hud.x    = (this._width/2 - this._hud.width/2);
		if (this._hudPer) this._hudPer.x = (this._width/2 - this._hudPer.width/2);
		if (this._hudInter) this._hudInter.x = (this._width/2 - this._hudInter.width/2);
        if (this._cameraCtl) this._cameraCtl.setEyesLength( (this._depth+this._width+this._height)/1.0 );
    } 

    private textureComplete() {
		// 全局的鼠标/触摸事件 --- 用于进度控制操作
        egret3d.Input.instance.addListenerKeyClick( (e:Event, self:CreateGame ) => this.interactiveOpt(e, this ) );
        egret3d.Input.instance.addTouchStartCallback( (e:Event, self:CreateGame ) => this.interactiveOpt(e, this ) );

		//环境光 
        this._lightGroup = new egret3d.LightGroup();
        let directLight: egret3d.DirectLight = new egret3d.DirectLight(new egret3d.Vector3D(0.5, 1.0, 0.6));
        directLight.diffuse = 0xAAAAAA;
        directLight.halfColor = 0XDDDDDD;
        directLight.halfIntensity = 0.6;
        this._lightGroup.addDirectLight(directLight);

		// 生成盒子
        this.GenCharBox();

		// 进度信息
        this.UpdateShowInfo();

		// 交互信息
        this.updateInteractiveTips( this._dtDriver.readyTips );
    }

    protected GenCharBox() {
        for (let idx:number = 0; idx < this._dtDriver.totalObjCnt; ++idx){
            let box : egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, (e: egret3d.Event3D) => this.OnPickupBox(e));
            box.addEventListener(egret3d.Event3D.TOUCH_START, (e: egret3d.Event3D) => this.OnPickupBox(e));

            box.material.lightGroup = this._lightGroup;
            box.material.ambientPower = 0.3;
            box.material.ambientColor = 0X888888;

            box.x = 0;
            box.y = 0;
            box.z = -100;
            box.rotationX = 0;
            box.rotationY = 0;
            box.rotationZ = 180;
            box.scaleX = 1;
            box.scaleY = 1;
            box.scaleZ = 1;
            this._view3D.addChild3D(box);

			if ( this._woodTexture && this._starTexture ) {
            	this._boxTxtureBgColor = "rgba(220,220,220,0)";
			}
			else{
            	this._boxTxtureBgColor = "rgba(220,220,220,1)";
			}

            if ( this._xBoxIds.length < this._dtDriver.xObjCnt ){
                aw.CharTexture.CreateCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsFind, 
                                                this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, 
                                                this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
                this._xBoxIds.push( box.id );
				//console.log(`xObjCnt: ${this._dtDriver.xObjCnt}, xBoxIds: ${this._xBoxIds.length}, now char: ${this._dtDriver.charsFind}`);
            }
            else{
                let n: number = Math.floor(Math.random() * this._dtDriver.charsPool.length);
                aw.CharTexture.CreateCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsPool[n], 
                                                this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, 
                                                this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
				//console.log(`xObjCnt: ${this._dtDriver.xObjCnt}, xBoxIds: ${this._xBoxIds.length}, now char: ${this._dtDriver.charsPool[n]}`);
            }

			if ( this._woodTexture && this._starTexture ) {
            	let mergedTxtr: egret3d.TextureBase = null;
				if ( this.dataDriver.stage % 2 == 0 ) {
            		mergedTxtr = aw.MergeCharTexture(this._woodTexture, aw.CharTexture.texture);
				}
				else{
					//mergedTxtr = aw.MergeCharTexture(this._starTexture, aw.CharTexture.texture);
					mergedTxtr = aw.MergeCharTexture(this._woodTexture, aw.CharTexture.texture);
				}
				if ( mergedTxtr ) {
            		box.material.diffuseTexture = mergedTxtr;
					console.log("Use merged texture");
				}
				else{
            		box.material.diffuseTexture = this._woodTexture;
					console.log("Use single image texture");
				}
			}
			else{
            	box.material.diffuseTexture = aw.CharTexture.texture;
					console.log("Use single char texture");
			}

            let bi: any = {"box" : box, 'id': box.id, 'idx': idx };

            bi['moveX']     = (Math.random()*2-1) * this._dtDriver.moveSpeed;
            bi['moveY']     = (Math.random()*2-1) * this._dtDriver.moveSpeed;
            bi['moveZ']     = (Math.random()*2-1) * this._dtDriver.moveSpeed;
            if (bi['moveX']==0) {bi['moveX']= this._dtDriver.moveSpeed;};
            if (bi['moveY']==0) {bi['moveY']= this._dtDriver.moveSpeed;};
            if (bi['moveZ']==0) {bi['moveZ']= this._dtDriver.moveSpeed;};
            bi['rotationX'] = (Math.random()*2-1) * this._dtDriver.rotateSpeed;
            bi['rotationY'] = (Math.random()*2-1) * this._dtDriver.rotateSpeed;
            bi['rotationZ'] = (Math.random()*2-1) * this._dtDriver.rotateSpeed;
            bi['scaleX'] = 1;
            bi['scaleY'] = 1;
            bi['scaleZ'] = 1;


            this._boxInfo[box.id] = bi;
            this._boxBak[box.id]  = bi;
        }
    }

    protected UpdateBoxView(){
		let rW: number = this._widthR *  this._width;
		let rH: number = this._heightR *  this._height;
		let rD: number = this._depthR *  this._depth;
        if ( this._uiReady === false ){ // 初始化到空间乱序，避免一开始集中被批量选中
            this._uiReady = true;
            for(let id in this._boxInfo ){
                let bi = this._boxInfo[id];
                if ( bi == null ) continue;
                bi['box'].rotationX = (Math.random()*2*Math.PI - Math.PI);
                bi['box'].rotationY = (Math.random()*2*Math.PI - Math.PI);
                bi['box'].rotationZ = (Math.random()*2*Math.PI - Math.PI);
                bi['box'].x = rW * (Math.random()*2 - 1) ;
                bi['box'].y = rH * (Math.random()*2 - 1);
                bi['box'].z = rD * (Math.random()*2 - 1);
            }
        }
        else{
            for(let id in this._boxInfo ){
                let bi = this._boxInfo[id];
                if ( bi === null ) {
                    bi = this._boxBak[id];
                    if ( this._view3D.hasChild3D(bi['box']) ) {
                        if (bi['box'].scaleX <= 0.2 || bi['box'].scaleY <= 0.2 || bi['box'].scaleZ <= 0.2 ) {
                            if (id in this._deadBox["box"] ){
                            }
                            else{
                                this._deadBox["box"][id] = bi;
                                this._deadBox["cnt"]++;
                            }
                            this._view3D.delChild3D( bi['box'] );
                        }
                        else{
                            if (bi['box'].scaleX === 1 && bi['box'].scaleY === 1 && bi['box'].scaleZ === 1 ) {
                                bi['scaleX'] = 1.1;
                                bi['scaleY'] = 1.1;
                                bi['scaleZ'] = 1.1;
                            }
                            else if (bi['box'].scaleX >= 4 || bi['box'].scaleY >= 4 || bi['box'].scaleZ >= 4 ) {
                                bi['scaleX'] = 0.9;
                                bi['scaleY'] = 0.9;
                                bi['scaleZ'] = 0.9;
                            }
                            
                            bi['box'].scaleX *= bi['scaleX'];
                            bi['box'].scaleY *= bi['scaleY'];
                            bi['box'].scaleZ *= bi['scaleZ'];
                        }
                    }
                }
                else{
                    bi['box'].rotationX += bi['rotationX'];
                    bi['box'].rotationY += bi['rotationY'];
                    bi['box'].rotationZ += bi['rotationZ'];

                    bi['box'].x += bi['moveX'];
                    bi['box'].y += bi['moveY'];
                    bi['box'].z += bi['moveZ'];
                    //if ( this._camera3D.isVisibleToCamera( bi['box'] ) ) {
                    //}
                    //else{
                    //    bi['moveX'] = -bi['moveX']
                    //    bi['moveY'] = -bi['moveY']
                    //    bi['moveZ'] = -bi['moveZ']
                    //}

                    //var v3 = bi['box'].getScreenPosition( this._camera3D );
                    //if ( v3 ) {
                    //}

                    if ( bi['box'].x < -rW || bi['box'].x > rW ){
                        bi['moveX'] = -bi['moveX']
                    }
                    if ( bi['box'].y < -rH || bi['box'].y > rH ){
                        bi['moveY'] = -bi['moveY']
                    }
                    if ( bi['box'].z < -rD || bi['box'].z > rD ){
                        bi['moveZ'] = -bi['moveZ']
                    }
                }
            }
        }
    }

    // 展示信息(文字和进度条)
    protected UpdateShowInfo(){
		let restTime: number = parseFloat((this._dtDriver.maxSeconds-this._dtDriver.lostSeconds10/10).toFixed(1));
		if ( restTime < 0 ) restTime = 0.0;
		let tips:string = ` 关卡:${this._dtDriver.stage} 目标:${this._dtDriver.charsFind}(${this._dtDriver.pickedXCnt}/${this._dtDriver.xObjCnt}) `
						+ `\n 计时:${restTime}\n`;
        this.updateShowTips( tips );
        if ( restTime > this._dtDriver.maxSeconds * 0.8 ){
            this._hudPerColor = "rgba(0,255,0,0.5)";
        }
        else if ( restTime > this._dtDriver.maxSeconds * 0.3 ){
            this._hudPerColor = "rgba(255,255,0,0.5)";
        }
        else{
            this._hudPerColor = "rgba(255,0,0,0.5)";
        }
        this.updateProgressBar( restTime, this._dtDriver.maxSeconds, this._hudPerTip);
    }

    // 展示进度条
    protected updateProgressBar( up:number, down:number, tip: boolean=true ) {
        if ( this._hudPer == null ){
            this._hudPer = new aw.ProgressHUD();
            this._hudPer.SetProgress(this._hudPerW, this._hudPerH, up, down, this._hudPerMulti, this._hudPerFixedCnt,
                                            this._hudPerColor, this._hudPerBgColor, this._hudPerFrmColor, this._hudPerFrmW,
                                        this._hudPerTip, this._hudPerTipColor, this._hudPerTipAlign, this._hudPerTipFont);
		    this._hudPer.x = (this._width/2 - this._hudPer.width/2);
            if ( this._hud == null){
		        this._hudPer.y = 2;
            }
            else{
		        this._hudPer.y = 2 + this._hudH + 2;
            }

            this._view3D.addHUD(this._hudPer );
        }
        else{
            this._hudPer.UpdateProgress( up, down, this._hudPerColor, tip );
        }
    }

    // 展示文字信息
    protected updateShowTips( tips:string ) {
        if ( this._hud == null ){
            this._hud = new aw.HUD();
            this._hud.SetCharTexture(this._hudW, this._hudH, tips, this._hudAlign, this._hudFont,
                                            this._hudColor, this._hudBgColor, this._hudFrmBgColor, this._hudFrmW);
		    this._hud.x = (this._width/2 - this._hud.width/2);
            if (this._hudPer == null){
		        this._hud.y = 2;
            }
            else{
		        this._hud.y = 2 + this._hudPerH + 2;
            }

            this._view3D.addHUD(this._hud );
        }
        else{
            this._hud.UpdateTextureString( tips );
        }
    }

    // 交互信息
    protected updateInteractiveTips( tips:string ) {
        if ( this._hudInter == null ){
            this._hudInter = new aw.HUD();
            this._hudInter.SetCharTexture(this._hudInterW, this._hudInterH, tips, this._hudInterAlign, this._hudInterFont,
                                            this._hudInterColor, this._hudInterBgColor, this._hudInterFrmBgColor, this._hudInterFrmW);
		    this._hudInter.x = (this._width/2 - this._hudInter.width/2);
		    this._hudInter.y = (this._view3D.height/2 - this._hudInter.height/2);
        }
        else{
            this._hudInter.UpdateTextureString( tips );
        }

		if ( this._view3D.hasHUD( this._hudInter ) ){
		}
		else{
            this._view3D.addHUD(this._hudInter );
		}
    }

    protected OnPickupBox(e: egret3d.Event3D): void {
        if ( this._uiReady === false ) return;
        if ( ! this._dtDriver.isRunning ) return;
        if ( this._boxInfo[ e.currentTarget.id ] == null ){
            // do nothing
        }
        else{
            for (let idx: number=0; idx < this._xBoxIds.length; idx++){
                if ( e.currentTarget.id == this._xBoxIds[idx] ){
                    this._boxInfo[ e.currentTarget.id ]= null;
                    this._dtDriver.addPickedXCnt();
					this.UpdateShowInfo();
                    break;
                }
            }
        }
    }

	protected HideInteractiveHUD() {
		this._view3D.delHUD( this._hudInter );
	}

    //重新开始游戏
	protected restart() {
		this._dtDriver.StartGame();
        if ( this._uiReady === true ) this._uiReady = false;
	}

    private ClearOldScene() {
        for ( let id in this._boxBak){
            if ( this._boxBak[id] != null ){
                this._view3D.delChild3D( this._boxBak[id]['box'] );
                delete this._boxBak[id];
            }
        }

        this._boxInfo = {};
        this._boxBak  = {};
        this._xBoxIds = [];
        this._deadBox = {"cnt": 0, 'box':{} };
    }

    // 点触改变状态
    public interactiveOpt(e:Event, self:CreateGame ) {
		if ( `${e}` == '256' || (typeof e === "object" && 'touches' in e)) {
			switch ( self._dtDriver.dataState ){ // 操作并根据数据驱动的状态控制游戏进度选折
			case aw.GameDataState.READY_GO:
        	    self.restart()
				self.HideInteractiveHUD();
        	    break;
			case aw.GameDataState.IN_RUN:
        	    // do nothing
        	    break;
			case aw.GameDataState.IN_PAUSE:
        	    self._dtDriver.Resume();
				self.HideInteractiveHUD();
        	    break;
			case aw.GameDataState.USER_WIN:
                this.ClearOldScene();
                this.GenCharBox();
                this._dtDriver.dataState = aw.GameDataState.READY_GO;
                this.updateInteractiveTips( this._dtDriver.readyTips );
				break;
			case aw.GameDataState.TIME_OVER:
                this.ClearOldScene();
                this.GenCharBox();
                this._dtDriver.dataState = aw.GameDataState.READY_GO;
                this.updateInteractiveTips( this._dtDriver.readyTips );
				break;
			case aw.GameDataState.NEVER_START:
        	    self.restart()
				self.HideInteractiveHUD();
				break;
			default:
        	    self.restart()
				self.HideInteractiveHUD();
				return;
			}
		}
    }

    // 根据状态刷新UI
    protected onUpdate(): void {
        super.onUpdate();
        this._dtDriver.Update(); // 数据计算的更新
		switch ( this._dtDriver.dataState ){ // 根据数据驱动的结果，控制游戏进度选折
		case aw.GameDataState.READY_GO:
            this.updateInteractiveTips( this._dtDriver.readyTips );
            break;
		case aw.GameDataState.IN_RUN:
            this.UpdateBoxView();   // 更新盒子飞行
            this.UpdateShowInfo();  // 更新 分数，等级等暂时信息
            break;
		case aw.GameDataState.IN_PAUSE:
            this.updateInteractiveTips( this._dtDriver.pauseTips );
            break;
		case aw.GameDataState.USER_WIN: //过关
            this.updateInteractiveTips( this._dtDriver.winTips );
            //console.log("dead box cnt:" + this._deadBox["cnt"] + "; picked X cnt:" + this._dtDriver.pickedXCnt);
            if (this._deadBox["cnt"] === this._dtDriver.pickedXCnt ){
                ; // do nothing.
            }
            else{
                this.UpdateBoxView();   // 更新盒子飞行
            }
			break;
		case aw.GameDataState.TIME_OVER: // 未过关 -- 超时
            this.updateInteractiveTips( this._dtDriver.failedTips );
			break;
		case aw.GameDataState.NEVER_START:
            this.updateInteractiveTips( " Sorry， 未准备就绪! " );
			break;
		default:
            this.updateInteractiveTips( " :(， something wrong! " );
			return;
		}
    }
} 

class Main extends egret.DisplayObjectContainer {
    public static nt_debug: boolean = false;
    public static nt_appid: number = 0;
    public static nt_version: number = 0;

    public enable_nest: boolean = false;

    public static regNest(debug: boolean, appid: number, version: number){
            Main.nt_debug = debug;
            Main.nt_appid = appid;
            Main.nt_version = version;
    }

    public constructor() {
        super();
        if ( Main.nt_appid > 0 && Main.nt_version > 0 ){
            this.enable_nest = true;
        }
        else {
            this.enable_nest = false;
        }

        if ( this.enable_nest ) {
            var info:any = { 'debug': Main.nt_debug, 'egretAppId': Main.nt_appid, 'version': Main.nt_version };
			console.log("Nest config: " );
			console.log( info );
            nest.core.startup(info, function (data) {
                if(data.result == 0) {
                    console.log("Nest初始化成功!" );
                    console.log( data.toString() );
                    var loginInfo = {};
                    nest.user.checkLogin( loginInfo, function(data){
                        if(data.token) {
                            console.log("已登录!" );
                            console.log( data.toString() );
                            var token = data.token;
                            new CreateGame();
                        }
                        else {
                            nest.user.login({loginType:'qq'}, function (data) {
                                if(data.token) {
                                    console.error("登录成功!" );
                                    console.error( data.toString() );
                                    var token = data.token;
                                    new CreateGame();
                                }
                                else {
                                    console.error("登录失败!" + data.toString() );
                                }
                            })
                        }
                    });
                }
                else {
                    console.error("Nest 初始化失败:" + data.toString() );
                }
            })
        }
        else {
            new CreateGame();
        }
    }
}
