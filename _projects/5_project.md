---
layout: page
title: Visual Reasoning
description: Explored GRPO to enhance visual question answering in vision-language models
img: assets/img/projects/vi_grounding_overview.jpeg
importance: 3
category: university
pretty_table: true
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

<div class="row justify-content-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vi_grounding_overview.jpeg" title="Grounded reasoning methodology" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption text-center mt-2">
    Two-stage training approach for grounded reasoning: SFT warmup followed by GRPO with structured rewards.
</div>

**Synthetic-to-Real Generalization.** We trained models on the synthetic [Rel3D](https://github.com/princeton-vl/Rel3D) dataset and evaluated on both Rel3D and the real-world [SpatialSense](https://github.com/princeton-vl/SpatialSense) dataset to assess transfer learning capabilities. We also experimented with augmented inputs including depth images and bounding boxes.

<div class="row justify-content-center">
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vi_Rel3Dexample.png" title="Rel3D example" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/vi_SpatialSenseexample.png" title="SpatialSense example" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption text-center mt-2">
    <b>Left</b>: Rel3D synthetic dataset features minimally contrastive 3D rendered pairs.
    <b>Right</b>: SpatialSense real-world dataset shows natural photography.
</div>

**Bias Mitigation.** We created increasingly biased variants of the [Visual Spatial Reasoning](https://github.com/cambridgeltl/visual-spatial-reasoning) (VSR) dataset through targeted undersampling and trained models using both SFT and GRPO to measure their robustness to spurious correlations.

**Prompt Engineering.** We applied soft prompt tuning using the [PEFT](https://huggingface.co/docs/peft/index) library, optimizing learnable token prefixes while keeping base model weights frozen, comparing answer-only and reasoning-chain fine-tuning strategies.

## Results

#### Reasoning-Answer Alignment

Our alignment analysis reveals a concerning trade-off: while GRPO improves task accuracy, it paradoxically decreases reasoning-answer alignment.

<table
  data-toggle="table"
  data-show-columns="true"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th>Model</th>
      <th>Reasoning</th>
      <th>Accuracy</th>
      <th>Alignment</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Qwen-Instruct</td>
      <td>✓</td>
      <td>70.59%</td>
      <td><b>88.29%</b></td>
    </tr>
    <tr>
      <td>Qwen-SFT</td>
      <td>✗</td>
      <td>84.12%</td>
      <td>—</td>
    </tr>
    <tr>
      <td>Qwen-GRPO</td>
      <td>✓</td>
      <td><b>86.47%</b></td>
      <td>82.86%</td>
    </tr>
  </tbody>
</table>

<p></p>

GRPO training achieves higher accuracy (86.47% vs 84.12%) but reduces alignment by approximately 6%, suggesting that detailed reasoning traces may reflect pattern-matching rather than genuine logical inference.

#### Grounded Reasoning Performance

Our two-stage grounding approach demonstrates strong improvements, particularly on out-of-domain data:

<table
  data-toggle="table"
  data-show-columns="true"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th>Methods</th>
      <th>Accuracy Reward</th>
      <th>Format Reward</th>
      <th>IoU Reward</th>
      <th>DrivingVQA (OOD)</th>
      <th>A-OKVQA (In-Domain)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SFT-1</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td>54.47</td>
      <td>88.03</td>
    </tr>
    <tr>
      <td>SFT-10</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td>51.91</td>
      <td>85.36</td>
    </tr>
    <tr>
      <td>GRPO</td>
      <td>✓</td>
      <td>✓</td>
      <td>✗</td>
      <td>57.89</td>
      <td><b>88.56</b></td>
    </tr>
    <tr>
      <td>GRPO</td>
      <td>✓</td>
      <td>✗</td>
      <td>✓</td>
      <td><b>61.31</b></td>
      <td>88.3</td>
    </tr>
    <tr>
      <td>GRPO</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><b>61.31</b></td>
      <td>88.3</td>
    </tr>
  </tbody>
</table>

<p></p>

The most significant gains appear on the out-of-domain [DrivingVQA](https://huggingface.co/datasets/EPFL-DrivingVQA/DrivingVQA) dataset, where GRPO with IoU rewards achieves a 12% improvement over the SFT baseline. The bounding box-based reward proves particularly valuable for generalization.

#### Synthetic-to-Real Generalization

Training on synthetic Rel3D data did not transfer effectively to real-world tasks:

<table
  data-toggle="table"
  data-show-columns="true"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th>Methods</th>
      <th>Training Data</th>
      <th>Augmented</th>
      <th>Rel3D</th>
      <th>SpatialSense</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SFT-2</td>
      <td>Rel3D</td>
      <td>✗</td>
      <td>53.6%</td>
      <td>50.8%</td>
    </tr>
    <tr>
      <td>SFT-50</td>
      <td>Rel3D</td>
      <td>✗</td>
      <td><b>55.4%</b></td>
      <td>46.8%</td>
    </tr>
    <tr>
      <td>GRPO</td>
      <td>Rel3D</td>
      <td>✗</td>
      <td>50.9%</td>
      <td>48.2%</td>
    </tr>
    <tr>
      <td>GRPO-AUG</td>
      <td>Rel3D</td>
      <td>✓</td>
      <td>48.3%</td>
      <td>—</td>
    </tr>
    <tr>
      <td>SFT-SS</td>
      <td>SpatialSense</td>
      <td>✗</td>
      <td>37.7%</td>
      <td><b>76.5%</b></td>
    </tr>
  </tbody>
</table>
<p></p>

Surprisingly, GRPO underperformed SFT on this task, with performance near random chance (50%). Adding depth images and bounding boxes as augmented modalities provided no benefit. The stark difference between performance on SpatialSense (76.5%) versus Rel3D (37.7%) when trained on the respective datasets suggests a substantial domain gap between synthetic and real imagery.

#### Bias Mitigation

VLMs demonstrated unexpected robustness to dataset-induced bias:

<table
  data-toggle="table"
  data-show-columns="true"
  class="table table-bordered table-hover text-center align-middle col-sm-6"
>
  <thead>
    <tr>
      <th>Train Data</th>
      <th>Qwen-SFT</th>
      <th>Qwen-GRPO</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>VSR</td>
      <td>82.0</td>
      <td><b>84.8</b></td>
    </tr>
    <tr>
      <td>Biased VSR</td>
      <td><b>84.6</b></td>
      <td>82.3</td>
    </tr>
    <tr>
      <td>Strongly Biased VSR</td>
      <td>79.9</td>
      <td><b>80.7</b></td>
    </tr>
  </tbody>
</table>
<p></p>

Even when introducing extreme textual bias (achieving 100% accuracy on a text-only classifier), model performance remained largely stable. GRPO provided no significant advantage over SFT in mitigating bias. These results suggest that VLMs' pre-training and instruction tuning make them inherently robust to spurious correlations.

#### Prompt Engineering

Soft prompt tuning proved ineffective for inducing reasoning behavior. With only 5 soft prompt tokens and 4 training epochs, the model failed to follow required output formats (0% accuracy under strict evaluation). While training loss decreased significantly when learning from GRPO-generated reasoning traces, no accuracy improvements materialized at test time, likely because the GRPO-generated traces themselves exhibit poor reasoning-answer alignment.

## References

1. **GRPO**: Zhihong Shao and Peiyi Wang and Qihao Zhu and Runxin Xu and Junxiao Song and Xiao Bi and Haowei Zhang and Mingchuan Zhang and Y. K. Li and Y. Wu and Daya Guo (2024). DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models. *arXiv preprint arXiv:2402.03300*. [https://arxiv.org/abs/2402.03300](https://arxiv.org/abs/2402.03300)
