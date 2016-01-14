module aw {

     /**
      * @language zh_CN
     * @class aw.GameDataDriver
     * @classdesc
     * 
     */
    export class GameDataDriver {
        protected _startTime : Date = null;        
        protected _maxSeconds: number = 60;
        protected _lostSeconds:number=  0;
        protected _moveSpeed:  number = 3;
        protected _rotateSpeed:number = 1;


        protected _level      : number=  1;
        protected _points     : number=  1;

        constructor( startTime: Date = null ) {
            this.startGame( startTime );
        }
        public startGame( startTime: Date = null ){
            if ( startTime == null ) { 
                this._startTime = new Date();
            }
            else{
                this._startTime = startTime;
            } 
        }

        public update( now: Date = new Date() ) {
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

        public set lostSeconds(v: number) {
            this._lostSeconds = v;
        }
        public get lostSeconds(): number {
            return this._lostSeconds;
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
