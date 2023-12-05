<script>
    import { onMount } from 'svelte';
    import { scholar_json } from "../support/store.js";
    import {findEdges } from "../support/findEdges.ts"
    import { scholar_json_edges } from "../support/store.js";

    let sample_edges = [
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "4d1bb76542a50a294f81037808af3ba6bb4a23aa"}, 
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "9011405b759b492b1132aea7b6165c9d1b0513e7"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "298af26244e3ad836c1aa5cf5855d05f5197063d"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "7550a05bf00f7b24aed9c1ac3ef000575388d21c"}, 
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "9c4da62e9e89e65ac78ee271e424e8b498053e8c"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "bcce96a2a074448953fc61a29a84afbdfc8db55a"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "6241276a3074f73c1ce9b9ce4ac69f748732aecd"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "7c7f1bb3d483df4c4a20b78a91b833f32d6bdcc5"},
  {"source": "391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b", "target": "b51a3a7d676df7947a0b28fb902a5a9f0bdf54ee"},
  
  {"source": "4d1bb76542a50a294f81037808af3ba6bb4a23aa", "target": "9011405b759b492b1132aea7b6165c9d1b0513e7"},  
  {"source": "4d1bb76542a50a294f81037808af3ba6bb4a23aa", "target": "7550a05bf00f7b24aed9c1ac3ef000575388d21c"},
  {"source": "4d1bb76542a50a294f81037808af3ba6bb4a23aa", "target": "9c4da62e9e89e65ac78ee271e424e8b498053e8c"},
  {"source": "4d1bb76542a50a294f81037808af3ba6bb4a23aa", "target": "bcce96a2a074448953fc61a29a84afbdfc8db55a"}, 
  {"source": "4d1bb76542a50a294f81037808af3ba6bb4a23aa", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"},
  
  {"source": "9011405b759b492b1132aea7b6165c9d1b0513e7", "target": "7550a05bf00f7b24aed9c1ac3ef000575388d21c"},
  {"source": "9011405b759b492b1132aea7b6165c9d1b0513e7", "target": "9c4da62e9e89e65ac78ee271e424e8b498053e8c"},
  {"source": "9011405b759b492b1132aea7b6165c9d1b0513e7", "target": "bcce96a2a074448953fc61a29a84afbdfc8db55a"},
  {"source": "9011405b759b492b1132aea7b6165c9d1b0513e7", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"},
  
  {"source": "298af26244e3ad836c1aa5cf5855d05f5197063d", "target": "7550a05bf00f7b24aed9c1ac3ef000575388d21c"},
  {"source": "298af26244e3ad836c1aa5cf5855d05f5197063d", "target": "9c4da62e9e89e65ac78ee271e424e8b498053e8c"},  
  {"source": "298af26244e3ad836c1aa5cf5855d05f5197063d", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"},
  
  {"source": "7550a05bf00f7b24aed9c1ac3ef000575388d21c", "target": "9c4da62e9e89e65ac78ee271e424e8b498053e8c"},
  {"source": "7550a05bf00f7b24aed9c1ac3ef000575388d21c", "target": "bcce96a2a074448953fc61a29a84afbdfc8db55a"},
  {"source": "7550a05bf00f7b24aed9c1ac3ef000575388d21c", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"}, 
  
  {"source": "9c4da62e9e89e65ac78ee271e424e8b498053e8c", "target": "bcce96a2a074448953fc61a29a84afbdfc8db55a"},
  {"source": "9c4da62e9e89e65ac78ee271e424e8b498053e8c", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"},

  {"source": "bcce96a2a074448953fc61a29a84afbdfc8db55a", "target": "7fc70d4cc5118fdbc8e8807979eae8b61948ff91"}
]
    // import {sample_date} from "../../static/paper_data.js"
    const sample_data = [
      {
      paperId: '391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b',
      url: 'https://www.semanticscholar.org/paper/391b86cf16c2702dcc4beee55a6dd6d3bd7cf27b',
      title: 'Deep Learning for Content-Based Image Retrieval: A Comprehensive Study',
      abstract: "Learning effective feature representations and similarity measures are crucial to the retrieval performance of a content-based image retrieval (CBIR) system. Despite extensive research efforts for decades, it remains one of the most challenging open problems that considerably hinders the successes of real-world CBIR systems. The key challenge has been attributed to the well-known ``semantic gap'' issue that exists between low-level image pixels captured by machines and high-level semantic concepts perceived by human. Among various techniques, machine learning has been actively investigated as a possible direction to bridge the semantic gap in the long term. Inspired by recent successes of deep learning techniques for computer vision and other applications, in this paper, we attempt to address an open problem: if deep learning is a hope for bridging the semantic gap in CBIR and how much improvements in CBIR tasks can be achieved by exploring the state-of-the-art deep learning techniques for learning feature representations and similarity measures. Specifically, we investigate a framework of deep learning with application to CBIR tasks with an extensive set of empirical studies by examining a state-of-the-art deep learning method (Convolutional Neural Networks) for CBIR tasks under varied settings. From our empirical studies, we find some encouraging results and summarize some important insights for future research.",
      year: 2014,
      citationCount: 832,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '4d1bb76542a50a294f81037808af3ba6bb4a23aa',
      url: 'https://www.semanticscholar.org/paper/4d1bb76542a50a294f81037808af3ba6bb4a23aa',
      title: 'Manifold Regularization: A Geometric Framework for Learning from Labeled and Unlabeled Examples',
      abstract: 'We propose a family of learning algorithms based on a new form of regularization that allows us to exploit the geometry of the marginal distribution. We focus on a semi-supervised framework that incorporates labeled and unlabeled data in a general-purpose learner. Some transductive graph learning algorithms and standard methods including support vector machines and regularized least squares can be obtained as special cases. We use properties of reproducing kernel Hilbert spaces to prove new Representer theorems that provide theoretical basis for the algorithms. As a result (in contrast to purely graph-based approaches) we obtain a natural out-of-sample extension to novel examples and so are able to handle both transductive and truly semi-supervised settings. We present experimental evidence suggesting that our semi-supervised algorithms are able to use unlabeled data effectively. Finally we have a brief discussion of unsupervised and fully supervised learning within our general framework.',
      year: 2006,
      citationCount: 3929,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '9011405b759b492b1132aea7b6165c9d1b0513e7',
      url: 'https://www.semanticscholar.org/paper/9011405b759b492b1132aea7b6165c9d1b0513e7',
      title: 'Reconciling schemas of disparate data sources: a machine-learning approach',
      abstract: 'A data-integration system provides access to a multitude of data sources through a single mediated schema. A key bottleneck in building such systems has been the laborious manual construction of semantic mappings between the source schemas and the mediated schema. We describe LSD, a system that employs and extends current machine-learning techniques to semi-automatically find such mappings. LSD first asks the user to provide the semantic mappings for a small set of data sources, then uses these mappings together with the sources to train a set of learners. Each learner exploits a different type of information either in the source schemas or in their data. Once the learners have been trained, LSD finds semantic mappings for a new data source by applying the learners, then combining their predictions using a meta-learner. To further improve matching accuracy, we extend machine learning techniques so that LSD can incorporate domain constraints as an additional source of knowledge, and develop a novel learner that utilizes the structural information in XML documents. Our approach thus is distinguished in that it incorporates multiple types of knowledge. Importantly, its architecture is extensible to additional learners that may exploit new kinds of information. We describe a set of experiments on several real-world domains, and show that LSD proposes semantic mappings with a high degree of accuracy.',
      year: 2001,
      citationCount: 898,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '298af26244e3ad836c1aa5cf5855d05f5197063d',
      url: 'https://www.semanticscholar.org/paper/298af26244e3ad836c1aa5cf5855d05f5197063d',
      title: 'Machine Learning Methods Without Tears: A Primer for Ecologists',
      abstract: 'Machine learning methods, a family of statistical techniques with origins in the field of artificial intelligence, are recognized as holding great promise for the advancement of understanding and prediction about ecological phenomena. These modeling techniques are flexible enough to handle complex problems with multiple interacting elements and typically outcompete traditional approaches (e.g., generalized linear models), making them ideal for modeling ecological systems. Despite their inherent advantages, a review of the literature reveals only a modest use of these approaches in ecology as compared to other disciplines. One potential explanation for this lack of interest is that machine learning techniques do not fall neatly into the class of statistical modeling approaches with which most ecologists are familiar. In this paper, we provide an introduction to three machine learning approaches that can be broadly used by ecologists: classification and regression trees, artificial neural networks, and evolutionary computation. For each approach, we provide a brief background to the methodology, give examples of its application in ecology, describe model development and implementation, discuss strengths and weaknesses, explore the availability of statistical software, and provide an illustrative example. Although the ecological application of machine learning approaches has increased, there remains considerable skepticism with respect to the role of these techniques in ecology. Our review encourages a greater understanding of machine learning approaches and promotes their future application and utilization, while also providing a basis from which ecologists can make informed decisions about whether to select or avoid these approaches in their future modeling endeavors.',
      year: 2008,
      citationCount: 600,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '7550a05bf00f7b24aed9c1ac3ef000575388d21c',
      url: 'https://www.semanticscholar.org/paper/7550a05bf00f7b24aed9c1ac3ef000575388d21c',
      title: 'Making large scale SVM learning practical',
      abstract: 'Training a support vector machine SVM leads to a quadratic optimization problem with bound constraints and one linear equality constraint. Despite the fact that this type of problem is well understood, there are many issues to be considered in designing an SVM learner. In particular, for large learning tasks with many training examples on the shelf optimization techniques for general quadratic programs quickly become intractable in their memory and time requirements. SVM light is an implementation of an SVM learner which addresses the problem of large tasks. This chapter presents algorithmic and computational results developed for SVM light V 2.0, which make large-scale SVM training more practical. The results give guidelines for the application of SVMs to large domains.',
      year: 1998,
      citationCount: 5473,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '9c4da62e9e89e65ac78ee271e424e8b498053e8c',
      url: 'https://www.semanticscholar.org/paper/9c4da62e9e89e65ac78ee271e424e8b498053e8c',
      title: 'Advances in kernel methods: support vector learning',
      abstract: 'Introduction to support vector learning roadmap. Part 1 Theory: three remarks on the support vector method of function estimation, Vladimir Vapnik generalization performance of support vector machines and other pattern classifiers, Peter Bartlett and John Shawe-Taylor Bayesian voting schemes and large margin classifiers, Nello Cristianini and John Shawe-Taylor support vector machines, reproducing kernel Hilbert spaces, and randomized GACV, Grace Wahba geometry and invariance in kernel based methods, Christopher J.C. Burges on the annealed VC entropy for margin classifiers - a statistical mechanics study, Manfred Opper entropy numbers, operators and support vector kernels, Robert C. Williamson et al. Part 2 Implementations: solving the quadratic programming problem arising in support vector classification, Linda Kaufman making large-scale support vector machine learning practical, Thorsten Joachims fast training of support vector machines using sequential minimal optimization, John C. Platt. Part 3 Applications: support vector machines for dynamic reconstruction of a chaotic system, Davide Mattera and Simon Haykin using support vector machines for time series prediction, Klaus-Robert Muller et al pairwise classification and support vector machines, Ulrich Kressel. Part 4 Extensions of the algorithm: reducing the run-time complexity in support vector machines, Edgar E. Osuna and Federico Girosi support vector regression with ANOVA decomposition kernels, Mark O. Stitson et al support vector density estimation, Jason Weston et al combining support vector and mathematical programming methods for classification, Bernhard Scholkopf et al.',
      year: 1999,
      citationCount: 5200,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'bcce96a2a074448953fc61a29a84afbdfc8db55a',
      url: 'https://www.semanticscholar.org/paper/bcce96a2a074448953fc61a29a84afbdfc8db55a',
      title: 'Online Learning and Online Convex Optimization',
      abstract: 'Online learning is a well established learning paradigm which has both theoretical and practical appeals. The goal of online learning is to make a sequence of accurate predictions given knowledge of the correct answer to previous prediction tasks and possibly additional available information. Online learning has been studied in several research fields including game theory, information theory, and machine learning. It also became of great interest to practitioners due the recent emergence of large scale applications such as online advertisement placement and online web ranking. In this survey we provide a modern overview of online learning. Our goal is to give the reader a sense of some of the interesting ideas and in particular to underscore the centrality of convexity in deriving efficient online learning algorithms. We do not mean to be comprehensive but rather to give a high-level, rigorous yet easy to follow, survey.',
      year: 2012,
      citationCount: 1931,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '6241276a3074f73c1ce9b9ce4ac69f748732aecd',
      url: 'https://www.semanticscholar.org/paper/6241276a3074f73c1ce9b9ce4ac69f748732aecd',
      title: 'Data Mining and Machine Learning in Astronomy',
      abstract: "We review the current state of data mining and machine learning in astronomy. 'Data Mining' can have a somewhat mixed connotation from the point of view of a researcher in this field. If used correctly, it can be a powerful approach, holding the potential to fully exploit the exponentially increasing amount of available data, promising great scientific advance. However, if misused, it can be little more than the black-box application of complex computing algorithms that may give little physical insight, and provide questionable results. Here, we give an overview of the entire data mining process, from data collection through to the interpretation of results. We cover common machine learning algorithms, such as artificial neural networks and support vector machines, applications from a broad range of astronomy, emphasizing those where data mining techniques directly resulted in improved science, and important current and future directions, including probability density functions, parallel algorithms, petascale computing, and the time domain. We conclude that, so long as one carefully selects an appropriate algorithm, and is guided by the astronomical problem at hand, data mining can be very much the powerful tool, and not the questionable black box.",
      year: 2009,
      citationCount: 273,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '7fc70d4cc5118fdbc8e8807979eae8b61948ff91',
      url: 'https://www.semanticscholar.org/paper/7fc70d4cc5118fdbc8e8807979eae8b61948ff91',
      title: 'The elements of statistical learning: data mining, inference and prediction',
      abstract: null,
      year: 2005,
      citationCount: 3277,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '7c7f1bb3d483df4c4a20b78a91b833f32d6bdcc5',
      url: 'https://www.semanticscholar.org/paper/7c7f1bb3d483df4c4a20b78a91b833f32d6bdcc5',
      title: 'Machine learning in virtual screening.',
      abstract: 'In this review, we highlight recent applications of machine learning to virtual screening, focusing on the use of supervised techniques to train statistical learning algorithms to prioritize databases of molecules as active against a particular protein target. Both ligand-based similarity searching and structure-based docking have benefited from machine learning algorithms, including naïve Bayesian classifiers, support vector machines, neural networks, and decision trees, as well as more traditional regression techniques. Effective application of these methodologies requires an appreciation of data preparation, validation, optimization, and search methodologies, and we also survey developments in these areas.',
      year: 2009,
      citationCount: 169,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'b51a3a7d676df7947a0b28fb902a5a9f0bdf54ee',
      url: 'https://www.semanticscholar.org/paper/b51a3a7d676df7947a0b28fb902a5a9f0bdf54ee',
      title: 'IAM Graph Database Repository for Graph Based Pattern Recognition and Machine Learning',
      abstract: null,
      year: 2008,
      citationCount: 490,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '302d64cebed714f453c6a1e63effb6fe884a7e80',
      url: 'https://www.semanticscholar.org/paper/302d64cebed714f453c6a1e63effb6fe884a7e80',
      title: 'Java-ML: A Machine Learning Library',
      abstract: 'Java-ML is a collection of machine learning and data mining algorithms, which aims to be a readily usable and easily extensible API for both software developers and research scientists. The interfaces for each type of algorithm are kept simple and algorithms strictly follow their respective interface. Comparing different classifiers or clustering algorithms is therefore straightforward, and implementing new algorithms is also easy. The implementations of the algorithms are clearly written, properly documented and can thus be used as a reference. The library is written in Java and is available from http://java-ml.sourceforge.net/ under the GNU GPL license.',
      year: 2009,
      citationCount: 130,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '22feb6532228392457664becc48b3096d9858505',
      url: 'https://www.semanticscholar.org/paper/22feb6532228392457664becc48b3096d9858505',
      title: 'Asymptotic Equivalence of Bayes Cross Validation and Widely Applicable Information Criterion in Singular Learning Theory',
      abstract: 'In regular statistical models, the leave-one-out cross-validation is asymptotically equivalent to the Akaike information criterion. However, since many learning machines are singular statistical models, the asymptotic behavior of the cross-validation remains unknown. In previous studies, we established the singular learning theory and proposed a widely applicable information criterion, the expectation value of which is asymptotically equal to the average Bayes generalization loss. In the present paper, we theoretically compare the Bayes cross-validation loss and the widely applicable information criterion and prove two theorems. First, the Bayes cross-validation loss is asymptotically equivalent to the widely applicable information criterion as a random variable. Therefore, model selection and hyperparameter optimization using these two values are asymptotically equivalent. Second, the sum of the Bayes generalization error and the Bayes cross-validation error is asymptotically equal to 2λ/n, where λ is the real log canonical threshold and n is the number of training samples. Therefore the relation between the cross-validation error and the generalization error is determined by the algebraic geometrical structure of a learning machine. We also clarify that the deviance information criteria are different from the Bayes cross-validation and the widely applicable information criterion.',
      year: 2010,
      citationCount: 2033,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'eb0c1e3d880e361b7ff61e5ac1d489cb75c55ece',
      url: 'https://www.semanticscholar.org/paper/eb0c1e3d880e361b7ff61e5ac1d489cb75c55ece',
      title: 'Adaptive computation and machine learning',
      abstract: 'A complete list of books published in The Adaptive Computation and Machine Learning series appears at the back of this book.',
      year: 1998,
      citationCount: 942,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '9512facd37bba2ff1ece31900c08901bb011f1ce',
      url: 'https://www.semanticscholar.org/paper/9512facd37bba2ff1ece31900c08901bb011f1ce',
      title: 'Using Machine Teaching to Identify Optimal Training-Set Attacks on Machine Learners',
      abstract: '\n' +
        ' \n' +
        ' We investigate a problem at the intersection of machine learning and security: training-set attacks on machine learners. In such attacks an attacker contaminates the training data so that a specific learning algorithm would produce a model profitable to the attacker. Understanding training-set attacks is important as more intelligent agents (e.g. spam filters and robots) are equipped with learning capability and can potentially be hacked via data they receive from the environment. This paper identifies the optimal training-set attack on a broad family of machine learners. First we show that optimal training-set attack can be formulated as a bilevel optimization problem. Then we show that for machine learners with certain Karush-Kuhn-Tucker conditions we can solve the bilevel problem efficiently using gradient methods on an implicit function. As examples, we demonstrate optimal training-set attacks on Support VectorMachines, logistic regression, and linear regression with extensive experiments. Finally, we discuss potential defenses against such attacks.\n' +
        ' \n',
      year: 2015,
      citationCount: 361,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '664b701a39371c5356754dc72cea1349233c8506',
      url: 'https://www.semanticscholar.org/paper/664b701a39371c5356754dc72cea1349233c8506',
      title: 'Computer Systems That Learn: Classification and Prediction Methods from Statistics, Neural Nets, Machine Learning and Expert Systems',
      abstract: "Preface 1 Overview of Learning Systems 1.1 What is a Learning System? 1.2 Motivation for Building Learning Systems 1.3 Types of Practical Empirical Learning Systems 1.3.1 Common Theme: The Classification Model 1.3.2 Let the Data Speak 1.4 What's New in Learning Methods 1.4.1 The Impact of New Technology 1.5 Outline of the Book 1.6 Bibliographical and Historical Remarks 2 How to Estimate the True Performance of a Learning System 2.1 The Importance of Unbiased Error Rate Estimation 2.2. What is an Error? 2.2.1 Costs and Risks 2.3 Apparent Error Rate Estimates 2.4 Too Good to Be True: Overspecialization 2.5 True Error Rate Estimation 2.5.1 The Idealized Model for Unlimited Samples 2.5.2 Train-and Test Error Rate Estimation 2.5.3 Resampling Techniques 2.5.4 Finding the Right Complexity Fit 2.6 Getting the Most Out of the Data 2.7 Classifier Complexity and Feature Dimensionality 2.7.1 Expected Patterns of Classifier Behavior 2.8 What Can Go Wrong? 2.8.1 Poor Features, Data Errors, and Mislabeled Classes 2.8.2 Unrepresentative Samples 2.9 How Close to the Truth? 2.10 Common Mistakes in Performance Analysis 2.11 Bibliographical and Historical Remarks 3 Statistical Pattern Recognition 3.1 Introduction and Overview 3.2 A Few Sample Applications 3.3 Bayesian Classifiers 3.3.1 Direct Application of the Bayes Rule 3.4 Linear Discriminants 3.4.1 The Normality Assumption and Discriminant Functions 3.4.2 Logistic Regression 3.5 Nearest Neighbor Methods 3.6 Feature Selection 3.7 Error Rate Analysis 3.8 Bibliographical and Historical Remarks 4 Neural Nets 4.1 Introduction and Overview 4.2 Perceptrons 4.2.1 Least Mean Square Learning Systems 4.2.2 How Good Is a Linear Separation Network? 4.3 Multilayer Neural Networks 4.3.1 Back-Propagation 4.3.2 The Practical Application of Back-Propagation 4.4 Error Rate and Complexity Fit Estimation 4.5 Improving on Standard Back-Propagation 4.6 Bibliographical and Historical Remarks 5 Machine Learning: Easily Understood Decision Rules 5.1 Introduction and Overview 5.2 Decision Trees 5.2.1 Finding the Perfect Tree 5.2.2 The Incredible Shrinking Tree 5.2.3 Limitations of Tree Induction Methods 5.3 Rule Induction 5.3.1 Predictive Value Maximization 5.4 Bibliographical and Historical Remarks 6 Which Technique is Best? 6.1 What's Important in Choosing a Classifier? 6.1.1 Prediction Accuracy 6.1.2 Speed of Learning and Classification 6.1.3 Explanation and Insight 6.2 So, How Do I Choose a Learning System? 6.3 Variations on the Standard Problem 6.3.1 Missing Data 6.3.2 Incremental Learning 6.4 Future Prospects for Improved Learning Methods 6.5 Bibliographical and Historical Remarks 7 Expert Systems 7.1 Introduction and Overview 7.1.1 Why Build Expert Systems? New vs. Old Knowledge 7.2 Estimating Error Rates for Expert Systems 7.3 Complexity of Knowledge Bases 7.3.1 How Many Rules Are Too Many? 7.4 Knowledge Base Example 7.5 Empirical Analysis of Knowledge Bases 7.6 Future: Combined Learning and Expert Systems 7.7 Bibliographical and Historical Remarks References Author Index Subject Index",
      year: 1990,
      citationCount: 1050,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '1f135e98e867ffcde5b359e7b817bbe21f80cfce',
      url: 'https://www.semanticscholar.org/paper/1f135e98e867ffcde5b359e7b817bbe21f80cfce',
      title: 'Deep Learning and Its Application to LHC Physics',
      abstract: 'Machine learning has played an important role in the analysis of high-energy physics data for decades. The emergence of deep learning in 2012 allowed for machine learning tools which could adeptly handle higher-dimensional and more complex problems than previously feasible. This review is aimed at the reader who is familiar with high-energy physics but not machine learning. The connections between machine learning and high-energy physics data analysis are explored, followed by an introduction to the core concepts of neural networks, examples of the key results demonstrating the power of deep learning for analysis of LHC data, and discussion of future prospects and concerns.',
      year: 2018,
      citationCount: 306,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '70bcdbac2c70c9f107123262cf5257b57839f708',
      url: 'https://www.semanticscholar.org/paper/70bcdbac2c70c9f107123262cf5257b57839f708',
      title: 'Machine Learning',
      abstract: null,
      year: 2010,
      citationCount: 17,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'c0927ffb79810318daab8821068629975cab67ad',
      url: 'https://www.semanticscholar.org/paper/c0927ffb79810318daab8821068629975cab67ad',
      title: 'Deep Learning for Classification of Malware System Call Sequences',
      abstract: null,
      year: 2016,
      citationCount: 420,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'ccd1282aea3cc7c3d40300d82472fc5f9f54cb8e',
      url: 'https://www.semanticscholar.org/paper/ccd1282aea3cc7c3d40300d82472fc5f9f54cb8e',
      title: 'Online Learning for Matrix Factorization and Sparse Coding',
      abstract: 'Sparse coding--that is, modelling data vectors as sparse linear combinations of basis elements--is widely used in machine learning, neuroscience, signal processing, and statistics. This paper focuses on the large-scale matrix factorization problem that consists of learning the basis set in order to adapt it to specific data. Variations of this problem include dictionary learning in signal processing, non-negative matrix factorization and sparse principal component analysis. In this paper, we propose to address these tasks with a new online optimization algorithm, based on stochastic approximations, which scales up gracefully to large data sets with millions of training samples, and extends naturally to various matrix factorization formulations, making it suitable for a wide range of learning problems. A proof of convergence is presented, along with experiments with natural images and genomic data demonstrating that it leads to state-of-the-art performance in terms of speed and optimization for both small and large data sets.',
      year: 2009,
      citationCount: 2555,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '464ebd4c86542e1610d67a9bc8810b8a7c109efe',
      url: 'https://www.semanticscholar.org/paper/464ebd4c86542e1610d67a9bc8810b8a7c109efe',
      title: 'Convex Incremental Extreme Learning Machine',
      abstract: "Unlike the conventional neural network theories and implementations, Huang et al. [Universal approximation using incremental constructive feedforward networks with random hidden nodes, IEEE Transactions on Neural Networks 17(4) (2006) 879–892] have recently proposed a new theory to show that single-hidden-layer feedforward networks (SLFNs) with randomly generated additive or radial basis function (RBF) hidden nodes (according to any continuous sampling distribution) can work as universal approximators and the resulting incremental extreme learning machine (I-ELM) outperforms many popular learning algorithms. I-ELM randomly generates the hidden nodes and analytically calculates the output weights of SLFNs, however, I-ELM does not recalculate the output weights of all the existing nodes when a new node is added. This paper shows that while retaining the same simplicity, the convergence rate of I-ELM can be further improved by recalculating the output weights of the existing nodes based on a convex optimization method when a new hidden node is randomly added. Furthermore, we show that given a type of piecewise continuous computational hidden nodes (possibly not neural alike nodes), if SLFNs f n ðxÞ ¼ P n i¼1 b i Gðx; a i ; b i Þ can work as universal approximators with adjustable hidden node parameters, from a function approximation point of view the hidden node parameters of such ''generalized'' SLFNs (including sigmoid networks, RBF networks, trigonometric networks, threshold networks, fuzzy inference systems, fully complex neural networks, high-order networks, ridge polynomial networks, wavelet networks, etc.) can actually be randomly generated according to any continuous sampling distribution. In theory, the parameters of these SLFNs can be analytically determined by ELM instead of being tuned.",
      year: 2007,
      citationCount: 1044,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'c9d60858f1cbe6b7eb36473b7d37ff4b73c31af8',
      url: 'https://www.semanticscholar.org/paper/c9d60858f1cbe6b7eb36473b7d37ff4b73c31af8',
      title: 'Machine Learning from Imbalanced Data Sets 101',
      abstract: 'For research to progress most effectively, we first should establish common ground regarding just what is the problem that imbalanced data sets present to machine learning systems. Why and when should imbalanced data sets be problematic? When is the problem simply an artifact of easily rectified design choices? I will try to pick the low-hanging fruit and share them with the rest of the workshop participants. Specifically, I would like to discuss what the problem is not. I hope this will lead to a profitable discussion of what the problem indeed is, and how it might be addressed most effectively.',
      year: 2008,
      citationCount: 454,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '83cf4b2f39bcc802b09fd59b69e23068447b26b7',
      url: 'https://www.semanticscholar.org/paper/83cf4b2f39bcc802b09fd59b69e23068447b26b7',
      title: 'Multi-Task Learning for Multiple Language Translation',
      abstract: 'In this paper, we investigate the problem of learning a machine translation model that can simultaneously translate sentences from one source language to multiple target languages. Our solution is inspired by the recently proposed neural machine translation model which generalizes machine translation as a sequence learning problem. We extend the neural machine translation to a multi-task learning framework which shares source language representation and separates the modeling of different target language translation. Our framework can be applied to situations where either large amounts of parallel data or limited parallel data is available. Experiments show that our multi-task learning model is able to achieve significantly higher translation quality over individually learned model in both situations on the data sets publicly available.',
      year: 2015,
      citationCount: 568,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '50feafd2cdafdfb1eead14388f6210f6b467eaa0',
      url: 'https://www.semanticscholar.org/paper/50feafd2cdafdfb1eead14388f6210f6b467eaa0',
      title: 'Pareto-Based Multiobjective Machine Learning: An Overview and Case Studies',
      abstract: 'Machine learning is inherently a multiobjective task. Traditionally, however, either only one of the objectives is adopted as the cost function or multiple objectives are aggregated to a scalar cost function. This can be mainly attributed to the fact that most conventional learning algorithms can only deal with a scalar cost function. Over the last decade, efforts on solving machine learning problems using the Pareto-based multiobjective optimization methodology have gained increasing impetus, particularly due to the great success of multiobjective optimization using evolutionary algorithms and other population-based stochastic search methods. It has been shown that Pareto-based multiobjective learning approaches are more powerful compared to learning algorithms with a scalar cost function in addressing various topics of machine learning, such as clustering, feature selection, improvement of generalization ability, knowledge extraction, and ensemble generation. One common benefit of the different multiobjective learning approaches is that a deeper insight into the learning problem can be gained by analyzing the Pareto front composed of multiple Pareto-optimal solutions. This paper provides an overview of the existing research on multiobjective machine learning, focusing on supervised learning. In addition, a number of case studies are provided to illustrate the major benefits of the Pareto-based approach to machine learning, e.g., how to identify interpretable models and models that can generalize on unseen data from the obtained Pareto-optimal solutions. Three approaches to Pareto-based multiobjective ensemble generation are compared and discussed in detail. Finally, potentially interesting topics in multiobjective machine learning are suggested.',
      year: 2008,
      citationCount: 383,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '4417f78b31546227784941bbd6f6532a177e60b8',
      url: 'https://www.semanticscholar.org/paper/4417f78b31546227784941bbd6f6532a177e60b8',
      title: 'Deep Learning using Linear Support Vector Machines',
      abstract: `Recently, fully-connected and convolutional neural networks have been trained to achieve state-of-the-art performance on a wide variety of tasks such as speech recognition, image classification, natural language processing, and bioinformatics. For classification tasks, most of these "deep learning" models employ the softmax activation function for prediction and minimize cross-entropy loss. In this paper, we demonstrate a small but consistent advantage of replacing the softmax layer with a linear support vector machine. Learning minimizes a margin-based loss instead of the cross-entropy loss. While there have been various combinations of neural nets and SVMs in prior art, our results using L2-SVMs show that by simply replacing softmax with linear SVMs gives significant gains on popular deep learning datasets MNIST, CIFAR-10, and the ICML 2013 Representation Learning Workshop's face expression recognition challenge.`,
      year: 2013,
      citationCount: 803,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'cf80cc34528273d8fbe17783efe802a6509e1562',
      url: 'https://www.semanticscholar.org/paper/cf80cc34528273d8fbe17783efe802a6509e1562',
      title: 'Online dictionary learning for sparse coding',
      abstract: 'Sparse coding---that is, modelling data vectors as sparse linear combinations of basis elements---is widely used in machine learning, neuroscience, signal processing, and statistics. This paper focuses on learning the basis set, also called dictionary, to adapt it to specific data, an approach that has recently proven to be very effective for signal reconstruction and classification in the audio and image processing domains. This paper proposes a new online optimization algorithm for dictionary learning, based on stochastic approximations, which scales up gracefully to large datasets with millions of training samples. A proof of convergence is presented, along with experiments with natural images demonstrating that it leads to faster performance and better dictionaries than classical batch algorithms for both small and large datasets.',
      year: 2009,
      citationCount: 2245,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '43456f4e5f2a7c56b781afe2e2d4e4aed297ceb0',
      url: 'https://www.semanticscholar.org/paper/43456f4e5f2a7c56b781afe2e2d4e4aed297ceb0',
      title: 'Bayesian Inference: An Introduction to Principles and Practice in Machine Learning',
      abstract: null,
      year: 2003,
      citationCount: 276,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'b379c5eb2f8cc501e855d295fa5712294ca2b3ed',
      url: 'https://www.semanticscholar.org/paper/b379c5eb2f8cc501e855d295fa5712294ca2b3ed',
      title: 'Application of Machine Learning Algorithms to KDD Intrusion Detection Dataset within Misuse Detection Context',
      abstract: 'A small subset of machine learning algorithms, mostly inductive learning based, applied to the KDD 1999 Cup intrusion detection dataset resulted in dismal performance for user-to-root and remote-to-local attack categories as reported in the recent literature. The uncertainty to explore if other machine learning algorithms can demonstrate better performance compared to the ones already employed constitutes the motivation for the study reported herein. Specifically, exploration of if certain algorithms perform better for certain attack classes and consequently, if a multi-expert classifier design can deliver desired performance measure is of high interest. This paper evaluates performance of a comprehensive set of pattern recognition and machine learning algorithms on four attack categories as found in the KDD 1999 Cup intrusion detection dataset. Results of simulation study implemented to that effect indicated that certain classification algorithms perform better for certain attack categories: a specific algorithm specialized for a given attack category . Consequently, a multi-classifier model, where a specific detection algorithm is associated with an attack category for which it is the most promising, was built. Empirical results obtained through simulation indicate that noticeable performance improvement was achieved for probing, denial of service, and user-to-root',
      year: 2003,
      citationCount: 316,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '3efcb97c1de1c87832a7a1d99e91801992a938ec',
      url: 'https://www.semanticscholar.org/paper/3efcb97c1de1c87832a7a1d99e91801992a938ec',
      title: 'Crafting Papers on Machine Learning',
      abstract: "This essay gives advice to authors of papers on machine learning, although much of it car-ries over to other computational disciplines. The issues covered include the material that should appear in a well-balanced paper, factors that arise in di(cid:11)erent approaches to evaluation, and ways to improve a submission's ability to communicate ideas to its readers.",
      year: 2000,
      citationCount: 334,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '1bf05a4ad4b6dd4b6d14d6d2dc7a9354dd1f4425',
      url: 'https://www.semanticscholar.org/paper/1bf05a4ad4b6dd4b6d14d6d2dc7a9354dd1f4425',
      title: 'A Machine Learning Approach to Workflow Management',
      abstract: null,
      year: 2000,
      citationCount: 233,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '3ecdaaa55313520b50ae17de9f4f6650403754a3',
      url: 'https://www.semanticscholar.org/paper/3ecdaaa55313520b50ae17de9f4f6650403754a3',
      title: 'Book Review: C4.5: Programs for Machine Learning by J. Ross Quinlan. Morgan Kaufmann Publishers, Inc., 1993',
      abstract: null,
      year: 1994,
      citationCount: 312,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'b9af24fa3faf6dbdc5e952857697588708fad8f5',
      url: 'https://www.semanticscholar.org/paper/b9af24fa3faf6dbdc5e952857697588708fad8f5',
      title: "Guest Editors' Introduction: On Applied Research in Machine Learning",
      abstract: null,
      year: 1998,
      citationCount: 298,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '1f7ed2ebc6b641e3804cf177fd42a1b8de95003b',
      url: 'https://www.semanticscholar.org/paper/1f7ed2ebc6b641e3804cf177fd42a1b8de95003b',
      title: 'Machine-learning techniques and their applications in manufacturing',
      abstract: 'Abstract Machine learning is concerned with enabling computer programs automatically to improve their performance at some tasks through experience. Manufacturing is an area where the application of machine learning can be very fruitful. However, little has been published about the use of machine-learning techniques in the manufacturing domain. This paper evaluates several machine-learning techniques and examines applications in which they have been successfully deployed. Special attention is given to inductive learning, which is among the most mature of the machine-learning approaches currently available. Current trends and recent developments in machine-learning research are also discussed. The paper concludes with a summary of some of the key research issues in machine learning.',
      year: 2005,
      citationCount: 117,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'f4971ff0f6ae626e78131bafa012eadfe8e238e2',
      url: 'https://www.semanticscholar.org/paper/f4971ff0f6ae626e78131bafa012eadfe8e238e2',
      title: 'Machine learning: an artificial intelligence approach volume III',
      abstract: 'This book reflects the expansion of machine learning research through presentation of recent advances in the field. The book provides an account of current research directions. Major topics covered include the following: learning concepts and rules from examples; cognitive aspects of learning; learning by analogy; learning by observation and discovery; and an exploration of general aspects of learning.',
      year: 1990,
      citationCount: 307,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'c5ca3b6ad0e74ab8a83d77ebef0c5a498ba5d781',
      url: 'https://www.semanticscholar.org/paper/c5ca3b6ad0e74ab8a83d77ebef0c5a498ba5d781',
      title: 'On-line Algorithms in Machine Learning',
      abstract: null,
      year: 1996,
      citationCount: 250,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '180882b3f2ea5dfe0a554deead2c0ceb837ee933',
      url: 'https://www.semanticscholar.org/paper/180882b3f2ea5dfe0a554deead2c0ceb837ee933',
      title: 'Machine learning as an experimental science',
      abstract: null,
      year: 2004,
      citationCount: 127,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'a54657b8de38a18f30fd154d713f9522f705166c',
      url: 'https://www.semanticscholar.org/paper/a54657b8de38a18f30fd154d713f9522f705166c',
      title: 'Computational complexity of machine learning',
      abstract: 'This thesis is a study of the computational complexity of machine learning from examples in the distribution-free model introduced by L. G. Valiant (V84). In the distribution-free model, a learning algorithm receives positive and negative examples of an unknown target set (or concept) that is chosen from some known class of sets (or concept class). These examples are generated randomly according to a fixed but unknown probability distribution representing Nature, and the goal of the learning algorithm is to infer an hypothesis concept that closely approximates the target concept with respect to the unknown distribution. This thesis is concerned with proving theorems about learning in this formal mathematical model. \n' +
        'We are interested in the phenomenon of efficient learning in the distribution-free model, in the standard polynomial-time sense. Our results include general tools for determining the polynomial-time learnability of a concept class, an extensive study of efficient learning when errors are present in the examples, and lower bounds on the number of examples required for learning in our model. A centerpiece of the thesis is a series of results demonstrating the computational difficulty of learning a number of well-studied concept classes. These results are obtained by reducing some apparently hard number-theoretic problems from cryptography to the learning problems. The hard-to-learn concept classes include the sets represented by Boolean formulae, deterministic finite automata and a simplified form of neural networks. We also give algorithms for learning powerful concept classes under the uniform distribution, and give equivalences between natural models of efficient learnability. \n' +
        'This thesis also includes detailed definitions and motivation for the distribution-free model, a chapter discussing past research in this model and related models, and a short list of important open problems.',
      year: 1990,
      citationCount: 252,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '5052871d430b803b4c59f459bb26b1f76e56736e',
      url: 'https://www.semanticscholar.org/paper/5052871d430b803b4c59f459bb26b1f76e56736e',
      title: 'Evaluation and selection of biases in machine learning',
      abstract: null,
      year: 1995,
      citationCount: 118,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'bd71831c69191c26a2a091f35509b1a80a4b1b64',
      url: 'https://www.semanticscholar.org/paper/bd71831c69191c26a2a091f35509b1a80a4b1b64',
      title: 'Reliable Classifications with Machine Learning',
      abstract: null,
      year: 2002,
      citationCount: 85,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '45d10fdf27a011beb82a36b944c3925ea83ee7a3',
      url: 'https://www.semanticscholar.org/paper/45d10fdf27a011beb82a36b944c3925ea83ee7a3',
      title: 'Machine Learning by Function Decomposition',
      abstract: 'We present a new machine learning method that, given a set of training examples, induces a definition of the target concept in terms of a hierarchy of intermediate concepts and their definitions. This effectively decomposes the problem into smaller, less complex problems. The method is inspired by the Boolean function decomposition approach to the design of digital circuits. To cope with high time complexity of finding an optimal decomposition, we propose a suboptimal heuristic algorithm. The method, implemented in program HINT (HIerarchy Induction Tool), is experimentally evaluated using a set of artificial and real-world learning problems. It is shown that the method performs well both in terms of classification accuracy and discovery of meaningful concept hierarchies.',
      year: 1997,
      citationCount: 79,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'd1e5263787d888da20a28254fd7bd581618e3a06',
      url: 'https://www.semanticscholar.org/paper/d1e5263787d888da20a28254fd7bd581618e3a06',
      title: 'An Overview of Machine Learning',
      abstract: null,
      year: 1983,
      citationCount: 268,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'e9415d9a6e0065b46acd99ba4ff8b89bd1435fc8',
      url: 'https://www.semanticscholar.org/paper/e9415d9a6e0065b46acd99ba4ff8b89bd1435fc8',
      title: 'Machine Learning and Software Engineering',
      abstract: null,
      year: 2002,
      citationCount: 187,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '14f2b886678251cdd80dc9701c889bc55de7940d',
      url: 'https://www.semanticscholar.org/paper/14f2b886678251cdd80dc9701c889bc55de7940d',
      title: 'Student Modeling and Machine Learning',
      abstract: 'After identifying essential student modeling issues and machine learning approaches, this paper examines how machine learning techniques have been used to automate the construction of student models as well as the background knowledge necessary for student modeling. In the process, the paper sheds light on the difficulty, suitability and potential of using machine learning for student modeling processes, and, to a lesser extent, the potential of using student modeling techniques in machine learning. (http://aied.inf.ed.ac.uk/members98/archive/vol_9/sison/full.html)',
      year: 1998,
      citationCount: 170,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '9820a5eeada755155f246f26ea0959e0d50dd57b',
      url: 'https://www.semanticscholar.org/paper/9820a5eeada755155f246f26ea0959e0d50dd57b',
      title: 'A review of machine learning in scheduling',
      abstract: 'This paper has two primary purposes: to motivate the need for machine learning in scheduling systems and to survey work on machine learning in scheduling. In order to motivate the need for machine learning in scheduling, we briefly motivate the need for systems employing artificial intelligence methods for scheduling. This leads to a need for incorporating adaptive methods-learning. >',
      year: 1994,
      citationCount: 146,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '65df2d9b3c656ca85e4d66c327cfd8c8d1182df3',
      url: 'https://www.semanticscholar.org/paper/65df2d9b3c656ca85e4d66c327cfd8c8d1182df3',
      title: 'Machine Learning: Neural Networks, Genetic Algorithms, and Fuzzy Systems',
      abstract: 'Perceptron Learning with a Hidden Layer An Object-Oriented Backpropagation Learning Model Concurrent Backpropagation Learning Algorithms An Adaptive Conjugate Gradient Learning Algorithm for Efficient Training of Neural Networks A Concurrent Adaptive Conjugate Gradient Learning Algorithm on MIMD Shared Memory Machines A Concurrent Genetic/Neural Network Learning Algorithm for MIMD Shared Memory Machines A Hybrid Learning Algorithm for Distributed Memory Multicomputers A Fuzzy Neural Network Learning Model Appendices References Index.',
      year: 1994,
      citationCount: 493,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '9a4da6802d1eca17a07ded017a87bef7001189c4',
      url: 'https://www.semanticscholar.org/paper/9a4da6802d1eca17a07ded017a87bef7001189c4',
      title: 'Introduction to Machine Learning (Adaptive Computation and Machine Learning)',
      abstract: null,
      year: 2004,
      citationCount: 368,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '22faafeba7d7443da14c1e23e549b94e40d7d6ee',
      url: 'https://www.semanticscholar.org/paper/22faafeba7d7443da14c1e23e549b94e40d7d6ee',
      title: '“Memo” Functions and Machine Learning',
      abstract: null,
      year: 1968,
      citationCount: 532,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '72282cfbb493c487f9f43a6270b5bd9d94b57d94',
      url: 'https://www.semanticscholar.org/paper/72282cfbb493c487f9f43a6270b5bd9d94b57d94',
      title: 'Machine Learning: ECML-98',
      abstract: null,
      year: 1998,
      citationCount: 388,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '298a09325dce98155779f9640ccae8fa5ddca62d',
      url: 'https://www.semanticscholar.org/paper/298a09325dce98155779f9640ccae8fa5ddca62d',
      title: 'Machine-Learning Applications of Algorithmic Randomness',
      abstract: "Machine-LearningApplicationsofAlgorithmicRandomnessVolodyaovk,AlexGammerman,CraigSaundersComputerLearningResearchCentreandDepartmentofScienceRoyalHollowa,UniversitofLondon,Egham,SurreyTW200EX,Englandfvovk,alex,craigg@dcs.rhbnc.ac.ukAbstractMostmachinelearningalgorithmssharethefollowingdrawback:theyonlyoutputbarepredictionsbutnotthecon denceinthosepredictions.Inthe1960salgorithmicinfor-mationtheorysupplieduniversalmeasuresofcon dencebuttheseare,unfortunately,non-computable.Inthispap erwecombinetheideasofalgorithmicinformationtheorywiththetheoryofSupp ortVectormachinestoobtainpracticableapproximationsuni-versalmeasuresofcon dence.Weshowthatinsomestandardproblemsofpatternrecog-nitionourapproximationsworkell.1INTRODUCTIONTwoimp ortantdi erencesofmostmo dernmetho dsmachinelearning(suchasstatisticaltheory,seeVapnik[21],1998,orPACtheory)fromclassicalstatisticalmetho dsarethat:\x0Fmachinelearningmetho dspro ducebarepredic-tions,withoutestimatingcon denceinthosepre-dictions(unlike,eg,predictionoffutureobser-vationsintraditionalstatistics(Guttman[5],1970));\x0Fmanymachinelearningmetho dsaredesignedtowork(andtheirp erformanceisanalysed)un-derthegeneraliidassumption(unlikeclas-sicalparametricstatistics)andtheyareabletodealwithextremelyhigh-dimensionalhyp othesisspaces;cfVapnik[21](1998).Inthispap erwewillfurtherdeveloptheapproachofGammermanetal[4](1998)andSaunders[17Figure1:Ifthetrainingsetonlycontainsclear2sand7s,weouldliktoattachmucloercon dencethemiddleimagethantorightandleftones(1999),wherethegoalistoobtaincon dencesforpredictionsunderthegeneraliidassumptioninhigh-dimensionalsituations.Figure1demonstratesthede-sirabilityofcon dences.Themaincontributionthispap erisemb eddingtheapproachesofGammermanetal[4](1998)andSaunderset[17(1999)intoagen-eralschemebasedonthenotionofalgorithmicran-domness.Aswillb ecomeclearlater,theproblemofassigningcon dencestopredictionsiscloselyconnectedtheproblemofde ningrandomsequences.ThelatterproblemwassolvedbyKolmogorov[8](1965),whobasedhisde nitionontheexistenceUniver-salTuringMachine(thoughitb ecameclearthatKol-mogorov'sde nitiondo essolvetheproblemofde ningrandomsequencesonlyafterMartin-L\x7Fof 'spap er[15],1966);Kolmogorov'sde nitionmovedthenotionofrandomnessfromthegreyareasurroundingprobabil-itytheoryandstatisticstomathematicalcomputersci-ence.Kolmogorovb elievedhisnotionofrandomnesstob easuitablebasisforapplicationsofprobability.Unfor-tunately,fateideaasdi erentfromKol-mogorov's1933axioms(Kolmogorov[7],1933),which",
      year: 1999,
      citationCount: 189,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '467568f1777bc51a15a5100516cd4fe8de62b9ab',
      url: 'https://www.semanticscholar.org/paper/467568f1777bc51a15a5100516cd4fe8de62b9ab',
      title: 'Transfer Learning for Reinforcement Learning Domains: A Survey',
      abstract: 'The reinforcement learning paradigm is a popular way to address problems that have only limited environmental feedback, rather than correctly labeled examples, as is common in other machine learning contexts. While significant progress has been made to improve learning in a single task, the idea of transfer learning has only recently been applied to reinforcement learning tasks. The core idea of transfer is that experience gained in learning to perform one task can help improve learning performance in a related, but different, task. In this article we present a framework that classifies transfer learning methods in terms of their capabilities and goals, and then use it to survey the existing literature, as well as to suggest future directions for transfer learning work.',
      year: 2009,
      citationCount: 1661,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'fc09717ba476ae2408c454e5557276a9fc4d093d',
      url: 'https://www.semanticscholar.org/paper/fc09717ba476ae2408c454e5557276a9fc4d093d',
      title: 'Machine Learning: A Theoretical Approach',
      abstract: 'Chapter 1 Introduction Chapter 2 Learning Concept on Countable Domains Chapter 3 Time Complexity of Concept Learning Chapter 4 Learning Concepts on Uncoutable Domains Chapter 5 Learning Functions Chapter 6 Finite Automata Chapter 7 Neural Networks Chapter 8 Generalizing the Learning Model Chapter 9 Conclusion',
      year: 1992,
      citationCount: 262,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '7649af7bf6e9d277ed045930fc08d79247e02375',
      url: 'https://www.semanticscholar.org/paper/7649af7bf6e9d277ed045930fc08d79247e02375',
      title: 'Gaussian Processes in Machine Learning',
      abstract: null,
      year: 2003,
      citationCount: 167,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '4a6a88fcd374e4fdf2120f65b82c1382bdccfa2d',
      url: 'https://www.semanticscholar.org/paper/4a6a88fcd374e4fdf2120f65b82c1382bdccfa2d',
      title: 'Genetic Algorithms in Machine Learning',
      abstract: null,
      year: 2001,
      citationCount: 101,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '07abd02f02774d178f26ca99937e5f94001a9ec9',
      url: 'https://www.semanticscholar.org/paper/07abd02f02774d178f26ca99937e5f94001a9ec9',
      title: 'Learning to link with wikipedia',
      abstract: 'This paper describes how to automatically cross-reference documents with Wikipedia: the largest knowledge base ever known. It explains how machine learning can be used to identify significant terms within unstructured text, and enrich it with links to the appropriate Wikipedia articles. The resulting link detector and disambiguator performs very well, with recall and precision of almost 75%. This performance is constant whether the system is evaluated on Wikipedia articles or "real world" documents.\n' +
        ' This work has implications far beyond enriching documents with explanatory links. It can provide structured knowledge about any unstructured fragment of text. Any task that is currently addressed with bags of words - indexing, clustering, retrieval, and summarization to name a few - could use the techniques described here to draw on a vast network of concepts and semantics.',
      year: 2008,
      citationCount: 1351,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '884895a86fe15cb9601df4a15a1475c07f28da3c',
      url: 'https://www.semanticscholar.org/paper/884895a86fe15cb9601df4a15a1475c07f28da3c',
      title: 'Boosting for transfer learning',
      abstract: 'Traditional machine learning makes a basic assumption: the training and test data should be under the same distribution. However, in many cases, this identical-distribution assumption does not hold. The assumption might be violated when a task from one new domain comes, while there are only labeled data from a similar old domain. Labeling the new data can be costly and it would also be a waste to throw away all the old data. In this paper, we present a novel transfer learning framework called TrAdaBoost, which extends boosting-based learning algorithms (Freund & Schapire, 1997). TrAdaBoost allows users to utilize a small amount of newly labeled data to leverage the old data to construct a high-quality classification model for the new data. We show that this method can allow us to learn an accurate model using only a tiny amount of new data and a large amount of old data, even when the new data are not sufficient to train a model alone. We show that TrAdaBoost allows knowledge to be effectively transferred from the old data to the new. The effectiveness of our algorithm is analyzed theoretically and empirically to show that our iterative algorithm can converge well to an accurate model.',
      year: 2007,
      citationCount: 1638,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '22d6d9c1b7ac2738b51d93be45ac8f753f81867c',
      url: 'https://www.semanticscholar.org/paper/22d6d9c1b7ac2738b51d93be45ac8f753f81867c',
      title: 'Stacked Autoencoders for Unsupervised Feature Learning and Multiple Organ Detection in a Pilot Study Using 4D Patient Data',
      abstract: 'Medical image analysis remains a challenging application area for artificial intelligence. When applying machine learning, obtaining ground-truth labels for supervised learning is more difficult than in many more common applications of machine learning. This is especially so for datasets with abnormalities, as tissue types and the shapes of the organs in these datasets differ widely. However, organ detection in such an abnormal dataset may have many promising potential real-world applications, such as automatic diagnosis, automated radiotherapy planning, and medical image retrieval, where new multimodal medical images provide more information about the imaged tissues for diagnosis. Here, we test the application of deep learning methods to organ identification in magnetic resonance medical images, with visual and temporal hierarchical features learned to categorize object classes from an unlabeled multimodal DCE-MRI dataset so that only a weakly supervised training is required for a classifier. A probabilistic patch-based method was employed for multiple organ detection, with the features learned from the deep learning model. This shows the potential of the deep learning model for application to medical images, despite the difficulty of obtaining libraries of correctly labeled training datasets and despite the intrinsic abnormalities present in patient datasets.',
      year: 2013,
      citationCount: 473,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '5a05b9d5de7d1d11d1aa03826ded577d4acf4f49',
      url: 'https://www.semanticscholar.org/paper/5a05b9d5de7d1d11d1aa03826ded577d4acf4f49',
      title: 'Genetic Algorithms + Data Structures = Evolution Programs',
      abstract: null,
      year: 1996,
      citationCount: 11662,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '98f8a0055bb28133efcff359a92937324d0e6f51',
      url: 'https://www.semanticscholar.org/paper/98f8a0055bb28133efcff359a92937324d0e6f51',
      title: 'A Perspective View and Survey of Meta-Learning',
      abstract: null,
      year: 2002,
      citationCount: 1061,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '73f76a40ed20aa3c6a8e27e4db4a8c102e7b4c6d',
      url: 'https://www.semanticscholar.org/paper/73f76a40ed20aa3c6a8e27e4db4a8c102e7b4c6d',
      title: 'The relationship between Precision-Recall and ROC curves',
      abstract: "Receiver Operator Characteristic (ROC) curves are commonly used to present results for binary decision problems in machine learning. However, when dealing with highly skewed datasets, Precision-Recall (PR) curves give a more informative picture of an algorithm's performance. We show that a deep connection exists between ROC space and PR space, such that a curve dominates in ROC space if and only if it dominates in PR space. A corollary is the notion of an achievable PR curve, which has properties much like the convex hull in ROC space; we show an efficient algorithm for computing this curve. Finally, we also note differences in the two types of curves are significant for algorithm design. For example, in PR space it is incorrect to linearly interpolate between points. Furthermore, algorithms that optimize the area under the ROC curve are not guaranteed to optimize the area under the PR curve.",
      year: 2006,
      citationCount: 5071,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '34d405eaecab40a932108a7ff97e92fb8fd1ae4e',
      url: 'https://www.semanticscholar.org/paper/34d405eaecab40a932108a7ff97e92fb8fd1ae4e',
      title: 'A review of feature selection techniques in bioinformatics',
      abstract: 'Feature selection techniques have become an apparent need in many bioinformatics applications. In addition to the large pool of techniques that have already been developed in the machine learning and data mining fields, specific applications in bioinformatics have led to a wealth of newly proposed techniques. In this article, we make the interested reader aware of the possibilities of feature selection, providing a basic taxonomy of feature selection techniques, and discussing their use, variety and potential in a number of both common as well as upcoming bioinformatics applications.',
      year: 2007,
      citationCount: 4618,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'e95d3934e51107da7610acd0b1bcb6551671f9f1',
      url: 'https://www.semanticscholar.org/paper/e95d3934e51107da7610acd0b1bcb6551671f9f1',
      title: 'A Practical Guide to Training Restricted Boltzmann Machines',
      abstract: null,
      year: 2012,
      citationCount: 2967,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '167e1359943b96b9e92ee73db1df69a1f65d731d',
      url: 'https://www.semanticscholar.org/paper/167e1359943b96b9e92ee73db1df69a1f65d731d',
      title: 'A Sentimental Education: Sentiment Analysis Using Subjectivity Summarization Based on Minimum Cuts',
      abstract: 'Sentiment analysis seeks to identify the viewpoint(s) underlying a text span; an example application is classifying a movie review as "thumbs up" or "thumbs down". To determine this sentiment polarity, we propose a novel machine-learning method that applies text-categorization techniques to just the subjective portions of the document. Extracting these portions can be implemented using efficient techniques for finding minimum cuts in graphs; this greatly facilitates incorporation of cross-sentence contextual constraints.',
      year: 2004,
      citationCount: 3847,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'a1874aafa8730bdd4b28f29d025141c13ee28b58',
      url: 'https://www.semanticscholar.org/paper/a1874aafa8730bdd4b28f29d025141c13ee28b58',
      title: 'From Data Mining to Knowledge Discovery in Databases',
      abstract: '■ Data mining and knowledge discovery in databases have been attracting a significant amount of research, industry, and media attention of late. What is all the excitement about? This article provides an overview of this emerging field, clarifying how data mining and knowledge discovery in databases are related both to each other and to related fields, such as machine learning, statistics, and databases. The article mentions particular real-world applications, specific data-mining techniques, challenges involved in real-world applications of knowledge discovery, and current and future research directions in the field.',
      year: 1996,
      citationCount: 5297,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '08b43d84e6747e370ef307e2ada50675b414514a',
      url: 'https://www.semanticscholar.org/paper/08b43d84e6747e370ef307e2ada50675b414514a',
      title: 'Survey of clustering algorithms',
      abstract: 'Data analysis plays an indispensable role for understanding various phenomena. Cluster analysis, primitive exploration with little or no prior knowledge, consists of research developed across a wide variety of communities. The diversity, on one hand, equips us with many tools. On the other hand, the profusion of options causes confusion. We survey clustering algorithms for data sets appearing in statistics, computer science, and machine learning, and illustrate their applications in some benchmark data sets, the traveling salesman problem, and bioinformatics, a new field attracting intensive efforts. Several tightly related topics, proximity measure, and cluster validation, are also discussed.',
      year: 2005,
      citationCount: 5846,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'a34e35dbbc6911fa7b94894dffdc0076a261b6f0',
      url: 'https://www.semanticscholar.org/paper/a34e35dbbc6911fa7b94894dffdc0076a261b6f0',
      title: 'Neural Networks and the Bias/Variance Dilemma',
      abstract: 'Feedforward neural networks trained by error backpropagation are examples of nonparametric regression estimators. We present a tutorial on nonparametric inference and its relation to neural networks, and we use the statistical viewpoint to highlight strengths and weaknesses of neural models. We illustrate the main points with some recognition experiments involving artificial data as well as handwritten numerals. In way of conclusion, we suggest that current-generation feedforward neural networks are largely inadequate for difficult problems in machine perception and machine learning, regardless of parallel-versus-serial hardware or other implementation issues. Furthermore, we suggest that the fundamental challenges in neural modeling are about representation rather than learning per se. This last point is supported by additional experiments with handwritten numerals.',
      year: 1992,
      citationCount: 3679,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '3a84214cb69ea0b34352285029f368b75718c32b',
      url: 'https://www.semanticscholar.org/paper/3a84214cb69ea0b34352285029f368b75718c32b',
      title: 'Understanding of a convolutional neural network',
      abstract: "The term Deep Learning or Deep Neural Network refers to Artificial Neural Networks (ANN) with multi layers. Over the last few decades, it has been considered to be one of the most powerful tools, and has become very popular in the literature as it is able to handle a huge amount of data. The interest in having deeper hidden layers has recently begun to surpass classical methods performance in different fields; especially in pattern recognition. One of the most popular deep neural networks is the Convolutional Neural Network (CNN). It take this name from mathematical linear operation between matrixes called convolution. CNN have multiple layers; including convolutional layer, non-linearity layer, pooling layer and fully-connected layer. The convolutional and fully-connected layers have parameters but pooling and non-linearity layers don't have parameters. The CNN has an excellent performance in machine learning problems. Specially the applications that deal with image data, such as largest image classification data set (Image Net), computer vision, and in natural language processing (NLP) and the results achieved were very amazing. In this paper we will explain and define all the elements and important issues related to CNN, and how these elements work. In addition, we will also state the parameters that effect CNN efficiency. This paper assumes that the readers have adequate knowledge about both machine learning and artificial neural network.",
      year: 2017,
      citationCount: 2049,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '08ad8fad21f6ec4cda4d56be1ca5e146b7c913a1',
      url: 'https://www.semanticscholar.org/paper/08ad8fad21f6ec4cda4d56be1ca5e146b7c913a1',
      title: 'Understanding Black-box Predictions via Influence Functions',
      abstract: "How can we explain the predictions of a black-box model? In this paper, we use influence functions — a classic technique from robust statistics — to trace a model's prediction through the learning algorithm and back to its training data, thereby identifying training points most responsible for a given prediction. To scale up influence functions to modern machine learning settings, we develop a simple, efficient implementation that requires only oracle access to gradients and Hessian-vector products. We show that even on non-convex and non-differentiable models where the theory breaks down, approximations to influence functions can still provide valuable information. On linear models and convolutional neural networks, we demonstrate that influence functions are useful for multiple purposes: understanding model behavior, debugging models, detecting dataset errors, and even creating visually-indistinguishable training-set attacks.",
      year: 2017,
      citationCount: 2094,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '43d2ed5c3c55c1100450cd74dc1031afa24d37b2',
      url: 'https://www.semanticscholar.org/paper/43d2ed5c3c55c1100450cd74dc1031afa24d37b2',
      title: 'Collective Classification in Network Data',
      abstract: 'Many real-world applications produce networked data such as the world-wide web (hypertext documents connected via hyperlinks), social networks (for example, people connected by friendship links), communication networks (computers connected via communication links) and biological networks (for example, protein interaction networks). A recent focus in machine learning research has been to extend traditional machine learning classification techniques to classify nodes in such networks. In this article, we provide a brief introduction to this area of research and how it has progressed during the past decade. We introduce four of the most widely used inference algorithms for classifying networked data and empirically compare them on both synthetic and real-world data.',
      year: 2008,
      citationCount: 3056,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '1dbc1238409549ae6872a744b7b2ff1da5822053',
      url: 'https://www.semanticscholar.org/paper/1dbc1238409549ae6872a744b7b2ff1da5822053',
      title: 'A reliable effective terascale linear learning system',
      abstract: 'We present a system and a set of techniques for learning linear predictors with convex losses on terascale data sets, with trillions of features, billions of training examples and millions of parameters in an hour using a cluster of 1000 machines. Individually none of the component techniques are new, but the careful synthesis required to obtain an efficient implementation is. The result is, up to our knowledge, the most scalable and efficient linear learning system reported in the literature. We describe and thoroughly evaluate the components of the system, showing the importance of the various design choices.',
      year: 2011,
      citationCount: 365,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '24281c886cd9339fe2fc5881faf5ed72b731a03e',
      url: 'https://www.semanticscholar.org/paper/24281c886cd9339fe2fc5881faf5ed72b731a03e',
      title: 'Spark: Cluster Computing with Working Sets',
      abstract: 'MapReduce and its variants have been highly successful in implementing large-scale data-intensive applications on commodity clusters. However, most of these systems are built around an acyclic data flow model that is not suitable for other popular applications. This paper focuses on one such class of applications: those that reuse a working set of data across multiple parallel operations. This includes many iterative machine learning algorithms, as well as interactive data analysis tools. We propose a new framework called Spark that supports these applications while retaining the scalability and fault tolerance of MapReduce. To achieve these goals, Spark introduces an abstraction called resilient distributed datasets (RDDs). An RDD is a read-only collection of objects partitioned across a set of machines that can be rebuilt if a partition is lost. Spark can outperform Hadoop by 10x in iterative machine learning jobs, and can be used to interactively query a 39 GB dataset with sub-second response time.',
      year: 2010,
      citationCount: 1383,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '7b4f3d0e4e2486a8d5d3f8e00549cf9a117bf88f',
      url: 'https://www.semanticscholar.org/paper/7b4f3d0e4e2486a8d5d3f8e00549cf9a117bf88f',
      title: 'Sequence Transduction with Recurrent Neural Networks',
      abstract: 'Many machine learning tasks can be expressed as the transformation---or \\emph{transduction}---of input sequences into output sequences: speech recognition, machine translation, protein secondary structure prediction and text-to-speech to name but a few. One of the key challenges in sequence transduction is learning to represent both the input and output sequences in a way that is invariant to sequential distortions such as shrinking, stretching and translating. Recurrent neural networks (RNNs) are a powerful sequence learning architecture that has proven capable of learning such representations. However RNNs traditionally require a pre-defined alignment between the input and output sequences to perform transduction. This is a severe limitation since \\emph{finding} the alignment is the most difficult aspect of many sequence transduction problems. Indeed, even determining the length of the output sequence is often challenging. This paper introduces an end-to-end, probabilistic sequence transduction system, based entirely on RNNs, that is in principle able to transform any input sequence into any finite, discrete output sequence. Experimental results for phoneme recognition are provided on the TIMIT speech corpus.',
      year: 2012,
      citationCount: 1463,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'bb144c04b9eb44579b19d21c3d5954401408440b',
      url: 'https://www.semanticscholar.org/paper/bb144c04b9eb44579b19d21c3d5954401408440b',
      title: 'Orange: data mining toolbox in python',
      abstract: 'Orange is a machine learning and data mining suite for data analysis through Python scripting and visual programming. Here we report on the scripting part, which features interactive data analysis and component-based assembly of data mining procedures. In the selection and design of components, we focus on the flexibility of their reuse: our principal intention is to let the user write simple and clear scripts in Python, which build upon C++ implementations of computationally-intensive tasks. Orange is intended both for experienced users and programmers, as well as for students of data mining.',
      year: 2013,
      citationCount: 1432,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'a42ca00fc188beb5586ad4c7108b70aeb5317da0',
      url: 'https://www.semanticscholar.org/paper/a42ca00fc188beb5586ad4c7108b70aeb5317da0',
      title: 'Auto-WEKA: combined selection and hyperparameter optimization of classification algorithms',
      abstract: "Many different machine learning algorithms exist; taking into account each algorithm's hyperparameters, there is a staggeringly large number of possible alternatives overall. We consider the problem of simultaneously selecting a learning algorithm and setting its hyperparameters, going beyond previous work that attacks these issues separately. We show that this problem can be addressed by a fully automated approach, leveraging recent innovations in Bayesian optimization. Specifically, we consider a wide range of feature selection techniques (combining 3 search and 8 evaluator methods) and all classification approaches implemented in WEKA's standard distribution, spanning 2 ensemble methods, 10 meta-methods, 27 base classifiers, and hyperparameter settings for each classifier. On each of 21 popular datasets from the UCI repository, the KDD Cup 09, variants of the MNIST dataset and CIFAR-10, we show classification performance often much better than using standard selection and hyperparameter optimization methods. We hope that our approach will help non-expert users to more effectively identify machine learning algorithms and hyperparameter settings appropriate to their applications, and hence to achieve improved performance.",
      year: 2012,
      citationCount: 1325,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: 'ba10b8f9ee40b68053af9e6c2383aa2c6e39e9be',
      url: 'https://www.semanticscholar.org/paper/ba10b8f9ee40b68053af9e6c2383aa2c6e39e9be',
      title: 'Text Classification Algorithms: A Survey',
      abstract: 'In recent years, there has been an exponential growth in the number of complex documentsand texts that require a deeper understanding of machine learning methods to be able to accuratelyclassify texts in many applications. Many machine learning approaches have achieved surpassingresults in natural language processing. The success of these learning algorithms relies on their capacityto understand complex models and non-linear relationships within data. However, finding suitablestructures, architectures, and techniques for text classification is a challenge for researchers. In thispaper, a brief overview of text classification algorithms is discussed. This overview covers differenttext feature extractions, dimensionality reduction methods, existing algorithms and techniques, andevaluations methods. Finally, the limitations of each technique and their application in real-worldproblems are discussed.',
      year: 2019,
      citationCount: 926,
      authors: [Array],
      citations: [Array]
    },
    {
      paperId: '2be40f5336afa68b49fef41e009b7172c2c9fdeb',
      url: 'https://www.semanticscholar.org/paper/2be40f5336afa68b49fef41e009b7172c2c9fdeb',
      title: 'POT: Python Optimal Transport',
      abstract: 'Optimal transport has recently been reintroduced to the machine learning community thanks in part to novel eﬃcient optimization procedures allowing for medium to large scale applications. We propose a Python toolbox that implements several key optimal transport ideas for the machine learning community. The toolbox contains implementations of a number of founding works of OT for machine learning such as Sinkhorn algorithm and Wasserstein barycenters, but also provides generic solvers that can be used for conducting novel fundamental research. This toolbox, named POT for Python Optimal Transport, is open source with an MIT license.',
      year: 2021,
      citationCount: 414,
      authors: [Array],
      citations: [Array]
    },
  ]


    import { writable } from 'svelte/store';

    // papers is now a writable store
    let papers = writable([]);
    let edges = [];  // This will hold the edges data

// Reactive statement to call findEdges whenever scholar_json updates
$: {
        if(Array.isArray($scholar_json) && $scholar_json.length > 0) {
            edges = findEdges($scholar_json);
            scholar_json_edges.set(edges);
            // console.log("edges", edges);  // Log the edges to see the result
        }
    }



    // Function to get papers on a topic with a specific offset
    async function getPapers(topic, offset) {
        const response = await fetch(`/api/semantic_scholar_pagination?topic=${encodeURIComponent(topic)}&offset=${offset}`);
        if (!response.ok) {
            console.log("response", response.json());
            throw new Error('Failed to fetch papers');
        }
        return await response.json();
    }

    // Create a new async function to encapsulate the for loop
    async function fetchAllPapers(topic) {
        const allPapers = []
        for (let i = 0; i < 10; i++) {  // 10 requests * 100 papers/request = 1000 papers
            try {
                const offset = i * 30; // 100
                const newPapers = await getPapers(topic, offset);
                allPapers.push(...newPapers.data);
                scholar_json.set(allPapers);
                papers.set(allPapers);

            } catch (error) {
                console.log("error", error)
                console.error('An error occurred while fetching papers:', error);
            }
        }
    }

    // onMount runs after the component is mounted to the DOM, it's the recommended place for fetch calls
    onMount(() => {
        // TEMP
        scholar_json.set(sample_data)
        scholar_json_edges.set(sample_edges)
        /////
        fetchAllPapers('machine learning');  // RESTART THIS
   
        //       // Now call findEdges with the current value of scholar_json
        //       edges = findEdges($scholar_json);
        // console.log(edges);  // Log the edges to see the result
    });

  
</script>
    <!-- {$scholar_json.length}
    {#if $scholar_json.length > 0}
    {$scholar_json[0].title}
    
    {/if}
<div>
    {#if $scholar_json.length === 0}
        <p>Loading papers...</p>
        {/if}

    {#if  $scholar_json.length > 0}

        {#each $scholar_json as paper}
            <article>
                <h2>{paper.title} ({paper.year})</h2>
                {#if paper.abstract}
                    <p>{paper.abstract}</p>
                {/if}
                <p>Citations: {paper.citationCount}</p>
        
                <h3>Authors:</h3>
                <ul>
                {#if paper.authors}
                    {#each paper.authors.slice(0, 10) as author}
                        <li>{author.name}</li> 
                    {/each}
                {/if}
                </ul> 
        
                <h3>Citations:</h3>
                <ul>
                {#if paper.citations}
                    {#each paper.citations.slice(0, 10) as citation}
                        <li>paper id: {citation.paperId}</li>
                        <li>title: {citation.title}</li>
                        <li>year: {citation.year || citation.publicationDate }</li> 

                    {/each}
                {/if}
                </ul>
            </article>
        {/each}

    {/if} 
</div> -->