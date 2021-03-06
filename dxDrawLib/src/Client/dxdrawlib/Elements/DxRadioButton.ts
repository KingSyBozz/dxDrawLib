﻿/// <reference path="../../dxdrawlib.d.ts" />

class DxRadioButton extends DxElement {

	private _group: string;
	private _clicked: boolean = false;
	private _selected: boolean;
	private _pointOffset: number;
	private get _getRoundHeight(): number { return Math.round(this.height * 10) / 10 }
	private get _innerRectangel(): number { return (this._getRoundHeight * this._pointOffset) }
	private get _textSize(): number { return (this.height / 100); }
	private get _text(): string { return (((this.text.length * (this._textSize * 40)) > (this.width - this.height)) ? this.text.substring(0, Math.round((this.width - this.height) / (this._textSize * 40))) + ((Math.round((this.width - this.height) / (this._textSize * 38)) == this.text.length) ? "" : "...") : this.text); }
	private _radioButtonGroup: DxRadioButtonGroups = DxScreen.RadioButtonGroups;
	private _selectedColor: Color;

	public enabled: boolean = true;
	public backColor: Color = new Color(255, 255, 255, 255);
	public colorUnselected: Color = new Color(0, 0, 0, 0);
	public textColor: Color = new Color(255, 255, 255, 255);

	//set setParent(value: DxElement) { this.changeParent(value); } // Not Supported at the moment
	public set selected(value: boolean) { this._selected = value; if (value) this._radioButtonGroup.changeSelected(this); }
	public get selected(): boolean { return this._selected }
	public set group(value: string) { this._radioButtonGroup.deleteElementFromGroup(this); this._group = value; this._radioButtonGroup.add(this); this.selected = false; }
	public get group(): string { return this._group; }
	public set pointOffset(value: number) { this._pointOffset = Math.round((clamp((1 - value), 0, 0.9) / 2) * 100) / 100; }
	public get pointOffset(): number { return 1 - this._pointOffset; }

	constructor(public text: string, group: string, X: number, Y: number, width: number, height: number, selected: boolean = false, relative?: boolean, color?: Color, parent?: DxElement) {
		super(X, Y, width, height, relative, color, parent);
		this._group = ((group != null) ? group : "");

		if (this.parent != null) this._radioButtonGroup = this.parent.DxRadioButtonGroups;
		else this._radioButtonGroup = DxScreen.RadioButtonGroups;

		this._radioButtonGroup.add(this);
		this.pointOffset = 0.9;
		this._selectedColor = this.color;
		this.selected = selected;
	}

	public draw(): void {
		if (this.visible) {
			this.calculate();
			API.drawRectangle(this.X, this.Y, this._getRoundHeight, this._getRoundHeight, this.backColor.r, this.backColor.g, this.backColor.b, this.backColor.a);
			API.drawRectangle(this.X + this._innerRectangel, this.Y + this._innerRectangel, this._getRoundHeight - (this._innerRectangel * 2), this._getRoundHeight - (this._innerRectangel * 2), this._selectedColor.r, this._selectedColor.g, this._selectedColor.b, this._selectedColor.a);
			API.drawText(this._text, this.X + (this.height), this.Y, this._textSize, this.textColor.r, this.textColor.g, this.textColor.b, this.textColor.a, 0, justify.left, false, false, 0);
			if (!this.enabled) {
				API.drawRectangle(this.X, this.Y, this.height, this.height, 0, 0, 0, 75);
			}
			this.drawChildren();
		}
	}

	protected calculate(): void {
		if (API.isCursorShown()) {
			var mPos = API.getCursorPositionMaintainRatio();
			if (this.enabled) {
				if (API.isDisabledControlJustPressed(24)) {
					if (this.isPointInElement(mPos)) {
						this._clicked = true;
					}
				}
				if (API.isControlJustReleased(24)) {
					if (this.isPointInElement(mPos) && this._clicked) {
						if (!this.selected) {
							this.selected = true;
							this._selectedColor = this.color;
						}
						this.debugMessage(debug.radiobutton, "~g~Change selected index");
					}
					this._clicked = false;
				}
				if (this.isPointInElement(mPos)) {
					
				}
			}
			else {
				// disabled
			}
		}
		if (this.selected) this._selectedColor.a = 255;
		else this._selectedColor.a = 0;
	}

	private changeParent(parent: DxElement): void {
		this._radioButtonGroup.deleteElementFromGroup(this);
		super.setNewParent(parent);
		if (this.parent != null) this._radioButtonGroup = this.parent.DxRadioButtonGroups;
		else this._radioButtonGroup = DxScreen.RadioButtonGroups;
	}
	
	public sync(data): void {
		
	}
}
