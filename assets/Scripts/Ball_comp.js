cc.Class({
    extends: cc.Component,

    properties: {
        isActive: false,                                    //========= в массиве для запоминания
        isSelected: false,                                  //========= после остановки шар выбрали
        isCorrect: false,                                   //========= выбран верно или неверно
        isMoving: false,                                    //========= игра началась, шар движется
        challangeStarted: false,                            //========= начался период угадивания

        speed: 1000,                                        //========= скорость движения шаров
        vector: cc.v2(0.6, 1),                              //========= вектор движения шаров

        topWall: cc.Node,                                   //========= инициализация стен игрового поля
        rightWall: cc.Node,                                 //========= инициализация стен игрового поля
        bottomWall: cc.Node,                                //========= инициализация стен игрового поля
        leftWall: cc.Node,                                  //========= инициализация стен игрового поля

        whiteLight: cc.Node,                                //========= узел с белой подсветкой
        redLight: cc.Node,                                  //========= узел с красной подсветкой

    },

    initProps(){
        this.whiteLight = this.node.children[0];
        this.redLight = this.node.children[1];
        this.node.width = 0;
        this.node.height = 0;
    },

    activateBall(){
        this.isActive = true;
    },
    selectBall(){
        this.isSelected = true;
    },
    moveBall(){
        this.isMoving = true;    
    },
    stopBall(){
        this.isMoving = false;
        this.node.width = 200;
        this.node.height = 200;
    },
    setCorrect(answ){
        switch(answ){
            case 1:
                this.isCorrect = true;
                break;
            case 2:
                this.isCorrect = false;
                break;
        }
    },
    startChallange(answ){
        switch(answ){
            case 1:
                this.challangeStarted = true;
                break;
                case 2:
                this.challangeStarted = false;
                break;
        }
    },
    onGameOver(){
        this.node.width = 0;
        this.node.height = 0;
    },    
    onLoad () {
        this.initProps();
        let parentScript = this.node._parent._parent.getComponent("Game_controller");
        // console.log(parentScript);
        this.node.on("touchstart",()=>{ 
            this.selectBall();
            this.node.width = 0;
            this.node.height = 0;
            parentScript.checkTheAnswer(this.node);
        }, this);
        // console.log(this);
        
    },
   
    onCollisionEnter(other, self) {
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
    
    update (dt) {
        if(this.isMoving){
            this.node.x += this.vector.x * this.speed * dt;
            this.node.y += this.vector.y * this.speed * dt;
        }
        
        if(this.isMoving){
            this.whiteLight.opacity = 0; 
            this.redLight.opacity = 0; 
        } //end if 
        else if (this.isActive && this.isSelected && this.isCorrect && this.challangeStarted && !this.isMoving) {
            this.whiteLight.opacity = 255;
        } //end 1 else if
        else if (!this.isActive && this.isSelected && !this.isCorrect && this.challangeStarted && !this.isMoving) {
            this.redLight.opacity = 255;
        } //end 2 else if
        else if (this.isActive && !this.isSelected && !this.isCorrect && !this.challangeStarted && !this.isMoving) {
            this.whiteLight.opacity = 255;
        } //end 3 else if
        else {
            this.whiteLight.opacity = 0; 
            this.redLight.opacity = 0; 
        }

    }

});


// resetBall(){
//     this.sActive = false;
//     this.isSelected = false;
//     this.isCorrect = false;
//     this.isMoving = false;
//     this.challangeStarted = false;

// },

// console.log('isActive', this.isActive);
// console.log('isSelected', this.isSelected);
// console.log('isMoving', this.isMoving);
// console.log('isCorrect', this.isCorrect);
// console.log('challangeStarted', this.challangeStarted);
// console.log('=============================');