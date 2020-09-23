// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Node,
        _from: 0,
        _to: 0,
        _duration: 0,
        _elapsed: 0,
        _percent: 0,
    
        _tween: cc.Tween,
    },

   
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(this.node._components[1].progress);
        this.action();
    },

    start() {
        this.enabled = false;
    },
 
    isDone() {
        return this._elapsed >= this._duration;
    },
 
    progressTo(duration, percent) {
        if (percent < 0 || percent > 1.0) {
            return;
        }
 
       this.tween(duration, percent);
    },
 
    tween(duration, percent) {
        if (this._tween) {
            this._tween.stop();
        }
 
        this._tween = cc.tween(this.bar).to(duration, { progress: percent })
                        .call(()=>{
                            this._tween = null;
                        })
                        .start();
    },
 
    action(duration, percent) {
        this._from = this.bar.progress;
        this._to = percent;
        this._elapsed = 0;
        this._duration = duration;
 
        this.enabled = true;
    },
// logger(){console.log("clicked");},
    update(dt) {
        if (this.isDone()) {
            this.enabled = false;
            return;
        }
 
        this._elapsed += dt;
 
        let t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
        t = (1 > t ? t : 1);
        this.step(t > 0 ? t : 0);
    },
 
    step(dt) {
        let percent = this._from + (this._to - this._from) * dt;
        if (this._percent != percent) {
            this._percent = cc.misc.clamp01(percent);
            this.bar.progress = this._percent;
        }
}}
)
