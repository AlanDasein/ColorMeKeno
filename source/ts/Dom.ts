/*
 *     GAME REPRESENTATION
 * */

class Dom {

    public static nodes: any;

    public static switcher(_elm: any, _ind: number, _oper?: string): void {
        for(let i = 0, j = _elm.length;i < j;i++) {
            if(_oper === "nav") this.nodes[_elm[i].style].classList.add(Setup.html.hidingClass);
            else _elm[i].classList.remove(Setup.html.activeClass);
        }
        if(_oper === "nav") this.nodes[_elm[_ind].style].classList.remove(Setup.html.hidingClass);
        else _elm[_ind].classList.add(Setup.html.activeClass);
    }

    public static modifier(_elm: any, _class: string, _status?: boolean): void {
        var style: any = {active: Setup.html.activeClass, hiding: Setup.html.hidingClass};
        if(_status === undefined) _status = !_elm.classList.contains(_class);
        _elm.classList.toggle(style[_class], _status);
    }

    public static nav(_panel: number, _tab?: number): void {
        this.switcher(Layout.elements.panels.members, _panel, "nav");
        if(_tab !== undefined) this.switcher(Layout.elements.tabs.members, _tab, "nav");
    }

    public static form(_ind: number, _val: number): number {
        _val = isNaN(_val) || _val < 0 ? Setup.options.input.values[_ind] : Math.ceil(_val);
        this.nodes.input[_ind].value = _val;
        return _val;
    }

    public static fillPaytable(_level: number): void {
        var aux: any[] = [];
        this.nodes.paytable.innerHTML = "";
        for(let i = 0;i < Setup.spots.max;i++) Layout.buildPaytable(this.nodes.paytable, (i + 1), _level);
        this.nodes.led.innerHTML = "BET " + _level;
    }

    public static fillPayouts(_vals: any[]): void {
        for(let i = 0;i < Setup.paytable.max;i++) {
            Dom.nodes.items[i].classList.add(Setup.html.hidingClass);
            if(_vals[i] !== undefined) {
                Dom.nodes.items[i].childNodes[0].innerHTML = _vals[i][0];
                Dom.nodes.items[i].childNodes[1].innerHTML = _vals[i][1];
                Dom.nodes.items[i].classList.remove(Setup.html.hidingClass);
            }
        }
    }

    public static activePayout(_val: number) {
        var index: number = -1;
        if(_val !== undefined) {
            for(let i = 0;i < Setup.paytable.max;i++) {
                if(this.nodes["items"][i].childNodes[0].innerHTML === _val.toString()) {
                    index = i;
                    break;
                }
            }
            if(index >= 0) this.switcher(this.nodes["items"], index);
        }
    }

    public static paintBall(_ind: number, _val: number): void {
        for(let i = 0, j = Setup.balls.colors.length;i < j;i++) this.nodes["balls"][_ind].classList.remove(Setup.balls.colors[i]);
        this.nodes["balls"][_ind].classList.add(Setup.balls.colors[_val]);
    }

    public static canPlaySound(_ind: number): boolean {
        var marked: boolean = this.nodes["balls"][_ind].classList.contains(Setup.html.activeClass);
        return Game.spots.length < Setup.spots.max || (marked && Game.spots.length === Setup.spots.max);
    }

    public static playSound(_sound: number, _rate?: number): void {
        var audio: any = new Audio(Setup.sounds.root + Setup.sounds.types[_sound] + Setup.sounds.ext);
        if(_rate !== undefined) audio.playbackRate = _rate;
        audio.volume = Setup.options.select[4].vals[Game.options["select"][4]];
        audio.play();
    }

    public static init(): void {
        this.nodes = Layout.init();
    }

}