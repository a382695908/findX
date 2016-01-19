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

        private _readyTips: string = "";
        private _startTips: string = "";
        private _pauseTips: string = "";
        private _winTips: string = "";
        private _failedTips: string = "";

        private _stageCtr: any[] = [
            {"ttCnt":  4, "xoCnt": 1, "tmLMT":  5, "mvSPD":  5, "rtSPD": 1, "mfCnt": 4, "xfCnt": 4, "cF": ["X" ], "cP": ["入", "人"] },
            {"ttCnt":  6, "xoCnt": 1, "tmLMT": 13, "mvSPD":  5, "rtSPD": 2, "mfCnt": 4, "xfCnt": 4, "cF": ["白" ], "cP": ["白", "自"] },
            {"ttCnt": 10, "xoCnt": 2, "tmLMT": 15, "mvSPD":  3, "rtSPD": 3, "mfCnt": 4, "xfCnt": 4, "cF": ["拔" ], "cP": ["拔", "拨"] },
            {"ttCnt": 12, "xoCnt": 3, "tmLMT": 18, "mvSPD":  3, "rtSPD": 4, "mfCnt": 4, "xfCnt": 4, "cF": ["天" ], "cP": ["天", "夭"] },
            {"ttCnt": 14, "xoCnt": 4, "tmLMT": 10, "mvSPD":  6, "rtSPD": 5, "mfCnt": 4, "xfCnt": 4, "cF": ["大" ], "cP": ["大", "犬"] },
            {"ttCnt": 16, "xoCnt": 4, "tmLMT": 10, "mvSPD":  6, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cF": ["日" ], "cP": ["日", "曰"] },
            {"ttCnt": 18, "xoCnt": 4, "tmLMT": 10, "mvSPD":  6, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cF": ["籍" ], "cP": ["籍", "藉"] },
            {"ttCnt": 20, "xoCnt": 4, "tmLMT": 12, "mvSPD":  6, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cF": ["阡", "迁", "歼", "奸" ], "cP": ["阡", "迁", "歼", "奸"] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 12, "mvSPD":  8, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cF": ["慕", "幕", "墓", "暮", "蓦", "募" ], "cP": ["慕", "幕", "墓", "暮", "蓦", "募"] },
            {"ttCnt": 26, "xoCnt": 4, "tmLMT": 12, "mvSPD": 10, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cF": ["稍", "梢", "捎" ], "cP": ["稍", "梢", "捎" ] },
            {"ttCnt": 28, "xoCnt": 4, "tmLMT": 15, "mvSPD": 10, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cF": ["魏", "巍", "翼", "冀" ], "cP": ["魏", "巍", "翼", "冀"] }
        ];

        constructor( startTime: Date = null ) {
            super( startTime );
            this._pickedXCnt = 0;
            this._readyTips = ` 请找到${this._XObjCnt}个${this._charsFind} `;
            this._startTips = ` 请找到${this._XObjCnt}个${this._charsFind} `;
            this._pauseTips = ` 暂停中，触摸/点击任意处继续... `;
            this._winTips = ` 恭喜，你找到全部${this._XObjCnt}个${this._charsFind} `;
            this._failedTips = ` :(，你找到${this._pickedXCnt}个${this._charsFind} `;
        }
        public StartGame( startTime: Date = null ){
			super.StartGame( startTime );
            this._pickedXCnt = 0;
            this._readyTips = ` 请找到${this._XObjCnt}个${this._charsFind} `;
            this._startTips = ` 请找到${this._XObjCnt}个${this._charsFind} `;
            this._pauseTips = ` 暂停中，触摸/点击任意处继续... `;
            this._winTips = ` 恭喜，你找到全部${this._XObjCnt}个${this._charsFind} `;
            this._failedTips = ` :(，你找到${this._pickedXCnt}个${this._charsFind} `;

            this.UpdateStageCtrData();
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

        public get readyTips(): string {
            return this._readyTips;
        }
        public get startTips(): string {
            return this._startTips;
        }
        public get pauseTips(): string {
            return this._pauseTips;
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
            if ( this._startTime == null ) {
         	    //this._driverState = GameDataState.NEVER_START;
         	    this._driverState = GameDataState.READY_GO;
                return;
            }
            super.Update( );
			if ( this._pickedXCnt == this._XObjCnt ) {
                this._driverState = GameDataState.USER_WIN;
                return;
            }
        }

        public StageUp(): number {
            super.StageUp();
            this.UpdateStageCtrData();

            return this.stage;
        }

        private UpdateStageCtrData() {
            let multi = Math.ceil( this.stage / this._stageCtr.length );
            if (multi == 0 ) multi = 1;
            let idx = this.stage % this._stageCtr.length;

            this._totalObjCnt = multi * this._stageCtr[idx]["ttCnt"]
            this._XObjCnt     = multi * this._stageCtr[idx]["xoCnt"]
            this._maxFaceCnt  = multi * this._stageCtr[idx]["mfCnt"]
            this._XFaceCnt    = multi * this._stageCtr[idx]["xfCnt"]
            this._moveSpeed   = multi * this._stageCtr[idx]["mvSPD"]
            this._rotateSpeed = multi * this._stageCtr[idx]["rtSPD"]

            this.maxSeconds   = multi * this._stageCtr[idx]["tmLMT"]

            let cIdx = multi - 1;
            if ( cIdx >= this._stageCtr[idx]["cF"].length ) cIdx = this._stageCtr[idx]["cF"].length - 1;
            this._charsFind   = this._stageCtr[idx]["cF"][cIdx]
            this._charsPool   = []; //this._stageCtr[idx]["cP"]
            for(let c of this._stageCtr[idx]["cP"]) {
                if ( c != this._charsFind ){ this._charsPool.push( c ); }
            }
        }
    }
}
