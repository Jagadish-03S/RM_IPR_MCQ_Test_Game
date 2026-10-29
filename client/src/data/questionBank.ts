export interface QuestionItem {
  id: string;
  moduleId: number;
  moduleTitle: string;
  questionNumber: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  chapterReference: string;
  pageReference: number;
}

export const questionBank: QuestionItem[] = [
  {
    "id": "m1_q01",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 1,
    "question": "According to the textbook, how does the engineering research cycle initially begin?",
    "options": {
      "A": "With funding allocation from government agencies",
      "B": "From a pragmatic problem space that necessitates resolution",
      "C": "With publishing a preliminary paper in a conference",
      "D": "By amassing an encyclopedia of existing literature"
    },
    "correctAnswer": "B",
    "explanation": "The research cycle initiates from a pragmatic problem space. Having a clear understanding of the problem that necessitates resolution serves as the catalyst for the research question.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 1
  },
  {
    "id": "m1_q02",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 2,
    "question": "In the context of knowledge categories in engineering research, which of the following is categorized under 'Orchestrating Actions'?",
    "options": {
      "A": "Organigraph and Maps",
      "B": "Given conditions and What happens",
      "C": "Process, Algorithm, and Procedure",
      "D": "Pictures and Graphs"
    },
    "correctAnswer": "C",
    "explanation": "Knowledge is categorized into: (1) Observation (Map, Graph, Picture, Equations, Descriptions, Organigraph), (2) Model (Given conditions, What happens), and (3) Orchestrating actions (Process, Algorithm, Procedure, Arrangement, Reference design).",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 3
  },
  {
    "id": "m1_q03",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 3,
    "question": "Which sequence correctly represents the standard navigation excursion in engineering research?",
    "options": {
      "A": "Problem -> Area -> Topic",
      "B": "Area -> Topic -> Problem",
      "C": "Topic -> Area -> Solution",
      "D": "Result -> Topic -> Area"
    },
    "correctAnswer": "B",
    "explanation": "Engineering exploration typically navigates from an examination area (e.g., Control Systems) to a topic (e.g., Control of Microbial Fuel Cells) and finally onto the specific problem (e.g., Adaptive Control of Single Chamber Microbial Fuel Cells).",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 3
  },
  {
    "id": "m1_q04",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 4,
    "question": "How do extrinsic motivators such as monetary rewards, fame, and awards affect creative research performance according to the text?",
    "options": {
      "A": "They consistently guarantee the highest levels of creative breakthrough",
      "B": "They wield considerable influence but might potentially hinder creativity",
      "C": "They eliminate the need for intrinsic curiosity",
      "D": "They have completely zero effect on researcher behavior"
    },
    "correctAnswer": "B",
    "explanation": "While intrinsic motivations correlate with elevated creative performance, extrinsic motivators (rewards, monetary gains, fame, awards) wield considerable influence but might potentially hinder creativity.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 4
  },
  {
    "id": "m1_q05",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 5,
    "question": "In which research type does the researcher lack control over variables and simply report fact-finding inquiries as observed?",
    "options": {
      "A": "Analytical research",
      "B": "Descriptive research",
      "C": "Experimental laboratory manipulation",
      "D": "Fundamental mathematics"
    },
    "correctAnswer": "B",
    "explanation": "Descriptive research encompasses methods like comparison, correlation, and fact-finding inquiries to succinctly portray the present state, where the researcher lacks control over variables (ex post facto).",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 5
  },
  {
    "id": "m1_q06",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 6,
    "question": "What differentiates fundamental research from applied research?",
    "options": {
      "A": "Fundamental research deals only with patents, while applied research deals with books",
      "B": "Fundamental research concentrates on formulating theories and broad generalizations, whereas applied research aims to resolve pressing, immediate practical problems",
      "C": "Fundamental research is commercial, while applied research is non-profit",
      "D": "There is no difference between them"
    },
    "correctAnswer": "B",
    "explanation": "Fundamental (basic or pure) research focuses on theory formulation and generalization with broad medium-to-long-term applicability, while applied research seeks immediate solutions for pressing practical or organizational predicaments.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 5
  },
  {
    "id": "m1_q07",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 7,
    "question": "Studying clustering effects at traffic intersections within Transportation Engineering using verbal narratives is an example of:",
    "options": {
      "A": "Quantitative research",
      "B": "Qualitative research",
      "C": "Double-blind testing",
      "D": "Exclusively fundamental mathematics"
    },
    "correctAnswer": "B",
    "explanation": "Qualitative research relies on a limited number of non-representative instances or verbal narratives—such as investigating clustering effects in intersections within Transportation Engineering—to assert propositions.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 5
  },
  {
    "id": "m1_q08",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 8,
    "question": "George Pólya (1887–1985) proposed a famous problem-solving framework consisting of how many core steps?",
    "options": {
      "A": "3 steps",
      "B": "4 steps",
      "C": "6 steps",
      "D": "8 steps"
    },
    "correctAnswer": "B",
    "explanation": "George Pólya proposed a 4-step framework for mathematical problem-solving: (1) Grasping the problem, (2) Initiating exploration/devising a plan, (3) Executing the devised plan, and (4) Reflecting on the journey and outcomes.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 7
  },
  {
    "id": "m1_q09",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 9,
    "question": "Which of the following describes the first step in George Pólya's 4-step framework?",
    "options": {
      "A": "Executing the plan and calculating the error rate",
      "B": "Grasping the problem, rephrasing it as if one's own, and representing it visually",
      "C": "Drafting the final journal manuscript",
      "D": "Conducting patent search under Form 1"
    },
    "correctAnswer": "B",
    "explanation": "Step 1 of Pólya's framework is grasping the problem, rephrasing it as if it were one's own, visually representing it with diagrams, and assessing the need for supplementary information.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 7
  },
  {
    "id": "m1_q10",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 10,
    "question": "What is defined as 'Fabrication' in engineering research misconduct?",
    "options": {
      "A": "Illicitly modifying real experimental data to fit a curve",
      "B": "Contriving inauthentic data or experiments based on presumed knowledge without performing the actual work",
      "C": "Failing to cite an author in Harvard format",
      "D": "Submitting a paper to two journals simultaneously"
    },
    "correctAnswer": "B",
    "explanation": "Fabrication involves inauthentic data generation—contriving data or experiments based on presumed knowledge of anticipated outcomes without waiting for or conducting actual experiments.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 10
  },
  {
    "id": "m1_q11",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 11,
    "question": "How does the textbook define 'Falsification'?",
    "options": {
      "A": "Reusing one's own previous text verbatim",
      "B": "Improper data manipulation—misrepresenting, misconstruing, or illicitly altering data or experimental results to bolster a desired hypothesis",
      "C": "Translating an English paper into German",
      "D": "Listing a coauthor without their knowledge"
    },
    "correctAnswer": "B",
    "explanation": "Falsification encompasses improper data manipulation: misrepresenting, misconstruing, or illicitly modifying data or experimental results, even partially, to bolster a desired hypothesis.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 10
  },
  {
    "id": "m1_q12",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 12,
    "question": "What is 'self-plagiarism' as explained in the textbook?",
    "options": {
      "A": "Borrowing ideas from one's own students without written permission",
      "B": "Verbatim replication or reuse of one's own previously published work without proper acknowledgment",
      "C": "Listing oneself as the first author on every paper",
      "D": "Using an automated spell checker"
    },
    "correctAnswer": "B",
    "explanation": "Verbatim replication or reuse of one's own previously published work is termed self-plagiarism, and it is considered unacceptable within scholarly literature.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 10
  },
  {
    "id": "m1_q13",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 13,
    "question": "According to the textbook, what is the limitation of automated similarity detection software tools?",
    "options": {
      "A": "They can definitively replace human peer reviewers entirely",
      "B": "They only generate a similarity score quantifying resemblance; a low score does not guarantee absence of plagiarism",
      "C": "They only recognize text printed before the year 1900",
      "D": "They can automatically grant patents to non-matching text"
    },
    "correctAnswer": "B",
    "explanation": "Tools generate a similarity score; they do not definitively identify plagiarism. A low similarity score does not provide foolproof assurance of a plagiarism-free document. Determining plagiarism necessitates human evaluation.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 11
  },
  {
    "id": "m1_q14",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 14,
    "question": "Submitting the same research manuscript simultaneously to two different journals or publication forums is known as:",
    "options": {
      "A": "Dual indexing",
      "B": "Double submission (concurrent submission)",
      "C": "Parallel patenting",
      "D": "Peer syndication"
    },
    "correctAnswer": "B",
    "explanation": "Concurrently submitting the same article to two distinct journals (double submission) contravenes publication guidelines and is an ethical breach.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 11
  },
  {
    "id": "m1_q15",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 15,
    "question": "According to Newman and Jones, what are the three core avenues of attributing credit for research contributions?",
    "options": {
      "A": "Payment, Royalty, and Patenting",
      "B": "Authorship, Citation, and Written Acknowledgment",
      "C": "Licensing, Franchising, and Assignment",
      "D": "Dedication, Foreword, and Appendix"
    },
    "correctAnswer": "B",
    "explanation": "Newman and Jones distill three core avenues of attributing credit for research contributions: authorship, citation, and written acknowledgment.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 12
  },
  {
    "id": "m1_q16",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 16,
    "question": "What is 'Career-boost authorship' as identified in the textbook?",
    "options": {
      "A": "Adding renowned international professors to gain citations",
      "B": "Dubiously extending co-authorship to junior faculty or students to artificially enhance their chances of employment or promotion",
      "C": "Publishing a paper every single month",
      "D": "Buying an established academic journal"
    },
    "correctAnswer": "B",
    "explanation": "Career-boost authorship occurs when a primary author dubiously extends co-authorship to junior faculty or students to enhance their chances of employment or promotion without genuine contribution.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 12
  },
  {
    "id": "m1_q17",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 17,
    "question": "Adding department heads, deans, or provosts as coauthors in exchange for administrative favors or rapport is termed:",
    "options": {
      "A": "Ghost authorship",
      "B": "Career-preservation authorship",
      "C": "Institutional branding",
      "D": "Honorary copyright"
    },
    "correctAnswer": "B",
    "explanation": "Career-preservation authorship involves adding department heads, deans, provosts, or administrators as coauthors in exchange for a quid pro quo arrangement or favorable rapport.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 12
  },
  {
    "id": "m1_q18",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 18,
    "question": "What characterizes 'Ghost co-authorship' in research publishing?",
    "options": {
      "A": "Listing deceased researchers as first authors",
      "B": "A legitimate contributor refraining from being listed due to undisclosed conflicts of interest or corporate influence",
      "C": "Using an anonymous artificial intelligence model",
      "D": "Writing under an ancient pseudonym"
    },
    "correctAnswer": "B",
    "explanation": "Ghost co-authorship occurs when a legitimate contributor refrains from being listed as an author due to undisclosed conflicts of interest or institutional/corporate influence.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 12
  },
  {
    "id": "m1_q19",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 19,
    "question": "When does downplaying a contributor's role by merely acknowledging them instead of giving authorship become unethical?",
    "options": {
      "A": "Only when the paper is translated into French",
      "B": "When the individual made substantial intellectual contributions to research design, interpretation, or writing in pursuit of sole authorship by the primary author",
      "C": "When the contributor is an undergraduate student",
      "D": "Whenever the research project receives government funding"
    },
    "correctAnswer": "B",
    "explanation": "In the pursuit of sole authorship, authors downplaying significant contributions of others by merely acknowledging them misrepresents actual contributions and denies them due credit and accountability.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 13
  },
  {
    "id": "m1_q20",
    "moduleId": 1,
    "moduleTitle": "Module 1: Introduction to Research Methodology",
    "questionNumber": 20,
    "question": "Who bears responsibility for the contents of a published research paper according to academic ethical norms?",
    "options": {
      "A": "Exclusively the first student author",
      "B": "Only the funding agency program manager",
      "C": "All authors listed on the research article bear collective responsibility",
      "D": "The journal typesetter and printer"
    },
    "correctAnswer": "C",
    "explanation": "All authors listed on a research article bear collective responsibility for its contents; consequently, they must all be informed and provide consent prior to journal submission.",
    "chapterReference": "Chapter 1: Introduction",
    "pageReference": 13
  },
  {
    "id": "m2_q01",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 1,
    "question": "What is the primary conceptual distinction between reading textbooks and reading research papers?",
    "options": {
      "A": "Textbooks present unproven hypotheses, whereas research papers present established absolute truths",
      "B": "Textbooks synthesize consolidated, verified knowledge for pedagogic foundation, while research papers present state-of-the-art frontiers, active debate, and novel findings",
      "C": "Research papers never contain mathematical models",
      "D": "Textbooks are only published by academic societies after peer review"
    },
    "correctAnswer": "B",
    "explanation": "Textbooks aggregate, structure, and synthesize foundational and consolidated knowledge, whereas research papers report bleeding-edge investigations, exploratory methodologies, and ongoing scientific dialogues.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 14
  },
  {
    "id": "m2_q02",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 2,
    "question": "A proficient literature survey generally follows which two-step process?",
    "options": {
      "A": "(i) Downloading 500 papers; (ii) Printing them all",
      "B": "(i) Identifying major topics; (ii) Categorizing relevant sources under respective concept/topic/subtopic markers",
      "C": "(i) Writing conclusions; (ii) Searching for references that match",
      "D": "(i) Applying for a patent; (ii) Citing competitors"
    },
    "correctAnswer": "B",
    "explanation": "A proficient literature survey follows a two-step process: (i) Identifying major topics, and (ii) Categorizing relevant sources (articles, subtopics, concepts) under the respective topic/subtopic using appropriate markers.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 16
  },
  {
    "id": "m2_q03",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 3,
    "question": "What is the structure of the literature survey grid described in Table 2.1 of the textbook?",
    "options": {
      "A": "A single column of author names",
      "B": "A matrix featuring N topics across M sources to synthesize collective findings",
      "C": "A financial balance sheet of journal subscription costs",
      "D": "A flowchart of patent filing stages"
    },
    "correctAnswer": "B",
    "explanation": "The literature survey grid (Table 2.1) features N topics and M sources to facilitate the systematic organization, comparison, and synthesis of information across diverse papers.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 16
  },
  {
    "id": "m2_q04",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 4,
    "question": "When reading technical literature, what note-taking technique does the textbook recommend immediately after highlighting a key passage?",
    "options": {
      "A": "Copying the sentence verbatim into the final manuscript draft",
      "B": "Setting aside or closing the book and articulating the concept in writing in one's own words",
      "C": "Filing an objection with the European Patent Office",
      "D": "Memorizing the paragraph word for word"
    },
    "correctAnswer": "B",
    "explanation": "After highlighting, it is advisable to set aside the paper or close the book and express the highlighted content in writing without verbatim copying to internalize and sculpt the knowledge.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 16
  },
  {
    "id": "m2_q05",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 5,
    "question": "What are the three key dimensions shaping technical paper title characteristics identified in the textbook?",
    "options": {
      "A": "Font size, ink color, and margin width",
      "B": "Type of title, length of title, and presence of specific markers",
      "C": "Number of vowels, number of syllables, and price",
      "D": "Author age, university ranking, and country code"
    },
    "correctAnswer": "B",
    "explanation": "Title characteristics are shaped by three key aspects: (i) the type of title, (ii) the length of the title, and (iii) the presence of specific markers.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q06",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 6,
    "question": "In the empirical study by Stremersch et al. (2007) examining papers published between 1990 and 2002, what relationship was discovered?",
    "options": {
      "A": "Shorter one-word titles received 10 times more citations",
      "B": "Longer titles positively correlate with a higher number of citations",
      "C": "Title length had zero mathematical correlation with citations",
      "D": "Only titles in Latin were cited by top engineering journals"
    },
    "correctAnswer": "B",
    "explanation": "Stremersch et al. (2007) analyzed title characteristics of papers published between 1990 and 2002 and concluded that longer titles positively correlate with a higher number of citations.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q07",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 7,
    "question": "What did Sagi and Yechiam (2008) discover regarding 'highly amusing' or humorous titles in scientific papers?",
    "options": {
      "A": "Highly amusing titles exhibited significantly fewer citations",
      "B": "Humorous titles were automatically rejected by patent examiners",
      "C": "Highly amusing titles received the highest number of citations across all fields",
      "D": "Amusing titles increased downloads by 1000%"
    },
    "correctAnswer": "A",
    "explanation": "In the study conducted by Sagi and Yechiam (2008), it was discovered that highly amusing titles exhibit fewer citations, while pleasant titles showed no significant correlation with citation counts.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q08",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 8,
    "question": "According to Jacques and Sebire's study of the 25 most-cited vs. 25 least-cited papers, how did title length compare?",
    "options": {
      "A": "Most-cited papers had titles more than twice as long as lower-cited papers",
      "B": "Most-cited papers had titles restricted to under five words",
      "C": "Lower-cited papers had titles containing more than 50 words",
      "D": "Title length was strictly identical across both groups"
    },
    "correctAnswer": "A",
    "explanation": "Jacques and Sebire revealed a strong correlation between title length and citation rates: highly cited articles featured titles that were more than twice as long as those of lower-cited papers.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q09",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 9,
    "question": "What did Jamali and Nikzad discover regarding articles bearing question-type titles?",
    "options": {
      "A": "They are downloaded more frequently but receive fewer citations compared to descriptive or declarative titles",
      "B": "They are never downloaded by researchers",
      "C": "They receive the highest citation counts in history",
      "D": "They can only be published in law reviews"
    },
    "correctAnswer": "A",
    "explanation": "Jamali and Nikzad revealed that articles bearing question-type titles are downloaded more frequently but receive fewer citations compared to descriptive or declarative titles.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q10",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 10,
    "question": "According to Habibzadeh and Yadollahie (2010), why do longer titles often garner higher citation rates?",
    "options": {
      "A": "They use bigger fonts in the journal header",
      "B": "They provide a more detailed account of the study methodology and results, piquing greater interest",
      "C": "They prevent other authors from copying the title",
      "D": "They qualify for copyright registration automatically"
    },
    "correctAnswer": "B",
    "explanation": "Habibzadeh and Yadollahie found that longer titles provide a more detailed account of study methodology and results, which consequently piques greater interest and garners more citations.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q11",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 11,
    "question": "Titles featuring question marks, colons, or references to specific geographical regions generally correlate with:",
    "options": {
      "A": "Extremely high citation surges",
      "B": "Lower citation rates",
      "C": "Immediate patent grants",
      "D": "Higher impact factor multiplier"
    },
    "correctAnswer": "B",
    "explanation": "Generally, titles featuring question marks, colons, or references to specific geographical regions tend to be associated with lower citation rates.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q12",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 12,
    "question": "Between titles emphasizing results versus titles centered around methodologies, which typically garners more citations?",
    "options": {
      "A": "Titles emphasizing results usually garner more citations",
      "B": "Titles emphasizing methodologies garner ten times more citations",
      "C": "Neither receives citations unless accompanied by audio",
      "D": "Both perform identically across all disciplines"
    },
    "correctAnswer": "A",
    "explanation": "Titles that emphasize results usually garner more citations than those centered around methodologies.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 30
  },
  {
    "id": "m2_q13",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 13,
    "question": "Which of the following citation styles uses bracketed numerical citations (e.g., [1], [2]) ordered sequentially as they appear in the text?",
    "options": {
      "A": "APA style",
      "B": "Harvard style",
      "C": "IEEE style",
      "D": "Chicago author-date style"
    },
    "correctAnswer": "C",
    "explanation": "IEEE referencing style uses numbered citations enclosed in square brackets (e.g., [1]), listed in sequential numerical order corresponding to their first appearance in the manuscript.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 32
  },
  {
    "id": "m2_q14",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 14,
    "question": "In APA (American Psychological Association) citation format, how is an in-text attribution properly formatted?",
    "options": {
      "A": "[1]",
      "B": "(Smith, 2020)",
      "C": "Smith [2020: Chapter 1]",
      "D": "/Smith 2020/"
    },
    "correctAnswer": "B",
    "explanation": "APA style employs author-date in-text citations enclosed in parentheses, such as (Smith, 2020), arranged alphabetically in the references section.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 33
  },
  {
    "id": "m2_q15",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 15,
    "question": "What is 'coercive citation' in scientific publishing as highlighted by Wilhite and Fong (2012)?",
    "options": {
      "A": "A software script that forces students to read citations",
      "B": "An unethical practice where editors or reviewers pressure authors to add unearned citations to their own journal to inflate impact metrics",
      "C": "A legal court order requiring patent attorneys to cite competitors",
      "D": "A standard mandatory requirement in IEEE transactions"
    },
    "correctAnswer": "B",
    "explanation": "Coercive citation occurs when academic editors or reviewers pressure authors to cite papers from their journal (or by themselves) without scientific justification, aiming to artificially inflate citation metrics.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 36
  },
  {
    "id": "m2_q16",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 16,
    "question": "What is the primary objective of an Acknowledgments section in a technical paper?",
    "options": {
      "A": "To assign patent rights to sponsors",
      "B": "To recognize financial sponsors, technical assistance, laboratory staff, and helpful discussions that did not meet authorship criteria",
      "C": "To list all published books in the library",
      "D": "To waive moral copyright protection"
    },
    "correctAnswer": "B",
    "explanation": "The acknowledgments section recognizes funding agencies, grant numbers, technical/administrative assistance, and individuals who contributed meaningfully but whose roles did not warrant formal authorship.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 38
  },
  {
    "id": "m2_q17",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 17,
    "question": "Why is a concept-focused literature review considered superior to an author-centric literature review?",
    "options": {
      "A": "Author-centric reviews are banned by international law",
      "B": "Concept-focused reviews synthesize themes, underlying trends, and methodological paradigms across multiple studies rather than merely summarizing isolated papers one by one",
      "C": "Concept-focused reviews only cite one author per page",
      "D": "Author-centric reviews require payment of royalties to cited authors"
    },
    "correctAnswer": "B",
    "explanation": "A concept-focused review structures knowledge logically around research themes, paradigms, and gaps across studies, offering deep synthesis rather than an unintegrated chronological list of author summaries.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 18
  },
  {
    "id": "m2_q18",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 18,
    "question": "What is self-citation in academic publishing, and when does it become problematic?",
    "options": {
      "A": "It is strictly illegal under Section 52 of the Copyright Act",
      "B": "It is an author referencing their own prior work; it becomes problematic when excessive or used artificially to inflate personal citation counts",
      "C": "It is citing a coauthor from another university",
      "D": "It is referencing a textbook rather than a journal article"
    },
    "correctAnswer": "B",
    "explanation": "Self-citation is legitimate when establishing continuity with earlier foundational findings, but becomes an ethical abuse when used gratuitously to artificially inflate personal citation indices.",
    "chapterReference": "Chapter 3: Attributions and Citations",
    "pageReference": 37
  },
  {
    "id": "m2_q19",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 19,
    "question": "Which of the following bibliographic database tools provides structured citation tracking, h-index calculation, and inter-paper link mapping?",
    "options": {
      "A": "Scopus, Web of Science, and Google Scholar",
      "B": "Adobe Acrobat Reader and WinRAR",
      "C": "Notepad and WordPad",
      "D": "Paint and Photoshop"
    },
    "correctAnswer": "A",
    "explanation": "Databases such as Scopus, Clarivate Web of Science, and Google Scholar provide citation indexing, author profile tracking, h-index calculation, and connected research mapping.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 22
  },
  {
    "id": "m2_q20",
    "moduleId": 2,
    "moduleTitle": "Module 2: Literature Review and Technical Reading; Attributions and Citations",
    "questionNumber": 20,
    "question": "When evaluating prior art bibliographic databases, what three analytical steps should researchers engage in according to Section 2.2?",
    "options": {
      "A": "(i) Grasping the underlying hypothesis, (ii) Comprehending models and experimental parameters, (iii) Establishing connections between pieces of information",
      "B": "(i) Translating into Latin, (ii) Calculating page numbers, (iii) Printing on cardstock",
      "C": "(i) Paying subscription fees, (ii) Scanning barcodes, (iii) Deleting PDF files",
      "D": "(i) Writing patents, (ii) Hiring lawyers, (iii) Filing Form 18"
    },
    "correctAnswer": "A",
    "explanation": "Researchers should engage in: (i) Grasping the underlying hypothesis, (ii) Comprehending models and experimental parameters employed, and (iii) Establishing connections between pieces of information.",
    "chapterReference": "Chapter 2: Literature Review and Technical Reading",
    "pageReference": 16
  },
  {
    "id": "m3_q01",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 1,
    "question": "Which committee in 1949 reviewed patent laws in India leading to early legislative revisions?",
    "options": {
      "A": "Justice Ayyangar Committee",
      "B": "Bakshi Tek Chand Committee",
      "C": "Kothari Commission",
      "D": "Sarkaria Commission"
    },
    "correctAnswer": "B",
    "explanation": "In 1949, the Bakshi Tek Chand Committee was constituted to review the patent laws in India, which led to the enactment of Act XXXII of 1950 and Act LXX of 1952.",
    "chapterReference": "Chapter 4: Introduction to Intellectual Property",
    "pageReference": 43
  },
  {
    "id": "m3_q02",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 2,
    "question": "Whose landmark committee report in 1957 formed the bedrock for the enactment of the comprehensive Indian Patents Act of 1970?",
    "options": {
      "A": "Justice N. Rajagopala Ayyangar Committee",
      "B": "Dr. B. R. Ambedkar Committee",
      "C": "Sir C. V. Raman Committee",
      "D": "Justice Verma Committee"
    },
    "correctAnswer": "A",
    "explanation": "Justice N. Rajagopala Ayyangar Committee (1957) submitted a comprehensive report that served as the primary foundation for the Indian Patents Act of 1970.",
    "chapterReference": "Chapter 4: Introduction to Intellectual Property",
    "pageReference": 43
  },
  {
    "id": "m3_q03",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 3,
    "question": "What are the three fundamental statutory requirements an invention must fulfill to be eligible for a patent in India?",
    "options": {
      "A": "Low cost, High sales, and Digital format",
      "B": "Novelty, Inventive step (non-obviousness), and Industrial applicability (utility)",
      "C": "Written in English, Signed by a notary, and Published in a newspaper",
      "D": "Software algorithms, Business methods, and Aesthetic beauty"
    },
    "correctAnswer": "B",
    "explanation": "Under the Patents Act 1970, an invention must satisfy three core criteria: (1) Novelty, (2) Inventive Step (non-obvious to a person skilled in the art), and (3) Capable of industrial application.",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 55
  },
  {
    "id": "m3_q04",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 4,
    "question": "Under the Indian Patents Act, 1970, what is the statutory term of validity of a granted patent from the date of filing?",
    "options": {
      "A": "10 years",
      "B": "15 years",
      "C": "20 years",
      "D": "60 years"
    },
    "correctAnswer": "C",
    "explanation": "Under Section 53 of the Indian Patents Act 1970 (amended to comply with TRIPS), the term of every patent granted is 20 years from the date of filing.",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 56
  },
  {
    "id": "m3_q05",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 5,
    "question": "Which section of the Indian Patents Act, 1970 explicitly enumerates subject matters that are NOT patentable inventions?",
    "options": {
      "A": "Section 3",
      "B": "Section 12",
      "C": "Section 57",
      "D": "Section 100"
    },
    "correctAnswer": "A",
    "explanation": "Section 3 of the Indian Patents Act 1970 provides a detailed list of non-patentable subject matters (e.g., frivolous inventions, mere discovery of scientific principles, plant varieties, software per se, traditional knowledge).",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 57
  },
  {
    "id": "m3_q06",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 6,
    "question": "Which of the following is explicitly non-patentable under Section 3(d) of the Indian Patents Act?",
    "options": {
      "A": "A novel mechanical fuel injector with 50% improved efficiency",
      "B": "The mere discovery of a new form of a known substance which does not result in significant enhancement of known efficacy",
      "C": "A newly synthesized organic compound exhibiting novel industrial utility",
      "D": "An automated solar panel cleaning mechanism"
    },
    "correctAnswer": "B",
    "explanation": "Section 3(d) prevents evergreening by excluding the mere discovery of a new form of a known substance unless it results in the enhancement of the known efficacy of that substance.",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 58
  },
  {
    "id": "m3_q07",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 7,
    "question": "Under Section 5.8 of the textbook, what grace period is provided in specific situations to file a patent application after public exhibition or presentation before a learned society?",
    "options": {
      "A": "3 months",
      "B": "6 months",
      "C": "12 months",
      "D": "24 months"
    },
    "correctAnswer": "C",
    "explanation": "The Patents Act includes provisions allowing a grace period of 12 months to file a patent application after an invention has been exhibited or published before a recognized scientific society.",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 59
  },
  {
    "id": "m3_q08",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 8,
    "question": "Under Section 100 of the Indian Patents Act 1970, what special power does the Central Government hold regarding patented inventions?",
    "options": {
      "A": "Power to confiscate all patent revenue forever without reason",
      "B": "Power to use the invention for government purposes in case of national emergency or extreme urgency after notifying the patentee",
      "C": "Power to imprison inventors without trial",
      "D": "Power to transfer patents automatically to foreign multinational corporations"
    },
    "correctAnswer": "B",
    "explanation": "Under Section 100 of the Patents Act 1970, the Central Government holds the right to use the invention for its own purposes or in cases of national emergency/extreme urgency after notifying the owner.",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 59
  },
  {
    "id": "m3_q09",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 9,
    "question": "When a provisional specification is filed, within what time period MUST the complete specification be submitted in India?",
    "options": {
      "A": "6 months",
      "B": "12 months",
      "C": "18 months",
      "D": "36 months"
    },
    "correctAnswer": "B",
    "explanation": "Following the filing of a provisional patent application, the applicant is granted a statutory duration of 12 months to submit the complete specification.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 61
  },
  {
    "id": "m3_q10",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 10,
    "question": "Which standard Patent Form is used for submitting the Application for Grant of a Patent in India?",
    "options": {
      "A": "Form 1",
      "B": "Form 5",
      "C": "Form 9",
      "D": "Form 18"
    },
    "correctAnswer": "A",
    "explanation": "Form 1 is the mandatory form for the 'Application for Grant of Patent' in India.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 63
  },
  {
    "id": "m3_q11",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 11,
    "question": "Which form is used for submitting either a Provisional or Complete Specification in Indian patent filing?",
    "options": {
      "A": "Form 2",
      "B": "Form 3",
      "C": "Form 8",
      "D": "Form 18A"
    },
    "correctAnswer": "A",
    "explanation": "Form 2 is the prescribed statutory form for submitting the provisional or complete specification.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 63
  },
  {
    "id": "m3_q12",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 12,
    "question": "In Form 2 of a patent application, what part is NOT applicable for a provisional specification?",
    "options": {
      "A": "Title of invention",
      "B": "Preamble to description",
      "C": "Claims",
      "D": "Applicant name"
    },
    "correctAnswer": "C",
    "explanation": "Claims define the legal monopoly boundaries and are required only in a complete specification; claims are NOT applicable for a provisional specification.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 64
  },
  {
    "id": "m3_q13",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 13,
    "question": "Which form must an applicant file if they wish to request early publication of their patent application before the statutory 18 months?",
    "options": {
      "A": "Form 3",
      "B": "Form 5",
      "C": "Form 9",
      "D": "Form 24"
    },
    "correctAnswer": "C",
    "explanation": "An applicant who wishes to expedite the publication of their patent application before the regular 18-month timeline files Form 9 (Request for Early Publication).",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 65
  },
  {
    "id": "m3_q14",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 14,
    "question": "Form 18 in the Indian patent system serves what primary function?",
    "options": {
      "A": "Request for examination of application for patent",
      "B": "Renewal fee payment",
      "C": "Notice of opposition",
      "D": "Surrender of patent"
    },
    "correctAnswer": "A",
    "explanation": "Form 18 is the Request for Examination of Application for Patent, which must be filed within 48 months from the date of priority or filing.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 65
  },
  {
    "id": "m3_q15",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 15,
    "question": "Where is the Southern territorial Patent Office located in India according to Table 6.1?",
    "options": {
      "A": "Bengaluru (Electronic City)",
      "B": "Chennai (Intellectual Property Office Building, G.S.T. Road, Guindy)",
      "C": "Hyderabad (HITEC City)",
      "D": "Kochi (Marine Drive)"
    },
    "correctAnswer": "B",
    "explanation": "As per Table 6.1, the Southern patent jurisdiction office covering Karnataka, Andhra Pradesh, Telangana, Kerala, Tamil Nadu, Pondicherry, and Lakshadweep is situated at Guindy, Chennai.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 64
  },
  {
    "id": "m3_q16",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 16,
    "question": "Under the Patent Cooperation Treaty (PCT), what is the maximum international filing timeline allowed before entering the national phase in member countries?",
    "options": {
      "A": "12 months",
      "B": "18 months",
      "C": "30 / 31 months",
      "D": "60 months"
    },
    "correctAnswer": "C",
    "explanation": "The PCT international filing system allows applicants up to 30 or 31 months from the initial priority date to enter the national phase in designated countries.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 67
  },
  {
    "id": "m3_q17",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 17,
    "question": "What is the role of the Budapest Treaty (1977) to which India is a signatory?",
    "options": {
      "A": "Registration of international industrial designs",
      "B": "International recognition of the deposit of microorganisms for the purposes of patent procedure",
      "C": "Global regulation of trademark royalties",
      "D": "Harmonization of copyright for cinematograph films"
    },
    "correctAnswer": "B",
    "explanation": "The Budapest Treaty (1977) provides for the international recognition of the deposit of microorganisms with an authorized International Depositary Authority (IDA) for patent procedures.",
    "chapterReference": "Chapter 4: Introduction to Intellectual Property",
    "pageReference": 46
  },
  {
    "id": "m3_q18",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 18,
    "question": "What legal remedies are available to a patent owner against infringement in an Indian court under Section 5.7?",
    "options": {
      "A": "Interim/interlocutory injunction, damages or accounts of profits, and permanent injunction",
      "B": "Immediate cancellation of infringer's passport",
      "C": "Summary confiscation of infringer's personal residential property",
      "D": "Compulsory acquisition by the World Intellectual Property Organization"
    },
    "correctAnswer": "A",
    "explanation": "Remedies available under the Patents Act include interlocutory/interim injunctions, damages or accounts of profits, and permanent injunctions.",
    "chapterReference": "Chapter 5: Patents",
    "pageReference": 59
  },
  {
    "id": "m3_q19",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 19,
    "question": "What is Form 3 under the Indian Patent Rules?",
    "options": {
      "A": "Statement and undertaking regarding foreign patent applications under Section 8",
      "B": "Application for renewal of granted patent",
      "C": "Opposition before the Appellate Board",
      "D": "Power of attorney for patent agent"
    },
    "correctAnswer": "A",
    "explanation": "Form 3 is the Statement and Undertaking under Section 8, requiring applicants to disclose details of corresponding patent filings in foreign countries.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 63
  },
  {
    "id": "m3_q20",
    "moduleId": 3,
    "moduleTitle": "Module 3: Introduction to Intellectual Property; Patents; Process of Patenting",
    "questionNumber": 20,
    "question": "What standard preamble must every claim in an Indian complete specification begin with according to Form 2 instructions?",
    "options": {
      "A": "'Be it known that'",
      "B": "'I/we claim'",
      "C": "'It is hereby proved that'",
      "D": "'Subject to government permission'"
    },
    "correctAnswer": "B",
    "explanation": "Under Form 2, the claims section must start on a separate page with the mandatory preamble: 'I/we claim' or 'We claim'.",
    "chapterReference": "Chapter 6: Process of Patenting",
    "pageReference": 64
  },
  {
    "id": "m4_q01",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 1,
    "question": "What is the general term of copyright protection for original literary, musical, and artistic works in India under the Copyright Act, 1957?",
    "options": {
      "A": "20 years from the date of creation",
      "B": "Lifetime of the author plus 60 years counted from the calendar year following death",
      "C": "50 years flat from publication",
      "D": "100 years from filing Form TM-A"
    },
    "correctAnswer": "B",
    "explanation": "Under the Copyright Act 1957, copyright in published literary, dramatic, musical, and artistic works subsists for the lifetime of the author plus 60 years after the calendar year of their death.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 80
  },
  {
    "id": "m4_q02",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 2,
    "question": "Which section of the Copyright Act, 1957 grants an author non-economic 'Moral Rights' (including Paternity and Integrity rights)?",
    "options": {
      "A": "Section 12",
      "B": "Section 52",
      "C": "Section 57",
      "D": "Section 101"
    },
    "correctAnswer": "C",
    "explanation": "Section 57 of the Copyright Act 1957 safeguards an author's special moral rights: the right to claim paternity/authorship and the right to restrain or claim damages against distortion, mutilation, or modification prejudicial to honor or reputation.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 82
  },
  {
    "id": "m4_q03",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 3,
    "question": "Under Section 52 of the Indian Copyright Act, which of the following is legally exempt from copyright infringement under Fair Dealing?",
    "options": {
      "A": "Selling pirated DVDs at commercial bus stations",
      "B": "Private or personal use including research, and reproduction by teachers in the course of instruction",
      "C": "Uploading an entire newly released Hollywood film to YouTube for monetization",
      "D": "Rebranding a commercial textbook under a new author name"
    },
    "correctAnswer": "B",
    "explanation": "Section 52 explicitly protects Fair Dealing, exempting reproduction for research, private study, criticism, news reporting, judicial proceedings, and educational instruction.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 84
  },
  {
    "id": "m4_q04",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 4,
    "question": "What four-part test governs the Fair Use Doctrine as detailed in Section 7.9 of the textbook?",
    "options": {
      "A": "Language, Font size, Country of printing, and Publisher wealth",
      "B": "Nature of use, nature of work, amount/substantiality used, and impact on market value",
      "C": "Author nationality, age, political affiliation, and gender",
      "D": "Filing date, registration fee, stamp duty, and notary seal"
    },
    "correctAnswer": "B",
    "explanation": "Fair use is governed by a four-part test: (1) The purpose and nature of use, (2) The nature of the copyrighted work, (3) The amount and substantiality of the portion taken, and (4) The economic impact on the potential market value.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 84
  },
  {
    "id": "m4_q05",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 5,
    "question": "Are computer software programs protected under Indian Intellectual Property law, and if so, under which classification?",
    "options": {
      "A": "Yes, protected as 'Literary Works' under the Copyright Act, 1957",
      "B": "No, software cannot be protected by any legal means in India",
      "C": "Exclusively as Industrial Designs under Designs Act 2000",
      "D": "Exclusively as Geographical Indications"
    },
    "correctAnswer": "A",
    "explanation": "Under Section 2(o) of the Indian Copyright Act 1957, computer programs and software code are protected as 'literary works'.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 81
  },
  {
    "id": "m4_q06",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 6,
    "question": "What is the duration of Performer's Rights under Section 38 of the Indian Copyright Act?",
    "options": {
      "A": "10 years",
      "B": "25 years",
      "C": "50 years",
      "D": "Life plus 60 years"
    },
    "correctAnswer": "C",
    "explanation": "Performer's rights subsist for 50 years from the beginning of the calendar year following the year in which the performance was made.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 86
  },
  {
    "id": "m4_q07",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 7,
    "question": "What is the duration of Broadcasting Reproduction Rights granted to broadcasting organizations in India?",
    "options": {
      "A": "15 years",
      "B": "20 years",
      "C": "25 years",
      "D": "60 years"
    },
    "correctAnswer": "C",
    "explanation": "Broadcasting reproduction rights subsist for 25 years from the beginning of the calendar year following the year in which the broadcast took place.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 86
  },
  {
    "id": "m4_q08",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 8,
    "question": "What primary act governs the registration, protection, and enforcement of trademarks in India?",
    "options": {
      "A": "The Trade and Merchandise Marks Act, 1958",
      "B": "The Trade Marks Act, 1999",
      "C": "The Companies Act, 2013",
      "D": "The Indian Contract Act, 1872"
    },
    "correctAnswer": "B",
    "explanation": "The Trade Marks Act, 1999 (effective since September 2003) is the primary statute governing trademark protection, registration, and litigation in India.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 93
  },
  {
    "id": "m4_q09",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 9,
    "question": "What is the statutory initial validity period of a registered trademark in India, and how can it be renewed?",
    "options": {
      "A": "5 years, non-renewable",
      "B": "10 years, renewable indefinitely in successive 10-year periods",
      "C": "20 years, same as a patent",
      "D": "60 years, same as copyright"
    },
    "correctAnswer": "B",
    "explanation": "In India, a registered trademark remains valid for 10 years, but can be renewed indefinitely for successive 10-year periods upon timely filing and payment of renewal fees.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 96
  },
  {
    "id": "m4_q10",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 10,
    "question": "Which form is used for the renewal of a registered trademark in India according to Section 8.7?",
    "options": {
      "A": "Form TM-A",
      "B": "Form TM-R",
      "C": "Form 18A",
      "D": "Form 8"
    },
    "correctAnswer": "B",
    "explanation": "The application for renewal of a registered trademark is submitted using form 'TM-R' within one year preceding the expiration of the mark's validity.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 96
  },
  {
    "id": "m4_q11",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 11,
    "question": "What legal remedy is available to the owner of an UNREGISTERED trademark when another entity mimics their mark?",
    "options": {
      "A": "Statutory infringement suit under Section 29",
      "B": "Common law action for 'Passing Off'",
      "C": "Automatic revocation of the rival company's incorporation certificate",
      "D": "No legal remedy exists for unregistered marks"
    },
    "correctAnswer": "B",
    "explanation": "Unregistered trademarks cannot sustain a statutory infringement action, but are protected under common law tort through an action for 'Passing Off' upon establishing reputation and goodwill.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 96
  },
  {
    "id": "m4_q12",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 12,
    "question": "According to Table 8.1 in the textbook, the brand name 'BAJAJ' is an example of what type of trademark?",
    "options": {
      "A": "An invented or coined word",
      "B": "A personal name / surname of the applicant or predecessor (industrialist Jamnalal Bajaj)",
      "C": "A generic geographical term",
      "D": "A numerical code"
    },
    "correctAnswer": "B",
    "explanation": "As highlighted in the textbook, 'BAJAJ' is an example of a trademark based on the surname/personal name of industrialist Mr. Jamnalal Bajaj.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 96
  },
  {
    "id": "m4_q13",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 13,
    "question": "Using an everyday dictionary word for an entirely unrelated product line (such as 'APPLE' for computers or 'INDIA GATE' for rice) is classified as:",
    "options": {
      "A": "Generic mark",
      "B": "Arbitrary mark",
      "C": "Deceptive mark",
      "D": "Descriptive mark"
    },
    "correctAnswer": "B",
    "explanation": "An arbitrary trademark uses a well-known dictionary word that possesses no intrinsic, descriptive relationship to the goods or services sold (e.g. 'Apple' for electronics, 'India Gate' for rice).",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 96
  },
  {
    "id": "m4_q14",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 14,
    "question": "Which form is submitted for filing an application for trademark registration in India?",
    "options": {
      "A": "Form TM-A",
      "B": "Form 1",
      "C": "Form GI-1",
      "D": "Form 24"
    },
    "correctAnswer": "A",
    "explanation": "Form TM-A is the standardized comprehensive application form used for registering a new trademark in India.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 98
  },
  {
    "id": "m4_q15",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 15,
    "question": "Which public online database is operated by the CGPDTM for conducting trademark prior art searches in India?",
    "options": {
      "A": "ipindiaservices.gov.in/tmrpublicsearch",
      "B": "incometaxindia.gov.in",
      "C": "parivahan.gov.in",
      "D": "epfindia.gov.in"
    },
    "correctAnswer": "A",
    "explanation": "The official trademark public search portal operated by the CGPDTM in India is hosted at ipindiaservices.gov.in/tmrpublicsearch.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 98
  },
  {
    "id": "m4_q16",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 16,
    "question": "Which trademark registry has territorial jurisdiction over Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala, and Lakshadweep?",
    "options": {
      "A": "Mumbai Registry",
      "B": "New Delhi Registry",
      "C": "Chennai Registry",
      "D": "Ahmedabad Registry"
    },
    "correctAnswer": "C",
    "explanation": "As per Table 8.2 of the textbook, the Trademarks Registry in Chennai has territorial jurisdiction over southern states: Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala, Puducherry, and Lakshadweep.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 98
  },
  {
    "id": "m4_q17",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 17,
    "question": "What is an invented or coined word trademark, such as 'KODAK'?",
    "options": {
      "A": "A word that has existed in Sanskrit dictionaries for thousands of years",
      "B": "A completely novel, fabricated word with no prior meaning in any language, affording the highest level of trademark distinctiveness",
      "C": "A generic word like 'Bread' or 'Milk'",
      "D": "A geographic region name"
    },
    "correctAnswer": "B",
    "explanation": "Coined or invented words (such as 'Kodak' or 'Exxon') are completely fictitious terms with no dictionary meaning, offering the strongest, highest category of trademark protection.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 96
  },
  {
    "id": "m4_q18",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 18,
    "question": "Does copyright protection require mandatory registration in India for legal subsistence?",
    "options": {
      "A": "Yes, an author has zero rights until a certificate is issued by the President",
      "B": "No, copyright protection is automatic upon the creation and fixing of the original work in tangible form; registration provides evidentiary presumption in court",
      "C": "Registration is mandatory within 3 days of writing",
      "D": "Copyright only exists if approved by WIPO headquarters"
    },
    "correctAnswer": "B",
    "explanation": "Copyright protection is automatic upon creation under the Berne Convention principle. Registration with the Indian Copyright Office is optional, though it serves as strong prima facie evidence in litigation.",
    "chapterReference": "Chapter 7: Copyrights and Related Rights",
    "pageReference": 82
  },
  {
    "id": "m4_q19",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 19,
    "question": "Under the Trade Marks Act 1999, what constitutes trademark infringement?",
    "options": {
      "A": "Registering a domain name that has never been used",
      "B": "Unauthorized use of an identical or deceptively similar mark in the course of trade for identical/similar goods causing likelihood of public confusion",
      "C": "Using a search engine to find competitor prices",
      "D": "Applying for a patent in the same industry"
    },
    "correctAnswer": "B",
    "explanation": "Trademark infringement occurs when an unauthorized person uses an identical or deceptively similar mark in relation to similar goods or services, creating consumer confusion as to origin.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 95
  },
  {
    "id": "m4_q20",
    "moduleId": 4,
    "moduleTitle": "Module 4: Copyrights and Related Rights; Trademarks",
    "questionNumber": 20,
    "question": "Which symbol signifies a trademark that is officially REGISTERED under the Trade Marks Act?",
    "options": {
      "A": "™",
      "B": "®",
      "C": "©",
      "D": "℗"
    },
    "correctAnswer": "B",
    "explanation": "The ® symbol signifies an officially registered trademark. The ™ symbol is used for unregistered marks asserting common law rights, while © is for copyright.",
    "chapterReference": "Chapter 8: Trademarks",
    "pageReference": 94
  },
  {
    "id": "m5_q01",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 1,
    "question": "Which primary legislation governs the protection and registration of industrial designs in India?",
    "options": {
      "A": "The Patents Act, 1970",
      "B": "The Designs Act, 2000",
      "C": "The Copyright Act, 1957",
      "D": "The Information Technology Act, 2000"
    },
    "correctAnswer": "B",
    "explanation": "Industrial designs in India are governed by the Designs Act, 2000 (which replaced the Designs Act of 1911) along with the Designs Rules, 2001.",
    "chapterReference": "Chapter 9: Industrial Design",
    "pageReference": 101
  },
  {
    "id": "m5_q02",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 2,
    "question": "What does an Industrial Design protect under Section 2(d) of the Designs Act, 2000?",
    "options": {
      "A": "Underlying functional mechanism and circuit principles",
      "B": "Visual aesthetic features of shape, configuration, pattern, ornament or composition of lines or colours applied to an article",
      "C": "Literary plot of a novel",
      "D": "Source code of an operating system"
    },
    "correctAnswer": "B",
    "explanation": "Under Section 2(d) of the Designs Act 2000, 'design' means only the features of shape, configuration, pattern, ornament, or composition of lines or colours applied to any article, solely appealing to and judged by the eye.",
    "chapterReference": "Chapter 9: Industrial Design",
    "pageReference": 102
  },
  {
    "id": "m5_q03",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 3,
    "question": "What is the initial duration of registration of an Industrial Design in India, and by how many years can it be extended?",
    "options": {
      "A": "5 years, extendable by 5 years (10 years max)",
      "B": "10 years, extendable by 5 years (total 15 years maximum)",
      "C": "20 years, extendable indefinitely",
      "D": "60 years flat"
    },
    "correctAnswer": "B",
    "explanation": "Under the Designs Act 2000, a registered design is initially valid for 10 years, and can be extended by an additional 5 years upon application, giving a maximum statutory protection of 15 years.",
    "chapterReference": "Chapter 9: Industrial Design",
    "pageReference": 105
  },
  {
    "id": "m5_q04",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 4,
    "question": "Under Section 9.12 and Figure 9.1, which form must be filed to petition for the cancellation of a registered design?",
    "options": {
      "A": "Form 1",
      "B": "Form-8",
      "C": "Form TM-A",
      "D": "Form 18A"
    },
    "correctAnswer": "B",
    "explanation": "The registration of a design may be cancelled at any time by filing a petition in Form-8 along with the prescribed fee to the Controller of Designs.",
    "chapterReference": "Chapter 9: Industrial Design",
    "pageReference": 105
  },
  {
    "id": "m5_q05",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 5,
    "question": "How many total application and proceeding forms are associated with Industrial Designs under the Designs Rules?",
    "options": {
      "A": "5 forms",
      "B": "12 forms",
      "C": "24 forms",
      "D": "50 forms"
    },
    "correctAnswer": "C",
    "explanation": "As stated in Section 9.13 of the textbook, a comprehensive set of exactly 24 forms is associated with Industrial Designs procedures.",
    "chapterReference": "Chapter 9: Industrial Design",
    "pageReference": 105
  },
  {
    "id": "m5_q06",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 6,
    "question": "Which legislation provides for the registration and better protection of Geographical Indications in India?",
    "options": {
      "A": "The Geographical Indications of Goods (Registration and Protection) Act, 1999",
      "B": "The Agriculture Produce Act, 1937",
      "C": "The Food Safety and Standards Act, 2006",
      "D": "The Foreign Trade Act, 1992"
    },
    "correctAnswer": "A",
    "explanation": "Geographical indications are governed in India by the Geographical Indications of Goods (Registration and Protection) Act, 1999, which came into force in September 2003.",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 110
  },
  {
    "id": "m5_q07",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 7,
    "question": "What is the initial validity period of a registered Geographical Indication (GI) in India, and can it be renewed?",
    "options": {
      "A": "5 years, cannot be renewed",
      "B": "10 years, renewable indefinitely for successive periods of 10 years",
      "C": "20 years, non-renewable",
      "D": "Life of the artisan plus 60 years"
    },
    "correctAnswer": "B",
    "explanation": "A registered Geographical Indication remains valid for 10 years and can be renewed indefinitely for successive periods of 10 years upon payment of renewal fees.",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 112
  },
  {
    "id": "m5_q08",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 8,
    "question": "Who can apply for and hold a Geographical Indication (GI) in India?",
    "options": {
      "A": "Any single private corporation without local ties",
      "B": "An association of persons or producers, or an organization representing the interest of the producers of the goods",
      "C": "Only individual foreign inventors",
      "D": "Exclusively the Prime Minister's Office"
    },
    "correctAnswer": "B",
    "explanation": "A GI is a collective community right held by an association of persons, producers, or authorized organizations representing the regional producers, not an individual monopoly.",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 111
  },
  {
    "id": "m5_q09",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 9,
    "question": "Which iconic Indian product was the first to be granted a Geographical Indication (GI) tag in India in 2004-2005?",
    "options": {
      "A": "Mysore Silk",
      "B": "Darjeeling Tea",
      "C": "Kanchipuram Saree",
      "D": "Nagpur Orange"
    },
    "correctAnswer": "B",
    "explanation": "Darjeeling Tea was the very first product in India to be registered with a GI tag under the Geographical Indications of Goods Act in 2004-2005.",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 112
  },
  {
    "id": "m5_q10",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 10,
    "question": "How many certified copies of the geographical map of the territory must accompany a GI application in India?",
    "options": {
      "A": "1 copy",
      "B": "3 certified copies",
      "C": "10 certified copies",
      "D": "No map is required"
    },
    "correctAnswer": "B",
    "explanation": "A GI application must be accompanied by three certified copies of the map of the specific geographical territory to which the product attributes are linked.",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 113
  },
  {
    "id": "m5_q11",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 11,
    "question": "According to Figure 10.2 and Section 10.13, how many total GIs had been registered in India up to June 2021?",
    "options": {
      "A": "50",
      "B": "120",
      "C": "370",
      "D": "1,500"
    },
    "correctAnswer": "C",
    "explanation": "Section 10.13 notes: 'However, till June 2021, a total of 370 GI have been registered in India, which is much below its potential.'",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 116
  },
  {
    "id": "m5_q12",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 12,
    "question": "In what year was the maximum number of GI applications (148 filings) recorded in India according to Figure 10.2?",
    "options": {
      "A": "2011-12",
      "B": "2015-16",
      "C": "2018-19",
      "D": "2020-21"
    },
    "correctAnswer": "A",
    "explanation": "Figure 10.2 and text state: 'Maximum number (148) of GI were filed in 2011-12 whereas minimum number (17) was observed in 2015-16.'",
    "chapterReference": "Chapter 10: Geographical Indications",
    "pageReference": 116
  },
  {
    "id": "m5_q13",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 13,
    "question": "In the Turmeric patent case study (Section 11.1), which institution in the United States was granted the controversial patent in 1995?",
    "options": {
      "A": "Harvard Medical School",
      "B": "University of Mississippi Medical Center",
      "C": "Stanford University",
      "D": "Pfizer Inc."
    },
    "correctAnswer": "B",
    "explanation": "In 1995, the University of Mississippi Medical Center was granted US Patent No. 5,401,504 for the wound healing properties of turmeric powder.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 117
  },
  {
    "id": "m5_q14",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 14,
    "question": "Which Indian organization spearheaded the legal challenge against the Turmeric patent at the USPTO?",
    "options": {
      "A": "Indian Council of Agricultural Research (ICAR)",
      "B": "Council of Scientific and Industrial Research (CSIR)",
      "C": "Department of Space (ISRO)",
      "D": "Federation of Indian Chambers of Commerce"
    },
    "correctAnswer": "B",
    "explanation": "The Council of Scientific and Industrial Research (CSIR), headed by Dr. R. A. Mashelkar, contested the patent at the USPTO on grounds of lack of novelty.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 117
  },
  {
    "id": "m5_q15",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 15,
    "question": "How many ancient references in languages including Sanskrit, Urdu, and Hindi did CSIR produce to prove prior art in the Turmeric patent revocation?",
    "options": {
      "A": "Only 1 reference",
      "B": "5 references",
      "C": "32 references",
      "D": "500 references"
    },
    "correctAnswer": "C",
    "explanation": "After extensive research, CSIR unearthed a total of 32 historical published references in Sanskrit, Urdu, and Hindi establishing centuries-old traditional knowledge of turmeric for wound healing.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 117
  },
  {
    "id": "m5_q16",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 16,
    "question": "In the Neem patent dispute (Section 11.2), which multinational corporation and government department submitted the contested patent to the EPO?",
    "options": {
      "A": "Monsanto and UK Department of Trade",
      "B": "W.R. Grace and the Department of Agriculture of the USA (USDA)",
      "C": "Bayer and the French Ministry of Health",
      "D": "DuPont and Australian Agriculture Agency"
    },
    "correctAnswer": "B",
    "explanation": "The contested European patent for fungicidal effects of neem oil was submitted jointly by W.R. Grace and the United States Department of Agriculture (USDA).",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 118
  },
  {
    "id": "m5_q17",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 17,
    "question": "What is the key active compound found in Neem seeds highlighted in Section 11.2 of the textbook?",
    "options": {
      "A": "Curcumin",
      "B": "Azadirachtin",
      "C": "Quinine",
      "D": "Capsaicin"
    },
    "correctAnswer": "B",
    "explanation": "Neem tree seeds contain the powerful hydrophobic active compound azadirachtin, traditionally used for insecticidal and anti-fungal treatments.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 118
  },
  {
    "id": "m5_q18",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 18,
    "question": "Which environmental coalition successfully opposed and revoked the Neem patent at the European Patent Office (EPO)?",
    "options": {
      "A": "Greenpeace and WWF",
      "B": "RFSTE (Research Foundation for Science, Technology, and Ecology), IFOAM, and Magda Aelvoet (MEP)",
      "C": "United Nations Environmental Program (UNEP)",
      "D": "European Chemicals Agency"
    },
    "correctAnswer": "B",
    "explanation": "Opposition to the EPO patent was lodged by RFSTE (led by Dr. Vandana Shiva) alongside IFOAM and Magda Aelvoet, leading to the total invalidation of the patent by the EPO.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 118
  },
  {
    "id": "m5_q19",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 19,
    "question": "In the Basmati patent case (Section 11.3), which US company was granted a patent on Basmati rice lines in 1997?",
    "options": {
      "A": "Cargill Inc.",
      "B": "RiceTec Inc.",
      "C": "Uncle Ben's Rice",
      "D": "Pioneer Hi-Bred"
    },
    "correctAnswer": "B",
    "explanation": "In 1997, RiceTec Inc. was granted US Patent No. 5,663,484 on novel Basmati rice lines and grains, claiming characteristics resembling traditional Indian/Pakistani Basmati.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 119
  },
  {
    "id": "m5_q20",
    "moduleId": 5,
    "moduleTitle": "Module 5: Industrial Design; Geographical Indications; Case Studies on Patents",
    "questionNumber": 20,
    "question": "How did the Indian Government respond to RiceTec Inc.'s patent application containing twenty claims?",
    "options": {
      "A": "The Indian Government took no action at all",
      "B": "The Indian Government contested only three specific claims related to Basmati characteristics (starch index, aroma, and grain dimensions), resulting in RiceTec withdrawing or restricting the claims",
      "C": "The Indian Government purchased RiceTec for $1 billion",
      "D": "India filed a complaint in the International Criminal Court"
    },
    "correctAnswer": "B",
    "explanation": "The Indian Government strategically contested only 3 of the 20 claims (focused on traditional starch index, aroma, and grain dimensions), successfully forcing RiceTec to restrict its claims.",
    "chapterReference": "Chapter 11: Case Studies on Patents",
    "pageReference": 119
  }
];

