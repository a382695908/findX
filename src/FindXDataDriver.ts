
module aw {

     /**
      * @language zh_CN
     * @class aw.CharTexture
     * @classdesc
     * 棋盘格纹理
     */
    export class FindXDataDriver extends aw.GameDataDriver {
        protected _totalObjCnt:number = 12;// 物体总数
        protected _XObjCnt:    number =  3;// 需要找到的目标物体数
        protected _maxFaceCnt: number =  4;// 物体的最大面数
        protected _XFaceCnt:   number =  4;// 物体上有特殊字符的面数

        protected _moveSpeed:  number = 3; // 移动线速度
        protected _rotateSpeed:number = 1; // 移动转速

        protected _pickedXCnt: number =  0; // 当前已经拾取的目标物体数

        private _charsFind: string = "X";   // 特殊字符
        private _charsPool: string[] = ["入", "人" ];  // 干扰字符

        private _startTips: string = "";
        private _winTips: string = "";
        private _failedTips: string = "";

        constructor( startTime: Date = null ) {
            super( startTime );
            this._startTips = `请找到${this._XFaceCnt}个有${this._charsFind}字的物体`;
        }

        public set totalObjCnt(v: number) {
            this._totalObjCnt = v;
        }
        public get totalObjCnt(): number {
            return this._totalObjCnt;
        }

        public set moveSpeed(v: number) {
            this._moveSpeed = v;
        }
        public get moveSpeed(): number {
            return this._moveSpeed;
        }
 
        public set rotateSpeed(v: number) {
            this._rotateSpeed = v;
        }
        public get rotateSpeed(): number {
            return this._rotateSpeed;
        }

        public get startTips(): string {
            return this._startTips;
        }

        public set XObjCnt(v: number) {
            this._XObjCnt = v;
        }
        public get XObjCnt(): number {
            return this._XObjCnt;
        }

        public set maxFaceCnt(v: number) {
            this._maxFaceCnt = v;
        }
        public get maxFaceCnt(): number {
            return this._maxFaceCnt;
        }

        public set XFaceCnt(v: number) {
            this._XFaceCnt = v;
        }
        public get XFaceCnt(): number {
            return this._XFaceCnt;
        }

        public set charsFind(c: string){
            this._charsFind = c;
        }
        public get charsFind(): string {
            return this._charsFind;
        }

        public set charsPool(v: string[]) {
            this._charsPool = v;
        }
        public get charsPool(): string[] {
            return this._charsPool;
        }

        public addPickedXCnt(v: number=1) {
            this._pickedXCnt += v;
        }
        public get pickedXCnt(): number {
            return this._pickedXCnt;
        }

        public update( ){
            if ( this._startTime == null ) return;
            super.update( );
        }

        public updatePoints( ){
            if ( this._startTime == null ) {
                this._running = false;
                this._overReason = GameOverReason.NEVER_START;
                return;
            }
            if ( this._XObjCnt <= this._pickedXCnt ){
                this._running = false;
                this._overReason = GameOverReason.USER_WIN;
                return;
            }
            if ( this._maxSeconds * 10 <= this._lostSeconds10 ){
                this._running = false;
                this._overReason = GameOverReason.TIME_OVER;
                return;
            }

            this._points += Math.floor( (30 - this._pickedXCnt) *  (600 - this._lostSeconds10 ) / 10);
            this._level = Math.ceil( this._points / 1600 );
        }
    }
}
