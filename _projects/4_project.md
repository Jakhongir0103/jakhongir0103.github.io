---
layout: page
title: Multi-turn RL
description: Extended the VeRL framework to support training multimodal models with multi-turn reinforcement learning with external tools.
img: assets/img/projects/verl_thumbnal.png
importance: 2
category: research
github: https://github.com/Jakhongir0103/verl/blob/main/README_VLMRL.md
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.github %}
    <a href="{{ page.github }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fab fa-github"></i> Code
    </a>
  {% endif %}
</div>

Reinforcement learning has revolutionized language model training, but what happens when models need to both see and manipulate images? This project extends the [VeRL](https://github.com/volcengine/verl) framework for training vision-language models using reinforcement learning with external tools, where images serve as both inputs and outputs throughout the learning process.

## Technical Approach

Our work extends the VeRL reinforcement learning framework to support multimodal training. The key innovation is creating a unified pipeline where visual data flows seamlessly alongside text throughout the entire RL loop.

### Core Contributions

**Multimodal Data Pipeline**: We redesigned the agent loop to handle images at every stage—from initial policy rollouts through reward computation. This required careful coordination between the text processing components and new image handling mechanisms.

**Flexible Processing Architecture**: The system now supports both text-only and multimodal models through a unified interface that automatically adapts to the model's capabilities. This means researchers can train either type of model without changing their training code.

**Tool Integration Framework**: We developed a comprehensive library of image manipulation tools that models can learn to use, such as:
- Rotation and flipping operations
- Cropping and bounding box drawing
- Line drawing and spatial transformations

The framework is designed for extensibility—adding new tools requires only implementing the tool logic and defining its interface, making it easy to explore different multimodal tasks.

## Experiment: Learning to Estimate Rotation

To validate the framework, we trained [Qwen2.5-VL-3B](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct) on a rotation estimation task. The model receives randomly rotated images and must predict the rotation angle through interactive use of a rotation tool. This multi-turn interaction allows the model to refine its predictions iteratively.

#### Reward Shaping Effects

We explored two different reward functions to understand how reward design influences learned behavior:

**Broad Tolerance (0-180°)**: Rewards decrease linearly with angular error up to 180°

$$
r(\theta) = \max(0, 1 - \frac{|\theta_{pred} - \theta_{true}|}{180°})
$$

**Strict Tolerance (0-45°)**: Rewards drop to zero beyond 45° error

$$
r(\theta) = \begin{cases} 1 - \frac{|\theta_{pred} - \theta_{true}|}{45°} & \text{if } |\theta_{pred} - \theta_{true}| \leq 45° \\ 0 & \text{otherwise} \end{cases}
$$

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/verl_angle.png" title="Angle predictions" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Predicted angle during training for different settings of rewards and the batch size.
</div>

#### Key Findings

The experiments revealed interesting trade-offs between prediction accuracy and interaction efficiency:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/verl_num_turns.png" title="Number of turns" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/verl_rewards.png" title="Rewards over training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Number of turns (left) and the Reward (right) during training for different settings of rewards and the batch size.
</div>

**Strict Rewards (0-45°)**: The model learned to predict angles uniformly across the full range, demonstrating good coverage. However, it developed a tendency to use the tool multiple times per query, suggesting inefficient interaction patterns.

**Small Batch Training**: With smaller batches, the model learned highly efficient behavior—using the tool exactly once per query. But this came at a cost: it converged to always predicting the average angle (~90°), essentially learning a safe but uninformative strategy.

**Large Batch + Strict Rewards**: This configuration achieved a balanced outcome, maintaining reasonable angle diversity while keeping tool usage relatively efficient.

These results highlight a fundamental tension in multimodal RL: reward design and training dynamics jointly determine what behaviors emerge. The framework successfully enables tool learning, but achieving desired behavior requires careful tuning of both the reward function and hyperparameters.
