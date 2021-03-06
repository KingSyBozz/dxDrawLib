﻿/// <reference path="../../dxdrawlib.d.ts" />

abstract class DxElement {

	protected _DxRadioButtonGroups: DxRadioButtonGroups = new DxRadioButtonGroups();
	protected _id: number;
	protected _offsetHeaderHeight = 0;
	protected _X: number;
	protected _Y: number;
	private _width: number;
	private _height: number;
	private _visible: boolean;
	private _debug: boolean = false;
	private _parent: DxElement;
	protected _children: DxElement[] = [];
	
	public static elements: DxElement[] = [];
	public static lastId: number = 1;
	
	get DxRadioButtonGroups(): 	DxRadioButtonGroups { return this._DxRadioButtonGroups; }
	get children(): DxElement[] 		{ return this._children; }	
	set debug(value: boolean) 			{ this._debug = value; for (let child of this.children) { child.debug = value; } }
	get debug(): boolean 				{ return this._debug; }
	get parent(): DxElement 			{ return this._parent; }
	get visible(): boolean 				{ return this._visible; }
	set visible(value: boolean) 		{ this._visible = value; for (let child of this.children) { child.visible = value; } }
	get parentX(): number 				{ return this.parent == null ? 0 : this.parent.X; }
	get parentY(): number 				{ return this.parent == null ? 0 : this.parent.Y + this.parent._offsetHeaderHeight; }
	get parentWidth(): number 			{ return this.parent == null ? DxScreen.width : this.parent.width; }
	get parentHeight(): number 			{ return this.parent == null ? DxScreen.height : this.parent.height - this.parent._offsetHeaderHeight; }
	get id(): number 					{ return this._id; }
	set X(value: number) 				{ this._X = this.calculateSize(value, 1); }
	get X(): number 					{ return (this.parentX + this._X); }
	set Y(value: number) 				{ this._Y = this.calculateSize(value, 2); }
	get Y(): number 					{ return (this.parentY + this._Y); }
	set width(value: number) 			{ this._width = this.calculateSize(value, 1); }
	get width(): number 				{ return this._width; }
	set height(value: number) 			{ this._height = this.calculateSize(value, 2); }
	get height(): number 				{ return this._height; }

	constructor(X: number, Y: number, width: number, height: number, public relative: boolean = true, public color?: Color, parent?: DxElement) {

		if (this.relative == null) this.relative = true;
		if (this.color == null) this.color = new Color();
		if (parent != null) {
			this._parent = parent;
			this._parent._children.push(this);
		}

		this._id = DxElement.lastId++;
		this.X = X;
		this.Y = Y;
		this.width = width;
		this.height = height;
		
		DxElement.elements[this._id] = this;
	}

	private calculateSize(value: number, type: number): number {
		if(type == 1) 	return clamp(this.relative ? (this.parentWidth  * value) : DxScreen.maintainHorizontal(value), 0, this.parentWidth);
		else 			return clamp(this.relative ? (this.parentHeight * value) : DxScreen.maintainVertical(value)  , 0, this.parentHeight);
	}

	protected isPointInElement(point: PointF): boolean {
		return isPointInArea(point, this.X, this.Y, this.width, this.height);
	}

	protected drawChildren(): void {
		for (let child of this.children) child.draw();
	}

	protected setNewParent(newParent: DxElement) {
		if (this._parent != null) {
			var index = this._parent.children.indexOf(this);
			if (index > -1) {
				this._parent.children.splice(index, 1);
			}
		}
		this._parent = newParent;
		API.sendChatMessage("called setnewparent");
	}

	protected debugMessage(type: number, message: string): void {
		if (this.debug) {
			var typeStr: string = "~b~";
			switch (type) {
				case 0:
					typeStr += "[DxWindow]";
					break;
				case 1:
					typeStr += "[DxButton]";
					break;
				case 2:
					typeStr += "[DxRadioButton]";
					break;
				case 3:
					typeStr += "[DxCheckbox]";
					break;
				case 4:
					typeStr += "[DxTabPanel]";
					break;
			}
			API.sendChatMessage(typeStr, "~w~" + message);
		}
	}

	//public abstract set setParent(value: DxElement);
	public abstract draw(): void;
	protected abstract calculate(): void;
	public abstract sync(data): void;

}
