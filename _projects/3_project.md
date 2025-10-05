---
layout: page
title: Multimodal Reasoning through Reinforcement Learning
description: Explored three paradigms of visual chain-of-thought reasoning using GRPO
img: assets/img/multimodal_reasoning_diagram.jpg
importance: 3
category: research
---

Chain-of-thought reasoning has transformed how large language models approach complex problems by generating explicit intermediate steps. As vision-language models have matured, a fundamental question emerges: should reasoning chains remain purely textual, or can visual representations enhance the thinking process?

This project investigates three paradigms for multimodal chain-of-thought reasoning. **Multimodal-to-Multimodal** takes image and text as input and generates reasoning chains that interleave visual and textual thoughts. **Text-to-Multimodal** starts with text alone but produces multimodal reasoning chains including generated images. **Multimodal-to-Text** processes image and text inputs but constrains reasoning to textual chains enriched with visual grounding elements like bounding boxes.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_diagram.jpeg" title="Three paradigms of multimodal reasoning" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Three variations of multimodal reasoning paradigms, differing in how visual and textual information flows through the reasoning process.
</div>

A key challenge is the scarcity of datasets with ground-truth reasoning chains. To address this, I employed Group Relative Policy Optimization (GRPO), a reinforcement learning technique that learns reasoning strategies from input-output pairs alone, guided by paradigm-specific reward functions.

## Methodology

### Multimodal-to-Multimodal Reasoning

I used Anole7B, built on the Chameleon architecture, which processes both image and text tokens through a unified transformer. The model was fine-tuned using LoRA on PuzzleVQA, a dataset of synthetically generated puzzles involving abstract patterns with colors, numbers, sizes, and shapes. I trained both multimodal and textual-only versions to compare performance across 20 different puzzle types, with 5 used for training (in-domain) and 15 held out (out-of-domain).

### Text-to-Multimodal Reasoning

For this paradigm, I trained SEED-LLaMA-8B using GRPO on the ReSQ dataset, containing about 1,000 questions involving spatial reasoning about described scenes. The model learned through four reward functions: formatting compliance, accuracy, image-text alignment (cosine similarity between descriptions and generated images), and a penalty for excessive image generation. I compared against a textual GRPO baseline and a strong baseline using DALL-E 3 for visualization and GPT-4o for reasoning.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_multimodel2text_example.jpeg" title="Multimodal-to-text reasoning with bounding boxes" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_grpo.jpeg" title="GRPO training pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: Example of Multimodal-to-Text reasoning with interleaved bounding boxes grounding attention on specific visual regions. Right: Two-stage training pipeline with SFT warmup followed by GRPO optimization.
</div>

### Multimodal-to-Text Reasoning

This paradigm used a two-stage pipeline with Qwen2.5-VL-7B. First, supervised fine-tuning on reasoning chains with interleaved bounding boxes warmed up the model. Second, GRPO training optimized three rewards: accuracy, format compliance, and IoU scores measuring bounding box quality. I trained on DrivingVQA and A-OKVQA, totaling about 20,000 examples with ground-truth reasoning traces containing bounding boxes.

## Results

### When Images Hurt Performance

Generating images during reasoning consistently degraded performance across both paradigms that produced visual outputs:

- **Multimodal-to-Multimodal**: Textual-only reasoning achieved 0.33 mean accuracy versus 0.24 for multimodal reasoning on PuzzleVQA, with the gap consistent across both in-domain and out-of-domain puzzles.

- **Text-to-Multimodal**: The best textual approach reached 0.450 Pass@1 on ReSQ, while the best multimodal variant achieved only 0.411. Even the DALL-E 3 + GPT-4o baseline showed textual reasoning (0.761) outperforming multimodal reasoning (0.695).

Including image-based rewards during GRPO training further degraded performance, suggesting the optimization struggled to effectively leverage visual information.

### When Visual Grounding Helps

The Multimodal-to-Text paradigm demonstrated clear benefits from visual grounding. GRPO training improved F1 scores on both A-OKVQA (86.78 → 88.12) and DrivingVQA (51.86 → 53.60). A targeted experiment confirmed that including bounding boxes during reasoning increased F1 scores from 63.55% to 66.09% on DrivingVQA.

Reward ablations revealed that IoU-based bounding box rewards particularly benefited out-of-domain performance, while format rewards had negligible impact since the SFT warmup already taught proper formatting. The most effective configuration combined accuracy and IoU rewards.

### Scaling to 120K Examples

I scaled the Multimodal-to-Text approach to approximately 120,000 samples across 10 datasets spanning fine-grained understanding, relation reasoning, text comprehension, general VQA, and chart interpretation. Training Qwen2.5-VL-3B on this corpus revealed two key insights:

- GRPO training consistently outperformed both the base model and SFT warmup across all six evaluation benchmarks (VQAv2, GQA, POPE, ScienceQA, TextVQA, VizWiz)
- Performance gains saturated beyond a certain training data size, suggesting data quality matters more than quantity at scale

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/syrielle_scale_up.png" title="Scaling results" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    GRPO training progress across six benchmark datasets, showing consistent improvements though gains plateau as more data is added.
</div>