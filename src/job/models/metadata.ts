/* eslint-disable @typescript-eslint/naming-convention */

export interface Metadata {
  /**
   * Unique identifier
   */
  identifier: string;
  /**
   * Typename for the metadata; typically the value of the root element tag (e.g. csw:Record, gmd:MD_Metadata)
   */
  typename: string;
  /**
   * Schema for the metadata; typically the target namespace (e.g. http://www.opengis.net/cat/csw/2.0.2, http://www.isotc211.org/2005/gmd)
   */
  schema: string;
  /**
   * MD source
   */
  mdSource: string;
  /**
   * Full XML representation
   */
  xml: string;
  /**
   * Bag of XML element text values, used for full text search
   */
  anytext: string;
  /**
   * Date of insertion
   */
  insertDate: Date;
  /**
   * Creation date
   */
  creationDate?: Date;
  /**
   * Validation date
   */
  validationDate?: Date;
  /**
   * Well-Known-Text markup language for representing vector geometry objects
   */
  wktGeometry?: string;
  /**
   * Title
   */
  title?: string;
  /**
   * The organization that produced/supplied the product
   */
  producerName?: string; // IDFMU
  /**
   * Description
   */
  description?: string;
  /**
   * Type
   */
  type?: string;
  /**
   * Product classification
   */
  classification?: string;
  /**
   * The product reference system, including a vertical data
   */
  srs?: string;
  /**
   * Project name
   */
  projectName?: string;
  /**
   * Version
   */
  version?: string;
  /**
   * Centroid
   */
  centroid?: string;
  /**
   * Footprint
   */
  footprint?: string;
  /**
   * Begining time
   */
  timeBegin?: Date;
  /**
   * Ending time
   */
  timeEnd?: Date;
  /**
   * The sensor used as the source of the product
   */
  sensorType?: string;
  /**
   * Region
   */
  region?: string;
  /**
   * Nominal resolution
   */
  nominalResolution?: string;
  /**
   * LE90 of the height values
   */
  accuracyLE90?: string;
  /**
   * CE90 of location of elevation points
   */
  horizontalAccuracyCE90?: string;
  /**
   * LE90 of distance measurement
   */
  relativeAccuracyLE90?: string;
  /**
   * Estimated precision
   */
  estimatedPrecision?: string;
  /**
   * Measured precision
   */
  measuredPrecision?: string;
}
