---
layout: page
title: Document Retrieval
description: Built an efficient IR system across 7 languages with computational limits
img: assets/img/projects/dis1_IR_pipeline.jpg
importance: 8
category: university
report: https://github.com/Jakhongir0103/dis_projects/blob/main/pdfs/Project_1_Document_Retrieval.pdf
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.report %}
    <a href="{{ page.report }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-file-pdf"></i> Technical Report
    </a>
  {% endif %}
</div>

When you need to search through 200,000+ documents across multiple languages-fast-the usual tricks might not work. Pre-trained language models deliver impressive results, but they're computationally expensive. Our task: build a multilingual information retrieval system that's both effective and resource-efficient.

The setup was straightforward: retrieve the single most relevant document for each query from a corpus spanning 7 languages (Arabic, German, English, Spanish, French, Italian, and Korean). But here's the catch -- inference had to complete within 10 minutes, and we were limited to a Kaggle notebook's resources.

## Our Approach

We tested three categories of methods, ranging from classical to modern:

**TF-IDF**

We started with [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf), a semantic method that weighs terms by their frequency and uniqueness. The baseline scored 0.52 on our test metric (Recall@10), but we improved it by boosting high-IDF terms—since rare terms often indicate query-specific documents. Using a scalar multiplier on the top 2 IDF terms increased performance to **0.5871**, a 10% boost.

**BM25: The Winner**

[BM25](https://en.wikipedia.org/wiki/Okapi_BM25) refined the TF-IDF approach by accounting for document length and term saturation effects. It's a simple formula, but it works remarkably well:

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/dis1_IR_pipeline.jpg" title="IR System Pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    IR System Pipeline.
</div>

The results were interesting: BM25 achieved **0.7714** on the dev set and **0.7562** on the final test submission. No complex models needed.

**Text Embeddings**

We tested [multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small), a compact embedding model with under 250M parameters. We tried two chunking strategies (20-word and 200-word sequences) to handle the attention mechanism's length limitations. The results were disappointing: e5 with 200-word chunks scored only 0.5414, and shorter chunks performed even worse at 0.3028. Longer chunks provided better context but created language imbalances.

**Reranking: The Diminishing Returns**

We fine-tuned [DistilBERT](https://huggingface.co/distilbert/distilbert-base-uncased) as a reranker to refine retrieved results. Unfortunately, adding reranking degraded performance for most models—likely due to the small model size. It slightly helped text embedding methods but hurt the strong keyword-based methods. For our final submission, we stuck with pure BM25.

## The Results

Below are the results of fine-tuned models:

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/dis1_rerankers_perf-size.png" title="Reranker performance based on different models" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Fine-tuned models' performances.
</div>

Here is the comparison of all methods for each language.

<table
data-toggle="table"
class="table table-bordered table-hover text-center align-middle"
>
  <thead class="table-light">
    <tr>
      <th></th>
      <th>ar</th>
      <th>de</th>
      <th>en</th>
      <th>es</th>
      <th>fr</th>
      <th>it</th>
      <th>ko</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>TF-IDF (Baseline)</strong></td>
      <td>0.460</td>
      <td>0.450</td>
      <td>0.495</td>
      <td>0.760</td>
      <td>0.715</td>
      <td>0.595</td>
      <td>0.465</td>
    </tr>
    <tr>
      <td><strong>TF-IDF (Optimal)</strong></td>
      <td>0.585</td>
      <td>0.560</td>
      <td>0.450</td>
      <td>0.775</td>
      <td>0.790</td>
      <td>0.610</td>
      <td>0.605</td>
    </tr>
    <tr>
      <td><strong>e5_sl200</strong></td>
      <td>0.420</td>
      <td>0.425</td>
      <td>0.520</td>
      <td>0.685</td>
      <td>0.670</td>
      <td>0.555</td>
      <td>0.515</td>
    </tr>
    <tr>
      <td><strong>BM25</strong></td>
      <td><strong>0.735</strong></td>
      <td><strong>0.665</strong></td>
      <td><strong>0.745</strong></td>
      <td><strong>0.910</strong></td>
      <td><strong>0.910</strong></td>
      <td><strong>0.770</strong></td>
      <td><strong>0.625</strong></td>
    </tr>
    <tr>
      <td><strong>TF-IDF + Rerank (Baseline)</strong></td>
      <td>0.460</td>
      <td>0.470</td>
      <td>0.490</td>
      <td>0.755</td>
      <td>0.725</td>
      <td>0.610</td>
      <td>0.460</td>
    </tr>
    <tr>
      <td><strong>TF-IDF + Rerank (Optimal)</strong></td>
      <td>0.580</td>
      <td>0.555</td>
      <td>0.450</td>
      <td>0.775</td>
      <td>0.790</td>
      <td>0.605</td>
      <td>0.600</td>
    </tr>
    <tr>
      <td><strong>e5_sl200 + Rerank</strong></td>
      <td>0.440</td>
      <td>0.435</td>
      <td>0.525</td>
      <td>0.675</td>
      <td>0.685</td>
      <td>0.565</td>
      <td>0.520</td>
    </tr>
    <tr>
      <td><u><strong>BM25 + Rerank</strong></u></td>
      <td>0.725</td>
      <td>0.660</td>
      <td>0.735</td>
      <td>0.895</td>
      <td>0.895</td>
      <td>0.765</td>
      <td>0.620</td>
    </tr>
  </tbody>
</table>

<div class="caption">
    Recall@10 per language for different retrieval models and configurations.
</div>

BM25 dominated across all 7 languages, with particularly strong performance in Spanish (0.91) and French (0.91). Even on less-resourced languages like Korean, it achieved 0.625.

## Takeaways

In constrained environments, classical information retrieval methods like BM25 outperform small embedding models because they're efficient, interpretable, and surprisingly effective at keyword matching. Text embeddings excel at semantic understanding, but they're overkill when you don't have the computational resources to properly leverage them.