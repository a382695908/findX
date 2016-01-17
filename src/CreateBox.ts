class CreateBox extends CreateSky{
    protected _dtDriver: aw.FindXDataDriver = null;

    protected _boxInfo : any = {};		 //实时操作的盒子存储
    protected _boxBak  : any = {};       //生产队盒子的原始备份
    protected _xBoxIds : number[] = [];  //记录特殊字符，点击时比较判断

	// 盒子活动的空间大小
    protected _width  : number = 600;
    protected _height : number = 800;
    protected _depth  : number = 400;

	// 展示信息的HUD(Head UP Display)
    protected _hud : egret3d.HUD;
    protected _hudW: number = 128;
    protected _hudH: number = 128;
    protected _hudFont: string = "20px 宋体";
    protected _hudAlign: string = "left";
    protected _hudColor: string = "rgba(255,0,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
    protected _hudBgColor: string="rgba(0,0,0,0)";
    protected _hudFrmBgColor: string="rgba(0,0,0,0)";
    protected _hudFrmW: number=0;

	// 交互信息的HUD(Head UP Display)
    protected _hudInter : egret3d.HUD;
    protected _hudInterW: number = 128;
    protected _hudInterH: number = 64;
    protected _hudInterFont: string = "16px 宋体";
    protected _hudInterAlign: string = "center";
    protected _hudInterColor: string = "rgba(255,0,0,1);rgba(255,255,0,1);rgba(0,255,0,1);rgba(0,0,255,1)";
    protected _hudInterBgColor: string="rgba(200,200,200, 0.8)";
    protected _hudInterFrmBgColor: string="rgba(0,0,0,1)";
    protected _hudInterFrmW: number=0;

	//盒子上的字符纹理
    protected _boxTxtureW: number = 64;
    protected _boxTxtureH: number = 64;
    protected _boxTxtureFont: string = "60px 楷体";
    protected _boxTxtureAlign: string = "center";
    protected _boxTxtureColor: string = "rgba(0,0,255,1)";
    protected _boxTxtureBgColor: string="rgba(200,200,200,1)";
    protected _boxTxtureFrmBgColor: string="rgba(0,0,255,1)";
    protected _boxTxtureFrmW: number=3;

    public constructor() {
        super();
        this._width  = this._viewPort.width;
        this._height = this._viewPort.height;
        this._depth  = this._viewPort.width;

        this._dtDriver = new aw.FindXDataDriver();
		this._dtDriver.startGame();
    }

    public get dataDriver() :aw.FindXDataDriver {
        return this._dtDriver;
    }

    protected onView3DInitComplete(): void {
        this.textureComplete();
        super.onView3DInitComplete();

		confirm( this._dtDriver.startTips );
    }
    private interactiveOpt( e : KeyboardEvent) {
        console.log(`mouse click:${e}`); 
    }

    private textureComplete() {
        egret3d.Input.instance.addListenerKeyClick( this.interactiveOpt );
        egret3d.Input.instance.addTouchStartCallback(this.interactiveOpt );

		//环境光 
        let lightGroup: egret3d.LightGroup = new egret3d.LightGroup();
        let directLight: egret3d.DirectLight = new egret3d.DirectLight(new egret3d.Vector3D(100, 100, 100));
        directLight.diffuse = 0xAAAAAA;
        lightGroup.addDirectLight(directLight);

        for (let idx:number = 0; idx < this._dtDriver.totalObjCnt; ++idx){
            let box : egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), new egret3d.TextureMaterial());
            box.mouseEnable = true;
            box.addEventListener(egret3d.Event3D.MOUSE_CLICK, (e: egret3d.Event3D) => this.onPickupBox(e));
            box.addEventListener(egret3d.Event3D.TOUCH_START, (e: egret3d.Event3D) => this.onPickupBox(e));
            box.material.lightGroup = lightGroup;
            this._view3D.addChild3D(box);

            if ( this._xBoxIds.length < this._dtDriver.XObjCnt ){
                aw.CharTexture.createCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsFind, 
                                                this._boxTxtureAlign, this._boxTxtureFont, this._boxTxtureColor, 
                                                this._boxTxtureBgColor, this._boxTxtureFrmBgColor, this._boxTxtureFrmW);
                this._xBoxIds.push( box.id );
            }
            else{
                let n: number = Math.random() > 0.5 ? 1 : 0;
                aw.CharTexture.createCharTexture(this._boxTxtureW, this._boxTxtureH, this._dtDriver.charsPool[n], 
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

            this._boxInfo[box.id] = bi;
            this._boxBak[box.id]  = bi;
        }

		// 进度信息
		let restTime: string = (this._dtDriver.maxSeconds-this._dtDriver.lostSeconds10/10).toFixed(1);
		let tips:string = ` 目标:${this._dtDriver.charsFind}(${this._dtDriver.pickedXCnt}/${this._dtDriver.XObjCnt})\n `
						+ `计时:${restTime}` 
                        + `\n 等级:${this._dtDriver.level} \n 积分:${this._dtDriver.points}`;
        this.updateShowTips( tips );

		// 交互信息
		let inter_tips:string = ` 请找出${this._dtDriver.XObjCnt}个 ${this._dtDriver.charsFind} 字符\n  触摸任意地方继续  `
        this.updateInteractiveTips( inter_tips);

        this._cameraCtl.setEyesLength(3500);
    }

    protected updateShowTips( tips:string ) {
        if ( this._hud!= null ){
            this._view3D.delHUN( this._hud);
            this._hud= null;
        }
        this._hud = new egret3d.HUD();
		this._hud.width = this._hudW;
		this._hud.height= this._hudH;
		this._hud.x = (this._view3D.width/2 - this._hud.width/2);
		this._hud.y = 2;

		let restTime: string = (this._dtDriver.maxSeconds - this._dtDriver.lostSeconds10/10).toFixed(1);
        aw.CharTexture.createCharTexture(this._hudW, this._hudH, tips, this._hudAlign, this._hudFont,
                                        this._hudColor, this._hudBgColor, this._hudFrmBgColor, this._hudFrmW);
        this._hud.texture = aw.CharTexture.texture;

        this._view3D.addHUD(this._hud );

    }

    protected updateInteractiveTips( tips:string ) {
        if ( this._hudInter != null ){
            this._view3D.delHUN( this._hudInter );
            this._hudInter = null;
        }
        this._hudInter = new egret3d.HUD();
		this._hudInter.width = this._hudInterW;
		this._hudInter.height= this._hudInterH;
		this._hudInter.x = (this._view3D.width/2 - this._hudInter.width/2);
		this._hudInter.y = (this._view3D.height/2 - this._hudInter.height/2);
        aw.CharTexture.createCharTexture(this._hudInterW, this._hudInterH, tips, this._hudInterAlign, this._hudInterFont,
                                        this._hudInterColor, this._hudInterBgColor, this._hudInterFrmBgColor, this._hudInterFrmW);
        this._hudInter.texture = aw.CharTexture.texture;
        this._view3D.addHUD(this._hudInter );
    }

    protected onUpdate(): void {
        super.onUpdate();
        this._dtDriver.update();

        if ( !this._dtDriver.IsRunning ){
			switch ( this._dtDriver.OverReason ){
			case aw.GameOverReason.USER_WIN:
                this.updateInteractiveTips( "恭喜， 你成功了!" );
            	alert("恭喜， 你成功了!");
				break;
			case aw.GameOverReason.TIME_OVER:
                this.updateInteractiveTips( "没时间了，你失败了!" );
            	alert("没时间了，你失败了!");
				break;
			case aw.GameOverReason.USER_FAILED:
                this.updateInteractiveTips( "哈哈， you are a loser!" );
            	alert("哈哈， you are a loser!");
				break;
			case aw.GameOverReason.NEVER_START:
                this.updateInteractiveTips( "Sorry， 未准备就绪!" );
            	alert("Sorry， 未准备就绪!");
				break;
			default:
                this.updateInteractiveTips( ":(， something wrong!" );
            	alert(":(， something wrong!");
				return;
			}
            this.updateInteractiveTips( this._dtDriver.startTips );
			if (true === confirm( this._dtDriver.startTips ) ){
				this.restart();
				console.log("Start game again.");
			}
			else{
				console.log("Give up play again, leave away.");
			}
            return;
        }

        for(let id in this._boxInfo ){
            let bi = this._boxInfo[id];
            if ( bi == null ) continue;

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

		let restTime: string = (this._dtDriver.maxSeconds-this._dtDriver.lostSeconds10/10).toFixed(1);
		let tips:string = ` 目标:${this._dtDriver.charsFind}(${this._dtDriver.pickedXCnt}/${this._dtDriver.XObjCnt})\n `
						+ `计时:${restTime}` 
                        + `\n 等级:${this._dtDriver.level} \n 积分:${this._dtDriver.points}`;
        this.updateShowTips( tips );
    }

    protected onPickupBox(e: egret3d.Event3D): void {
        if ( this._boxInfo[ e.currentTarget.id ] == null ){
            //this._boxInfo[ e.currentTarget.id ] = this._boxBak[ e.currentTarget.id ];
        }
        else{
            for (let idx: number=0; idx < this._xBoxIds.length; idx++){
                if ( e.currentTarget.id == this._xBoxIds[idx] ){
                    this._boxInfo[ e.currentTarget.id ] = null;
                    this._dtDriver.addPickedXCnt();
                    this._dtDriver.updatePoints();
                    break;
                }
            }
        }
    }

	protected restart() {
		this._dtDriver.startGame();
        for(let id in this._boxInfo ){
            let bi = this._boxInfo[id];
            if ( bi !== null ) continue;
			this._boxInfo[id] = this._boxBak[id];
		}
	}
} 
