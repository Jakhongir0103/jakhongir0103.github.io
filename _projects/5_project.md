---
layout: page
title: Visual Reasoning
description: Explored GRPO to enhance visual question answering in vision-language models
img: assets/img/projects/vi_grounding_overview.jpeg
importance: 3
category: university
report: https://github.com/Jakhongir0103/VLM-R1/blob/main/pdf/Visual_Intelligence_Tech_Report.pdf
code: https://github.com/Jakhongir0103/VLM-R1
checkpoints: https://huggingface.co/collections/Jakh0103/visual-intelligence-68398719ee0d35e8b553b5c9
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
  {% if page.checkpoints %}
    <a href="{{ page.checkpoints }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-cube"></i> Checkpoints
    </a>
  {% endif %}
</div>

We investigate how Group Relative Policy Optimization (GRPO), a reinforcement learning technique, can enhance visual reasoning capabilities in vision-language models (VLMs). Our study examines five key dimensions: the alignment between reasoning chains and final answers, grounding reasoning with bounding boxes, generalization from synthetic to real-world data, bias mitigation, and prompt-based reasoning induction. Our findings show that GRPO improves performance and generalization on out-of-domain datasets when structured rewards are used, but reasoning alignment remains imperfect and prompt tuning proves challenging. These results highlight both the potential and current limitations of reinforcement learning for advancing visual reasoning in VLMs.

## Methods

Our work approach tackles five distinct research questions through targeted experiments:

**Reasoning-Answer Alignment.** We quantified misalignment between model reasoning and final answers using an LLM-as-judge protocol with GPT-4 mini, assessing whether reasoning traces logically support predicted answers.

**Grounded Reasoning.** As illustrated in the methodology overview below, we employed a two-stage training approach: first, supervised fine-tuning (SFT) to teach the model to generate bounding boxes within reasoning chains, followed by GRPO$^{[1]}$ training with three reward functions (accuracy, format consistency, and IoU scores).

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vi_grounding_overview.jpeg" title="Grounded reasoning methodology" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Two-stage training approach for grounded reasoning: SFT warmup followed by GRPO with structured rewards.
</div>

**Synthetic-to-Real Generalization.** We trained models on the synthetic [Rel3D]() dataset and evaluated on both Rel3D and the real-world [SpatialSense]() dataset to assess transfer learning capabilities. We also experimented with augmented inputs including depth images and bounding boxes.

<div class="row">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vi_Rel3Dexample.png" title="Rel3D example" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vi_SpatialSenseexample.png" title="SpatialSense example" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: Rel3D synthetic dataset features minimally contrastive 3D rendered pairs. Right: SpatialSense real-world dataset shows natural photography.
</div>

**Bias Mitigation.** We created increasingly biased variants of the [Visual Spatial Reasoning]() (VSR) dataset through targeted undersampling and trained models using both SFT and GRPO to measure their robustness to spurious correlations.

**Prompt Engineering.** We applied soft prompt tuning using the [PEFT]() library, optimizing learnable token prefixes while keeping base model weights frozen, comparing answer-only and reasoning-chain fine-tuning strategies.

## Results

### Reasoning-Answer Alignment

Our alignment analysis reveals a concerning trade-off: while GRPO improves task accuracy, it paradoxically decreases reasoning-answer alignment.

| Model | Reasoning | Accuracy | Alignment |
|-------|-----------|----------|-----------|
| Qwen-Instruct | ✓ | 70.59% | **88.29%** |
| Qwen-SFT | ✗ | 84.12% | — |
| Qwen-GRPO | ✓ | **86.47%** | 82.86% |

GRPO training achieves higher accuracy (86.47% vs 84.12%) but reduces alignment by approximately 6%, suggesting that detailed reasoning traces may reflect pattern-matching rather than genuine logical inference.

### Grounded Reasoning Performance

Our two-stage grounding approach demonstrates strong improvements, particularly on out-of-domain data:

| Methods | Accuracy Reward | Format Reward | IoU Reward | DrivingVQA (OOD) | A-OKVQA (In-Domain) |
|---------|-----------------|---------------|-----------|------------------|---------------------|
| SFT-1 | — | — | — | 54.47 | 88.03 |
| SFT-10 | — | — | — | 51.91 | 85.36 |
| GRPO | ✓ | ✓ | ✗ | 57.89 | **88.56** |
| GRPO | ✓ | ✗ | ✓ | **61.31** | 88.3 |
| GRPO | ✓ | ✓ | ✓ | **61.31** | 88.3 |

The most significant gains appear on the out-of-domain [DrivingVQA]() dataset, where GRPO with IoU rewards achieves a 12% improvement over the SFT baseline. The bounding box-based reward proves particularly valuable for generalization.

### Synthetic-to-Real Generalization

Training on synthetic Rel3D data did not transfer effectively to real-world tasks:

| Methods | Training Data | Augmented | Rel3D | SpatialSense |
|---------|---------------|-----------|-------|--------------|
| SFT-2 | Rel3D | ✗ | 53.6% | 50.8% |
| SFT-50 | Rel3D | ✗ | **55.4%** | 46.8% |
| GRPO | Rel3D | ✗ | 50.9% | 48.2% |
| GRPO-AUG | Rel3D | ✓ | 48.3% | — |
| SFT-SS | SpatialSense | ✗ | 37.7% | **76.5%** |

Surprisingly, GRPO underperformed SFT on this task, with performance near random chance (50%). Adding depth images and bounding boxes as augmented modalities provided no benefit. The stark difference between performance on SpatialSense (76.5%) versus Rel3D (37.7%) when trained on the respective datasets suggests a substantial domain gap between synthetic and real imagery.

### Bias Mitigation

VLMs demonstrated unexpected robustness to dataset-induced bias:

| Train Data | Qwen-SFT | Qwen-GRPO |
|-----------|----------|----------|
| VSR | 82.0 | **84.8** |
| Biased VSR | **84.6** | 82.3 |
| Strongly Biased VSR | 79.9 | **80.7** |

Even when introducing extreme textual bias (achieving 100% accuracy on a text-only classifier), model performance remained largely stable. GRPO provided no significant advantage over SFT in mitigating bias. These results suggest that VLMs' pre-training and instruction tuning make them inherently robust to spurious correlations.

### Prompt Engineering

Soft prompt tuning proved ineffective for inducing reasoning behavior. With only 5 soft prompt tokens and 4 training epochs, the model failed to follow required output formats (0% accuracy under strict evaluation). While training loss decreased significantly when learning from GRPO-generated reasoning traces, no accuracy improvements materialized at test time, likely because the GRPO-generated traces themselves exhibit poor reasoning-answer alignment.

## References

1. **GRPO**: Zhihong Shao and Peiyi Wang and Qihao Zhu and Runxin Xu and Junxiao Song and Xiao Bi and Haowei Zhang and Mingchuan Zhang and Y. K. Li and Y. Wu and Daya Guo (2024). DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models. *arXiv preprint arXiv:2402.03300*. [https://arxiv.org/abs/2402.03300](https://arxiv.org/abs/2402.03300)
