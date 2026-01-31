import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  keyFeatures: string[];
  technicalChallenge: string;
  technologies: string[];
  githubUrl: string;
  year: number;
}

const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects: Project[] = [
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

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const projectVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 md:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={projectVariants} className="text-center mt-6 mb-14">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Work
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-bitter">
            7 projects that solved real problems
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={projectVariants}
              className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                        {project.title}
                      </h3>
                      <span className="text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-foreground/80 font-sans leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expand/Collapse Details */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => setSelectedProject(
                      selectedProject === project.id ? null : project.id
                    )}
                    className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors font-display font-medium"
                    whileHover={{ x: 5 }}
                  >
                    <span>{selectedProject === project.id ? 'Hide Details' : 'View Details'}</span>
                    <motion.span
                      animate={{ rotate: selectedProject === project.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                  
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>GitHub</span>
                      <span>↗</span>
                    </motion.a>
                  )}
                </div>

                {/* Detailed Content */}
                <AnimatePresence>
                  {selectedProject === project.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
                    >
                      <div className="space-y-6">
                        {/* Detailed Description */}
                        <div>
                          <h4 className="text-lg font-display font-semibold mb-3 text-foreground">
                            Overview
                          </h4>
                          <p className="text-foreground/80 font-sans leading-relaxed">
                            {project.detailedDescription}
                          </p>
                        </div>

                        {/* Key Features */}
                        <div>
                          <h4 className="text-lg font-display font-semibold mb-3 text-foreground">
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {project.keyFeatures.map((feature, index) => (
                              <motion.li
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 text-foreground/80"
                              >
                                <span className="text-secondary mt-1">→</span>
                                <span className="font-sans">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Technical Challenge */}
                        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border border-white/5">
                          <h4 className="text-lg font-display font-semibold mb-3 text-foreground">
                            Technical Challenge
                          </h4>
                          <p className="text-foreground/80 font-sans leading-relaxed">
                            {project.technicalChallenge}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          variants={projectVariants}
          className="text-center mt-16"
        >
          <p className="text-foreground/60 font-sans mb-6">
            Interested in working together on the next challenge?
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's discuss your project
            <motion.span 
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Work;