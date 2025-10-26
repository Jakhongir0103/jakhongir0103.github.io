---
layout: page
title: Mixed-modal Reasoning
description: Trained 3 paradigms of visual reasoning using GRPO
img: assets/img/projects/syrielle_diagram.jpeg
importance: 1
category: research
images:
  slider: true
report: https://github.com/Jakhongir0103/multimodal_cot/blob/main/pdf/technical_report.pdf
github: https://github.com/Jakhongir0103/multimodal_cot
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.report %}
    <a href="{{ page.report }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-file-pdf"></i> Technical Report
    </a>
  {% endif %}
  {% if page.github %}
    <a href="{{ page.github }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fa-brands fa-github gh-icon"></i> Code
    </a>
  {% endif %}
</div>

Chain-of-thought reasoning has transformed how large language models approach complex problems by generating explicit intermediate steps. As vision-language models have matured, a fundamental question emerges: should reasoning chains remain purely textual, or can visual representations enhance the thinking process?

This project investigates three paradigms for multimodal chain-of-thought reasoning:
- **Multimodal-to-Multimodal**: takes image and text as input and generates reasoning chains that interleave visual and textual thoughts
- **Text-to-Multimodal**: starts with text alone but produces multimodal reasoning chains including generated images
- **Multimodal-to-Text**: processes image and text inputs but constrains reasoning to textual chains enriched with visual grounding elements like bounding boxes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_diagram.jpeg" title="Three paradigms of multimodal reasoning" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Three variations of multimodal reasoning paradigms, differing in how visual and textual information flows through the reasoning process.
</div>

A key challenge is the scarcity of datasets with ground-truth reasoning chains. To address this, we employed Group Relative Policy Optimization (GRPO$^{[1]}$), a reinforcement learning technique that learns reasoning strategies from input-output pairs alone, guided by paradigm-specific reward functions.

## Methodology

**Multimodal-to-Multimodal Reasoning**

I used [Anole7B](https://huggingface.co/GAIR/Anole-7b-v0.1), built on the Chameleon$^{[2]}$ architecture, which processes both image and text tokens through a unified transformer. I fine-tuned the model using LoRA$^{[3]}$ on [PuzzleVQA](https://huggingface.co/datasets/declare-lab/PuzzleVQA), a dataset of synthetically generated puzzles involving abstract patterns with colors, numbers, sizes, and shapes. I trained both multimodal and textual-only versions to compare performance across 20 different puzzle types, with 5 used for training (in-domain) and 15 held out (out-of-domain).

**Text-to-Multimodal Reasoning**

For this paradigm, I trained [SEED-LLaMA-8B](https://huggingface.co/AILab-CVC/seed-llama-8b-sft) using GRPO on the [ReSQ](https://huggingface.co/datasets/tasksource/ReSQ) dataset, containing about 1,000 questions involving spatial reasoning about described scenes. The model learned through four reward functions: formatting compliance, accuracy, image-text alignment (cosine similarity between descriptions and generated images), and a penalty for excessive image generation. I compared against a textual GRPO baseline and a strong baseline using DALL-E 3 for visualization and GPT-4o for reasoning.

**Multimodal-to-Text Reasoning**

This paradigm used a two-stage pipeline with [Qwen2.5-VL-7B](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct). First, supervised fine-tuning on reasoning chains with interleaved bounding boxes warmed up the model. Second, GRPO training optimized three rewards: accuracy, format compliance, and IoU scores measuring bounding box quality. I trained on [DrivingVQA](https://huggingface.co/datasets/EPFL-DrivingVQA/DrivingVQA) and [A-OKVQA](https://huggingface.co/datasets/HuggingFaceM4/A-OKVQA), totaling about 20,000 examples with ground-truth reasoning traces containing bounding boxes.

<div class="row justify-content-center">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_grpo.jpeg" title="GRPO training pipeline" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption text-center mt-2">
  Multimodal-to-Text reasoning: Two-stage training pipeline of with SFT warmup followed by GRPO optimization.
</div>

## Results

**Images Hurt Performance**

Generating images during reasoning consistently degraded performance across both paradigms that produced visual outputs:

1. *Multimodal-to-Multimodal*: Textual-only reasoning achieved a higher perofrmance over multimodal reasoning on PuzzleVQA, with the gap consistent across both in-domain and out-of-domain puzzles.

<table
  data-toggle="table"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th># Puzzle Types</th>
      <th>Domain Type</th>
      <th>Multimodal</th>
      <th>Textual</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5</td>
      <td>ID</td>
      <td>0.574</td>
      <td>0.744</td>
    </tr>
    <tr>
      <td>15</td>
      <td>OOD</td>
      <td>0.123</td>
      <td>0.195</td>
    </tr>
  </tbody>
</table>
<div class="caption text-center mt-2">
  Accuracy of Anole7B fine-tuned on PuzzleVQA.
</div>

Below are examples of consistent and inconsistent interleaved image generations:
<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true" style="max-width: 80%; margin: 0 auto;">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/syrielle_t2m_example1.jpeg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/syrielle_t2m_example2.jpeg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

2. *Text-to-Multimodal*: The best textual approach reached 0.450 Pass@1 on ReSQ, while the best multimodal variant achieved only 0.411. Even the DALL-E 3 + GPT-4o baseline showed textual reasoning (0.761) outperforming multimodal reasoning (0.695).

Including image-based rewards during GRPO training further degraded performance, suggesting the optimization struggled to effectively leverage visual information.

**Visual Grounding Helps**

The Multimodal-to-Text paradigm demonstrated clear benefits from visual grounding. GRPO training improved F1 scores on both A-OKVQA (86.78 → 88.12) and DrivingVQA (51.86 → 53.60).

<table
  data-toggle="table"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th>Method</th>
      <th>DrivingVQA (F1)</th>
      <th>A-OKVQA (F1)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>SFT-warmup</b></td>
      <td>51.86</td>
      <td>86.78</td>
    </tr>
    <tr>
      <td><b>GRPO</b></td>
      <td>53.6</td>
      <td>88.12</td>
    </tr>
  </tbody>
</table>
<div class="caption text-center mt-2">
  F1 score of Qwen2.5-VL-7B trained with 2-stage pipeline on 2 datasets.
</div>

Reward ablations revealed that IoU-based bounding box rewards particularly benefited out-of-domain performance, while format rewards had negligible impact since the SFT warmup already taught proper formatting. The most effective configuration combined accuracy and IoU rewards.

Below is an example of the model's output:
<div class="row justify-content-center">
  <div class="col-10 col-md-8 mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_multimodel2text_example.jpeg" title="Multimodal-to-text reasoning with bounding boxes" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption text-center mt-2">
  Example of Multimodal-to-Text reasoning with interleaved bounding boxes grounding attention on specific visual regions.  
</div>

**Scaling to 120K Examples**

I scaled the Multimodal-to-Text approach to approximately 120,000 samples across 10 datasets spanning fine-grained understanding, relation reasoning, text comprehension, general VQA, and chart interpretation. Training [Qwen2.5-VL-3B](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct) on this corpus revealed two key insights:

- GRPO training consistently outperformed both the base model and SFT warmup across all six evaluation benchmarks ([VQAv2](https://huggingface.co/datasets/HuggingFaceM4/VQAv2), [GQA](https://cs.stanford.edu/people/dorarad/gqa/about.html), [POPE](https://huggingface.co/datasets/lmms-lab/POPE), [ScienceQA](https://scienceqa.github.io/), [TextVQA](https://textvqa.org/), [VizWiz](https://vizwiz.org/tasks-and-datasets/vqa/))
- Performance gains saturated beyond a certain training data size, suggesting data quality matters more than quantity at scale

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_scale_up.png" title="Scaling results" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    GRPO training progress across six benchmark datasets, showing consistent improvements though gains plateau as more data is added.
</div>

## References

1. **GRPO**: Zhihong Shao and Peiyi Wang and Qihao Zhu and Runxin Xu and Junxiao Song and Xiao Bi and Haowei Zhang and Mingchuan Zhang and Y. K. Li and Y. Wu and Daya Guo (2024). DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models. *arXiv preprint arXiv:2402.03300*. [https://arxiv.org/abs/2402.03300](https://arxiv.org/abs/2402.03300)

2. **Chameleon**: Chameleon Team (2025). Chameleon: Mixed-Modal Early-Fusion Foundation Models. *arXiv preprint arXiv:2405.09818*. [https://arxiv.org/abs/2405.09818](https://arxiv.org/abs/2405.09818)

3. **LoRA**: Edward J. Hu and Yelong Shen and Phillip Wallis and Zeyuan Allen-Zhu and Yuanzhi Li and Shean Wang and Lu Wang and Weizhu Chen (2021). LoRA: Low-Rank Adaptation of Large Language Models. *arXiv preprint arXiv:2106.09685*. [https://arxiv.org/abs/2106.09685](https://arxiv.org/abs/2106.09685)