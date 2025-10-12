---
layout: page
title: Predicting Cardiovascular Diseases
description: Using machine learning on behavioral risk factor data to predict heart disease
img: assets/img/projects/ml1_thumbnail.png
importance: 7
category: university
code: https://github.com/Jakhongir0103/Cardiovascular-Diseases-Prediction
report: https://github.com/Jakhongir0103/Cardiovascular-Diseases-Prediction/blob/main/pdfs/project1_report.pdf
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.report %}
    <a href="{{ page.report }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-file-pdf"></i> Technical Report
    </a>
  {% endif %}
  {% if page.code %}
    <a href="{{ page.code }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fab fa-github"></i> Code
    </a>
  {% endif %}
</div>

*Cardiovascular diseases (CVD)* are among the leading causes of death worldwide. In this project, we developed machine learning models to help with early detection of CVDs using data from the Behavioral Risk Factor Surveillance System (BRFSS), a large-scale survey of U.S. residents' health behaviors and risk factors.

> *All models were implemented from scratch using Python native libraries - no machine learning frameworks like scikit-learn or PyTorch were used.*

## The Challenge

The BRFSS dataset contains responses from 328,135 individuals across 322 features, covering demographics, health conditions, lifestyle factors, and behaviors. Our goal was to predict whether someone has been diagnosed with coronary heart disease (MICHD), which includes heart attacks and angina.

The dataset presented several challenges:
- **Class imbalance**: Less than 9% of respondents had CVD, making accuracy a poor metric
- **Feature heterogeneity**: Mix of binary (34%), categorical (18%), and numerical (48%) features
- **Missing values**: Survey structure meant many missing values had semantic meaning
- **Confounders**: Many features unrelated to the prediction task

## Three Preprocessing Strategies

We experimented with three different approaches to handling this complex dataset:

**"The Good"**: Carefully selected 122 relevant features with informed preprocessing that respected the semantic meaning of each feature. This included mapping invalid values, converting answers to meaningful scales, and intelligently filling missing values based on question context.

**"The Bad"**: Used all 322 raw features with minimal preprocessing - simply mapping missing values to -1 and applying min-max normalization.

**"The Ugly"**: A hybrid approach using all features, where our selected 122 were preprocessed with the informed strategy and the rest with the default approach.

## Model and Optimization

We trained logistic regression models with L2 regularization, optimizing the following loss function:

$$
\mathcal{L}(w):=\frac{1}{N} \sum_{n=1}^N-y_n x_n^{\top} w+\log \left(1+e^{x_n^{\top} w}\right) + \frac{\lambda}{2} \|w\|_2^2
$$

For each preprocessing strategy, we performed grid search over:
- Regularization coefficient $\lambda \in \{0.00001, 0.0001, 0.001, 0.01, 0.1\}$
- Learning rate: $\gamma \in \{0.01, 0.05, 0.1, 0.5, 1\}$
- Batch size: $b \in \{500, 5000, 10000\}$

We trained each model for 5000 epochs using mini-batch gradient descent on a 90-10 train-validation split. Since our primary concern was catching cases of CVD (high recall), we optimized the decision threshold for F1 score on the validation set.

## Results

<table
  data-toggle="table"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead class="table-light">
    <tr>
      <th>Model</th>
      <th>Accuracy</th>
      <th>Precision</th>
      <th>Recall</th>
      <th>F₁ Score</th>
      <th>Threshold</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>The Good</strong></td>
      <td>86.78%</td>
      <td>34.99%</td>
      <td><strong>57.96%</strong></td>
      <td><strong>43.63%</strong></td>
      <td>0.186</td>
    </tr>
    <tr>
      <td><strong>The Ugly</strong></td>
      <td><strong>87.83%</strong></td>
      <td><strong>36.91%</strong></td>
      <td>53.26%</td>
      <td>43.60%</td>
      <td>0.206</td>
    </tr>
    <tr>
      <td><strong>The Bad</strong></td>
      <td>85.95%</td>
      <td>33.07%</td>
      <td>57.71%</td>
      <td>42.05%</td>
      <td>0.181</td>
    </tr>
  </tbody>
</table>

<div class="caption">
    Best model performance on validation set. The best test submission was "The Ugly", achieving $F_1$ = 0.442
</div>

Surprisingly, all three preprocessing strategies achieved similar performance metrics. "The Ugly" performed best on the test set, though "The Good" achieved the highest recall - critical for identifying at-risk individuals.

## The Real Value: Interpretability

While the performance differences were minimal, the preprocessing strategy had a dramatic impact on model interpretability. By examining the features with the largest absolute weights, we discovered why careful preprocessing matters:

<div class="row">
  <div class="col-md-6">
    <h4>"The Good" - Top Features</h4>
    <ul>
      <li><strong>Age</strong> (w = 0.82)</li>
      <li><strong>Cardiac rehabilitation</strong> (w = 0.72)</li>
      <li><strong>General health</strong> (w = 0.43)</li>
      <li><strong>Sex</strong> (w = -0.42)</li>
      <li><strong>Physical activity</strong> (w = -0.39)</li>
    </ul>
  </div>
  <div class="col-md-6">
    <h4>"The Ugly" - Top Features</h4>
    <ul>
      <li><strong>Cardiac rehabilitation</strong> (w = 0.61)</li>
      <li><span class="text-danger"><strong>Missing fruit responses</strong></span> (w = 0.60)</li>
      <li><span class="text-danger"><strong>Out of range fruit data</strong></span> (w = 0.55)</li>
      <li><span class="text-danger"><strong>Phone number confirmation</strong></span> (w = 0.45)</li>
      <li><strong>High blood pressure</strong> (w = 0.44)</li>
    </ul>
  </div>
</div>

<div class="caption mt-3">
  Features in red are confounders - artifacts of data collection rather than meaningful health indicators.
</div>

The difference is striking. "The Good" model highlights medically meaningful factors like age, rehabilitation history, and physical activity. "The Ugly" model, despite similar predictive performance, gives high importance to data collection artifacts like missing survey responses and phone number confirmations.