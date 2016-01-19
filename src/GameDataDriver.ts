namespace aw {

     /**
      * @language zh_CN
     * @class aw.GameDataDriver
     * @classdesc
     * 
     */
    export enum GameDataState {
        NEVER_START,
        READY_GO,
        IN_RUN,
        IN_PAUSE,
        TIME_OVER,
        USER_WIN
    }

    export class GameDataDriver {
        protected _driverState : GameDataState = GameDataState.NEVER_START;  // 数据驱动的状态
        protected _maxSeconds: number = 20;     // 数据驱动最大运行秒数
        protected _startTime : Date = null;     // 数据驱动开始时间    
        protected _pauseTime : Date = null;     // 数据驱动暂停时间
        protected _resumeTime : Date = null;    // 数据驱动恢复时间
        protected _sleepSecnds10: number = 0;   // 数据驱动休眠时间秒数 * 10
        protected _lostSeconds10:number=  0;    // 数据驱动已经运行秒数 * 10
        protected _stage      : number=  0;     // 关卡

        constructor( startTime: Date = null ) {
            this._driverState = GameDataState.READY_GO;
            this._startTime = null;
            this._pauseTime = null;
            this._resumeTime = null;
            this._sleepSecnds10 = 0;
			this._lostSeconds10 = 0;
        }

        public StartGame( startTime: Date = null ){
            this._driverState = GameDataState.IN_RUN;
            if ( startTime == null ) { 
                this._startTime = new Date();
            }
            else{
                this._startTime = startTime;
            } 
            this._pauseTime = null;
            this._resumeTime = null;
            this._sleepSecnds10 = 0;
			this._lostSeconds10 = 0;
        }

        public set dataState( v : GameDataState ){
            this._driverState = v;
        }
        public get dataState( ): GameDataState {
            return this._driverState;
        }

        public Pause() {
            if ( this._pauseTime == null ){
                this._pauseTime = new Date();
                this._driverState = GameDataState.IN_PAUSE;
            }
        }
        public Resume() {
            if ( this._pauseTime != null && this._resumeTime == null ){
                this._resumeTime = new Date();
                this._sleepSecnds10 += Math.floor( (this._resumeTime.getTime() - this._pauseTime.getTime()) / 100);
                this._driverState = GameDataState.IN_RUN;
                this._pauseTime = null;
            }
        }
        
        public get isRunning(): boolean {
            return this._driverState === GameDataState.IN_RUN;
        }

        public Update( ) {
			if ( this.isRunning ){
         	   let now: Date = new Date();
         	   this._lostSeconds10 = Math.floor( (now.getTime() - this._startTime.getTime() ) / 100 - this._sleepSecnds10 );
         	   if ( this._lostSeconds10 > this._maxSeconds * 10 ){
         	       this._driverState = GameDataState.TIME_OVER;
		 	   	return;
         	   }
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
                this._driverState = GameDataState.TIME_OVER;
            }
        }
        public get lostSeconds10(): number {
            return this._lostSeconds10;
        }
 
        public StageUp():number {
            this._stage++;
            return this._stage;
        }
        public set stage(v: number) {
            this._stage = v;
        }
        public get stage(): number {
            return this._stage;
        }
    }
}
