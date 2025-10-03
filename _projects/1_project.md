---
layout: page
title: GalactiTA
description: GalactiTA: AI-Driven Solutions for Scientific Question Answering
img: assets/img/projects/mnlp_overall_workflow.png
importance: 1
category: course project
related_publications: false
---
<!-- 
Categories:
- Research (Syrielle, SwissAI)
- Course Projects (MNLP, ...)
- Hackathons (...)
 -->

Large Language Models have transformed education, but they often struggle with technical domains and complex reasoning. This project addresses a key question: **How can we adapt pre-trained LLMs for scientific multiple-choice question answering?** 

We developed **GalactiTA**, a digital teaching assistant specifically designed for STEM subjects. Starting with the Galactica-1.3B model, we applied a three-stage training pipeline: Supervised Fine-Tuning (SFT), Direct Preference Optimization (DPO[^1]), and Retrieval-Augmented Generation (RAG[^2]) tuning. The final model achieved an **11.52% improvement** over the baseline on EPFL course questions, demonstrating that smaller, specialized models can effectively support students and teaching assistants with domain-specific queries.

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
Rather than traditional reinforcement learning, we used DPO[^1] to align the model with human preferences. The data collection process involved prompting ChatGPT strategically to generate high-quality responses:

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
In the final phase, we fine-tuned the model for RAG[^2] incorporating external knowledge. We collected 5GB of scientific documents (textbooks, papers) and created training data where the model learned to generate answers based on retrieved context:

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

| Model | ARC | MMLU | SciQ | EPFL |
|-------|-----|------|------|------|
| GalactiTA (DPO only) | 29.24% | 29.03% | 41.31% | 27.32% |
| GalactiTA (MCQA-tuned) | **35.06%** | 31.61% | **60.50%** | 35.59% |
| GalactiTA (MCQA + RAG) | 33.00% | **32.90%** | 53.22% | 34.59% |
| GalactiTA (RAG-tuned) | 31.01% | 29.68% | 47.35% | 30.83% |
| GalactiTA (RAG + RAG) | 29.67% | 30.97% | 45.47% | 31.58% |
| TinyLlama | 24.34% | 25.16% | 24.00% | 36.84% |
| TinyLlama (+ RAG) | 25.20% | 22.58% | 25.80% | **38.60%** |

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