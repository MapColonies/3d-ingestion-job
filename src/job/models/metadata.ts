/* eslint-disable @typescript-eslint/naming-convention */

export interface Metadata {
  /**
   * Product's unique identifier
   */
  productId: string;
  /**
   * Product name
   */
  productName: string;
  /**
   * Emergence geographic area name
   */
  geographicArea: string;
  /**
   * Product version
   */
  productVersion: number; // 1
  /**
   * Product type
   */
  productType: string; // 3DModel
  /**
   * Product description
   */
  description?: string;
  /**
   * Product classification
   */
  classification?: string;
  /**
   * Geographical delineation of the product
   */
  footprint?: string;
  /**
   * Bottom left point of a blocking rectangle
   */
  extentLowerLeft: string;
  /**
   * Top right point of a blocking rectangle
   */
  extentUpperRight: string;
  /**
   * Date of oldest source material
   */
  SourceDateStart: Date;
  /**
   * Date of latest source material
   */
  SourceDateEnd: Date;
  /**
   * The organization that produced/supplied the product
   */
  producerName: string; // IDFMU
  /**
   * The product reference system, including a vertical data
   */
  SRS: string;
  /**
   * Axis system center in which the coordinate is displayed
   */
  SRSOrigin?: string;
  /**
   * Number of points per unit of area
   */
  nominalResolution?: string;
  /**
   * LE90 of the height values
   */
  accuracyLE90: string;
  /**
   * CE90 of location of elevation points
   */
  horizontalAccuracyCE90: string;
  /**
   * LE90 of distance measurement
   */
  relativeAccuracyLE90: string;
  /**
   * The minimum height
   */
  heightRangeFrom?: number;
  /**
   * The maximum height
   */
  heightRangeTo?: number;
  /**
   * The sensor used as the source of the product (possibly more than one)
   */
  sensor: string[];
  /**
   * Method of extracting altitude data
   */
  productionMethod?: string; // Photogrammetric
  /**
   * Production system
   */
  productionSystem: string;
}
