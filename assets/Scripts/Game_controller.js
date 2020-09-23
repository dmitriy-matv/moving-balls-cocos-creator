// 1. Выбрать шары, которые нужно запомнить
// 2. запустить таймер запоминания шаров
// 3. подсветить нужные шары
// 4. после окончания таймера снять подсветку и запустить таймер движения шаров
// 5. после таймера остановить шары подсветку не включать
// 6. по тапу на шар включить нужную подсветку ( верно \ не верно )
const BEFORE_START_TIME = 2;
const BALLS_MOVE_TIME = 4;
const CHALLANGE_TIME = 2;
const LEVELS = [
    {
        lvl: 1,
        quest:[
            {
                num: 1,
                nbRemember: 2,
                nbTotal: 6,
                nColors: 3,
                spaeed: 1000,
                motion: 10
            }
        ]
    }
]
// ======================
cc.Class({
    extends: cc.Component,
    properties: {
        ChallangeTimer: false,          //========= начало выбора шаров 
        GameOver: false,                //========= конец игры
        targetBalls: [cc.Node],         //========= шарики, которые нужно запомнить
        selectedBalls: [cc.Node],       //========= шарики, которые выбрал игрок

        correctChoices: 0,              //========= количество правильных ответов

        selectTimer: 5,                 //========= начальный таймер для запоминания
        motionTimer: 10,                //========= таймер движения шаров по полю
        taskTimer: 10.0,                //========= таймер для ответа
        TimerNode: cc.Node,             //========= НОДА таймера

        availableNumbers: [cc.Integer], //========= массив доступных индексов шаров
    },

    initNumbersArray(){                 //инициализируем массив доступных индексов шаров
        this.availableNumbers = [...Array.from(Array(LEVELS[0].quest[0].nbTotal).keys())];
    },
    showMenu(){
        this.menu.opacity = 255;
        this.menu.children[1].height = 150;            //========= кнопка НОВАЯ ИГРА
        this.menu.children[2].height = 150;            //========= кнопка ПЕРЕЗАГРУЗКА
    },
    hideMenu(){
        this.menu.opacity = 0;
        this.menu.children[1].height = 0;              //========= кнопка НОВАЯ ИГРА
        this.menu.children[2].height = 0;              //========= кнопка ПЕРЕЗАГРУЗКА
    },
    newGame(){
        // this.resetGame();
        this.node.children[11]._components[0].string = "Запомните подсвеченные шары";
        this.hideMenu();
        this.selTargetBall();
        this.lightUpTargetBalls();
        this.scheduleOnce( this.roundStarting, BEFORE_START_TIME);
        this.scheduleOnce( this.roundStopping, BALLS_MOVE_TIME);
    },
    resetGame(){                                                    //========= перезапуск игры
        cc.director.loadScene('GameBoard');
    },
    selTargetBall(){                                                                            //========= выюрать рандомно нужное количество шариков
        let randomIndex = 0;                                                                    
        let currentNumber = 0;
        for(i=0; i<LEVELS[0].quest[0].nbRemember; i++){                                         //========= столько итераций, сколько нужно запоминать шариков
            randomIndex = Math.floor(Math.random() * this.availableNumbers.length );
            currentNumber = this.availableNumbers.splice(randomIndex, 1)[0];
            this.targetBalls = [...this.targetBalls, this.Balls_gr[0].children[currentNumber]]
        } //end for
        
    },
    lightUpTargetBalls(){                                                                       //========= подсветить выбранные шарики
        this.targetBalls.map( ball => {
            ball._components[1].activateBall()
        });
    },
    
    roundStarting(){   
        this.node.children[11]._components[0].string = "Следите за выбранными шарами";                                                         //========= шари начинают двигаться
        this.Balls_gr[0].children.map( b => {
            let activator = b.getComponent("Ball_comp");
            activator.moveBall();
        });
        // console.log("start");
    },
    roundStopping(){    
        this.node.children[11]._components[0].string = "Выберите нужные шары";                                                        //========= шары остановились (игрок угадивает шары)
        this.Balls_gr[0].children.map( b => {
            let activator = b.getComponent("Ball_comp");
            activator.stopBall();
        });
        // console.log("stop");
        this.startChallangeTimer(); //  запуск таймера выбора шариков
    },
    startChallangeTimer(){                                                      //========= начало осчета времени для угадывания
        this.ChallangeTimer = true;
        this.Balls_gr[0].children.map(ball => {
            ball._components[1].startChallange(1);
        })
        // this.scheduleOnce( this.stopChallangeTimer, CHALLANGE_TIME);
    },
    stopChallangeTimer(){                                                       //========= время для угадывания закончилось
        this.ChallangeTimer = false;
        this.Balls_gr[0].children.map(ball => {
            ball._components[1].startChallange(2);
        })
        this.gameOver();
        // console.log("TIME is OVER");
        this.GameOver = true;
    },
    checkTheAnswer(ball){                                                       //========= проверка правильности выбора шарика
        let script = ball.getComponent("Ball_comp");
        let filtered = this.targetBalls.filter( tb => {
            return tb === ball
        });  //отфильтрованный массив
        
        if(filtered.length > 0){
            this.selectedBalls = [...this.selectedBalls, ...filtered];
            // console.log(this.selectedBalls);
            this.correctChoices = this.correctChoices + 1;
            if(this.targetBalls.length === this.correctChoices){
                this.winTheGame();
            }
            script.setCorrect(1);
            // console.log(tb);
        } // end if
        else if(filtered.length < 1) {
            script.setCorrect(2);
            this.gameOver();
        } //end else
        
    },
    gameOver(){                                                                 //========= конец игры (проиграш)
        // console.log("GAME OVER");
        this.node.children[11]._components[0].string = "Эх...вы проиграли ;(";
        this.GameOver = true;
        this.ChallangeTimer = false;
        this.Balls_gr[0].children.map(ball => {
            ball._components[1].onGameOver();
        })
        this.gameOverBG.opacity = 255;
    },
    winTheGame(){      
        this.node.children[11]._components[0].string = "УРА! Вы выиграли!";                                                         //========= конец игры (победа)
        console.log("win");
        this.ChallangeTimer = false;
        this.Balls_gr[0].children.map(ball => {
            ball._components[1].onGameOver();
        })
        
    },
    onLoad () {
        // console.log(this.node.children[11]._components[0].string);
        this.node.children[11]._components[0].string = "Нажмите на МЕНЮ > Новая игра";
        var manager = cc.director.getCollisionManager();                        //========= отлавливаем столкновения со стенками
        manager.enabled = true;
        
        this.initNumbersArray();                                                //========= инициализация массива индексов шаров
    },
    start(){
        this._timer = 0.0;
        this.Balls_gr = this.node.children.filter( ch => {
            return ch.name === "Balls"});
        this.gameOverBG = this.node.children[1];
        
        this.menu = this.node.children[10];
        // this.node.children[11]._components[0] = this.node.children[11]._components[0];
        },
    update(dt){
        if(this.ChallangeTimer){
            this.taskTimer -= dt;
            // console.log(this.taskTimer);
            
        }
        if(this.taskTimer <= 0){
            this.gameOver();
            return;
        }
    }
            
            
});
        
// resetGame(){
//     this.targetBalls.splice(0, this.targetBalls.length);
//     this.selectedBalls.splice(0, this.selectedBalls.length);
//     this.initNumbersArray();
//     this.targetBalls.length = 0;
//     this.selectedBalls.length = 0;
//     this.ChallangeTimer = false;
//     this.GameOver = false;
//     this.correctChoices = 0;
//     this.taskTimer = 10.0;
//     this.Balls_gr[0].children.map(ball => {
//         ball._components[1].resetBall();
//     })

//     console.log(this.targetBalls);
//     console.log(this.selectedBalls);
//     console.log(this.availableNumbers);
//     cc.director.loadScene('GameBoard');
// },
// ========================================= timer
// clickOnePer(){
//     this._percent += 0.02;
//     this.TimerNode.getComponent("Timer_controller").progressTo(1,this._percent);
//     // this.TimerNode.getComponent("Timer_controller").logger();
// },

// clickReset(){
//     this._percent = 0;
//     this.nodeBar.getComponent("Timer_controller").progressTo(1,0);
// },
// ================================================
// logger(){
//     // console.log(this.TimerNode._components[1].progress);
//     this.TimerNode._components[1].progress -= 0.025;
//     cc.tween(this.TimerNode._components[1])
//         .to(1, { progress: 0.5 })
//         .start();
// },