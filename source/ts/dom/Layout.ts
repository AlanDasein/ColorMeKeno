class Layout {
    
    public static elements: any = {
        container: {"tag": "main"},
        panels: {
            tag: "section",
            parent: "container",
            members: [{style: "panel-main"}, {style: "panel-various", extendedStyle: "hide"}]
        },
        sections : {
            tag: "section",
            parent: "panel-main",
            members: [
                {style: "section-paytable"},
                {style: "section-balls"},
                {style: "section-buttons"},
                {style: "section-info"},
                {parent: "panel-various", style: "section-nav"}
            ]
        },
        tabs : {
            tag: "section",
            parent: "panel-various",
            members: [{style: "section-help"}, {style: "section-payouts"}, {style: "section-options"}]
        },
        blocks: {
            tag: "section",
            parent: "section-options",
            members: [
                {parent: "section-paytable", style: "block-paytable-items"},
                {parent: "section-paytable", style: "block-paytable-buttons"},
                {parent: "section-balls", style: "block-balls-messages", extendedStyle: "text-centered"},
                {parent: "section-balls", style: "block-balls-grid"},
                {parent: "section-info", style: "block-info-buttons"},
                {parent: "section-help", style: "block-help-paneltop", extendedStyle: "text-justified", text:  Setup.help[0]},
                {parent: "section-help", style: "block-help-panelbottom"},
                {parent: "section-payouts", style: "block-payouts-buttons"},
                {style: "block-options-quickpick"},
                {style: "block-options-autoplay"},
                {style: "block-options-maxbet"},
                {style: "block-options-audio"},
                {style: "block-options-speed"}
            ]
        },
        buttons: {
            tag: "button",
            parent: "section-buttons",
            members: [
                {parent: "block-paytable-buttons", style: "button-quickpick", extendedStyle: "large"},
                {parent: "block-paytable-buttons", style: "button-clearall", extendedStyle: "large"},
                {style: "button-betmax", extendedStyle: "small"},
                {style: "button-betone", extendedStyle: "small"},
                {style: "button-auto", extendedStyle: "medium"},
                {style: "button-start", extendedStyle: "medium"},
                {parent: "block-info-buttons", style: "button-gamehelp", extendedStyle: "large"},
                {parent: "block-info-buttons", style: "button-payouts", extendedStyle: "large"},
                {parent: "block-info-buttons", style: "button-options", extendedStyle: "large"},
                {parent: "block-payouts-buttons", style: "button-down", extendedStyle: "small"},
                {parent: "block-payouts-buttons", style: "button-up", extendedStyle: "small"},
                {parent: "section-nav", style: "button-back", extendedStyle: "small"}
            ]
        },
        labels: {
            tag: "div",
            parent: "block-help-panelbottom",
            members: [
                {parent: "section-info", style: "label-info-credits"},
                {parent: "section-info", style: "label-info-marked"},
                {parent: "section-info", style: "label-info-bet"},
                {parent: "section-info", style: "label-info-match"},
                {parent: "section-info", style: "label-info-win"},
                {style: "label-help-start", text: Setup.help[1]},
                {style: "label-help-quickpick", text: Setup.help[2]},
                {style: "label-help-auto", text:  Setup.help[3]},
                {style: "label-help-clearall", text:  Setup.help[4]},
                {style: "label-help-bets", text:  Setup.help[5]},
                {style: "label-help-extra", extendedStyle: "text-justified", text: Setup.help[6]},
                {parent: "block-payouts-buttons", style: "led"}
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
                {parent: "block-options-quickpick"},
                {parent: "block-options-quickpick", extendedStyle: "left small"},
                {parent: "block-options-autoplay"},
                {parent: "block-options-maxbet", extendedStyle: "left large"},
                {parent: "block-options-audio", extendedStyle: "xsmall"},
                {parent: "block-options-speed", extendedStyle: "xsmall"}
            ]
        },
        inputs:  {
            tag: "span",
            parent: "block-options-autoplay",
            style: "input",
            textTag: "label",
            membersStyle: "text-centered"
        },
        paytable: {parent: "section-payouts", style: "text-centered"},
        link: {attr: ["href", "target"], style: "text-centered"}
    };

    private static isEmpty(_value: any): boolean {
        return _value === undefined;
    }

    private static buildStyle(_base: string, _value: string): string {
        return _base + (this.isEmpty(_value) ? "" : " " + _value);
    }

    public static buildValues(_property: string[], _value: any[]): any[] {
        var values: any[] = [];
        for(let i = 0, j = _property.length;i < j;i++) values.push({"property": _property[i], "value": _value[i]});
        return values;
    }

    private static buildComponents(_component: any, _holder: any): any {
        var aux: any[] = [];
        for(let i = 0, j = _component.members.length;i < j;i++) {
            aux["parent"] = this.isEmpty(_component.members[i].parent) ? _component.parent : _component.members[i].parent;
            aux["style"] = this.buildStyle(_component.members[i].style, _component.members[i].extendedStyle);
            _holder[_component.members[i].style] = new Component(_holder[aux["parent"]], _component.tag, aux["style"], _component.members[i].text);
        }
        return _holder;
    }

    private static buildComponentsExtended(_component: any, _holder: any, kind: string): any {
        var aux: any;
        _holder[kind] =  [];
        for(let i = 0, j = kind === "items" ? Setup.paytable.max : Setup.balls.total;i < j;i++) {
            _holder[kind][i] = new Component(_holder[_component.parent], _component.tag, this.buildStyle(_component.style, _component.extendedStyle));
            if(!this.isEmpty(_component.childrenStyle)) {
                for(let j = 0;j < _component.childrenStyle.length;j++) aux = new Component(_holder[kind][i], _component.tag, _component.childrenStyle[j]);
            }
        }
        return _holder;
    }

    private static buildComponentsSpecial(_component: any, _holder: any, kind: string): any {
        var aux: any[] = [];
        if(this.isEmpty(_component.groups)) {
            _holder["input"] = [];
            aux["input"] = new Component(_holder[_component.parent], _component.tag, _component.style);
            aux["extra"] = new Component(aux["input"], _component.textTag, "", Setup.options.input.text);
            for(let i = 0, j = Setup.options.input.values.length;i < j;i++) {
                aux["extra"] = this.buildValues(["value"], [Setup.options.input.values[i]]);
                _holder["input"][i] = new Component(aux["input"], "input", _component.membersStyle, "", aux["extra"]);
            }
        }
        else {
            for(let i = 0, j = Setup.options.select.length;i < j;i++) {
                _holder[kind + i] = [];
                aux["items"] = Setup.options.select[i].items;
                if(this.isEmpty(aux["items"])) {
                    aux["items"] = [];
                    for(let k = Setup.options.select[i].range.start;k < Setup.options.select[i].range.end;k++) aux["items"].push(k);
                }
                for(let k = 0, l = aux["items"].length;k < l;k++) {
                    aux["style"] = this.buildStyle(_component.style, _component.groups[i].extendedStyle);
                    aux["values"] = this.buildValues(["value"], [isNaN(aux["items"][k]) ? k : aux["items"][k]]);
                    if(Setup.options.select[i].default === k) aux["style"] += " active";
                    _holder[kind + i][k] = new Component(_holder[_component.groups[i].parent], _component.tag, aux["style"], aux["items"][k].toString(), aux["values"]);
                }
            }
        }
        return _holder;
    }

    public static buildPaytable(_holder: any, _index: number, _level: number): void {
        var aux: any[] = [];
        aux["row"] = new Component(_holder, "tr");
        aux["cell"] = new Component(aux["row"], "td", "", _index.toString());
        aux["match"] = Setup.paytable.values["match" + _index];
        for(let i = Setup.spots.min - 1;i < Setup.spots.max;i++) {
            if(aux["match"] !== undefined) aux["text"] = aux["match"]["spots" + (i + 1)];
            if(aux["text"] === undefined || isNaN(aux["text"])) aux["text"] = "<hr/>";
            else aux["text"] *= _level;
            aux["cell"] = new Component(aux["row"], "td", "", aux["text"].toString());
        }
    }

    public static init(): any[] {

        var elm: any[] = [];

        for(let obj in this.elements) {
            switch(obj) {
                case "container":
                    elm["container"] = new Component(document.body, this.elements[obj].tag);
                    break;
                case "radios":
                case "inputs":
                    this.buildComponentsSpecial(this.elements[obj], elm, obj)
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

    }

}