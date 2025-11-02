---
layout: page
title: Segmentation and Classification
description: Using classic computer vision techniques to segment and extract, and deep learning for the classification
img: assets/img/projects/coin_neutral_segmentation.png
importance: 6
category: university
images:
  slider: true
github: https://github.com/Jakhongir0103/Coin-segmentation-and-classification
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.github %}
    <a href="{{ page.github }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fab fa-github"></i> Code
    </a>
  {% endif %}
</div>

The project is about on segmenting, extracting and classifying coin images using computer vision techniques, involving both segmentation and classification steps. The images contain coins with 3 backgrounds: neutral, noisy interference, and those containing hands. 

## Methodology

#### Segmentation: Hough Transforms

Initially, a straightforward thresholding approach was applied to isolate coins from their backgrounds. However, this simple method struggled with the project's diverse image conditions: neutral backgrounds, noisy interference, and images containing hands. The primary challenges included overlapping backgrounds and inconsistent segmentation across different image types.

To overcome these limitations, we enhanced the pipeline with morphological operations like dilation to refine segment boundaries and merged components. The key breakthrough came with implementing the [Hough transform](https://en.wikipedia.org/wiki/Hough_transform) to detect circular coin shapes. This approach proved essential for handling complex cases where coin pieces merged together or adhered to the background, allowing us to reliably extract individual coin regions.

At the end, the segmentation phase consisted of 4 steps:
1. **Background Detection** - Using standard deviation on specific channels to identify image type (Noisy/Neutral/Hand)
2. **Edge Detection** - Using Canny algorithm (for hand/neutral) or thresholding on H and S channels (for noisy), adapted per background type
3. **Morphological Operations** - Dilation and other morphology functions to remove noise, adapted per background type
4. **Hough Transformation** - Detecting coins as circular objects, separating merged pieces and removing background attachments

Some examples of segmentation are given below for each background type:

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/coin_neutral_segmentation.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/coin_noisy_segmentation.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/coin_hand_segmentation.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

#### Classification: ResNet50

Once coins were successfully segmented, the extracted circular regions were processed for classification. We manually labeled the coins and trained a [ResNet50](https://docs.pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html) architecture to learn discriminative features for each coin class. The model was validated using 5-fold cross-validation to ensure robust performance.

The training process showed steady improvement, with both training and test loss converging and accuracy increasing across folds. The loss and accuracy curves demonstrate successful learning without significant overfitting.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/coin_loss.png" title="Training Metrics" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Loss function and accuracy metrics across training and test sets during 5-fold cross-validation, showing model convergence and generalization.
</div>

## Results

The final model evaluation on held-out test data revealed strong classification performance. Here is the final confucion matrix of the evaluation:.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/coin_confusion_matrix.png" title="Confusion Matrix" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Confusion matrix from the final model evaluation, showing classification accuracy for each coin class and potential misclassifications.
</div>

Here are some prediction examples of the final model:

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true" style="max-width: 60%; margin: 0 auto;">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/coin_prediction_example_1.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/coin_prediction_example_2.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>