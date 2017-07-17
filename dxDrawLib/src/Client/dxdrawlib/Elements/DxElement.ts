﻿/// <reference path="../../dxdrawlib.d.ts" />

abstract class DxElement {

	public static lastId: number = 0;

	protected _id: number;

	protected _offsetHeaderHeight = 0;
	protected _X: number;
	protected _Y: number;
	private _width: number;
	private _height: number;

	public visible: boolean = false;
	public children: DxElement[] = [];

	get parentX(): number { return ((this.parent == null) ? 0 : this.parent.X); }
	get parentY(): number { return ((this.parent == null) ? 0 : this.parent.Y + this.parent._offsetHeaderHeight); }
	get parentWidth(): number { return ((this.parent == null) ? DxScreen.width : this.parent.width); }
	get parentHeight(): number { return ((this.parent == null) ? DxScreen.height : this.parent.height - this.parent._offsetHeaderHeight); }
	//get parentHeaderOffset(): number { return ((this.parent == null) ? 0 : this.parent._offsetHeaderHeight);}

	get id(): number { return this._id; }
	set X(value: number) { this._X = this.calculateSize(value, 1); }
	get X(): number { return (this.parentX + this._X); }
	set Y(value: number) { this._Y = this.calculateSize(value, 2); }
	get Y(): number { return (this.parentY + this._Y); }
	set width(value: number) { this._width = this.calculateSize(value, 1); }
	get width(): number { return this._width; }
	set height(value: number) { this._height = this.calculateSize(value, 2); }
	get height(): number { return this._height; }

	constructor(X: number, Y: number, width: number, height: number, public relative: boolean = true, public color?: Color, public parent?: DxElement) {

		if (this.parent != null) this.parent.children.push(this);
		if (this.color == null) this.color = new Color();

		this._id = DxElement.lastId++;
		this.X = X;
		this.Y = Y;
		this.width = width;
		this.height = height;
		
	}

	private calculateSize(value: number, type: number): number {
		var result: number;

		switch (type) {
			case 1: // For X and width
				result = (this.relative) ? clamp(this.parentWidth * value, 0, this.parentWidth) : clamp(value, 0, this.parentWidth);
				break;
			case 2: // For Y and height
				result = (this.relative) ? clamp(this.parentHeight * value, 0, this.parentHeight) : clamp(value, 0, this.parentHeight);
				break;
		}

		return result;
	}

	public isPointInElement(point: PointF): boolean {
		if (point.X > (this.X) && point.X < (this.X + this.width) && point.Y > (this.Y) && point.Y < (this.Y + this.width)) return true;
		else return false;
	}

	public abstract draw(): void;
	public abstract sync(data): void;

}
