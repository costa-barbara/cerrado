## 01_trainingMask.js
Build the training mask based on stable pixels (from 1985 to 2020), reference maps, and GEDI-based filtering 
```javascript
// read training mask
var trainingMask = ee.Image('users/dh-conciani/collection7/masks/cerrado_stablePixels_1985_2020_v3');
var vis = {
    'min': 0,
    'max': 49,
    'palette': require('users/mapbiomas/modules:Palettes.js').get('classification6')
    };
// plot 
Map.addLayer(trainingMask, vis, 'trainingMask'); 
```
[Link to script](https://code.earthengine.google.com/2fe1a3f5958c0f22901e5541a1fd6429)

## 02_computeProportion.js
Calculates the area of each class in each classification region. These calculations will estimate the number of training samples in each class. 

## 03_samplePoints.js
Uses the stable pixels to sort 7,000 training samples for each classification region (38). 
```javascript
// read training samples
var samplePoints = ee.FeatureCollection('users/dh-conciani/collection7/sample/points/samplePoints_v7');
// plot
Map.addLayer(samplePoints, {}, 'samplePoints');
```
[Link to script](https://code.earthengine.google.com/4c949df27bf33031a0e5af7f85e1224d)

## 04_getSignatures.R
Use the points generated in the previous step to extract the spectral signatures from the Landsat mosaic for each year. 
```javascript
// inspect a sample of the training dataset 
var trainingPoints = ee.FeatureCollection('users/dh-conciani/collection7/training/v2/train_col7_reg34_2021_v2');
Map.addLayer(trainingPoints, {}, 'trainingSamples');
```
[Link to script](https://code.earthengine.google.com/98596da0d1e5dbec9bb66e0c274a694b)

## Step05_rfClassification.py
Perform the classification of the Cerrado Landsat SR mosaics by using the `ee.Classifier.smileRandomForest()` added with auxiliary mosaics and training samples.

## Step06_postGapfill.js
No-data values (gaps) produced by cloud covered (or cloud shadow) pixels in a given image, were filled by the temporally nearest future valid classification. If no future valid classification was available, then the no-data value was replaced by its previous valid classification. Therefore, gaps should only remain in the final classified map when a given pixel was consistently classified as no-data throughout the entire temporal series.

## Step07a_postCalc_Incidence.js
Compute an image in which each pixel-value represents the number of times that a given pixel as changed among different classes. 

## Step07b_postApply_Incidence.js
An incident filter was applied to remove pixels that changed too many times over the 36 years. All pixels that changed more than eight times, and were connected to less than 6
same-class pixels that also changed more than eight times, were replaced by the MODE value. This avoids spurious transitions at the border of the same-class pixel group. <br> <br> Savanna Formation and Grassland pixels that changed more than ten times, and were connected to less than 66 pixels that also changed more than ten times, were classified as Other Non-Vegetated Areas (Class 25). Natural classes tend to be stable, and these areas that change too often are likely not native vegetation. <br><br> As a final rule, all forest pixels that changed more than eight times, and were connected to more than 66 pixels that also changed more than eight times, were also classified as Other Non-Vegetated Areas (Class 25). This rule aims to filter out areas of commercial tree plantations mapped as Forest Formation; as the growth period for *Eucalyptus* sp. and *Pinus* sp. commercial forest stands is approximately seven to eight years.

## Step08_postTemporal.js
The temporal filter uses the subsequent years to replace pixels that have invalid transitions in a given year. It follows sequential steps:
1. As a first step, the filter searches for any native vegetation class (Forest, Savanna, and Grassland) that was not classified as such in 1985, and was correctly classified in 1986 and 1987, and then corrects the 1985 value.

2. In the second step, the filter searches for pixel values that were not Pasture, Agriculture, or Other Non Vegetated Areas (classes representing anthropogenic use) in 2020, but were classified as such in 2018 and 2019. The value in 2020 is then corrected to match the previous years to avoid any regeneration detection in the last year (which can not be corroborated).

3. In the third step, the filter evaluates all pixels in a 3-year moving window to correct any value that changes in the second year (midpoint of the window) but returns to the same class in the third year. This process is applied observing prevalence rules, in this order: Pasture (15), Agriculture (19), Other non Vegetated Areas (25), River, Lake and Ocean (33), Savanna (4), Grassland (12), Forest (3).

4. The last step is similar to the third process, but consists of a 4- and 5-year moving window that corrects all middle years running in the same order of class prevalence.

## Step09_postSpatial.js
The spatial filter avoids misclassifications at the edge of pixel groups, and was built based on the `connectedPixelCount` function. Native to the GEE platform, this function
locates connected components (neighbours) that share the same pixel value. Thus, only pixels that do not share connections to a predefined number of identical neighbours are
considered isolated. At least six connected pixels are required to reach the minimum connection value. Consequently, the minimum mapping unit is directly affected by the
spatial filter applied, and it was defined as six pixels (~0,5 ha).

## Step10_postFrequency.js
The frequency filter was applied only on pixels that were classified as native vegetation (no conversion transitions) throughout the time series. If such a pixel was
classified as the same class over more than 50% of the period for savana and grassland or 75% for forest , that class was assigned to that pixel over the whole period. The results of this frequency filter was a more stable classification of native vegetation classes. Another important result was the removal of noise in the first and last year of the classification, which can not be adequately assessed by the temporal filter.

## Classification schema:
![alt text](https://github.com/musx/mapbiomas-cerrado-col6/blob/main/2-general-map/www/Collection%206.png?raw=true)


# Changelog <br>
## 1_trainingMask:
 

## 2_computeProportion:
  * Code structure optmization. Inclusion of .map functions instead repetition 

## 3_createPoints:
  * Code structure optmization. Inclusion of .map functions instead repetition 

## 4_getSignatures.R:
  * Migration from python api to R api (rgee)
  * inclusion of the time since the last fire as predictor
  * Inclusion of derived longitude geo-descriptors (sin, cos)
  * inclusion of HAND as predictor 
  * Inclusion the auxMosaics inside this step

## 5_rfClassification.R:
  * Migration from python api to R api (rgee)
  * ntree optimization (from 100 to 300)
  * mtry optimization (form sqrt(predictors) to 12)  

## 6_gapfill.js:
  * No changes

## 7_incidence.js:
  * code optimization (from 240 to 83 lines)

## 8_temporal.js:
  * rewriten to new sintax 
  * rules reviewed and optimized
  * wetlands included 
 
 ## 9_frequency.js:
  * stabilize pixels that are native vegetation for at least 90% of the time

 ## 10_geomorfology.js:
  * use geomorfology from IBGE (2009)- "Plano de inundação" - to optimize wetlands classification in Araguaia basin 
 
 ## 10_spatial.js:
  * double filtering
  * minimum mapping area equals to 0.45 ha
 


