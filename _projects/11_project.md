---
layout: page
title: Recommender Systems
description: Compares collaborative filtering, matrix factorization, and neural networks
img: assets/img/projects/dis2_mf_buomso.jpg
importance: 10
category: university
report: https://github.com/Jakhongir0103/dis_projects/blob/main/pdfs/Project_2_Recommender_Systems.pdf
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.report %}
    <a href="{{ page.report }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-file-pdf"></i> Technical Report
    </a>
  {% endif %}
</div>

With millions of books available online, effective recommendation systems are crucial for helping users discover titles they'll love. In this project, we implemented and compared 4 different approaches to predicting user book ratings, pitting traditional machine learning against modern deep learning methods.

## Methods: 4 Approaches to Recommendations

**Collaborative Filtering** is the classic approach that recommends items based on similar users' preferences. We tested both user-based filtering (finding similar users) and item-based filtering (finding similar books), combining the two for better performance. The main limitation? It struggles when users or items lack similar peers.

**Matrix Factorization with ALS** decomposes the user-book rating matrix into latent factors representing hidden patterns. Unlike collaborative filtering, this method excels at capturing the underlying structure in sparse data. We used Alternating Least Squares (ALS) to optimize the factorization, tuning the latent factor dimension to k=256.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/dis2_mf_buomso.jpg" title="Matrix factorization decomposition of the rating matrix" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Matrix factorization decomposition of the rating matrix.
</div>

**Joint-Embeddings** Neural Network adds non-linearity to matrix factorization by training embeddings through a multi-layer perceptron. This approach learns user and item representations jointly, potentially capturing more complex relationships than linear methods.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/dis2_mf_nn_arch.jpg" title="Joint-embeddings neural network architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Joint-embeddings neural network architecture.
</div>

**SLIM (Sparse Linear Methods)** combines the speed of collaborative filtering with matrix factorization's effectiveness by learning a sparse aggregation matrix. Its key strength is computational efficiency—we trained it in under 4 minutes using parallel processing.

## Results: Matrix Factorization Dominates

Here's where things get interesting. Our test set results tell a clear story:

<table
data-toggle="table"
class="table table-bordered table-hover text-center align-middle"
>
  <thead class="table-light">
    <tr>
      <th>Method</th>
      <th>RMSE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Matrix Factorization (ALS)</strong></td>
      <td><strong>0.812</strong></td>
    </tr>
    <tr>
      <td>Collaborative Filtering (Aggregated)</td>
      <td>0.889</td>
    </tr>
    <tr>
      <td>SLIM (Aggregated)</td>
      <td>1.467</td>
    </tr>
    <tr>
      <td>Joint-Embeddings Neural Network</td>
      <td>1.453</td>
    </tr>
  </tbody>
</table>

**Matrix Factorization (ALS) achieved the best performance with an RMSE of 0.812**, significantly outperforming the other methods. Collaborative filtering came second at 0.889, while SLIM and the neural network lagged at 1.467 and 1.453 respectively.

The superiority of matrix factorization makes sense—ALS directly optimizes for RMSE, matching our evaluation metric perfectly. However, the neural network's dramatic performance drop from development set (0.843) to test set (1.453) was surprising and suggests potential overfitting issues worth investigating.

Collaborative filtering's weaker performance highlights its core limitation: it can only leverage rating patterns, missing richer contextual information. Interestingly, cosine similarity outperformed Pearson correlation, and aggregating both user-based and item-based predictions improved results consistently.

## Why This Matters

Our findings confirm what the Netflix Prize demonstrated years ago: **latent factor models beat neighborhood-based approaches** for recommendation tasks. Matrix factorization's efficiency and accuracy make it the practical choice for production systems.

However, the study reveals room for improvement. The dataset contained only user-book rating pairs with no additional context. Enriching this with metadata like author, genre, or publication year could unlock more sophisticated patterns and help hybrid approaches shine.

## Takeaway

**Matrix factorization**, a relatively straightforward method, outperformed more sophisticated neural network approaches -- a useful reminder that the best model isn't always the most elaborate one.