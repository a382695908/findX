
module aw {

     /**
      * @language zh_CN
     * @class aw.CharTexture
     * @classdesc
     * 棋盘格纹理
     */
    export class FindXDataDriver extends aw.GameDataDriver {
        protected _totalObjCnt:number = 12;
        protected _XObjCnt:    number =  1;
        protected _maxFaceCnt: number =  4;
        protected _XFaceCnt:   number =  4;

        protected _pickedXCnt: number =  0;

        private _charsFind: string = "X";
        private _charsPool: string[] = ["入", "人" ];

        constructor( startTime: Date = null ) {
            super( startTime );
        }

        public set totalObjCnt(v: number) {
            this._totalObjCnt = v;
        }
        public get totalObjCnt(): number {
            return this._totalObjCnt;
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

        public update( now: Date = new Date() ){
            if ( this._startTime == null ) return;
            super.update( now );
            this._points += Math.floor( (30 - this._pickedXCnt) *  (600 - this._lostSeconds10 ) / 10);
            this._level = Math.ceil( this._points / 1600 );
            this._lostSeconds10 = Math.floor( (now.getTime() - this._startTime.getTime() ) / 100 );
        }

        public updatePoints( ){
            if ( this._startTime == null ) {
                this._running = false; return;
            }
            if ( 30 <= this._pickedXCnt || 600 <= this._lostSeconds10 ){
                this._running = false; return;
            }
            this._points += Math.floor( (30 - this._pickedXCnt) *  (600 - this._lostSeconds10 ) / 10);
            this._level = Math.ceil( this._points / 1600 );
        }
    }
}
