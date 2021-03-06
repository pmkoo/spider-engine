import { Plane, PlaneClassification } from "../math/Plane";
import { Vector3 } from "../math/Vector3";
import { Transform } from "../core/Transform";
import { AABB } from "../math/AABB";

enum FrustumPlane {
    Near,
    Far,
    Left,
    Right,
    Bottom,
    Top,
    Count 
}

export enum FrustumCorner {
    FarTopLeft,
    FarTopRight,
    FarBottomLeft,
    FarBottomRight,
    NearTopLeft,
    NearTopRight,
    NearBottomLeft,
    NearBottomRight,
    Count
}

export enum FrustumTest {
    In,
    Out,
    Intersect
}

namespace Private {
    export namespace update {
        export let fCenter = new Vector3();
        export let nCenter = new Vector3();
        export let temp1 = new Vector3();
        export let temp2 = new Vector3();
    }
}

export class Frustum {

    get corners() { return this._corners; }

    private _planes: Plane[];
    private _corners: Vector3[];

    constructor() {
        this._planes = [];
        this._planes.length = FrustumPlane.Count;
        for (let i = 0; i < FrustumPlane.Count; ++i) {
            this._planes[i] = new Plane();
        }
        this._corners = [];
        this._corners.length = FrustumCorner.Count;
        for (let i = 0; i < FrustumCorner.Count; ++i) {
            this._corners[i] = new Vector3();
        }
    }

    isPointInside(worldPos: Vector3) {
        for (let plane of this._planes) {
            let result = plane.classifyPoint(worldPos);    
            if (result === PlaneClassification.Front) {
                return false;
            }
        }
        return true;
    }
    
    update(
        nearW: number, 
        nearH: number, 
        farW: number, 
        farH: number,
        near: number,
        far: number,
        transform: Transform
    ) {
        const { fCenter, nCenter, temp1, temp2 } = Private.update;

        fCenter.copy(transform.worldForward).multiply(-far).add(transform.worldPosition);        
        this._corners[FrustumCorner.FarTopLeft].addVectors(
            temp1.copy(transform.worldUp).multiply(farH),
            temp2.copy(transform.worldRight).multiply(-farW)
        ).add(fCenter);
        this._corners[FrustumCorner.FarTopRight].addVectors(
            temp1.copy(transform.worldUp).multiply(farH),
            temp2.copy(transform.worldRight).multiply(farW)
        ).add(fCenter);
        this._corners[FrustumCorner.FarBottomLeft].addVectors(
            temp1.copy(transform.worldUp).multiply(-farH),
            temp2.copy(transform.worldRight).multiply(-farW)
        ).add(fCenter);
        this._corners[FrustumCorner.FarBottomRight].addVectors(
            temp1.copy(transform.worldUp).multiply(-farH),
            temp2.copy(transform.worldRight).multiply(farW)
        ).add(fCenter);

        nCenter.copy(transform.worldForward).multiply(-near).add(transform.worldPosition);
        this._corners[FrustumCorner.NearTopLeft].addVectors(
            temp1.copy(transform.worldUp).multiply(nearH),
            temp2.copy(transform.worldRight).multiply(-nearW)
        ).add(nCenter);
        this._corners[FrustumCorner.NearTopRight].addVectors(
            temp1.copy(transform.worldUp).multiply(nearH),
            temp2.copy(transform.worldRight).multiply(nearW)
        ).add(nCenter);
        this._corners[FrustumCorner.NearBottomLeft].addVectors(
            temp1.copy(transform.worldUp).multiply(-nearH),
            temp2.copy(transform.worldRight).multiply(-nearW)
        ).add(nCenter);
        this._corners[FrustumCorner.NearBottomRight].addVectors(
            temp1.copy(transform.worldUp).multiply(-nearH),
            temp2.copy(transform.worldRight).multiply(nearW)
        ).add(nCenter);
        
        this._planes[FrustumPlane.Top].setFromPoints(
            this._corners[FrustumCorner.NearTopLeft], 
            this._corners[FrustumCorner.FarTopLeft], 
            this._corners[FrustumCorner.FarTopRight]
        );
        this._planes[FrustumPlane.Bottom].setFromPoints(
            this._corners[FrustumCorner.NearBottomRight], 
            this._corners[FrustumCorner.FarBottomRight], 
            this._corners[FrustumCorner.FarBottomLeft]
        );
        this._planes[FrustumPlane.Left].setFromPoints(
            this._corners[FrustumCorner.FarBottomLeft], 
            this._corners[FrustumCorner.FarTopLeft], 
            this._corners[FrustumCorner.NearTopLeft]
        );
        this._planes[FrustumPlane.Right].setFromPoints(
            this._corners[FrustumCorner.NearBottomRight], 
            this._corners[FrustumCorner.NearTopRight], 
            this._corners[FrustumCorner.FarTopRight]
        );
        this._planes[FrustumPlane.Near].setFromPoints(
            this._corners[FrustumCorner.NearBottomLeft], 
            this._corners[FrustumCorner.NearTopLeft], 
            this._corners[FrustumCorner.NearTopRight]
        );
        this._planes[FrustumPlane.Far].setFromPoints(
            this._corners[FrustumCorner.FarBottomRight], 
            this._corners[FrustumCorner.FarTopRight], 
            this._corners[FrustumCorner.FarTopLeft]
        );

        return this;
    }

    testAABB(aabb: AABB): FrustumTest {
        let planesIn = 0;
        const corners = aabb.corners;
        for (let i = 0; i < FrustumPlane.Count; ++i) {
            let pointsIn = FrustumCorner.Count;
            let planeIn = 1;

            for (let j = 0; j < FrustumCorner.Count; ++j) {
                if (this._planes[i].classifyPoint(corners[j]) === PlaneClassification.Back) {
                    planeIn = 0;
                    --pointsIn;
                }
            }

            if (pointsIn === 0) {
                return FrustumTest.Out;
            }

            planesIn += planeIn;
        }

        if (planesIn === FrustumPlane.Count) {
            return FrustumTest.In;
        }

        return FrustumTest.Intersect;
    }
}
