class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingPanel;
    private e3d_game:E3DBaseEnv ;

    public static nt_debug: boolean = false;
    public static nt_appid: number = 0;
    public static nt_version: number = 0;
    public static nt_channel: number = 0;
    public static nt_statid: string = "0";
    public static nt_token: string = null;
    public static nt_user:any = null;
    //public static nt_id: string = null;

    public enable_nest: boolean = false;

    public static regNest(debug: boolean, appid: number, version: number, channel: number, statid: string){
            Main.nt_debug = debug;
            Main.nt_appid = appid;
            Main.nt_version = version;
            Main.nt_channel = channel;
            Main.nt_statid = statid;
            Main.nt_token = null;
            Main.nt_user = null;
            esa.EgretSA.init({"gameId": Main.nt_statid,"chanId":Main.nt_channel, "debug": false});
            //Main.nt_id = null;
    }


    protected createChildren(): void {
        super.createChildren();
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        
        this.loadingView = new LoadingPanel();
        window["loadPanel"] = this.loadingView;
        this.loadingView.left = 0 ;
        this.loadingView.right = 0;
        this.loadingView.top = 0;
        this.loadingView.bottom = 0;
        this.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        Assets.initLoad();
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.isResourceLoadEnd = true;
            
            egret3d.AssetsManager.getInstance().addEventListener(egret3d.Event3D.EVENT_LOAD_PROGRESS,(e: egret3d.Event3D) => this.progress(e));
            this.e3d_game = new FindX();
        }
    }
    
    private progress(e: egret3d.Event3D) {
        var loadingView: LoadingPanel = <LoadingPanel>window["loadPanel"];
        loadingView.setProgress(egret3d.AssetsManager.getInstance().loadCompleteNumber,egret3d.AssetsManager.getInstance().loadTotalNumber);
        if(this.isResourceLoadEnd&&egret3d.AssetsManager.getInstance().loadCompleteNumber == egret3d.AssetsManager.getInstance().loadTotalNumber) {
            setTimeout(() => this.createScene(),100);
        }
    }
    
    private createScene(){
        var loadingView: LoadingPanel = <LoadingPanel>window["loadPanel"];
        loadingView.parent.removeChild(loadingView);
		

        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            
            var navPanel: NavPanel = new NavPanel();
            this.addChild(navPanel);
            window["nav"] = navPanel;
            this.e3d_game.start3D();
            this.addChild(this.e3d_game);
        }
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
}
