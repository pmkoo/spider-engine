import { Rect } from "./Rect";
import { Vector2 } from "../math/Vector2";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { UISize } from "./UISize";
import { Matrix44 } from "../math/Matrix44";
import { Color } from "../graphics/Color";
import { SerializedObject } from "../core/SerializableObject";
import { Component } from "../core/Component";
export declare class Layout extends Component {
    static horizontalAlignmentPropertyKey: string;
    static verticalAlignmentPropertyKey: string;
    static rotationKey: string;
    static offsetKey: string;
    static scaleKey: string;
    readonly version: number;
    offset: Vector3;
    readonly pivot: Vector2;
    readonly width: UISize;
    readonly height: UISize;
    horizontalAlignment: number;
    verticalAlignment: number;
    readonly margin: Rect;
    rotation: Quaternion;
    scale: Vector2;
    tint: Color;
    inheritTint: boolean;
    actualWidth: number;
    actualHeight: number;
    readonly worldMatrix: Matrix44;
    readonly finalTint: Color;
    readonly right: Vector3;
    readonly forward: Vector3;
    readonly up: Vector3;
    readonly localRight: Vector3;
    readonly localForward: Vector3;
    readonly localUp: Vector3;
    readonly absoluteScale: Vector3;
    readonly absolutePos: Vector3;
    private _horizontalAlignment;
    private _verticalAlignment;
    private _pivot;
    private _offset;
    private _width;
    private _height;
    private _margin;
    private _rotation;
    private _scale;
    private _tint;
    private _inheritTint;
    private _worldMatrix;
    private _actualWidth;
    private _actualHeight;
    private _finalTint;
    upgrade(json: SerializedObject, previousVersion: number): SerializedObject;
}
