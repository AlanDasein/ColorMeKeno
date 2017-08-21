/*
 *     GAME LOGIC
 * */

class Game {

    public static credits: number = Setup.credits.init;

    public static spots: any = [];

    public static match: number = 0;

    public static win: number = 0;

    public static bet: any = {sample: Setup.sample, current: 1, max: Setup.options.select[3].items[Setup.options.select[3].default]};

    public static auto: any = {active: false, plays: 0};

    public static balls: any = {dial: 0, indexes: []};

    public static messages: number = 0;

    public static stats: any = {
        lastSelection: Setup.spots.max,
        topCredits: Setup.credits.init,
        biggestWin: 0,
        playedHands: 0
    };

    public static deck: number[];

    public static options: any[] = [];

    public static demo: number = 0;

    private static randomize(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private static shuffle(a: number[]): number[] {
        a.sort(function() {return 0.5 - Math.random();});
        return a;
    }

    private static playDemo(): void {
        var aux: number[] = [];
        if(this.demo > 0 && this.demo <= this.spots.length) {
            for(let i = 0, j = this.spots.length;i < j;i++) {
                aux[0] = i < this.demo ? 0 : aux[0] === 1 ? 2 : aux[0] === 2 ? 3 : aux[0] === 3 ? 4 : 1;
                aux[1] = this.deck[this.spots[i]];
                this.deck[this.spots[i]] = aux[0];
                for(let k = 0;k < Setup.balls.max;k++) {
                    if(this.deck[k] === aux[0] && this.spots.indexOf(k) < 0) {
                        this.deck[k] = aux[1];
                        break;
                    }
                }
            }
        }
        this.demo = 0;
    }

    private static getMatch(): number {
        var selectedBalls: number[] = [];
        var selectedSpots: number[] = [];
        var counter: any = [];
        for(let i = 0;i < this.balls.dial;i++) selectedBalls.push(this.balls.indexes[i]);
        for(let i = 0, j = this.spots.length;i < j;i++) {
            if(selectedBalls.indexOf(this.spots[i]) >= 0) selectedSpots.push(this.deck[this.spots[i]]);
        }
        selectedSpots.forEach(function(i) {counter[i] = (counter[i] || 0) + 1 ;});
        counter = counter.filter(function(val) {return val !== null;});
        counter.sort();
        return counter.length > 0 ? counter[counter.length - 1] : 0;
    }

    public static maxBetInvalid(): boolean {
        return this.bet.current === this.bet.max || this.bet.max > this.credits;
    }

    public static betTopsCredits(): boolean {
        return this.bet.current > this.credits;
    }

    public static manageBet(_amount: number, _sample?: boolean): void {
        var aux: any = _sample ? this.bet.sample : this.bet.current;
        aux = _amount > 1 ? _amount : aux + _amount;
        if(aux > this.bet.max) aux = 1;
        _sample ? this.bet.sample = aux : this.bet.current = aux;
    }

    public static manageOptions(_group: number, _val: number): void {
        this.options["select"][_group] = _val;
        if(_group === 3) {
            this.bet.max = this.options["select"][3];
            this.bet.current = 1;
        }
    }

    public static manageSpots(_spot: number, _massive?: number): void {
        var pick: number = -1;
        var index: number = this.spots.indexOf(_spot);
        if(_massive === undefined) {
            if(index >= 0) this.spots.splice(index, 1);
            else if(this.spots.length < Setup.spots.max) this.spots.push(_spot);
            if(this.spots.length >= Setup.spots.min) this.stats.lastSelection = this.spots.length;
        }
        else {
            this.spots = [];
            if(_massive > 0) {
                for(let i = 0;i < _massive;i++) {
                    while(pick < 0 || this.spots.indexOf(pick) >= 0) pick = this.randomize(0, Setup.balls.total - 1);
                    this.spots.push(pick);
                }
            }
        }
    }

    public static manageResults(): void {
        var aux: any;
        this.match = this.getMatch();
        aux = Setup.paytable.values["match" + this.match];
        if(aux !== undefined) this.win = aux["spots" + this.spots.length];
        if(this.win === undefined) this.win = 0;
        else this.win *= this.bet.current;
    }

    public static getPayouts(): number[] {
        var vals: any[] = [];
        var aux: any;
        if(this.spots.length >= Setup.spots.min) {
            for(let i = 0, j = this.spots.length;i < j;i++) {
                aux = Setup.paytable.values["match" + (i + 1)];
                if(aux !== undefined && aux["spots" + this.spots.length] !== undefined) {
                    vals.push([(i + 1), aux["spots" + this.spots.length] * this.bet.current]);
                }
            }
        }
        return vals;
    }

    public static buildDeck(_reset?: boolean): void {
        var members = Setup.balls.total / (Setup.balls.colors.length - 1);
        this.deck = [];
        for(let i = 0, j = Setup.balls.colors.length - 1;i < j;i++) {
            for(let k = 0;k < members;k++) this.deck.push(_reset ? Setup.balls.neutral : i);
        }
        this.deck = this.shuffle(this.deck);
        this.playDemo();
    }

    public static buildIndexes(): void {
        this.balls.indexes = this.shuffle(this.balls.indexes);
    }

    public static init(): void {
        this.options["select"] = [];
        for(let i = 0, j = Setup.options.select.length;i < j;i++) this.options["select"].push(Setup.options.select[i].default);
        this.options["input"] = [];
        for(let i = 0, j = Setup.options.input.values.length;i < j;i++) this.options["input"].push(Setup.options.input.values[i]);
        this.buildDeck(true);
        for(let i = 0;i < Setup.balls.total;i++) this.balls.indexes.push(i);
    }

}