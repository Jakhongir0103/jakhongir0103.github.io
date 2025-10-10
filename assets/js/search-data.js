// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/assets/pdf/cv.pdf";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-started-student-research-assistantship-in-dhlab-on-llm-qa-system-project-by-venice-time-machine-with-prof-frédéric-kaplan",
          title: 'Started Student Research Assistantship in DHLAB on LLM QA system project by Venice...',
          description: "",
          section: "News",},{id: "news-participated-in-amld-2024",
          title: 'Participated in AMLD 2024',
          description: "",
          section: "News",},{id: "news-participated-in-llms-hackathon",
          title: 'Participated in LLMs Hackathon',
          description: "",
          section: "News",},{id: "news-started-summer-research-internship-in-nlp-lab-on-multilingual-model-training-project-by-swiss-ai-initiative-with-prof-antoine-bosselut",
          title: 'Started Summer Research Internship in NLP Lab on Multilingual Model Training project by...',
          description: "",
          section: "News",},{id: "news-participated-in-deepfake-hackaton",
          title: 'Participated in DeepFake Hackaton',
          description: "",
          section: "News",},{id: "news-won-the-axa-challenge-in-lauzhack-2024-hackathon-code",
          title: 'Won the AXA challenge in Lauzhack 2024 Hackathon [code]',
          description: "",
          section: "News",},{id: "news-started-a-new-research-project-on-multimodal-reasoning-at-the-nlp-lab-with-prof-antoine-bosselut",
          title: 'Started a new research project on Multimodal Reasoning at the NLP lab with...',
          description: "",
          section: "News",},{id: "news-won-the-2nd-place-in-a-hackathon-on-efficient-llm-training-code",
          title: 'Won the 2nd place in a hackathon on efficient LLM training [code]',
          description: "",
          section: "News",},{id: "news-joined-swissai-to-work-on-reasoning-for-vision-language-models-through-reinforcement-learning",
          title: 'Joined SwissAI to work on reasoning for vision language models through reinforcement learning...',
          description: "",
          section: "News",},{id: "news-joined-logitech-as-an-ml-research-intern-to-work-on-computer-use-agents",
          title: 'Joined Logitech as an ML Research Intern to work on Computer Use Agents...',
          description: "",
          section: "News",},{id: "projects-galactita",
          title: 'GalactiTA',
          description: "1.3B LLM trained through a 3-stage pipeline of SFT, DPO, and RAG-tuning on scientific datasets.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-youtube-analysis",
          title: 'YouTube Analysis',
          description: "Analysis of Tech channels on YouTube using the videos published between May 2005 and October 2019",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-multimodal-reasoning",
          title: 'Multimodal Reasoning',
          description: "Trained 3 paradigms of visual reasoning using GRPO",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-multi-turn-rl",
          title: 'Multi-turn RL',
          description: "Extended the VeRL framework to support for training multimodal models with multi-turn reinforcement learning with external tools using images as both inputs and outputs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-visual-reasoning",
          title: 'Visual Reasoning',
          description: "Explored GRPO to enhance visual question answering in vision-language models",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-mountain-car",
          title: 'Mountain Car',
          description: "Handling sparse reward challenges in reinforcement learning using DQN and Dyna-Q algorithms",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },];
