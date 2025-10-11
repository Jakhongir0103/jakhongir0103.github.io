---
layout: page
title: GalactiTA
description: 1.3B LLM trained through a 3-stage pipeline of SFT, DPO, and RAG-tuning on scientific datasets.
img: assets/img/projects/mnlp_raft_workflow.png
importance: 1
category: university
report: https://github.com/Jakhongir0103/sft-dpo-rag-training/blob/main/pdfs/report.pdf
---

<!-- Project Links/Buttons -->
<div class="links" style="margin-bottom: 2rem;">
  {% if page.report %}
    <a href="{{ page.report }}" class="btn btn-primary btn-sm" role="button" target="_blank" style="background-color: white !important; border: 1px solid black !important; color: black !important; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; margin-right: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <i class="fas fa-file-pdf"></i> Technical Report
    </a>
  {% endif %}
</div>

Large Language Models have transformed education, but they often struggle with technical domains and complex reasoning. This project addresses a key question: **How can we adapt pre-trained LLMs for scientific multiple-choice question answering?** 

We developed **GalactiTA**, a digital teaching assistant specifically designed for STEM subjects. Starting with the Galactica-1.3B model, we applied a three-stage training pipeline: Supervised Fine-Tuning (SFT), Direct Preference Optimization (DPO$^{[1]}$), and Retrieval-Augmented Generation (RAG$^{[2]}$) tuning. The final model achieved an **11.52% improvement** over the baseline on EPFL course questions, demonstrating that smaller, specialized models can effectively support students and teaching assistants with domain-specific queries.

## Methodology

Our approach follows a systematic pipeline with three distinct training phases. The overall workflow is illustrated below:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mnlp_overall_workflow.png" title="Training pipeline workflow" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The complete training pipeline: SFT for question answering, DPO for preference alignment, and RAG-tuning for incorporating external knowledge.
</div>

**Supervised Fine-Tuning (SFT)**  
We trained [Galactica-1.3B](https://huggingface.co/facebook/galactica-1.3b) on scientific QA datasets ([ScienceQA](https://scienceqa.github.io/), [SciQ](https://huggingface.co/datasets/allenai/sciq), [ARC](https://huggingface.co/datasets/allenai/ai2_arc), [Stack Exchange](https://huggingface.co/datasets/HuggingFaceH4/stack-exchange-preferences)) totaling ~43k questions. For datasets lacking explanations, we used ChatGPT to generate Chain-of-Thought (CoT) reasoning, teaching the model to explain its answers rather than just provide them.

**Direct Preference Optimization (DPO)**  
Rather than traditional reinforcement learning, we used DPO$^{[1]}$ to align the model with human preferences. The data collection process involved prompting ChatGPT strategically to generate high-quality responses:

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/mnlp_dpo_dataset.png" title="DPO data collection" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Interaction with ChatGPT to collect preference data, using prompts like "Let's think step by step" to generate high-quality responses.
</div>

We collected pairs of "good" and "bad" responses—both AI-generated from ChatGPT and human-annotated from platforms like Stack Exchange. This taught the model to distinguish between high-quality and low-quality scientific explanations.

**RAG-Tuning**  
In the final phase, we fine-tuned the model for RAG$^{[2]}$ incorporating external knowledge. We collected 5GB of scientific documents (textbooks, papers) and created training data where the model learned to generate answers based on retrieved context:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mnlp_raft_workflow.png" title="RAG-tuning workflow" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    High-level workflow of the RAG-tuning phase: documents are chunked, embedded, and retrieved based on question similarity, then used to train the model to reason from external sources.
</div>

For each question, we retrieved the top-3 relevant documents and trained the model to reason from these sources. This approach allows the model to leverage domain-specific knowledge beyond its training data.

## Evaluation Methods

We designed three automatic evaluation methods to assess model performance on multiple-choice questions:

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/mnlp_all_eval_methods.png" title="Three evaluation methods" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Three decoding strategies: (1) Token Distribution - examining probabilities for A/B/C/D directly, (2) Greedy Decoding - predicting from entire vocabulary, and (3) Option Probability Sum - calculating cumulative probability for each complete option.
</div>

These complementary methods allow us to assess whether the model truly learned to answer multiple-choice questions correctly or is simply exploiting patterns in the data.

## Results

Our experiments revealed several key findings across four test datasets (ARC, MMLU, SciQ, EPFL). The table below shows accuracy scores using Method 1 (Token Distribution):

<table
  data-toggle="table"
  class="table table-bordered table-hover text-center align-middle"
>
  <thead>
    <tr>
      <th>Model</th>
      <th>ARC</th>
      <th>MMLU</th>
      <th>SciQ</th>
      <th>EPFL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GalactiTA (DPO only)</td>
      <td>29.24%</td>
      <td>29.03%</td>
      <td>41.31%</td>
      <td>27.32%</td>
    </tr>
    <tr>
      <td>GalactiTA (MCQA-tuned)</td>
      <td><b>35.06%</b></td>
      <td>31.61%</td>
      <td><b>60.50%</b></td>
      <td>35.59%</td>
    </tr>
    <tr>
      <td>GalactiTA (MCQA + RAG)</td>
      <td>33.00%</td>
      <td><b>32.90%</b></td>
      <td>53.22%</td>
      <td>34.59%</td>
    </tr>
    <tr>
      <td>GalactiTA (RAG-tuned)</td>
      <td>31.01%</td>
      <td>29.68%</td>
      <td>47.35%</td>
      <td>30.83%</td>
    </tr>
    <tr>
      <td>GalactiTA (RAG + RAG)</td>
      <td>29.67%</td>
      <td>30.97%</td>
      <td>45.47%</td>
      <td>31.58%</td>
    </tr>
    <tr>
      <td>TinyLlama</td>
      <td>24.34%</td>
      <td>25.16%</td>
      <td>24.00%</td>
      <td>36.84%</td>
    </tr>
    <tr>
      <td>TinyLlama (+ RAG)</td>
      <td>25.20%</td>
      <td>22.58%</td>
      <td>25.80%</td>
      <td><b>38.60%</b></td>
    </tr>
  </tbody>
</table>
<p></p>

**MCQA-tuning was highly effective**: The model learned to predict single letters accurately, with Method 1 and Method 2 scores matching perfectly after MCQA-tuning. This demonstrates that the model genuinely learned the task structure rather than exploiting shortcuts.

**RAG benefits were dataset-dependent**: For EPFL questions specifically, RAG-tuning with retrieval showed an 11.52% improvement over the baseline when comparing greedy decoding methods. This makes sense because our document collection was curated for EPFL-relevant topics. On datasets where retrieved documents were less relevant (like general science benchmarks), adding RAG during inference sometimes confused the model rather than helping it.

Our ablation studies revealed important insights about training dynamics:

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/mnlp_epochs.png" title="Effect of training epochs" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Training with more epochs doesn't always help: the best performance came from 1 epoch of SFT followed by 1 epoch of DPO. Over-training the SFT model actually degraded DPO performance.
</div>

We found that using 3-4 retrieved documents was optimal, and that training with only one epoch each for SFT and DPO produced the best results. Training longer actually degraded DPO performance, suggesting the importance of careful hyperparameter tuning in alignment tasks.

**Scalability confirmed**: Testing on Llama-3 8B showed our RAG-tuning approach generalizes to larger models, with the RAG-tuned version achieving 62.38% on ARC when using retrieval (vs. 33.07% without), validating our training methodology across different model scales.

## References

1. **Direct Preference Optimization**: Rafailov, R., Sharma, A., Mitchell, E., Ermon, S., Manning, C. D., & Finn, C. (2024). Direct Preference Optimization: Your Language Model is Secretly a Reward Model. *arXiv preprint arXiv:2305.18290*. [https://arxiv.org/abs/2305.18290](https://arxiv.org/abs/2305.18290)

2. **Retrieval-Augmented Generation**: Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2021). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *arXiv preprint arXiv:2005.11401*. [https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)