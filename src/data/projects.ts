import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'spotify-analytics',
    title: 'Spotify Artist Analytics',
    description: 'Modern data stack pipeline processing 73K+ music streaming records with automated ETL/ELT workflows and 40% faster processing through incremental loading.',
    detailedDescription: 'Built an end-to-end data engineering pipeline using the modern data stack approach, orchestrating data flows from Spotify API through transformation to visualization.',
    keyFeatures: [
      'Airflow DAGs for orchestration with dbt transformation models',
      'Snowflake cloud warehouse with incremental loading strategies',
      'Automated data quality testing and comprehensive lineage tracking',
      'Containerized deployment using Docker for reproducibility',
      'Interactive Tableau dashboards for artist performance insights'
    ],
    technicalChallenge: 'Implementing efficient incremental loading while maintaining data consistency across the pipeline required careful orchestration of dependencies and idempotent transformations.',
    technologies: ['Apache Airflow', 'dbt', 'Snowflake', 'Docker', 'Tableau', 'Python'],
    githubUrl: '',
    year: 2024
  },
  {
    id: 'spotify-streaming',
    title: 'Spotify Trend Analysis',
    description: 'Real-time streaming analytics processing 1M+ interactions with advanced probabilistic algorithms achieving sub-5% cardinality estimation error.',
    detailedDescription: 'Developed a real-time data pipeline for streaming analytics using Kafka and Spark, implementing advanced algorithms for efficient large-scale data processing.',
    keyFeatures: [
      'Apache Kafka + Spark Streaming for real-time processing pipeline',
      'Bloom Filters and Flajolet-Martin algorithm for probabilistic analytics',
      'Reservoir Sampling and LSH for efficient data representation',
      'Differential Privacy implementation for data protection',
      '18% improvement in forecasting accuracy with time-series models'
    ],
    technicalChallenge: 'Balancing accuracy with processing speed required implementing probabilistic data structures that provide approximate answers with bounded error rates in constant memory.',
    technologies: ['Apache Kafka', 'Spark Streaming', 'PySpark', 'Zookeeper', 'Tableau'],
    githubUrl: '',
    year: 2024
  },
  {
    id: 'airline-odyssey',
    title: 'Airline Data Odyssey',
    description: 'Cloud data warehouse analyzing post-COVID airline industry patterns with star schema design and Neo4J graph analysis for flight delays.',
    detailedDescription: 'Built a comprehensive analytics platform on Google Cloud for post-COVID airline industry analysis, combining traditional warehousing with graph database capabilities.',
    keyFeatures: [
      'BigQuery cloud warehouse with star schema dimensional modeling',
      'Automated ETL pipelines with Google Cloud Storage integration',
      'Neo4J graph database for relationship-based route analysis',
      'Root cause analysis across airports, carriers, and seasons',
      'Interactive dashboards with Matplotlib, Seaborn, and Plotly'
    ],
    technicalChallenge: 'Integrating relational warehouse analytics with graph database queries required designing a hybrid architecture that leverages each technology\'s strengths for different analytical questions.',
    technologies: ['BigQuery', 'Neo4J', 'Google Cloud', 'Python', 'Pandas', 'SQL'],
    githubUrl: '',
    year: 2024
  },
  {
    id: 'recommendation-engine',
    title: 'Large-Scale Recommendation Engine',
    description: 'Distributed recommendation system processing 1M+ user interactions with sub-second latency and 99.9% uptime using collaborative filtering.',
    detailedDescription: 'Designed a scalable recommendation engine combining batch and real-time processing for dynamic, personalized recommendations across a distributed cluster.',
    keyFeatures: [
      'Collaborative Filtering with ALS algorithm on Apache Spark',
      'Kafka for real-time ingestion, Cassandra for low-latency storage',
      'HDFS for batch processing with Spark Structured Streaming',
      'Hybrid batch + real-time architecture for dynamic updates',
      'Real-time Tableau dashboard for recommendation metrics'
    ],
    technicalChallenge: 'Achieving sub-second latency while processing millions of interactions required a lambda architecture combining pre-computed batch recommendations with real-time updates.',
    technologies: ['Apache Spark', 'Kafka', 'Cassandra', 'HDFS', 'Python', 'ALS'],
    githubUrl: '',
    year: 2024
  },
  {
    id: 'air-pollution',
    title: 'Air Pollution USA Analysis',
    description: 'Environmental public health analysis revealing 30% pollution reduction during COVID-19 lockdowns across PM2.5, PM10, NO2, and O3 pollutants.',
    detailedDescription: 'Conducted comprehensive analysis of US air pollution data (2019-2020) to identify patterns, geographic hotspots, and the impact of COVID-19 lockdowns on air quality.',
    keyFeatures: [
      'Multi-pollutant analysis: PM2.5, PM10, NO2, and O3 tracking',
      'Meteorological factors correlation with pollution levels',
      'Cluster analysis for geographic pattern identification',
      'Statistical analysis with median imputation for data cleaning',
      'Policy-focused visualizations for public health recommendations'
    ],
    technicalChallenge: 'Handling missing data across multiple monitoring stations while maintaining statistical validity required implementing robust imputation strategies and cross-validation techniques.',
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Plotly', 'Statistical Analysis'],
    githubUrl: '',
    year: 2024
  },
  {
    id: 'learning-management',
    title: 'Learning Management System',
    description: 'Full-stack LMS supporting 500+ concurrent users with role-based access, AWS auto-scaling, and sub-200ms query response times.',
    detailedDescription: 'Developed a comprehensive learning management platform with distinct interfaces for faculty, students, and admins, deployed on AWS with high availability architecture.',
    keyFeatures: [
      'Role-based access control (RBAC) for faculty, students, and admins',
      'MongoDB with optimized indexing for read-heavy workloads',
      'RESTful APIs with validation, error handling, and JSON I/O',
      'AWS deployment with Auto Scaling, Load Balancer, 99.5% uptime',
      'Agile development with sprint planning and project journals'
    ],
    technicalChallenge: 'Scaling to 500+ concurrent users required implementing connection pooling, query optimization with proper indexing, and AWS auto-scaling policies based on traffic patterns.',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS EC2', 'Express', 'REST APIs'],
    githubUrl: '',
    year: 2023
  },
  {
    id: 'ubereats-prototype',
    title: 'UberEATS Prototype',
    description: 'Full-stack food delivery application with distinct customer and restaurant interfaces, secure authentication, and real-time order processing.',
    detailedDescription: 'Created a complete food delivery platform prototype with separate user experiences for customers and restaurants, featuring secure transactions and responsive design.',
    keyFeatures: [
      'Dual interfaces: customer ordering and restaurant management',
      'Secure authentication with bcrypt.js and session management',
      'MySQL relational schema for orders, users, and menu data',
      'RESTful APIs with Swagger documentation',
      'Responsive UI with React and Bootstrap across all devices'
    ],
    technicalChallenge: 'Designing a database schema that efficiently handles the transactional nature of food ordering while supporting complex queries for restaurant analytics required careful normalization and indexing strategies.',
    technologies: ['React', 'Node.js', 'Express', 'MySQL', 'Bootstrap', 'bcrypt.js'],
    githubUrl: '',
    year: 2023
  }
];
