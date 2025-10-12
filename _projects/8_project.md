---
layout: page
title: Stance Detection
description: Fine-tuning Large Language Models for argument stance detection in unseen domains
img: assets/img/projects/ml2_selected_models_f1.png
importance: 6
category: university
report: https://github.com/Jakhongir0103/Machine-Learning_EPFL/blob/master/projects/project2/project2_report.pdf
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.report %}
    <a href="{{ page.report }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-file-pdf"></i> Technical Report
    </a>
  {% endif %}
</div>

*Stance detection* is the task of determining whether an argument is in favor of, against, or neutral towards a given topic. This has significant applications in social media analysis, misinformation detection, and political discourse understanding. Our work explores how well Large Language Models (LLMs) can be fine-tuned for this task and, importantly, how well they generalize to unseen datasets.

This project is part of [CommPass](https://www.media-initiative.ch/project/commpass/), a larger initiative aimed at creating awareness about media polarity by providing readers with visualizations showing where content sits in the "space" of media events like the Russia-Ukraine war or COVID-19.

## Methods

#### Models and Fine-Tuning Approach

We experimented with three LLMs:
- [Mistral-7B](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1) - 7 billion parameters with advanced features like Grouped Query Attention
- [Llama-2-7B](https://huggingface.co/meta-llama/Llama-2-7b) - 7 billion parameters 
- [Phi-1.5](https://huggingface.co/microsoft/phi-1_5) - A smaller 1.3 billion parameter model trained primarily on textbook data

Rather than fine-tuning all parameters (which would be computationally expensive), we used Low-Rank Adaptation (LoRA$^{[1]}$) - a parameter-efficient technique that inserts trainable rank decomposition matrices into selected layers while freezing the pre-trained weights. This dramatically reduces the number of trainable parameters while maintaining performance.

#### Datasets

We trained and evaluated on two distinct datasets to test generalization:

1. [SemEval2016](https://www.saifmohammad.com/WebPages/StanceDataset.htm) - Twitter data focusing on six targets (Abortion, Atheism, Climate Change, Feminist Movement, Hillary Clinton, Donald Trump) with three labels: Favor, Neutral, Against

2. [IBM-Debater](https://research.ibm.com/haifa/dept/vst/debating_data.shtml) - Claims and evidence from Wikipedia articles covering 33 controversial topics, with only two labels: PRO and CON

A key difference: SemEval uses short targets (1-2 words) while IBM-Debater uses complete sentences.

## Experiments

#### Finding the Right LoRA Rank

We tested LoRA ranks from 1 to 64 on the full SemEval dataset. The results showed that Mistral consistently outperformed Llama and Phi, but interestingly, there was no clear trend with rank size - lower ranks performed just as well as higher ones.

<div class="row">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/ml2_rank_experiments.png" title="LoRA rank comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Assessing the role of LoRA rank: no significant differences between lower and higher ranks across models.
</div>

#### Low-Data Regimes

We tested how well models perform when fine-tuned on limited data (1%, 10%, and 50% of the training set). Mistral again proved superior, especially in low-data scenarios. We found that rank choice depends on data volume - rank 1 works better with less data, while rank 8 improves with more data (likely because higher ranks overfit small datasets).

<div class="row">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/ml2_train_percentage_models.png" title="Data regime experiments" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Fine-tuning LLMs in different data regimes shows Mistral's robustness even with limited training data.
</div>

## Main Results

Our best model - Mistral with LoRA rank 16, trained on 70% of both SemEval and IBM-Debater datasets - significantly outperformed all baselines:

<div class="row">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/ml2_selected_models_f1.png" title="F1 scores across training configurations" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    F1-scores of Mistral trained on different dataset combinations. Models with rank 1 used 10% of training data, while rank 8 and 16 used 70%.
</div>

#### Performance Table

<table
  data-toggle="table"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th>Model</th>
      <th>Abortion</th>
      <th>Atheism</th>
      <th>Climate Change</th>
      <th>Feminist Movement</th>
      <th>Hillary Clinton</th>
      <th>SemEval (avg)</th>
      <th>IBM (avg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>BERTweet (baseline)</td>
      <td>0.65</td>
      <td>0.76</td>
      <td>0.79</td>
      <td>0.65</td>
      <td>0.69</td>
      <td>0.70</td>
      <td>-</td>
    </tr>
    <tr>
      <td>RoBERTa (baseline)</td>
      <td>0.54</td>
      <td><b>0.79</b></td>
      <td>0.80</td>
      <td>0.64</td>
      <td>0.71</td>
      <td>0.68</td>
      <td>-</td>
    </tr>
    <tr>
      <td>StanceBERTa (baseline)</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>0.61</td>
    </tr>
    <tr>
      <td>Mistral Zero-shot</td>
      <td>0.54</td>
      <td>0.33</td>
      <td>0.55</td>
      <td>0.57</td>
      <td>0.66</td>
      <td>0.54</td>
      <td>0.44</td>
    </tr>
    <tr>
      <td><b>Mistral Fine-tuned (Ours)</b></td>
      <td><b>0.71</b></td>
      <td>0.73</td>
      <td><b>0.84</b></td>
      <td><b>0.76</b></td>
      <td><b>0.80</b></td>
      <td><b>0.76</b></td>
      <td><b>0.92</b></td>
    </tr>
  </tbody>
</table>

<p></p>

#### Surprising Findings

1. **Cross-dataset generalization**: Models fine-tuned on SemEval alone generalized remarkably well to IBM-Debater, outperforming the baseline despite never seeing that data format during training.

2. **Training on both datasets improved neutral class recall** on SemEval, even though IBM-Debater has no neutral labels - suggesting the model learned more nuanced representations.

3. **Fine-tuning on SemEval and extrapolating to IBM might lead to better results** than directly fine-tuning on IBM alone.

<div class="row">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/ml2_confusion_matrix_r16_semeval.png" title="Confusion matrices" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Confusion matrices showing how training dataset combinations affect classification performance on SemEval test set.
</div>

## References

1. **LoRA**: Edward J. Hu and Yelong Shen and Phillip Wallis and Zeyuan Allen-Zhu and Yuanzhi Li and Shean Wang and Lu Wang and Weizhu Chen (2021). LoRA: Low-Rank Adaptation of Large Language Models. *arXiv preprint arXiv:2106.09685*. [https://arxiv.org/abs/2106.09685](https://arxiv.org/abs/2106.09685)