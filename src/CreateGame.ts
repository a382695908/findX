class CreateGame extends CreateBaseEnv{
    protected _dtDriver: aw.FindXDataDriver = null;
    private _uiReady: boolean = false;

    protected _boxInfo : any = {};		 //实时操作的盒子存储
    protected _boxBak  : any = {};       //生产队盒子的原始备份
    protected _xBoxIds : number[] = [];  //记录特殊字符，点击时比较判断

	// 盒子活动的空间大小
    protected _width  : number = 600;
    protected _height : number = 800;
    protected _depth  : number = 400;

	// 展示信息的HUD(Head UP Display)
    protected _hud : aw.HUD = null;
    protected _hudW: number = 128;
    protected _hudH: number = 128;
    protected _hudFont: string = "20px 宋体";
    protected _hudAlign: string = "left";
    protected _hudColor: string = "rgba(255,0,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
    protected _hudBgColor: string="rgba(0,0,0,0)";
    protected _hudFrmBgColor: string="rgba(0,0,0,0)";
    protected _hudFrmW: number=0;

	// 交互信息的HUD(Head UP Display)
    protected _hudInter : aw.HUD;
    protected _hudInterW: number = 256;
    protected _hudInterH: number = 64;
    protected _hudInterFont: string = "16px 宋体";
    protected _hudInterAlign: string = "center";
    protected _hudInterColor: string = "rgba(255,0,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
    protected _hudInterBgColor: string="rgba(100,100,100, 0.5)";
    protected _hudInterFrmBgColor: string="rgba(0,0,0,1)";
    protected _hudInterFrmW: number=0;

	//盒子上的字符纹理
    protected _boxTxtureW: number = 64;
    protected _boxTxtureH: number = 64;
    protected _boxTxtureFont: string = "60px 楷体";
    protected _boxTxtureAlign: string = "center";
    protected _boxTxtureColor: string = "rgba(255,0,0,1)";
    protected _boxTxtureBgColor: string="rgba(200,200,200,1)";
    protected _boxTxtureFrmBgColor: string="rgba(0,0,255,1)";
    protected _boxTxtureFrmW: number=3;

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
    }

    private textureComplete() {
		// 全局的鼠标/触摸事件 --- 用于进度控制操作
        egret3d.Input.instance.addListenerKeyClick( (e:Event, self:CreateGame ) => this.interactiveOpt(e, this ) );
        egret3d.Input.instance.addTouchStartCallback( (e:Event, self:CreateGame ) => this.interactiveOpt(e, this ) );

		//环境光 
        this._lightGroup = new egret3d.LightGroup();
        let directLight: egret3d.DirectLight = new egret3d.DirectLight(new egret3d.Vector3D(100, 100, 100));
        directLight.diffuse = 0xAAAAAA;
        this._lightGroup.addDirectLight(directLight);
		// 生成盒子
        this.GenCharBox();

		// 进度信息
		let restTime: string = (this._dtDriver.maxSeconds-this._dtDriver.lostSeconds10/10).toFixed(1);
		let tips:string = ` 目标:${this._dtDriver.charsFind}(${this._dtDriver.pickedXCnt}/${this._dtDriver.xObjCnt})\n `
						+ `计时:${restTime}\n 关卡:${this._dtDriver.stage}`;
        this.updateShowTips( tips );

		// 交互信息
		let inter_tips:string = ` 请找出${this._dtDriver.xObjCnt}个 ${this._dtDriver.charsFind} 字符\n  触摸任意地方继续  `
        this.updateInteractiveTips( inter_tips);

        this._cameraCtl.setEyesLength(3500);
    }

    protected GenCharBox() {
        for (let idx:number = 0; idx < this._dtDriver.totalObjCnt; ++idx){
            let box : egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, (e: egret3d.Event3D) => this.OnPickupBox(e));
            box.addEventListener(egret3d.Event3D.TOUCH_START, (e: egret3d.Event3D) => this.OnPickupBox(e));
            box.material.lightGroup = this._lightGroup;

            this._view3D.addChild3D(box);

            if ( this._xBoxIds.length < this._dtDriver.xObjCnt ){
                aw.CharTexture.CreateCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsFind, 
                                                this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, 
                                                this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
                this._xBoxIds.push( box.id );
            }
            else{
                let n: number = Math.floor(Math.random() * this._dtDriver.charsPool.length);
                aw.CharTexture.CreateCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsPool[n], 
                                                this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, 
                                                this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
            }
            box.material.diffuseTexture = aw.CharTexture.texture;

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

            bi['box'].rotationX = bi['rotationX'];
            bi['box'].rotationY = bi['rotationY'];
            bi['box'].rotationZ = bi['rotationZ'];

            bi['scaleX'] = 1;
            bi['scaleY'] = 1;
            bi['scaleZ'] = 1;
            bi['box'].scaleX = bi['scaleX'];
            bi['box'].scaleY = bi['scaleY'];
            bi['box'].scaleZ = bi['scaleZ'];

            this._boxInfo[box.id] = bi;
            this._boxBak[box.id]  = bi;
        }
    }

    protected UpdateBoxView(){
        if ( this._uiReady === false ){ // 初始化到空间乱序，避免一开始集中被批量选中
            this._uiReady = true;
            for(let id in this._boxInfo ){
                let bi = this._boxInfo[id];
                if ( bi == null ) continue;
                bi['box'].rotationX = (Math.random()*2*Math.PI - Math.PI);
                bi['box'].rotationY = (Math.random()*2*Math.PI - Math.PI);
                bi['box'].rotationZ = (Math.random()*2*Math.PI - Math.PI);
                bi['box'].x = (Math.random()*2 - 1) *  this._width;
                bi['box'].y = (Math.random()*2 - 1) *  this._height;
                bi['box'].z = (Math.random()*2 - 1) *  this._depth;
            }
        }
        else{
            for(let id in this._boxInfo ){
                let bi = this._boxInfo[id];
                if ( bi === null ) {
                    bi = this._boxBak[id];
                    if (bi['box'].scaleX <= 0.0001 || bi['box'].scaleY <= 0.0001 || bi['box'].scaleZ <= 0.0001 ) {
                        this._view3D.delChild3D( bi['box'] );
                    }
                    else{
                        if (bi['box'].scaleX === 1 && bi['box'].scaleY === 1 && bi['box'].scaleZ === 1 ) {
                            bi['scaleX'] = 1.1;
                            bi['scaleY'] = 1.1;
                            bi['scaleZ'] = 1.1;
                        }
                        else if (bi['box'].scaleX >= 4 || bi['box'].scaleY >= 4 || bi['box'].scaleZ >= 4 ) {
                            bi['scaleX'] = 0.95;
                            bi['scaleY'] = 0.95;
                            bi['scaleZ'] = 0.95;
                        }
                        
                        bi['box'].scaleX *= bi['scaleX'];
                        bi['box'].scaleY *= bi['scaleY'];
                        bi['box'].scaleZ *= bi['scaleZ'];
                    }
                }
                else{
                    bi['box'].rotationX += bi['rotationX'];
                    bi['box'].rotationY += bi['rotationY'];
                    bi['box'].rotationZ += bi['rotationZ'];

                    bi['box'].x += bi['moveX'];
                    bi['box'].y += bi['moveY'];
                    bi['box'].z += bi['moveZ'];

                    if ( bi['box'].x < -this._width || bi['box'].x > this._width ){
                        bi['moveX'] = -bi['moveX']
                    }
                    if ( bi['box'].y < -this._height || bi['box'].y > this._height ){
                        bi['moveY'] = -bi['moveY']
                    }
                    if ( bi['box'].z < -this._depth || bi['box'].z > this._depth ){
                        bi['moveZ'] = -bi['moveZ']
                    }
                }
            }
        }
    }

    protected updateShowTips( tips:string ) {
        if ( this._hud == null ){
            this._hud = new aw.HUD();
            this._hud.SetCharTexture(this._hudW, this._hudH, tips, this._hudAlign, this._hudFont,
                                            this._hudColor, this._hudBgColor, this._hudFrmBgColor, this._hudFrmW);
            this._view3D.addHUD(this._hud );
        }
        else{
            this._hud.UpdateTextureString( tips );
        }
		this._hud.x = (this._view3D.width/2 - this._hud.width/2);
		this._hud.y = 2;
    }

    protected updateInteractiveTips( tips:string ) {
        if ( this._hudInter == null ){
            this._hudInter = new aw.HUD();
            this._hudInter.SetCharTexture(this._hudInterW, this._hudInterH, tips, this._hudInterAlign, this._hudInterFont,
                                            this._hudInterColor, this._hudInterBgColor, this._hudInterFrmBgColor, this._hudInterFrmW);
        }
        else{
            this._hudInter.UpdateTextureString( tips );
        }
		this._hudInter.x = (this._view3D.width/2 - this._hudInter.width/2);
		this._hudInter.y = (this._view3D.height/2 - this._hudInter.height/2);
		if ( this._view3D.hasHUD( this._hudInter ) ){
		}
		else{
            this._view3D.addHUD(this._hudInter );
		}
    }

    protected UpdateShowInfo(){
		let restTime: string = (this._dtDriver.maxSeconds-this._dtDriver.lostSeconds10/10).toFixed(1);
		let tips:string = ` 目标:${this._dtDriver.charsFind}(${this._dtDriver.pickedXCnt}/${this._dtDriver.xObjCnt})\n `
						+ `计时:${restTime}\n 关卡:${this._dtDriver.stage}`;
        this.updateShowTips( tips );
    }

    protected OnPickupBox(e: egret3d.Event3D): void {
        if ( this._uiReady === false ) return;
        if ( this._boxInfo[ e.currentTarget.id ] == null ){
            //this._boxInfo[ e.currentTarget.id ] = this._boxBak[ e.currentTarget.id ];
        }
        else{
            for (let idx: number=0; idx < this._xBoxIds.length; idx++){
                if ( e.currentTarget.id == this._xBoxIds[idx] ){
                    this._boxInfo[ e.currentTarget.id ] = null;
                    this._dtDriver.addPickedXCnt();
					this.UpdateShowInfo();
                    break;
                }
            }
        }
    }

	protected HideInteractiveHUD() {
		this._view3D.delHUN( this._hudInter );
	}

    //重新开始游戏
	protected restart() {
		this._dtDriver.StartGame();

        for ( let id in this._boxBak){
            if ( this._boxBak[id] != null ){
                this._view3D.delChild3D( this._boxBak[id]['box'] );
                delete this._boxBak[id];
            }
        }

        this._boxInfo = {};
        this._boxBak  = {};
        this._xBoxIds = [];

		// 生成盒子
        this.GenCharBox();
        if ( this._uiReady === true ) this._uiReady = false;
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
                this._dtDriver.dataState = aw.GameDataState.READY_GO;
                this.updateInteractiveTips( this._dtDriver.readyTips );
				break;
			case aw.GameDataState.TIME_OVER:
        	    self.restart()
				self.HideInteractiveHUD();
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
		case aw.GameDataState.USER_WIN:
            this.updateInteractiveTips( this._dtDriver.winTips );
            this.UpdateBoxView();   // 更新盒子飞行
			break;
		case aw.GameDataState.TIME_OVER:
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
    public constructor() {
        super();
        new CreateGame();
    }
}
