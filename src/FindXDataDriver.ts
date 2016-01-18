namespace aw {

     /**
      * @language zh_CN
     * @class aw.FindXDataDriver
     * @classdesc
     * 棋盘格纹理
     */
    export class FindXDataDriver extends aw.GameDataDriver {
        protected _totalObjCnt:number = 12;// 物体总数
        protected _XObjCnt:    number =  2;// 需要找到的目标物体数
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
            this._startTips = `请找到${this._XObjCnt}个有${this._charsFind}物体`;
            this._winTips = `恭喜，你找到全部${this._XObjCnt}个有${this._charsFind}物体`;
            this._failedTips = `:(，你只找到${this._pickedXCnt}个有${this._charsFind}物体`;
            this._pickedXCnt = 0;
        }
        public startGame( startTime: Date = null ){
			super.startGame( startTime );
            this._startTips = `请找到${this._XObjCnt}个有${this._charsFind}物体`;
            this._winTips = `恭喜，你找到全部${this._XObjCnt}个有${this._charsFind}物体`;
            this._failedTips = `:(，你只找到${this._pickedXCnt}个有${this._charsFind}物体`;
            this._pickedXCnt = 0;
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
        public get winTips(): string {
            return this._winTips;
        }
        public get failedTips(): string {
            return this._failedTips;
        }

        public set xObjCnt(v: number) {
            this._XObjCnt = v;
        }
        public get xObjCnt(): number {
            return this._XObjCnt;
        }

        public set maxFaceCnt(v: number) {
            this._maxFaceCnt = v;
        }
        public get maxFaceCnt(): number {
            return this._maxFaceCnt;
        }

        public set xFaceCnt(v: number) {
            this._XFaceCnt = v;
        }
        public get xFaceCnt(): number {
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

        public Update( ){
            if ( this._startTime == null ) return;
            super.Update( );
        }
    }
}
