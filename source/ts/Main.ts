/*
*     GAME FUNCTIONALITY
* */

class Main {

    private static gameInProgress: boolean = false;

    private static selecting: boolean = false;

    private static delays: any = {msg: 3000, flash: 400, game: [40, 20, 10]};

    private static timers: any[] = [];

    public static indexes: number[] = [];

    public static reference: number;

    public static audio: any;

    public static setVars(x: number): number[] {
        var breakpoints: any = {
                "speed": {
                    "points": [10, 30, 75],
                    "vals": [100, 75, 50, 20]
                },
                "divisor": {
                    "points": [25, 20, 15, 10, 5],
                    "vals": [5000, 3000, 1000, 500]
                }
            },
            speed: number = breakpoints.speed.vals[3],
            divisor: number = 1,
            milestone = 200;
        for(let i = 0, j = breakpoints.speed.points.length;i < j;i++) {
            if(x < breakpoints.speed.points[i]) {
                speed = breakpoints.speed.vals[i];
                break;
            }
        }
        if(x > milestone) {
            for(let i = breakpoints.divisor.points[0];i > 1;i--) {
                if(x % i === 0) {
                    divisor = i;
                    if(x >= breakpoints.divisor.vals[0] ||
                        (i <= breakpoints.divisor.points[1] && x >= breakpoints.divisor.vals[1]) ||
                        (i <= breakpoints.divisor.points[2] && x >= breakpoints.divisor.vals[2]) ||
                        (i <= breakpoints.divisor.points[3] && x >= breakpoints.divisor.vals[3]) ||
                        i <= breakpoints.divisor.points[4]) {break;}
                }
            }
        }
        return [speed, divisor];
    }

    public static isBetRelated(_elm: string): boolean {
        return _elm.indexOf("betone") >= 0 || _elm.indexOf("betmax") >= 0 || _elm.indexOf("up") >= 0 || _elm.indexOf("down") >= 0;
    }

    public static isNavRelated(_elm: string): boolean {
        return _elm.indexOf("gamehelp") >= 0 || _elm.indexOf("payouts") >= 0 || _elm.indexOf("options") >= 0 || _elm.indexOf("back") >= 0
    }

    public static isPaytableViewRelated(_elm: string): boolean {
        return _elm.indexOf("up") >= 0 || _elm.indexOf("down") >= 0 || _elm.indexOf("payouts") >= 0;
    }

    public static isPickRelated(_elm: string): boolean {
        return _elm.indexOf("quickpick") >= 0 || _elm.indexOf("clearall") >= 0;
    }

    public static betType(_elm: string, _param: number): any {
        if(_param === 0) return _elm.indexOf("betmax") >= 0 ? Game.bet.max : (_elm.indexOf("down") >= 0 ? -1 : 1);
        else return Number(_elm.indexOf("up") >= 0 || _elm.indexOf("down") >= 0);
    }

    public static navType(_elm: string, _param: number): any {
        if(_param === 0) return Number(_elm.indexOf("back") < 0);
        else return _elm.indexOf("gamehelp") >= 0 ? 0 : (_elm.indexOf("payouts") >= 0 ? 1 : 2);
    }

    public static notAvailable(_elm: string): boolean {
        var aux = _elm.indexOf("auto") >= 0 ? Game.auto : Main.gameInProgress;
        if(_elm.indexOf("start") >= 0) aux = aux || Game.spots.length < Setup.spots.min;
        if(_elm.indexOf("betmax") >= 0) aux = aux || Game.maxBetInvalid();
        if(_elm.indexOf("clearall") >= 0) aux = aux || Game.spots.length === 0;
        if(_elm.indexOf("up") >= 0) aux = aux || Game.bet.sample === Game.bet.max;
        if(_elm.indexOf("down") >= 0) aux = aux || Game.bet.sample === 1;
        return Game.credits === 0 || aux;
    }

    public static canContinue(): boolean {
        var go = Game.auto.active && !Game.betTopsCredits() && (
                 Game.options["select"][2] === 0 ||
                 (Game.options["select"][2] === 1 && Game.auto.plays < Game.options["input"][0]) ||
                 (Game.options["select"][2] === 2 && Game.credits > Game.options["input"][1] && Game.credits < Game.options["input"][2])
            );
        return go;
    }

    public static bindInfo(): void {
        Dom.nodes["label-info-credits"].innerHTML = Game.credits;
        Dom.nodes["label-info-marked"].innerHTML = Game.spots.length;
        Dom.nodes["label-info-bet"].innerHTML = Game.bet.current;
        Dom.nodes["label-info-match"].innerHTML = Game.match;
        Dom.nodes["label-info-win"].innerHTML = Game.win;
    }

    public static bindButtons(): void {
        var aux: string;
        var active: boolean;
        for(let i = 0,j = Layout.elements.buttons.members.length;i < j;i++) {
            aux = Layout.elements.buttons.members[i].style;
            active = aux.indexOf("auto") >= 0 ? Game.auto.active : this.notAvailable(aux);
            Dom.modifier(Dom.nodes[aux], "active", active);
        }
    }

    public static bindBalls(): void {
        for(let i = 0, j = Game.spots.length;i < j;i++) Dom.modifier(Dom.nodes["balls"][Game.spots[i]], "active");
    }

    public static bind(_sectors: string[]): void {
        for(let i = 0, j = _sectors.length;i < j;i++){
            if(_sectors[i] === "info") this.bindInfo();
            if(_sectors[i] === "balls") this.bindBalls();
            if(_sectors[i] === "buttons") this.bindButtons();
        }
    }

    public static flashMessage(): void {
        Dom.nodes["block-balls-messages"].innerHTML = Dom.nodes["block-balls-messages"].innerHTML === "" ? Setup.messages.success + Game.win : "";
    }

    public static progressMessage(): void {
        clearInterval(this.timers["msg"]);
        Dom.nodes["block-balls-messages"].innerHTML = Setup.messages.progress;
    }

    public static cyclicMessages(): void {
        if(Game.messages === Setup.messages.start.length) Game.messages = 0;
        Dom.nodes["block-balls-messages"].innerHTML = Setup.messages.start[Game.messages++];
    }

    public static messages(): void {
        this.cyclicMessages();
        this.timers["msg"] = setInterval(function() {Main.cyclicMessages();}, this.delays.msg);
    }

    public static manageRadios(_group: number, _ind: number, _val: number): void {
        Dom.playSound(1);
        Game.manageOptions(_group, _val);
        Dom.switcher(Dom.nodes["radios" + _group], _ind);
    }

    public static manageInputs(_ind: number, _val: number): void {
        Game.options["input"][_ind] = Dom.form(_ind, _val);
    }

    public static manageBalls(_ind: number, _auto?: number): void {
        this.reset();
        this.bindBalls();
        if(_auto !== undefined) {
            if(_auto > 0) _auto = Game.options["select"][0] === 0 ? Game.stats.lastSelection : Game.options["select"][1];
            Game.manageSpots(_ind, _auto);
        }
        else Game.manageSpots(_ind);
        this.bindBalls();
        Dom.fillPayouts(Game.getPayouts());
        Main.bind(["info", "buttons"]);
        if(_auto === undefined && Dom.canPlaySound(_ind)) Dom.playSound(0);
    }

    public static manageStats(): void {
        if(Game.stats.topCredits < Game.credits) Game.stats.topCredits = Game.credits;
        if(Game.stats.biggestWin < Game.win) Game.stats.biggestWin = Game.win;
    }

    public static manageBet(_elm: string, _sample?: boolean): void {
        Game.manageBet(Main.betType(_elm, 0), _sample);
        if(!_sample) {
            Dom.fillPayouts(Game.getPayouts());
            this.reset();
        }
    }

    public static managePainting(_ind?: number): void {
        if(_ind === undefined) {
            if(Game.deck[0] !== Setup.balls.neutral) {
                for(let i = 0;i < Setup.balls.total;i++) Dom.paintBall(i, Setup.balls.neutral);
            }
        }
        else Dom.paintBall(_ind, Game.deck[_ind]);
    }

    public static paytableView(_reset?: boolean): void {
        if(_reset) Game.bet.sample = Setup.sample;
        Dom.fillPaytable(Game.bet.sample);
    }

    public static reset(): void {
        this.managePainting();
        Game.match = 0;
        Game.win = 0;
        for(let i = 0;i < Setup.paytable.max;i++) Dom.modifier(Dom.nodes["items"][i], "active", false);
    }

    public static takeWin(_divisor: number): void {
        Game.credits += _divisor;
        Main.bind(["info"]);
        if(Game.credits === Main.reference) Main.autoPlay();
        Dom.playSound(3);
    }

    public static gameSet(): void {
        Game.auto.plays++;
        Game.stats.playedHands++;
        Game.balls.dial = 0;
        Game.buildDeck();
        Game.buildIndexes();
        Game.credits -= Game.bet.current;
    }

    public static gameStart(): void {
        Main.gameInProgress = true;
        Main.progressMessage();
        Main.reset();
        Main.gameSet();
        Main.bind(["info", "buttons"]);
        Dom.playSound(2, Game.options["select"][5] + 1);
        Main.timers["game"] = setInterval(Main.gameProgress, Main.delays.game[Game.options["select"][5]]);
    }

    public static gameProgress(): void {
        Main.managePainting(Game.balls.indexes[Game.balls.dial++]);
        Game.manageResults();
        Dom.activePayout(Game.match);
        Main.bind(["info"]);
        if(Game.balls.dial === Setup.balls.total) Main.gameEnd();
    }

    public static gameEnd(): void {
        var vars: number[] = this.setVars(Game.win);
        clearInterval(this.timers["game"]);
        if(Game.win > 0) {
            Dom.nodes["block-balls-messages"].innerHTML = "";
            Dom.modifier(Dom.nodes["block-balls-messages"], "active");
            this.reference = Game.credits + Game.win;
            this.timers["msg"] = setInterval(this.flashMessage, this.delays.flash);
            this.timers["game"] = setInterval(function() {Main.takeWin(vars[1]);}, vars[0]);
        }
        else this.autoPlay();
    }

    public static autoPlay(): void {
        clearInterval(this.timers["msg"]);
        clearInterval(this.timers["game"]);
        Dom.modifier(Dom.nodes["block-balls-messages"], "active", false);
        this.manageStats();
        if(this.canContinue() && Game.credits > 0) setTimeout(this.gameStart, 1000);
        else {
            if(Game.betTopsCredits()) Game.bet.current = 1;
            Game.auto.plays = 0;
            Game.auto.active = false;
            this.gameInProgress = false;
            this.messages();
            this.bind(["info", "buttons"]);
        }
    }

    public static assignForm(): void {
        for(let i = 0, j = Setup.options.select.length;i < j;i++) {
            for(let k = 0, l = Dom.nodes["radios" + i].length;k < l;k++) {
                Dom.nodes["radios" + i][k].onclick = function() {Main.manageRadios(i, k, Number(this.getAttribute("value")));}
            }
        }
        for(let i = 0, j = Setup.options.input.values.length;i < j;i++) {
            Dom.nodes.input[i].onblur = function() {Main.manageInputs(i, this.value);}
            Dom.nodes.input[i].onkeydown = function() {Dom.playSound(1);}
        }
    }

    public static assignBalls(): void {
        for(let i = 0, j = Dom.nodes.balls.length;i < j;i++) {
                Dom.nodes.balls[i].onmousedown = function() {
                    if(!Main.notAvailable("ball")) {
                        Main.manageBalls(i);
                        Main.selecting = true;
                    }
                }
                Dom.nodes.balls[i].onmouseover = function() {
                    if(!Main.notAvailable("ball") && Main.selecting) {Main.manageBalls(i);}
                }
        }
    }

    public static assignButtons(): void {
        var aux: string;
        for(let i = 0,j = Layout.elements.buttons.members.length;i < j;i++) {
            aux = Layout.elements.buttons.members[i].style;
            Dom.nodes[aux].onclick = function () {
                var aux = this.classList.value;
                var stop = Main.notAvailable(aux);
                if(!stop || aux.indexOf("auto") >= 0) {
                    if(Main.isBetRelated(aux)) Main.manageBet(aux, Main.betType(aux, 1));
                    if(Main.isNavRelated(aux)) Dom.nav(Main.navType(aux, 0), Main.navType(aux, 1));
                    if(Main.isPaytableViewRelated(aux)) Main.paytableView(aux.indexOf("payouts") >= 0);
                    if(Main.isPickRelated(aux)) Main.manageBalls(-1, Number(aux.indexOf("quickpick") >= 0));
                    if(aux.indexOf("auto") >= 0) Game.auto.active = !Game.auto.active;
                    if(aux.indexOf("start") >= 0) Main.gameStart();
                    Dom.playSound(1);
                    Main.bind(["info", "buttons"]);
                }
            }
        }
    }

    public static assignations(): void {
        window.onmouseup = function() {Main.selecting = false;}
        this.assignButtons();
        this.assignBalls();
        this.assignForm();
    }

    public static init() {
        Game.init();
        Dom.init();
        this.bind(["info", "buttons"]);
        this.messages();
        this.assignations();
    }

}

Main.init();