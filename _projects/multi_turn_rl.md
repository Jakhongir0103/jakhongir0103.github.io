---
layout: page
title: Multi-turn RL
description: Extended the VeRL framework to support training multimodal models with multi-turn reinforcement learning with external tools.
img: assets/img/projects/verl_thumbnal.png
importance: 2
images:
  slider: true
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

## Technical Approach

Our work extends the VeRL framework—which was originally designed for text-based environments—to handle image-based interactions. The key contribution is adding support for multi-turn RL training where images are both inputs and outputs, and where the model can invoke external tools to manipulate them.

### Core Contributions

**1. Multimodal Environment Support**  
We redesigned the VeRL environment loop to handle image tensors throughout all stages of interaction—policy rollout, tool execution, and reward computation. This required extending the observation and action spaces and integrating image processing into the agent-environment interface.

**2. Unified Architecture for Vision and Text Models**  
The extended system now supports both text-only and vision-language models via a unified interface. This allows researchers to seamlessly train multimodal agents without modifying core framework components.

**3. External Tool Library for Image Manipulation**  
We implemented a set of image manipulation tools that the model can learn to use autonomously during training, including:
- Rotation (clockwise/counterclockwise)
- Cropping and zooming
- Flipping and simple geometric transformations  

These tools allow the model to transform images before reasoning, enabling it to handle visual distortions and small details more effectively.

## Experiment: Learning to Handle Rotated Text

To validate the framework, we trained [Qwen2.5-VL-3B](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct) on a **rotation correction task**.  
The model was asked to read text from images that were synthetically rotated by random angles between 0° and 360°. When the rotation exceeded roughly **120°–240°**, the baseline model failed to correctly recognize the text—highlighting its inability to handle geometric transformations directly.

To address this, we trained the model in a **multi-turn RL setup**, where it could first invoke a *Rotation* tool to reorient the image before attempting to read the text. This setup explicitly encouraged the model to learn that **rotating the image back to 0°** improves its performance on downstream text recognition.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/verl_rotation.png" title="Text prediction accuracy" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Text prediction accuracy across rotation angles between 0° and 360°. The model struggles significantly between 120°–240°.
</div>

Below are some data samples of randomly rotated texts in an image:

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true" style="max-width: 60%; margin: 0 auto;">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_1.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_2.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_3.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_4.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_5.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_6.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_7.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_8.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_9.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/verl_example_10.jpg" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

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

Below is predicted angle during training for different settings of rewards and the batch size. We can see that when trained with *Broad Tolerance* reward, the model learns the average angle in the dataset, leading to *reward hacking*.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/verl_angle.png" title="Angle predictions" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Predicted angle during training for different settings of rewards and the batch size.
</div>

#### Results and Findings

The experiments revealed interesting trade-offs between prediction accuracy and interaction efficiency in the conversation:

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

- The baseline model failed to interpret rotated text for large angles (120°–240°).  
- After RL training with the rotation tool, the model learned to rotate the image back to the correct orientation before predicting, leading to noticeable performance improvement.  
- The average reward increased by approximately 20% during training, showing learning progress.  
- Different reward designs led to distinct behaviors:
  - *Broad tolerance* caused the model to exploit reward averaging (“reward hacking”) by predicting mean angles.
  - *Strict tolerance* encouraged accurate correction but increased tool usage.
- *Large batch + strict reward* achieved the best balance between accuracy and efficiency.

These results demonstrate that the extended framework successfully enables multi-turn image manipulation learning, and that reward design plays a crucial role in shaping the model’s reasoning and tool-use strategies.