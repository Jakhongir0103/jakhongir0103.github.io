---
layout: about
title: about
permalink: /
subtitle: <a href='https://www.epfl.ch/en/'>EPFL</a>

profile:
  align: right
  image: profile.png
  image_circular: true # crops the image to make it circular
  more_info: 

selected_papers: true # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit:  # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

I research large language and vision models as an MSc student at [EPFL](https://www.epfl.ch/en/). I’m fortunate to have worked at the [NLP](), [DHLAB](), [LINX]() labs and also at [SwissAI](). I have done my Bachelor’s at <a href='https://www.polito.it/'>Politecnico di Torino</a>.

#### Research Interests
I research building inclusive, multimodal reasoning AI systems that work for everyone. Below are some areas I've been working on:

- **Inclusivity in NLP:** I want to bridge the gaps in multilingual NLP & ensure AI benefits linguistically diverse and underrepresented communities
  - [ConLID](https://arxiv.org/abs/2506.15304): Contrastive language identification for low-resource languages
  - [Apertus](https://arxiv.org/abs/2509.14233): The first large-scale language model developed in Switzerland
  <!-- - COLM workshop (annotations, models) -->

- **Multimodal Reasoning:** Models need to reason across modalities, not just text, to handle real-world scenarios
  - Grounding-based multimodal reasoning: Trained VLMs to align visual and textual representations through bounding boxes
  - Tool-augmented visual reasoning: Trained VLMs with RL in multi-turn to manipulate images during reasoning
  - GUI agents: Building autonomous agents for mouse/keyboard operations (Logitech)

- **Efficient Reasoning:** As we scale to multimodal scenarios, we need computationally efficient reasoning to make deployment practical
  - Investigating the "overthinking" phenomenon in LLMs using uncertainty metrics like entropy and certainty