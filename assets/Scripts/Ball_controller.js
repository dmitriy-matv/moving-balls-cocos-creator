
cc.Class({
    extends: cc.Component,

    isMoving : false,
    body: cc.RigidBody,

    properties: {
        
        speed: 1000,

        topWall: cc.Node,
        rightWall: cc.Node,
        bottomWall: cc.Node,
        leftWall: cc.Node,

       
    },

    runBall(){
        this.isMoving = true;
        this.body.linearVelocity=cc.v2(500,1000);
        
    },

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.body = this.node.getComponent(cc.RigidBody);
    },

    onKeyDown(e)  {
        if((e.keyCode == cc.macro.KEY.enter || e.keyCode == cc.macro.KEY.space) && !this.isMoving){
            this.runBall();
        }
    },

    onCollisionEnter(other, self){
        switch(other.node){
            case this.leftWall:
            case this.rightWall:
                this.vector.x = -this.vector.x;
                break;
            case this.topWall:
            case this.bottomWall:
                this.vector.y = -this.vector.y;
                break;
        }
    },

    start () {

    },

    // update (dt) {},
});
