import os
import random

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "demo-cvs")

CATEGORIES = {
    "tech_software": {
        "roles": [
            "Junior Frontend Developer", "Frontend Developer", "Senior Frontend Engineer", "Staff Frontend Architect",
            "Junior Backend Developer", "Backend Developer", "Senior Backend Engineer", "Lead Backend Architect",
            "Junior Full Stack Developer", "Full Stack Developer", "Senior Full Stack Engineer", "Principal Full Stack Engineer",
            "iOS Mobile Developer", "Senior Android Developer", "Mobile Tech Lead",
            "Embedded Systems Engineer", "Firmware Engineer", "IoT Solutions Architect"
        ],
        "skills": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "Java", "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "Redis", "AWS", "CI/CD"],
        "companies": ["Stripe", "Datadog", "Vercel", "Shopify", "Cloudflare", "Atlassian", "Twilio", "Square", "Airbnb", "Spotify"]
    },
    "tech_infrastructure_data": {
        "roles": [
            "DevOps Engineer", "Senior DevOps Engineer", "Site Reliability Engineer (SRE)", "Principal SRE",
            "Cloud Infrastructure Engineer", "AWS Cloud Architect", "Platform Engineer",
            "Database Administrator (DBA)", "Data Engineer", "Senior Data Engineer", "Big Data Architect",
            "Data Analyst", "Senior Business Intelligence Analyst", "Analytics Engineer",
            "Machine Learning Engineer", "Senior MLOps Engineer", "AI Research Scientist", "Data Scientist", "Lead Data Scientist",
            "Cybersecurity Analyst", "Information Security Specialist", "Penetration Tester", "SOC Analyst"
        ],
        "skills": ["Terraform", "Ansible", "Kubernetes", "Docker", "AWS", "GCP", "Azure", "Python", "SQL", "Apache Spark", "Kafka", "Snowflake", "Airflow", "PyTorch", "TensorFlow", "SIEM"],
        "companies": ["Snowflake", "Palantir", "CrowdStrike", "HashiCorp", "Databricks", "Elastic", "Confluent", "MongoDB", "Splunk", "Palo Alto Networks"]
    },
    "product_and_design": {
        "roles": [
            "Associate Product Manager", "Product Manager", "Senior Product Manager", "Group Product Manager", "Director of Product",
            "Technical Product Manager", "Growth Product Manager", "AI Product Manager",
            "UI/UX Designer", "Senior Product Designer", "Principal UX Designer", "Design Systems Lead",
            "UX Researcher", "User Experience Strategist", "Interaction Designer",
            "Scrum Master", "Agile Coach", "Technical Program Manager"
        ],
        "skills": ["User Journey Mapping", "Wireframing", "Figma", "Design Systems", "Prototyping", "User Research", "A/B Testing", "Roadmapping", "Agile/Scrum", "Product Analytics", "Mixpanel"],
        "companies": ["Figma", "Linear", "Notion", "Canva", "Miro", "Asana", "Slack", "Monday.com", "Intercom", "Dropbox"]
    },
    "marketing_and_growth": {
        "roles": [
            "Digital Marketing Specialist", "Growth Marketing Manager", "Performance Marketing Lead", "VP of Growth",
            "SEO Strategist", "Technical SEO Specialist", "Content Marketing Manager", "Head of Content",
            "Social Media Strategist", "Community Manager", "Influencer Marketing Lead",
            "Email Marketing Specialist", "Lifecycle Marketing Manager", "CRM Campaign Manager",
            "Product Marketing Manager (PMM)", "Senior PMM", "Brand Marketing Director", "Public Relations Specialist"
        ],
        "skills": ["SEO/SEM", "Google Analytics 4", "HubSpot", "Copywriting", "Paid Search (PPC)", "Meta Ads", "Content Strategy", "Email Automation", "Conversion Rate Optimization (CRO)", "A/B Testing"],
        "companies": ["HubSpot", "Zapier", "Buffer", "Semrush", "Klaviyo", "Mailchimp", "Hootsuite", "ActiveCampaign", "Sprout Social", "Webflow"]
    },
    "sales_and_customer_success": {
        "roles": [
            "Sales Development Representative (SDR)", "Business Development Representative (BDR)",
            "Account Executive (SMB)", "Mid-Market Account Executive", "Enterprise Account Executive", "VP of Enterprise Sales",
            "Solutions Engineer (Pre-Sales)", "Sales Engineering Lead",
            "Customer Success Manager (CSM)", "Senior Enterprise CSM", "Director of Customer Success",
            "Account Manager", "Client Relationship Director", "Onboarding Specialist", "Customer Support Lead"
        ],
        "skills": ["Salesforce", "Outreach", "MEDDPICC", "Cold Calling", "B2B SaaS Negotiation", "Pipeline Management", "Customer Retention", "Executive Presentation", "Contract Closing", "Churn Reduction"],
        "companies": ["Salesforce", "Gong", "ZoomInfo", "DocuSign", "Zendesk", "Braze", "Qualtrics", "Freshworks", "Box", "ServiceNow"]
    },
    "finance_and_accounting": {
        "roles": [
            "Financial Analyst", "Senior Financial Analyst", "FP&A Manager", "Director of Finance",
            "Junior Accountant", "Staff Accountant", "Senior Corporate Accountant", "Accounting Manager", "Financial Controller",
            "Investment Banking Analyst", "Private Equity Associate", "Portfolio Manager",
            "Internal Auditor", "Senior Risk Assurance Auditor", "Tax Accountant", "Treasury Analyst"
        ],
        "skills": ["Financial Modeling", "GAAP/IFRS", "Excel (VBA/Macros)", "QuickBooks", "NetSuite", "Budgeting & Forecasting", "Variance Analysis", "LBO Modeling", "SEC Filings (10-K/10-Q)", "Cash Flow Management"],
        "companies": ["Goldman Sachs", "Morgan Stanley", "JPMorgan Chase", "Deloitte", "PwC", "EY", "KPMG", "BlackRock", "Robinhood", "Fidelity"]
    },
    "human_resources_and_talent": {
        "roles": [
            "HR Assistant", "HR Coordinator", "HR Generalist", "Senior HR Business Partner (HRBP)", "Director of People Operations",
            "Technical Recruiter", "Senior Executive Recruiter", "Head of Talent Acquisition",
            "Compensation and Benefits Analyst", "Total Rewards Manager",
            "People Analytics Specialist", "Diversity and Inclusion Specialist", "Learning and Development Specialist"
        ],
        "skills": ["Applicant Tracking Systems (ATS)", "Workday", "Greenhouse", "Lever", "Talent Sourcing", "Performance Management", "Employee Relations", "Onboarding Programs", "Labor Law Compliance"],
        "companies": ["Workday", "LinkedIn", "Carta", "Rippling", "Gusto", "Deel", "Remote", "BambooHR", "Paychex", "Lattice"]
    },
    "operations_and_supply_chain": {
        "roles": [
            "Operations Coordinator", "Operations Manager", "Director of Business Operations (BizOps)", "Chief Operating Officer (COO)",
            "Supply Chain Analyst", "Senior Supply Chain Planner", "Logistics Coordinator", "Warehouse Operations Manager",
            "Procurement Specialist", "Strategic Sourcing Manager", "Vendor Relations Manager",
            "Inventory Control Specialist", "Continuous Improvement / Lean Six Sigma Manager"
        ],
        "skills": ["Supply Chain Optimization", "ERP Systems (SAP/Oracle)", "Lean Six Sigma", "Vendor Negotiation", "Inventory Forecasting", "Logistics Fleet Routing", "Process Automation", "Cost Reduction Analysis"],
        "companies": ["Amazon", "Flexport", "DHL", "FedEx", "Maersk", "Procter & Gamble", "Unilever", "Target", "Walmart Supply Chain", "Sysco"]
    },
    "healthcare_and_clinical": {
        "roles": [
            "Registered Nurse (RN - ICU)", "Registered Nurse (RN - Emergency)", "Charge Nurse", "Nurse Practitioner (NP)",
            "Healthcare Administrator", "Clinic Operations Director", "Medical Office Manager",
            "Clinical Research Coordinator", "Clinical Data Associate", "Health Informatics Specialist",
            "Medical Coder and Biller", "Physical Therapist", "Pharmacy Operations Manager"
        ],
        "skills": ["Electronic Health Records (Epic/Cerner)", "Patient Care Planning", "HIPAA Compliance", "Triage Assessment", "Clinical Trial Protocol", "ICD-10 / CPT Coding", "Pharmacology", "BLS/ACLS Certified"],
        "companies": ["Mayo Clinic", "Cleveland Clinic", "Kaiser Permanente", "Mount Sinai Health System", "Johns Hopkins Hospital", "UnitedHealth Group", "CVS Health", "Pfizer", "IQVIA"]
    },
    "engineering_and_sciences": {
        "roles": [
            "Mechanical Design Engineer", "Senior Mechanical Engineer", "Thermal Systems Engineer",
            "Electrical Engineer", "PCB Hardware Design Engineer", "Power Electronics Engineer",
            "Civil Project Engineer", "Structural Engineer", "Transportation Systems Engineer",
            "Chemical Process Engineer", "Biomedical Engineer", "Quality Assurance Engineer (Hardware)",
            "Laboratory Research Scientist", "Environmental Compliance Engineer"
        ],
        "skills": ["SolidWorks", "AutoCAD", "MATLAB", "Finite Element Analysis (FEA)", "Altium Designer", "Circuit Design", "Six Sigma", "Rapid Prototyping", "Geometric Dimensioning & Tolerancing (GD&T)"],
        "companies": ["Tesla", "Lockheed Martin", "Boeing", "General Electric", "Siemens", "ASML", "Bosch", "Northrop Grumman", "Honeywell", "Caterpillar"]
    },
    "legal_and_compliance": {
        "roles": [
            "Legal Assistant", "Corporate Paralegal", "Senior Litigation Paralegal", "Contracts Administrator",
            "Compliance Analyst", "Regulatory Affairs Specialist", "Privacy and Data Protection Officer",
            "Corporate Governance Manager", "Intellectual Property Specialist"
        ],
        "skills": ["Contract Lifecycle Management", "Legal Research (LexisNexis/Westlaw)", "Regulatory Compliance", "GDPR / CCPA Frameworks", "Due Diligence", "Document Drafting", "Intellectual Property Filings"],
        "companies": ["DLA Piper", "Baker McKenzie", "Latham & Watkins", "Kirkland & Ellis", "Skadden Arps", "Clifford Chance", "Kroll", "Ironclad"]
    },
    "education_and_training": {
        "roles": [
            "Instructional Designer", "Senior E-Learning Developer", "Curriculum Specialist",
            "Corporate Training Specialist", "Customer Education Manager", "Technical Trainer",
            "Academic Advisor", "Higher Education Program Coordinator", "EdTech Product Specialist"
        ],
        "skills": ["Articulate Storyline", "LMS Administration (Canvas/Moodle)", "Adult Learning Theory", "Curriculum Development", "Video Training Production", "Assessment Design", "Workshop Facilitation"],
        "companies": ["Coursera", "Udemy", "Guild Education", "Pearson", "Duolingo", "2U", "McGraw Hill", "General Assembly"]
    }
}

FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Avery", "Cameron", "Jamie", "Logan", "Kendall", "Reese", "Harper", "Rowan", "Finley", "Hayden", "Dakota", "Emerson", "Adrian", "Elena", "Marcus", "Siddharth", "Priya", "Chen", "Mei", "Mateo", "Sofia"]
LAST_NAMES = ["Vance", "Mercer", "Sterling", "Cross", "Chen", "Kowalski", "Patel", "Nakamura", "Al-Mansoor", "O'Connor", "Dubois", "Santos", "Novak", "Lindqvist", "Sinclair", "Montgomery", "Zhang", "Gupta", "Reyes", "Fischer", "Kim", "Larsson", "Bauer", "Gallagher", "Castillo"]
CITIES = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Chicago, IL", "Boston, MA", "Denver, CO", "Atlanta, GA", "Toronto, ON", "London, UK", "Berlin, Germany", "Remote"]
UNIVERSITIES = ["University of California, Berkeley", "University of Michigan", "Georgia Institute of Technology", "Carnegie Mellon University", "University of Texas at Austin", "University of Washington", "New York University", "University of Illinois Urbana-Champaign", "Purdue University", "Columbia University"]

def generate_bullet(role, skill, category):
    templates = [
        f"Spearheaded redesign of core workflow utilizing {skill}, driving a 34% increase in user efficiency and slashing processing latency from 450ms to 95ms.",
        f"Orchestrated cross-functional initiative spanning engineering and operations, reducing deployment cycle times by 42% while maintaining 99.98% service uptime.",
        f"Architected and deployed scalable enterprise solution leveraging {skill}, resulting in $1.4M in annualized infrastructure cost savings.",
        f"Pioneered automated testing and monitoring pipeline using modern tooling, boosting test coverage from 58% to 94% and catching 120+ regression bugs prior to production.",
        f"Engineered end-to-end data processing pipelines delivering sub-second real-time telemetry across 15M+ daily active sessions.",
        f"Negotiated and implemented modernized vendor framework, slashing operational overhead by 22% and expediting delivery schedules by 3 weeks.",
        f"Championed adoption of industry best practices and automated validation, cutting customer onboarding time from 14 days down to 48 hours.",
        f"Analyzed key funnel metrics and user friction points, delivering targeted optimizations that elevated quarterly conversion rates by 19.5%."
    ]
    return random.choice(templates)

def generate_resume(role, category, index):
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    city = random.choice(CITIES)
    email = f"{first.lower()}.{last.lower()}{index}@example.com"
    phone = f"+1 (555) {random.randint(100,999)}-{random.randint(1000,9999)}"
    linkedin = f"linkedin.com/in/{first.lower()}-{last.lower()}-{index}"
    
    cat_data = CATEGORIES[category]
    skills_sample = random.sample(cat_data["skills"], min(len(cat_data["skills"]), 8))
    
    comp1 = random.choice(cat_data["companies"])
    remaining_comps = [c for c in cat_data["companies"] if c != comp1]
    comp2 = random.choice(remaining_comps)
    
    bullet1 = generate_bullet(role, skills_sample[0], category)
    bullet2 = generate_bullet(role, skills_sample[1], category)
    bullet3 = generate_bullet(role, skills_sample[2], category)
    bullet4 = generate_bullet(role, skills_sample[3], category)
    
    bullet5 = generate_bullet(role, skills_sample[4], category)
    bullet6 = generate_bullet(role, skills_sample[5], category)
    bullet7 = generate_bullet(role, skills_sample[6], category)
    
    content = f"""# {first} {last}
**{role}** | {city}  
{email} | {phone} | {linkedin}

## Professional Summary
Performance-driven and results-oriented {role} with 6+ years of proven track record in architecting high-impact solutions, optimizing operational workflows, and driving quantifiable organizational growth. Expert in leveraging {skills_sample[0]}, {skills_sample[1]}, and {skills_sample[2]} to eliminate bottlenecks, reduce costs, and elevate customer outcomes in fast-paced competitive environments.

## Core Competencies & Skills
* **Core Domains:** {", ".join(skills_sample[:4])}
* **Tools & Methodologies:** {", ".join(skills_sample[4:])}
* **Professional Attributes:** Cross-Functional Leadership, Agile Execution, Quantitative Analysis, Stakeholder Management

## Professional Experience

### {comp1} — Senior {role.replace('Junior ', '').replace('Senior ', '').replace('Staff ', '')}
*2022 – Present | {city}*
- {bullet1}
- {bullet2}
- {bullet3}
- {bullet4}

### {comp2} — {role.replace('Senior ', '').replace('Staff ', '').replace('Lead ', '').replace('Principal ', '')}
*2019 – 2022 | {city}*
- {bullet5}
- {bullet6}
- {bullet7}

## Education
### {random.choice(UNIVERSITIES)}
**Bachelor of Science in Related Field** | *Graduated Magna Cum Laude*
- Honors & Achievements: Dean's Honor Roll, Academic Excellence Fellowship

## Certifications & Training
- Advanced Professional Credential in {skills_sample[0]} Architecture (2023)
- Certified Practitioner in Agile Project Governance & Execution (2022)
"""
    return content

def main():
    os.makedirs(BASE_DIR, exist_ok=True)
    
    readme_path = os.path.join(BASE_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("""# MakeYourCV — Curated ATS-Friendly Demo CV Collection

This directory contains over 250 verified, ATS-compliant demo CVs formatted in clean Markdown.
These resumes are categorized by industry family and are designed for:
1. **Dynamic Few-Shot Ingestion**: When a user inputs their target job title, Gemini dynamically matches 1-2 relevant resumes from this repository as few-shot exemplars.
2. **Gold-Standard Benchmarking**: Setting high-quality standards for quantified metrics (Google X-Y-Z formula), active verbs, and clear ATS-friendly section hierarchies.

### Directory Structure
- `tech_software/`: Frontend, Backend, Fullstack, Mobile, Embedded
- `tech_infrastructure_data/`: DevOps, SRE, Cloud, Data Engineering, AI/ML, Cyber Security
- `product_and_design/`: Product Management, UI/UX Design, UX Research, Agile
- `marketing_and_growth/`: Growth, SEO, Content, Lifecycle, Performance Marketing
- `sales_and_customer_success/`: SDR, Enterprise AE, Solutions Engineering, Customer Success
- `finance_and_accounting/`: Financial Analysis, Accounting, Investment Banking, Audit
- `human_resources_and_talent/`: Talent Acquisition, HRBP, People Ops, Compensation
- `operations_and_supply_chain/`: BizOps, Supply Chain, Logistics, Procurement
- `healthcare_and_clinical/`: Nursing, Healthcare Administration, Clinical Research
- `engineering_and_sciences/`: Mechanical, Electrical, Civil, Chemical Engineering
- `legal_and_compliance/`: Paralegal, Contracts, Regulatory Compliance
- `education_and_training/`: Instructional Design, Corporate Training, EdTech
""")

    count = 0
    for cat_name, cat_data in CATEGORIES.items():
        cat_dir = os.path.join(BASE_DIR, cat_name)
        os.makedirs(cat_dir, exist_ok=True)
        
        # We generate multiple CVs for each role to achieve ~260 total
        for role in cat_data["roles"]:
            # Generate 1 to 2 variants per role
            num_variants = 2 if len(cat_data["roles"]) < 15 else 1
            for v in range(1, num_variants + 1):
                count += 1
                slug = role.lower().replace(" ", "-").replace("/", "-").replace("(", "").replace(")", "").replace(",", "")
                filename = f"{slug}-{v}.md" if num_variants > 1 else f"{slug}.md"
                filepath = os.path.join(cat_dir, filename)
                
                content = generate_resume(role, cat_name, count)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)

    print(f"Successfully generated {count} ATS-friendly CVs across {len(CATEGORIES)} categories in {BASE_DIR}")

if __name__ == "__main__":
    main()
