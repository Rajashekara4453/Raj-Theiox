/// <reference path="./mxShape.d.ts" />
/// <reference path="../util/mxRectangle.d.ts" />
/// <reference path="../util/mxAbstractCanvas2D.d.ts" />

/**
 * Extends {@link mxShape} to implement a rectangle shape.
 * This shape is registered under {@link mxConstants.SHAPE_RECTANGLE} in {@link mxCellRenderer}.
 * @class mxRectangleShape
 * @extends {mxShape}
 */
declare class mxRectangleShape extends mxShape {

  /**
   * @param {mxRectangle} bounds
   * @param {string} fill
   * @param {string} stroke
   * @param {number} [strokewidth]
   */
  constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth?: number);

  /**
   * Returns true for non-rounded, non-rotated shapes with no glass gradient.
   */
  isHtmlAllowed(): boolean;

  /**
   * Generic background painting implementation.
   */
  paintBackground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void;

  /**
   * Adds roundable support.
   */
  isRoundable(c?: mxAbstractCanvas2D, x?: number, y?: number, w?: number, h?: number): boolean;

  /**
   * Generic background painting implementation.
   */
  paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void;

}
