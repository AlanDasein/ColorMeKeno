var Setup = (function () {
    function Setup() {
    }
    Setup.paytable = {
        values: {
            match1: { spots4: 1, spots5: 7 },
            match2: { spots2: 5, spots3: 1 },
            match3: { spots3: 24, spots4: 2, spots6: 2, spots7: 1 },
            match4: { spots4: 60, spots5: 10, spots6: 6, spots7: 1, spots8: 1, spots9: 1 },
            match5: { spots5: 590, spots6: 52, spots7: 15, spots8: 8, spots9: 4, spots10: 4 },
            match6: { spots6: 1480, spots7: 382, spots8: 84, spots9: 36, spots10: 18 },
            match7: { spots7: 7500, spots8: 1740, spots9: 398, spots10: 156 },
            match8: { spots8: 10000, spots9: 5400, spots10: 1200 },
            match9: { spots9: 10000, spots10: 7000 },
            match10: { spots10: 15000 }
        },
        max: 6
    };
    Setup.credits = {
        init: 1000
    };
    Setup.spots = {
        min: 2,
        max: 10
    };
    Setup.balls = {
        total: 80,
        colors: ["red", "green", "blue", "pink", "yellow", "neutral"],
        neutral: 5
    };
    Setup.sample = 1;
    Setup.options = {
        select: [
            {
                name: "quickpick",
                default: 0,
                items: ["Remember last selection or", "Select always this number of spots:"]
            },
            {
                name: "quickpickFavorite",
                default: Setup.spots.max - Setup.spots.min,
                range: { start: Setup.spots.min, end: (Setup.spots.max + 1) }
            },
            {
                name: "autoplay",
                default: 0,
                items: ["Stop manually or", "Stop after specific number of plays or", "Stop when credits bellow or above specific range"]
            },
            {
                name: "maxbet",
                default: 1,
                items: [2, 4, 5, 6, 8, 10]
            },
            {
                name: "audio",
                default: 1,
                items: ["Off", "low", "High"],
                vals: [0, .5, 1]
            },
            {
                name: "speed",
                default: 1,
                items: ["Slow", "Fast", "Ultra"]
            },
        ],
        input: {
            values: [100, 0, Setup.credits.init * 2],
            text: "Plays / Min Credit / Max Credit"
        }
    };
    Setup.messages = {
        start: [
            "CHANGE BET OR TOUCH START TO BEGIN",
            "CANCEL MAXBET BY PRESSING BET ONE",
            "SELECT BETWEEN " + Setup.spots.min + " AND " + Setup.spots.max + " BALLS",
            "QUICKPICK SELECTS RANDOM BALLS",
            "CLEARALL CLEARS SELECTED BALLS"
        ],
        progress: "GAME IN PROGRESS",
        success: "YOU HAVE WON "
    };
    Setup.help = [
        "To play <label>COLORME KENO</label> select between 2 and 10 balls from the group of 80 balls located on the board. Once the game begins, each ball will be given a color from a set of 5 different colors. These 5 colors will be evenly distributed among the 80 balls. That is, each color will be present in 16 balls after all the balls have been \"colored\". The goal is to gather as many colors as possible in the set of selected balls. Wins are based on the number of balls selected, the largest number of balls of the same color achieved and the number of credits bet.",
        "Press this button to start the game at<br/>the current bet",
        "Press this button to automatically select random balls",
        "Press this button to play several games<br/>at the current bet",
        "Press this button to clear any balls selected",
        "Press these buttons to increase the bet by one or to bet the maximum amount of credits allowed respectively",
        "Visit the options panel to adjust the game according your preferences. The available options for customization are Quickpick, Autoplay, Maxbet, Audio and Speed. Likewise, the Payouts panel shows the winnings for each selection that can be made according the number of matches achieved."
    ];
    Setup.link = {
        text: "DO YOU LIKE THIS GAME? CLIC HERE TO CONTACT ME",
        href: "https://www.facebook.com/allcrossword/",
        target: "_blank"
    };
    Setup.sounds = {
        root: "files/assets/media/",
        ext: ".wav",
        types: ["ball", "button", "play", "collect"]
    };
    Setup.html = {
        activeClass: "active",
        hidingClass: "hide"
    };
    return Setup;
}());
var Component = (function () {
    function Component(_parent, _tag, _style, _text, _attr) {
        this.item = document.createElement(_tag);
        if (_style !== undefined && _style.length > 0)
            this.item.className = _style;
        if (_text !== undefined && _text.length > 0)
            this.item.innerHTML = _text;
        if (_attr !== undefined) {
            for (var i = 0, j = _attr.length; i < j; i++)
                this.item.setAttribute(_attr[i].property, _attr[i].value);
        }
        _parent.appendChild(this.item);
        return this.item;
    }
    return Component;
}());
var Layout = (function () {
    function Layout() {
    }
    Layout.isEmpty = function (_value) {
        return _value === undefined;
    };
    Layout.buildStyle = function (_base, _value) {
        return _base + (this.isEmpty(_value) ? "" : " " + _value);
    };
    Layout.buildValues = function (_property, _value) {
        var values = [];
        for (var i = 0, j = _property.length; i < j; i++)
            values.push({ "property": _property[i], "value": _value[i] });
        return values;
    };
    Layout.buildComponents = function (_component, _holder) {
        var aux = [];
        for (var i = 0, j = _component.members.length; i < j; i++) {
            aux["parent"] = this.isEmpty(_component.members[i].parent) ? _component.parent : _component.members[i].parent;
            aux["style"] = this.buildStyle(_component.members[i].style, _component.members[i].extendedStyle);
            _holder[_component.members[i].style] = new Component(_holder[aux["parent"]], _component.tag, aux["style"], _component.members[i].text);
        }
        return _holder;
    };
    Layout.buildComponentsExtended = function (_component, _holder, kind) {
        var aux;
        _holder[kind] = [];
        for (var i = 0, j = kind === "items" ? Setup.paytable.max : Setup.balls.total; i < j; i++) {
            _holder[kind][i] = new Component(_holder[_component.parent], _component.tag, this.buildStyle(_component.style, _component.extendedStyle));
            if (!this.isEmpty(_component.childrenStyle)) {
                for (var j_1 = 0; j_1 < _component.childrenStyle.length; j_1++)
                    aux = new Component(_holder[kind][i], _component.tag, _component.childrenStyle[j_1]);
            }
        }
        return _holder;
    };
    Layout.buildComponentsSpecial = function (_component, _holder, kind) {
        var aux = [];
        if (this.isEmpty(_component.groups)) {
            _holder["input"] = [];
            aux["input"] = new Component(_holder[_component.parent], _component.tag, _component.style);
            aux["extra"] = new Component(aux["input"], _component.textTag, "", Setup.options.input.text);
            for (var i = 0, j = Setup.options.input.values.length; i < j; i++) {
                aux["extra"] = this.buildValues(["value"], [Setup.options.input.values[i]]);
                _holder["input"][i] = new Component(aux["input"], "input", _component.membersStyle, "", aux["extra"]);
            }
        }
        else {
            for (var i = 0, j = Setup.options.select.length; i < j; i++) {
                _holder[kind + i] = [];
                aux["items"] = Setup.options.select[i].items;
                if (this.isEmpty(aux["items"])) {
                    aux["items"] = [];
                    for (var k = Setup.options.select[i].range.start; k < Setup.options.select[i].range.end; k++)
                        aux["items"].push(k);
                }
                for (var k = 0, l = aux["items"].length; k < l; k++) {
                    aux["style"] = this.buildStyle(_component.style, _component.groups[i].extendedStyle);
                    aux["values"] = this.buildValues(["value"], [isNaN(aux["items"][k]) ? k : aux["items"][k]]);
                    if (Setup.options.select[i].default === k)
                        aux["style"] += " active";
                    _holder[kind + i][k] = new Component(_holder[_component.groups[i].parent], _component.tag, aux["style"], aux["items"][k].toString(), aux["values"]);
                }
            }
        }
        return _holder;
    };
    Layout.buildPaytable = function (_holder, _index, _level) {
        var aux = [];
        aux["row"] = new Component(_holder, "tr");
        aux["cell"] = new Component(aux["row"], "td", "", _index.toString());
        aux["match"] = Setup.paytable.values["match" + _index];
        for (var i = Setup.spots.min - 1; i < Setup.spots.max; i++) {
            if (aux["match"] !== undefined)
                aux["text"] = aux["match"]["spots" + (i + 1)];
            if (aux["text"] === undefined || isNaN(aux["text"]))
                aux["text"] = "<hr/>";
            else
                aux["text"] *= _level;
            aux["cell"] = new Component(aux["row"], "td", "", aux["text"].toString());
        }
    };
    Layout.init = function () {
        var elm = [];
        for (var obj in this.elements) {
            switch (obj) {
                case "container":
                    elm["container"] = new Component(document.body, this.elements[obj].tag);
                    break;
                case "radios":
                case "inputs":
                    this.buildComponentsSpecial(this.elements[obj], elm, obj);
                    break;
                case "balls":
                case "items":
                    this.buildComponentsExtended(this.elements[obj], elm, obj);
                    break;
                case "paytable":
                    elm["paytable"] = new Component(elm[this.elements[obj].parent], "table", this.elements[obj].style);
                    break;
                case "link":
                    elm["link"] = new Component(document.body, "a", this.elements[obj].style, Setup.link.text, this.buildValues(this.elements[obj].attr, [Setup.link.href, Setup.link.target]));
                    break;
                default: this.buildComponents(this.elements[obj], elm);
            }
        }
        return elm;
    };
    Layout.elements = {
        container: { "tag": "main" },
        panels: {
            tag: "section",
            parent: "container",
            members: [{ style: "panel-main" }, { style: "panel-various", extendedStyle: "hide" }]
        },
        sections: {
            tag: "section",
            parent: "panel-main",
            members: [
                { style: "section-paytable" },
                { style: "section-balls" },
                { style: "section-buttons" },
                { style: "section-info" },
                { parent: "panel-various", style: "section-nav" }
            ]
        },
        tabs: {
            tag: "section",
            parent: "panel-various",
            members: [{ style: "section-help" }, { style: "section-payouts" }, { style: "section-options" }]
        },
        blocks: {
            tag: "section",
            parent: "section-options",
            members: [
                { parent: "section-paytable", style: "block-paytable-items" },
                { parent: "section-paytable", style: "block-paytable-buttons" },
                { parent: "section-balls", style: "block-balls-messages", extendedStyle: "text-centered" },
                { parent: "section-balls", style: "block-balls-grid" },
                { parent: "section-info", style: "block-info-buttons" },
                { parent: "section-help", style: "block-help-paneltop", extendedStyle: "text-justified", text: Setup.help[0] },
                { parent: "section-help", style: "block-help-panelbottom" },
                { parent: "section-payouts", style: "block-payouts-buttons" },
                { style: "block-options-quickpick" },
                { style: "block-options-autoplay" },
                { style: "block-options-maxbet" },
                { style: "block-options-audio" },
                { style: "block-options-speed" }
            ]
        },
        buttons: {
            tag: "button",
            parent: "section-buttons",
            members: [
                { parent: "block-paytable-buttons", style: "button-quickpick", extendedStyle: "large" },
                { parent: "block-paytable-buttons", style: "button-clearall", extendedStyle: "large" },
                { style: "button-betmax", extendedStyle: "small" },
                { style: "button-betone", extendedStyle: "small" },
                { style: "button-auto", extendedStyle: "medium" },
                { style: "button-start", extendedStyle: "medium" },
                { parent: "block-info-buttons", style: "button-gamehelp", extendedStyle: "large" },
                { parent: "block-info-buttons", style: "button-payouts", extendedStyle: "large" },
                { parent: "block-info-buttons", style: "button-options", extendedStyle: "large" },
                { parent: "block-payouts-buttons", style: "button-down", extendedStyle: "small" },
                { parent: "block-payouts-buttons", style: "button-up", extendedStyle: "small" },
                { parent: "section-nav", style: "button-back", extendedStyle: "small" }
            ]
        },
        labels: {
            tag: "div",
            parent: "block-help-panelbottom",
            members: [
                { parent: "section-info", style: "label-info-credits" },
                { parent: "section-info", style: "label-info-marked" },
                { parent: "section-info", style: "label-info-bet" },
                { parent: "section-info", style: "label-info-match" },
                { parent: "section-info", style: "label-info-win" },
                { style: "label-help-start", text: Setup.help[1] },
                { style: "label-help-quickpick", text: Setup.help[2] },
                { style: "label-help-auto", text: Setup.help[3] },
                { style: "label-help-clearall", text: Setup.help[4] },
                { style: "label-help-bets", text: Setup.help[5] },
                { style: "label-help-extra", extendedStyle: "text-justified", text: Setup.help[6] },
                { parent: "block-payouts-buttons", style: "led" }
            ]
        },
        items: {
            tag: "span",
            parent: "block-paytable-items",
            style: "item hide",
            childrenStyle: ["left", "right"]
        },
        balls: {
            tag: "span",
            parent: "block-balls-grid",
            style: "ball",
            extendedStyle: Setup.balls.colors[Setup.balls.neutral]
        },
        radios: {
            tag: "span",
            style: "radio",
            groups: [
                { parent: "block-options-quickpick" },
                { parent: "block-options-quickpick", extendedStyle: "left small" },
                { parent: "block-options-autoplay" },
                { parent: "block-options-maxbet", extendedStyle: "left large" },
                { parent: "block-options-audio", extendedStyle: "xsmall" },
                { parent: "block-options-speed", extendedStyle: "xsmall" }
            ]
        },
        inputs: {
            tag: "span",
            parent: "block-options-autoplay",
            style: "input",
            textTag: "label",
            membersStyle: "text-centered"
        },
        paytable: { parent: "section-payouts", style: "text-centered" },
        link: { attr: ["href", "target"], style: "text-centered" }
    };
    return Layout;
}());
var Dom = (function () {
    function Dom() {
    }
    Dom.switcher = function (_elm, _ind, _oper) {
        for (var i = 0, j = _elm.length; i < j; i++) {
            if (_oper === "nav")
                this.nodes[_elm[i].style].classList.add(Setup.html.hidingClass);
            else
                _elm[i].classList.remove(Setup.html.activeClass);
        }
        if (_oper === "nav")
            this.nodes[_elm[_ind].style].classList.remove(Setup.html.hidingClass);
        else
            _elm[_ind].classList.add(Setup.html.activeClass);
    };
    Dom.modifier = function (_elm, _class, _status) {
        var style = { active: Setup.html.activeClass, hiding: Setup.html.hidingClass };
        if (_status === undefined)
            _status = !_elm.classList.contains(_class);
        _elm.classList.toggle(style[_class], _status);
    };
    Dom.nav = function (_panel, _tab) {
        this.switcher(Layout.elements.panels.members, _panel, "nav");
        if (_tab !== undefined)
            this.switcher(Layout.elements.tabs.members, _tab, "nav");
    };
    Dom.form = function (_ind, _val) {
        _val = isNaN(_val) || _val < 0 ? Setup.options.input.values[_ind] : Math.ceil(_val);
        this.nodes.input[_ind].value = _val;
        return _val;
    };
    Dom.fillPaytable = function (_level) {
        var aux = [];
        this.nodes.paytable.innerHTML = "";
        for (var i = 0; i < Setup.spots.max; i++)
            Layout.buildPaytable(this.nodes.paytable, (i + 1), _level);
        this.nodes.led.innerHTML = "BET " + _level;
    };
    Dom.fillPayouts = function (_vals) {
        for (var i = 0; i < Setup.paytable.max; i++) {
            Dom.nodes.items[i].classList.add(Setup.html.hidingClass);
            if (_vals[i] !== undefined) {
                Dom.nodes.items[i].childNodes[0].innerHTML = _vals[i][0];
                Dom.nodes.items[i].childNodes[1].innerHTML = _vals[i][1];
                Dom.nodes.items[i].classList.remove(Setup.html.hidingClass);
            }
        }
    };
    Dom.activePayout = function (_val) {
        var index = -1;
        if (_val !== undefined) {
            for (var i = 0; i < Setup.paytable.max; i++) {
                this.modifier(this.nodes["items"][i], "active", false);
                if (this.nodes["items"][i].childNodes[0].innerHTML === _val.toString() && index < 0)
                    index = i;
            }
            if (index >= 0) {
                this.switcher(this.nodes["items"], index);
            }
        }
    };
    Dom.paintBall = function (_ind, _val) {
        for (var i = 0, j = Setup.balls.colors.length; i < j; i++)
            this.nodes["balls"][_ind].classList.remove(Setup.balls.colors[i]);
        this.nodes["balls"][_ind].classList.add(Setup.balls.colors[_val]);
    };
    Dom.canPlaySound = function (_ind) {
        var marked = this.nodes["balls"][_ind].classList.contains(Setup.html.activeClass);
        return Game.spots.length < Setup.spots.max || (marked && Game.spots.length === Setup.spots.max);
    };
    Dom.playSound = function (_sound, _rate) {
        var audio = new Audio(Setup.sounds.root + Setup.sounds.types[_sound] + Setup.sounds.ext);
        if (_rate !== undefined)
            audio.playbackRate = _rate;
        audio.volume = Setup.options.select[4].vals[Game.options["select"][4]];
        audio.play();
    };
    Dom.init = function () {
        this.nodes = Layout.init();
    };
    return Dom;
}());
var Game = (function () {
    function Game() {
    }
    Game.randomize = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Game.shuffle = function (a) {
        a.sort(function () { return 0.5 - Math.random(); });
        return a;
    };
    Game.playDemo = function () {
        var aux = [];
        if (this.demo > 0 && this.demo <= this.spots.length) {
            for (var i = 0, j = this.spots.length; i < j; i++) {
                aux[0] = i < this.demo ? 0 : aux[0] === 1 ? 2 : aux[0] === 2 ? 3 : aux[0] === 3 ? 4 : 1;
                aux[1] = this.deck[this.spots[i]];
                this.deck[this.spots[i]] = aux[0];
                for (var k = 0; k < Setup.balls.max; k++) {
                    if (this.deck[k] === aux[0] && this.spots.indexOf(k) < 0) {
                        this.deck[k] = aux[1];
                        break;
                    }
                }
            }
        }
        this.demo = 0;
    };
    Game.getMatch = function () {
        var selectedBalls = [];
        var selectedSpots = [];
        var counter = [];
        for (var i = 0; i < this.balls.dial; i++)
            selectedBalls.push(this.balls.indexes[i]);
        for (var i = 0, j = this.spots.length; i < j; i++) {
            if (selectedBalls.indexOf(this.spots[i]) >= 0)
                selectedSpots.push(this.deck[this.spots[i]]);
        }
        selectedSpots.forEach(function (i) { counter[i] = (counter[i] || 0) + 1; });
        counter = counter.filter(function (val) { return val !== null; });
        counter.sort();
        return counter.length > 0 ? counter[counter.length - 1] : 0;
    };
    Game.maxBetInvalid = function () {
        return this.bet.current === this.bet.max || this.bet.max > this.credits;
    };
    Game.betTopsCredits = function () {
        return this.bet.current > this.credits;
    };
    Game.manageBet = function (_amount, _sample) {
        var aux = _sample ? this.bet.sample : this.bet.current;
        aux = _amount > 1 ? _amount : aux + _amount;
        if (aux > this.bet.max)
            aux = 1;
        _sample ? this.bet.sample = aux : this.bet.current = aux;
    };
    Game.manageOptions = function (_group, _val) {
        this.options["select"][_group] = _val;
        if (_group === 3) {
            this.bet.max = this.options["select"][3];
            this.bet.current = 1;
        }
    };
    Game.manageSpots = function (_spot, _massive) {
        var pick = -1;
        var index = this.spots.indexOf(_spot);
        if (_massive === undefined) {
            if (index >= 0)
                this.spots.splice(index, 1);
            else if (this.spots.length < Setup.spots.max)
                this.spots.push(_spot);
            if (this.spots.length >= Setup.spots.min)
                this.stats.lastSelection = this.spots.length;
        }
        else {
            this.spots = [];
            if (_massive > 0) {
                for (var i = 0; i < _massive; i++) {
                    while (pick < 0 || this.spots.indexOf(pick) >= 0)
                        pick = this.randomize(0, Setup.balls.total - 1);
                    this.spots.push(pick);
                }
            }
        }
    };
    Game.manageResults = function () {
        var aux;
        this.match = this.getMatch();
        aux = Setup.paytable.values["match" + this.match];
        if (aux !== undefined)
            this.win = aux["spots" + this.spots.length];
        if (this.win === undefined)
            this.win = 0;
        else
            this.win *= this.bet.current;
    };
    Game.getPayouts = function () {
        var vals = [];
        var aux;
        if (this.spots.length >= Setup.spots.min) {
            for (var i = 0, j = this.spots.length; i < j; i++) {
                aux = Setup.paytable.values["match" + (i + 1)];
                if (aux !== undefined && aux["spots" + this.spots.length] !== undefined) {
                    vals.push([(i + 1), aux["spots" + this.spots.length] * this.bet.current]);
                }
            }
        }
        return vals;
    };
    Game.buildDeck = function (_reset) {
        var members = Setup.balls.total / (Setup.balls.colors.length - 1);
        this.deck = [];
        for (var i = 0, j = Setup.balls.colors.length - 1; i < j; i++) {
            for (var k = 0; k < members; k++)
                this.deck.push(_reset ? Setup.balls.neutral : i);
        }
        this.deck = this.shuffle(this.deck);
        this.playDemo();
    };
    Game.buildIndexes = function () {
        this.balls.indexes = this.shuffle(this.balls.indexes);
    };
    Game.init = function () {
        this.options["select"] = [];
        for (var i = 0, j = Setup.options.select.length; i < j; i++)
            this.options["select"].push(Setup.options.select[i].default);
        this.options["input"] = [];
        for (var i = 0, j = Setup.options.input.values.length; i < j; i++)
            this.options["input"].push(Setup.options.input.values[i]);
        this.buildDeck(true);
        for (var i = 0; i < Setup.balls.total; i++)
            this.balls.indexes.push(i);
    };
    Game.credits = Setup.credits.init;
    Game.spots = [];
    Game.match = 0;
    Game.win = 0;
    Game.bet = { sample: Setup.sample, current: 1, max: Setup.options.select[3].items[Setup.options.select[3].default] };
    Game.auto = { active: false, plays: 0 };
    Game.balls = { dial: 0, indexes: [] };
    Game.messages = 0;
    Game.stats = {
        lastSelection: Setup.spots.max,
        topCredits: Setup.credits.init,
        biggestWin: 0,
        playedHands: 0
    };
    Game.options = [];
    Game.demo = 0;
    return Game;
}());
var Main = (function () {
    function Main() {
    }
    Main.setVars = function (x) {
        var breakpoints = {
            "speed": {
                "points": [10, 30, 75],
                "vals": [100, 75, 50, 20]
            },
            "divisor": {
                "points": [25, 20, 15, 10, 5],
                "vals": [5000, 3000, 1000, 500]
            }
        }, speed = breakpoints.speed.vals[3], divisor = 1, milestone = 200;
        for (var i = 0, j = breakpoints.speed.points.length; i < j; i++) {
            if (x < breakpoints.speed.points[i]) {
                speed = breakpoints.speed.vals[i];
                break;
            }
        }
        if (x > milestone) {
            for (var i = breakpoints.divisor.points[0]; i > 1; i--) {
                if (x % i === 0) {
                    divisor = i;
                    if (x >= breakpoints.divisor.vals[0] ||
                        (i <= breakpoints.divisor.points[1] && x >= breakpoints.divisor.vals[1]) ||
                        (i <= breakpoints.divisor.points[2] && x >= breakpoints.divisor.vals[2]) ||
                        (i <= breakpoints.divisor.points[3] && x >= breakpoints.divisor.vals[3]) ||
                        i <= breakpoints.divisor.points[4]) {
                        break;
                    }
                }
            }
        }
        return [speed, divisor];
    };
    Main.isBetRelated = function (_elm) {
        return _elm.indexOf("betone") >= 0 || _elm.indexOf("betmax") >= 0 || _elm.indexOf("up") >= 0 || _elm.indexOf("down") >= 0;
    };
    Main.isNavRelated = function (_elm) {
        return _elm.indexOf("gamehelp") >= 0 || _elm.indexOf("payouts") >= 0 || _elm.indexOf("options") >= 0 || _elm.indexOf("back") >= 0;
    };
    Main.isPaytableViewRelated = function (_elm) {
        return _elm.indexOf("up") >= 0 || _elm.indexOf("down") >= 0 || _elm.indexOf("payouts") >= 0;
    };
    Main.isPickRelated = function (_elm) {
        return _elm.indexOf("quickpick") >= 0 || _elm.indexOf("clearall") >= 0;
    };
    Main.betType = function (_elm, _param) {
        if (_param === 0)
            return _elm.indexOf("betmax") >= 0 ? Game.bet.max : (_elm.indexOf("down") >= 0 ? -1 : 1);
        else
            return Number(_elm.indexOf("up") >= 0 || _elm.indexOf("down") >= 0);
    };
    Main.navType = function (_elm, _param) {
        if (_param === 0)
            return Number(_elm.indexOf("back") < 0);
        else
            return _elm.indexOf("gamehelp") >= 0 ? 0 : (_elm.indexOf("payouts") >= 0 ? 1 : 2);
    };
    Main.notAvailable = function (_elm) {
        var aux = _elm.indexOf("auto") >= 0 ? Game.auto : Main.gameInProgress;
        if (_elm.indexOf("start") >= 0)
            aux = aux || Game.spots.length < Setup.spots.min;
        if (_elm.indexOf("betmax") >= 0)
            aux = aux || Game.maxBetInvalid();
        if (_elm.indexOf("clearall") >= 0)
            aux = aux || Game.spots.length === 0;
        if (_elm.indexOf("up") >= 0)
            aux = aux || Game.bet.sample === Game.bet.max;
        if (_elm.indexOf("down") >= 0)
            aux = aux || Game.bet.sample === 1;
        return Game.credits === 0 || aux;
    };
    Main.canContinue = function () {
        var go = Game.auto.active && !Game.betTopsCredits() && (Game.options["select"][2] === 0 ||
            (Game.options["select"][2] === 1 && Game.auto.plays < Game.options["input"][0]) ||
            (Game.options["select"][2] === 2 && Game.credits > Game.options["input"][1] && Game.credits < Game.options["input"][2]));
        return go;
    };
    Main.bindInfo = function () {
        Dom.nodes["label-info-credits"].innerHTML = Game.credits;
        Dom.nodes["label-info-marked"].innerHTML = Game.spots.length;
        Dom.nodes["label-info-bet"].innerHTML = Game.bet.current;
        Dom.nodes["label-info-match"].innerHTML = Game.match;
        Dom.nodes["label-info-win"].innerHTML = Game.win;
    };
    Main.bindButtons = function () {
        var aux;
        var active;
        for (var i = 0, j = Layout.elements.buttons.members.length; i < j; i++) {
            aux = Layout.elements.buttons.members[i].style;
            active = aux.indexOf("auto") >= 0 ? Game.auto.active : this.notAvailable(aux);
            Dom.modifier(Dom.nodes[aux], "active", active);
        }
    };
    Main.bindBalls = function () {
        for (var i = 0, j = Game.spots.length; i < j; i++)
            Dom.modifier(Dom.nodes["balls"][Game.spots[i]], "active");
    };
    Main.bind = function (_sectors) {
        for (var i = 0, j = _sectors.length; i < j; i++) {
            if (_sectors[i] === "info")
                this.bindInfo();
            if (_sectors[i] === "balls")
                this.bindBalls();
            if (_sectors[i] === "buttons")
                this.bindButtons();
        }
    };
    Main.flashMessage = function () {
        Dom.nodes["block-balls-messages"].innerHTML = Dom.nodes["block-balls-messages"].innerHTML === "" ? Setup.messages.success + Game.win : "";
    };
    Main.progressMessage = function () {
        clearInterval(this.timers["msg"]);
        Dom.nodes["block-balls-messages"].innerHTML = Setup.messages.progress;
    };
    Main.cyclicMessages = function () {
        if (Game.messages === Setup.messages.start.length)
            Game.messages = 0;
        Dom.nodes["block-balls-messages"].innerHTML = Setup.messages.start[Game.messages++];
    };
    Main.messages = function () {
        this.cyclicMessages();
        this.timers["msg"] = setInterval(function () { Main.cyclicMessages(); }, this.delays.msg);
    };
    Main.manageRadios = function (_group, _ind, _val) {
        Dom.playSound(1);
        Game.manageOptions(_group, _val);
        Dom.switcher(Dom.nodes["radios" + _group], _ind);
    };
    Main.manageInputs = function (_ind, _val) {
        Game.options["input"][_ind] = Dom.form(_ind, _val);
    };
    Main.manageBalls = function (_ind, _auto) {
        this.reset();
        this.bindBalls();
        if (_auto !== undefined) {
            if (_auto > 0)
                _auto = Game.options["select"][0] === 0 ? Game.stats.lastSelection : Game.options["select"][1];
            Game.manageSpots(_ind, _auto);
        }
        else
            Game.manageSpots(_ind);
        this.bindBalls();
        Dom.fillPayouts(Game.getPayouts());
        Main.bind(["info", "buttons"]);
        if (_auto === undefined && Dom.canPlaySound(_ind))
            Dom.playSound(0);
    };
    Main.manageStats = function () {
        if (Game.stats.topCredits < Game.credits)
            Game.stats.topCredits = Game.credits;
        if (Game.stats.biggestWin < Game.win)
            Game.stats.biggestWin = Game.win;
    };
    Main.manageBet = function (_elm, _sample) {
        Game.manageBet(Main.betType(_elm, 0), _sample);
        if (!_sample) {
            Dom.fillPayouts(Game.getPayouts());
            this.reset();
        }
    };
    Main.managePainting = function (_ind) {
        if (_ind === undefined) {
            if (Game.deck[0] !== Setup.balls.neutral) {
                for (var i = 0; i < Setup.balls.total; i++)
                    Dom.paintBall(i, Setup.balls.neutral);
            }
        }
        else
            Dom.paintBall(_ind, Game.deck[_ind]);
    };
    Main.paytableView = function (_reset) {
        if (_reset)
            Game.bet.sample = Setup.sample;
        Dom.fillPaytable(Game.bet.sample);
    };
    Main.reset = function () {
        this.managePainting();
        Game.match = 0;
        Game.win = 0;
        for (var i = 0; i < Setup.paytable.max; i++)
            Dom.modifier(Dom.nodes["items"][i], "active", false);
    };
    Main.takeWin = function (_divisor) {
        Game.credits += _divisor;
        Main.bind(["info"]);
        if (Game.credits === Main.reference)
            Main.autoPlay();
        Dom.playSound(3);
    };
    Main.gameSet = function () {
        Game.auto.plays++;
        Game.stats.playedHands++;
        Game.balls.dial = 0;
        Game.buildDeck();
        Game.buildIndexes();
        Game.credits -= Game.bet.current;
    };
    Main.gameStart = function () {
        Main.gameInProgress = true;
        Main.progressMessage();
        Main.reset();
        Main.gameSet();
        Main.bind(["info", "buttons"]);
        Dom.playSound(2, Game.options["select"][5] + 1);
        Main.timers["game"] = setInterval(Main.gameProgress, Main.delays.game[Game.options["select"][5]]);
    };
    Main.gameProgress = function () {
        Main.managePainting(Game.balls.indexes[Game.balls.dial++]);
        Game.manageResults();
        Dom.activePayout(Game.match);
        Main.bind(["info"]);
        if (Game.balls.dial === Setup.balls.total)
            Main.gameEnd();
    };
    Main.gameEnd = function () {
        var vars = this.setVars(Game.win);
        clearInterval(this.timers["game"]);
        if (Game.win > 0) {
            Dom.nodes["block-balls-messages"].innerHTML = "";
            Dom.modifier(Dom.nodes["block-balls-messages"], "active");
            this.reference = Game.credits + Game.win;
            this.timers["msg"] = setInterval(this.flashMessage, this.delays.flash);
            this.timers["game"] = setInterval(function () { Main.takeWin(vars[1]); }, vars[0]);
        }
        else
            this.autoPlay();
    };
    Main.autoPlay = function () {
        clearInterval(this.timers["msg"]);
        clearInterval(this.timers["game"]);
        Dom.modifier(Dom.nodes["block-balls-messages"], "active", false);
        this.manageStats();
        if (this.canContinue() && Game.credits > 0)
            setTimeout(this.gameStart, 1000);
        else {
            if (Game.betTopsCredits())
                Game.bet.current = 1;
            Game.auto.plays = 0;
            Game.auto.active = false;
            this.gameInProgress = false;
            this.messages();
            this.bind(["info", "buttons"]);
        }
    };
    Main.assignForm = function () {
        var _loop_1 = function(i, j) {
            var _loop_2 = function(k, l) {
                Dom.nodes["radios" + i][k].onclick = function () { Main.manageRadios(i, k, Number(this.getAttribute("value"))); };
            };
            for (var k = 0, l = Dom.nodes["radios" + i].length; k < l; k++) {
                _loop_2(k, l);
            }
        };
        for (var i = 0, j = Setup.options.select.length; i < j; i++) {
            _loop_1(i, j);
        }
        var _loop_3 = function(i, j) {
            Dom.nodes.input[i].onblur = function () { Main.manageInputs(i, this.value); };
            Dom.nodes.input[i].onkeydown = function () { Dom.playSound(1); };
        };
        for (var i = 0, j = Setup.options.input.values.length; i < j; i++) {
            _loop_3(i, j);
        }
    };
    Main.assignBalls = function () {
        var _loop_4 = function(i, j) {
            Dom.nodes.balls[i].onmousedown = function () {
                if (!Main.notAvailable("ball")) {
                    Main.manageBalls(i);
                    Main.selecting = true;
                }
            };
            Dom.nodes.balls[i].onmouseover = function () {
                if (!Main.notAvailable("ball") && Main.selecting) {
                    Main.manageBalls(i);
                }
            };
        };
        for (var i = 0, j = Dom.nodes.balls.length; i < j; i++) {
            _loop_4(i, j);
        }
    };
    Main.assignButtons = function () {
        var aux;
        for (var i = 0, j = Layout.elements.buttons.members.length; i < j; i++) {
            aux = Layout.elements.buttons.members[i].style;
            Dom.nodes[aux].onclick = function () {
                var aux = this.classList.value;
                var stop = Main.notAvailable(aux);
                if (!stop || aux.indexOf("auto") >= 0) {
                    if (Main.isBetRelated(aux))
                        Main.manageBet(aux, Main.betType(aux, 1));
                    if (Main.isNavRelated(aux))
                        Dom.nav(Main.navType(aux, 0), Main.navType(aux, 1));
                    if (Main.isPaytableViewRelated(aux))
                        Main.paytableView(aux.indexOf("payouts") >= 0);
                    if (Main.isPickRelated(aux))
                        Main.manageBalls(-1, Number(aux.indexOf("quickpick") >= 0));
                    if (aux.indexOf("auto") >= 0)
                        Game.auto.active = !Game.auto.active;
                    if (aux.indexOf("start") >= 0)
                        Main.gameStart();
                    Dom.playSound(1);
                    Main.bind(["info", "buttons"]);
                }
            };
        }
    };
    Main.assignations = function () {
        window.onmouseup = function () { Main.selecting = false; };
        this.assignButtons();
        this.assignBalls();
        this.assignForm();
    };
    Main.init = function () {
        Game.init();
        Dom.init();
        this.bind(["info", "buttons"]);
        this.messages();
        this.assignations();
    };
    Main.gameInProgress = false;
    Main.selecting = false;
    Main.delays = { msg: 3000, flash: 400, game: [40, 20, 10] };
    Main.timers = [];
    Main.indexes = [];
    return Main;
}());
Main.init();
