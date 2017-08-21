class Component {

    public item: any;

    constructor(_parent: any, _tag: string, _style?: string, _text?: string, _attr?: any) {
        this.item = document.createElement(_tag);
        if(_style !== undefined && _style.length > 0) this.item.className = _style;
        if(_text !== undefined && _text.length > 0) this.item.innerHTML = _text;
        if(_attr !== undefined) {
            for(let i = 0, j = _attr.length;i < j;i++) this.item.setAttribute(_attr[i].property, _attr[i].value);
        }
        _parent.appendChild(this.item);
        return this.item;
    }

}