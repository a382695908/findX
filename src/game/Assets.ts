class Assets {
    public static initLoad() {
        egret3d.AssetsManager.getInstance().setRootURL("resource/");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/bk.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/fr.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/lf.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("sky/3/rt.jpg");
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/up.jpg"); // 只支持Y轴旋转，不需要顶／底纹理
        //egret3d.AssetsManager.getInstance().addLoadTexture("sky/dn.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("star64.jpg");
        egret3d.AssetsManager.getInstance().addLoadTexture("wood64.jpg");
    }

    public static startLoad() {
        egret3d.AssetsManager.getInstance().startLoad();
    }

}
