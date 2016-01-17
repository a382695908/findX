module aw {

     /**
      * @language zh_CN
     * @class aw.GameDataDriver
     * @classdesc
     * 
     */
    export enum GameOverReason {
        NEVER_START,
        NOT_OVER,
        TIME_OVER,
        USER_WIN,
        USER_FAILED
    }

    export class GameDataDriver {
        protected _startTime : Date = null;     // 数据驱动开始时间    
        protected _running : boolean   = false; // 数据驱动是否在运行
        protected _maxSeconds: number = 60;     // 数据驱动最大运行秒数
        protected _lostSeconds10:number=  0;    // 数据驱动已经运行秒数 * 10

        protected _level      : number=  0;     // 等级
        protected _points     : number=  0;     // 积分

        protected _overReason : GameOverReason = GameOverReason.NEVER_START;

        constructor( startTime: Date = null ) {
        }
        public startGame( startTime: Date = null ){
            if ( startTime == null ) { 
                this._startTime = new Date();
            }
            else{
                this._startTime = startTime;
            } 
            this._running = true;
            this._overReason = GameOverReason.NOT_OVER;
			this._lostSeconds10 = 0;
        }

        public set OverReason( v : GameOverReason ){
            this._overReason = v;
        }
        public get OverReason( ): GameOverReason {
            return this._overReason;
        }
        
        public get IsRunning(): boolean {
            return this._running;
        }

        public update( ) {
            if ( this._startTime == null ) return;
            let now: Date = new Date();
            this._lostSeconds10 = Math.floor( (now.getTime() - this._startTime.getTime() ) / 100 );
            if ( this._lostSeconds10 > this._maxSeconds * 10 ){
                this._running = false;
                this._overReason = GameOverReason.TIME_OVER;
            }
        }

        public get startTime(): number {
            if ( this._startTime ){
                return this._startTime.getTime();
            }
            else{
                return -1;
            }
        }

        public set maxSeconds(v: number) {
            this._maxSeconds = v;
        }
        public get maxSeconds(): number {
            return this._maxSeconds;
        }

        public set lostSeconds10(v: number) {
            this._lostSeconds10 = v;
            if ( this._lostSeconds10 >= this._maxSeconds * 10 ){
                this._running = false;
                this._overReason = GameOverReason.TIME_OVER;
            }
        }
        public get lostSeconds10(): number {
            return this._lostSeconds10;
        }
 
        public set level(v: number) {
            this._level = v;
        }
        public get level(): number {
            return this._level;
        }
 
        public set points(v: number) {
            this._points = v;
        }
        public get points(): number {
            return this._points;
        }
    }
}
