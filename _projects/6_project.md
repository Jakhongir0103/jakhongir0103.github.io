---
layout: page
title: Mountain Car
description: Handling sparse reward challenges in reinforcement learning using DQN and Dyna-Q algorithms
img: assets/img/projects/mountain_car_gif.gif
importance: 5
category: university
images:
  slider: true
report: https://github.com/Jakhongir0103/mountain-car-reinforcement-learning/blob/main/pdf/report.pdf
code: https://github.com/Jakhongir0103/mountain-car-reinforcement-learning
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

The [Mountain Car](https://gymnasium.farama.org/environments/classic_control/mountain_car/) environment presents a classic reinforcement learning challenge where an agent must learn to drive a car up a steep hill by building momentum through strategic back-and-forth movements. The sparse reward structure (only -1 per timestep with no intermediate feedback) makes this seemingly simple task surprisingly difficult for standard RL algorithms. We explored both model-free (DQN with auxiliary rewards) and model-based (Dyna-Q) approaches to overcome this challenge.

<div class="row justify-content-center">
  <div class="col-10 col-md-8 mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_2.1.png" title="Mountain Car Environment" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-10 col-md-8 mt-3">
    {% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_2.2.png" title="Random Agent Performance" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption text-center mt-2">
    <b>Top</b>: The Mountain Car environment with the car starting at the bottom of the valley.
    <b>Bottom</b>: Episode duration when playing randomly - the agent never succeeds and always hits the 200 timestep limit.
</div>

## Methods

#### Deep Q-Learning (DQN)

We implemented the standard DQN$^{[1]}$ algorithm with experience replay and target networks. The Q-learning update rule with neural networks is:

$$
Q_{\theta}(s, a) \leftarrow Q_{\theta}(s, a) + \alpha \left[ r + \gamma \max_{a'} Q_{\hat{\theta}}(s', a') - Q_{\theta}(s, a) \right]
$$

However, vanilla DQN struggled with the sparse rewards, failing to complete the task even after 1000 episodes despite the loss function converging.

#### Auxiliary Reward Functions

To address the sparse reward problem, we experimented with two approaches:

**1. Heuristic Reward Function:** We designed a domain-specific reward that incentivizes both position and velocity:

$$
r_{aux} = |s'_p - s_{p_0}| + \frac{|s'_v|}{2 \times s'_{v_{max}}}
$$

**2. Random Network Distillation (RND):** An environment-agnostic approach that encourages exploration by using the prediction error between a fixed random network and a learned predictor network as intrinsic reward.

#### Dyna-Q

We also implemented Dyna-Q$^{[2]}$, which combines model-free and model-based learning by using a learned environment model to generate simulated experiences. Since Mountain Car has continuous states, we discretized the state space using different bin sizes (small, medium, large) to study the effect of state resolution on learning.

## Results

We report the episode duration over training for each method below. Lower value means the model has learned to finish the task faster.

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_episode_vanilla.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_episode_heuristic.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_episode_rnd.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_episode_dyna.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

<div class="caption">
    Episode duration over training for different algorithms for: (1) Vanilla DQN, (2) DQN with heuristic reward, (3) DQN with RND, (4) Dyna-Q. Lower duration indicates successful task completion. Both auxiliary reward methods help DQN learn, with RND achieving success slightly earlier (~500 episodes) than the heuristic reward (~600 episodes).
</div>

### Reward Distribution Analysis

One fascinating insight comes from visualizing where each algorithm accumulates rewards in the state space. For each of the 4 methods, we report the sum of reward per position and velocity. Position=0.5 is the final state.

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_3.2-reward distribution.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_3.3-reward distribution.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_3.4-reward distribution.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_4-q_heat_map.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
</swiper-container>

<div class="caption">
    Heatmaps showing the sum of rewards at each state (position vs velocity) from the last 10k experiences. The heuristic reward creates a clear gradient leading to the goal, while RND explores more broadly across the state space.
</div>

## Key Findings

1. **Sparse rewards are challenging**: Vanilla DQN completely fails without auxiliary rewards, highlighting the importance of reward shaping or intrinsic motivation in sparse reward environments.

2. **RND vs Heuristic rewards**: While both approaches succeed, RND learns slightly faster and is more generalizable since it doesn't require domain knowledge. The heuristic reward creates more interpretable learning patterns focused on reaching the goal.

3. **Discretization matters**: For Dyna-Q, medium-sized bins provided the best balance between state resolution and learning speed. Too large bins lose important dynamics, while too small bins slow learning.

4. **Multiple policies emerge**: Interestingly, all successful agents learned to complete the task in approximately two distinct durations (~90 or ~150 steps), suggesting multiple valid strategies for solving the Mountain Car problem.

Below is how the model learns to achieve the task during traning at the episodes 99, 499, and 2998:

<swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true">
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_dyna_demo_1.png" class="img-fluid rounded z-depth-1" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_dyna_demo_1.png" class="img-fluid rounded z-depth-2" %}</swiper-slide>
  <swiper-slide>{% include figure.liquid loading="eager" path="assets/img/projects/mountain_car_dyna_demo_1.png" class="img-fluid rounded z-depth-3" %}</swiper-slide>
</swiper-container>
<div class="caption">
    Evolution of Dyna-Q's exploration over training, showing how the agent progressively discovers more of the state space and refines its policy.
</div>

## References

1. **Deep Q-Learning**: Volodymyr Mnih and Koray Kavukcuoglu and David Silver and Alex Graves and Ioannis Antonoglou and Daan Wierstra and Martin Riedmiller (2013). Playing Atari with Deep Reinforcement Learning. *arXiv preprint arXiv:1312.5602*. [https://arxiv.org/abs/1312.5602](https://arxiv.org/abs/1312.5602)

1. **Dyna-Q**: Baolin Peng and Xiujun Li and Jianfeng Gao and Jingjing Liu and Kam-Fai Wong and Shang-Yu Su (2018). Deep Dyna-Q: Integrating Planning for Task-Completion Dialogue Policy Learning. *arXiv preprint arXiv:1801.06176*. [https://arxiv.org/abs/1801.06176](https://arxiv.org/abs/1801.06176)