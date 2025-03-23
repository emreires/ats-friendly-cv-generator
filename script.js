// Dark mode functionality
let darkMode = localStorage.getItem('darkMode') === 'true';

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    updateDarkMode();
}

function updateDarkMode() {
    const html = document.documentElement;
    if (darkMode) {
        html.classList.add('dark');
        document.body.classList.add('dark:bg-gray-900');
    } else {
        html.classList.remove('dark');
        document.body.classList.remove('dark:bg-gray-900');
    }
}

// Navigation functions
function showForm() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('cv-form').classList.remove('hidden');
    document.getElementById('cv-preview').classList.add('hidden');
    showStep(1);
    
    // Scroll to form with offset for navbar
    const formSection = document.getElementById('cv-form');
    const navbarHeight = document.querySelector('nav').offsetHeight;
    window.scrollTo({
        top: formSection.offsetTop - navbarHeight,
        behavior: 'smooth'
    });
}

function showLanding() {
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('cv-form').classList.add('hidden');
    document.getElementById('cv-preview').classList.add('hidden');
}

function showPreview() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('cv-form').classList.add('hidden');
    document.getElementById('cv-preview').classList.remove('hidden');
}

function editCV() {
    showForm();
}

// Template selection
let selectedTemplate = 'classic';

function selectTemplate(template) {
    selectedTemplate = template;
    const templateOptions = document.querySelectorAll('.template-option');
    if (templateOptions) {
        templateOptions.forEach(option => {
            option.classList.remove('ring-2', 'ring-blue-500');
        });
        const selectedOption = document.querySelector(`[data-template="${template}"]`);
        if (selectedOption) {
            selectedOption.classList.add('ring-2', 'ring-blue-500');
        }
    }
    showNotification('Template selected: ' + template.charAt(0).toUpperCase() + template.slice(1));
}

// Step navigation functions
function showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step) {
            step.classList.add('hidden');
        }
    }
    
    // Show current step
    const currentStep = document.getElementById(`step-${stepNumber}`);
    if (currentStep) {
        currentStep.classList.remove('hidden');
    }
    
    // Update progress indicators
    updateProgress(stepNumber);
}

function nextStep(currentStep) {
    if (validateStep(currentStep)) {
        showStep(currentStep + 1);
    }
}

function prevStep(currentStep) {
    showStep(currentStep - 1);
}

function updateProgress(currentStep) {
    const steps = document.querySelectorAll('.flex.items-center');
    if (steps) {
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            const circle = step.querySelector('.rounded-full');
            const text = step.querySelector('.text-sm');
            
            if (circle && text) {
                if (stepNumber < currentStep) {
                    circle.classList.remove('bg-gray-200', 'text-gray-600');
                    circle.classList.add('bg-green-500', 'text-white');
                    text.classList.remove('text-gray-500');
                    text.classList.add('text-gray-900', 'dark:text-white');
                } else if (stepNumber === currentStep) {
                    circle.classList.remove('bg-gray-200', 'text-gray-600', 'bg-green-500');
                    circle.classList.add('bg-blue-600', 'text-white');
                    text.classList.remove('text-gray-500');
                    text.classList.add('text-gray-900', 'dark:text-white');
                } else {
                    circle.classList.remove('bg-blue-600', 'bg-green-500', 'text-white');
                    circle.classList.add('bg-gray-200', 'text-gray-600');
                    text.classList.remove('text-gray-900', 'dark:text-white');
                    text.classList.add('text-gray-500');
                }
            }
        });
    }
}

function validateStep(step) {
    const form = document.getElementById('cv-generator-form');
    const stepElement = document.getElementById(`step-${step}`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-500');
            showNotification('Please fill in all required fields', 'error');
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Notification function
function showNotification(message, type = 'info') {
    const options = {
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        style: {
            background: type === 'error' ? '#EF4444' : '#3B82F6',
            color: 'white',
            borderRadius: '0.5rem',
        }
    };
    
    Toastify(options).showToast();
}

// Form handling functions
function addWorkExperience() {
    const container = document.getElementById('work-experience-container');
    const template = container.querySelector('.work-experience-entry').cloneNode(true);
    
    // Clear input values
    template.querySelectorAll('input, textarea').forEach(input => {
        input.value = '';
    });
    
    container.appendChild(template);
    showNotification('New work experience section added');
}

function addEducation() {
    const container = document.getElementById('education-container');
    const template = container.querySelector('.education-entry').cloneNode(true);
    
    // Clear input values
    template.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    
    container.appendChild(template);
    showNotification('New education section added');
}

// CV Generation functions
function generateCV() {
    const formData = new FormData(document.getElementById('cv-generator-form'));
    const cvContent = document.getElementById('cv-content');
    
    // Clear previous content
    cvContent.innerHTML = '';
    
    // Apply selected template class
    cvContent.className = `cv-template-${selectedTemplate}`;
    
    // Generate CV content based on template
    generateCVContent(formData, selectedTemplate);
    
    showPreview();
    showNotification('CV generated successfully');
}

function generateCVContent(formData, template) {
    const cvContent = document.getElementById('cv-content');
    
    switch (template) {
        case 'classic':
            generateClassicTemplate(formData, cvContent);
            break;
        case 'modern':
            generateModernTemplate(formData, cvContent);
            break;
        case 'professional':
            generateProfessionalTemplate(formData, cvContent);
            break;
        default:
            generateClassicTemplate(formData, cvContent);
    }
}

// Template generation functions
function generateClassicTemplate(formData, container) {
    container.className = 'cv-template-classic max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg';
    
    // Personal Information with classic header
    const personalInfo = document.createElement('div');
    personalInfo.innerHTML = `
        <div class="mb-8 border-b-2 border-gray-300 dark:border-gray-600 pb-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${formData.get('fullName')}</h1>
            <div class="text-gray-600 dark:text-gray-400 space-x-4">
                ${formData.get('email') ? `<span>${formData.get('email')}</span>` : ''}
                ${formData.get('phone') ? `<span>${formData.get('phone')}</span>` : ''}
                ${formData.get('location') ? `<span>${formData.get('location')}</span>` : ''}
            </div>
        </div>
    `;
    container.appendChild(personalInfo);
    
    // Professional Summary with classic style
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-300 dark:border-gray-600 pb-2">Professional Summary</h2>
                <p class="text-gray-700 dark:text-gray-300">${formData.get('summary')}</p>
            </div>
        `;
        container.appendChild(summary);
    }
    
    // Work Experience with classic layout
    const companies = formData.getAll('company[]');
    if (companies.length > 0 && companies[0] !== '') {
        const experience = document.createElement('div');
        experience.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.getAll('position[]');
                const startDates = formData.getAll('startDate[]');
                const endDates = formData.getAll('endDate[]');
                const descriptions = formData.getAll('description[]');
                
                experience.innerHTML += `
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">${company}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">${positions[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                        <p class="text-gray-700 dark:text-gray-300">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experience.innerHTML += '</div>';
        container.appendChild(experience);
    }
    
    // Education with classic style
    const institutions = formData.getAll('institution[]');
    if (institutions.length > 0 && institutions[0] !== '') {
        const education = document.createElement('div');
        education.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.getAll('degree[]');
                const startDates = formData.getAll('eduStartDate[]');
                const endDates = formData.getAll('eduEndDate[]');
                
                education.innerHTML += `
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">${institution}</h3>
                        <p class="text-gray-600 dark:text-gray-400">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        container.appendChild(education);
    }
    
    // Skills with classic design
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${skills.split(',').map(skill => `
                        <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(skillsDiv);
    }
}

function generateModernTemplate(formData, container) {
    container.className = 'cv-template-modern max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg';
    
    // Personal Information with modern gradient header
    const personalInfo = document.createElement('div');
    personalInfo.innerHTML = `
        <div class="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <h1 class="text-4xl font-bold mb-2">${formData.get('fullName')}</h1>
            <div class="space-x-4 text-blue-100">
                ${formData.get('email') ? `<span>${formData.get('email')}</span>` : ''}
                ${formData.get('phone') ? `<span>${formData.get('phone')}</span>` : ''}
                ${formData.get('location') ? `<span>${formData.get('location')}</span>` : ''}
            </div>
        </div>
    `;
    container.appendChild(personalInfo);
    
    // Professional Summary with modern card design
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <div class="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Summary</h2>
                <p class="text-gray-700 dark:text-gray-300">${formData.get('summary')}</p>
            </div>
        `;
        container.appendChild(summary);
    }
    
    // Work Experience with modern timeline design
    const companies = formData.getAll('company[]');
    if (companies.length > 0 && companies[0] !== '') {
        const experience = document.createElement('div');
        experience.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.getAll('position[]');
                const startDates = formData.getAll('startDate[]');
                const endDates = formData.getAll('endDate[]');
                const descriptions = formData.getAll('description[]');
                
                experience.innerHTML += `
                    <div class="mb-8 relative pl-8 border-l-2 border-blue-500">
                        <div class="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${company}</h3>
                        <p class="text-blue-600 dark:text-blue-400 mb-2">${positions[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                        <p class="text-gray-700 dark:text-gray-300">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experience.innerHTML += '</div>';
        container.appendChild(experience);
    }
    
    // Education with modern card design
    const institutions = formData.getAll('institution[]');
    if (institutions.length > 0 && institutions[0] !== '') {
        const education = document.createElement('div');
        education.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.getAll('degree[]');
                const startDates = formData.getAll('eduStartDate[]');
                const endDates = formData.getAll('eduEndDate[]');
                
                education.innerHTML += `
                    <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${institution}</h3>
                        <p class="text-blue-600 dark:text-blue-400">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        container.appendChild(education);
    }
    
    // Skills with modern design
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>
                <div class="flex flex-wrap gap-3">
                    ${skills.split(',').map(skill => `
                        <span class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(skillsDiv);
    }
}

function generateProfessionalTemplate(formData, container) {
    container.className = 'cv-template-professional max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg';
    
    // Personal Information with professional header
    const personalInfo = document.createElement('div');
    personalInfo.innerHTML = `
        <div class="mb-8 border-b-4 border-gray-300 dark:border-gray-600 pb-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${formData.get('fullName')}</h1>
            <div class="text-gray-600 dark:text-gray-400 space-x-4">
                ${formData.get('email') ? `<span>${formData.get('email')}</span>` : ''}
                ${formData.get('phone') ? `<span>${formData.get('phone')}</span>` : ''}
                ${formData.get('location') ? `<span>${formData.get('location')}</span>` : ''}
            </div>
        </div>
    `;
    container.appendChild(personalInfo);
    
    // Professional Summary with clean design
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Summary</h2>
                <p class="text-gray-700 dark:text-gray-300">${formData.get('summary')}</p>
            </div>
        `;
        container.appendChild(summary);
    }
    
    // Work Experience with professional layout
    const companies = formData.getAll('company[]');
    if (companies.length > 0 && companies[0] !== '') {
        const experience = document.createElement('div');
        experience.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.getAll('position[]');
                const startDates = formData.getAll('startDate[]');
                const endDates = formData.getAll('endDate[]');
                const descriptions = formData.getAll('description[]');
                
                experience.innerHTML += `
                    <div class="mb-6">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">${company}</h3>
                            <span class="text-gray-600 dark:text-gray-400">${formatDate(startDates[index])} - ${formatDate(endDates[index])}</span>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">${positions[index]}</p>
                        <p class="text-gray-700 dark:text-gray-300">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experience.innerHTML += '</div>';
        container.appendChild(experience);
    }
    
    // Education with professional layout
    const institutions = formData.getAll('institution[]');
    if (institutions.length > 0 && institutions[0] !== '') {
        const education = document.createElement('div');
        education.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.getAll('degree[]');
                const startDates = formData.getAll('eduStartDate[]');
                const endDates = formData.getAll('eduEndDate[]');
                
                education.innerHTML += `
                    <div class="mb-6">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">${institution}</h3>
                            <span class="text-gray-600 dark:text-gray-400">${formatDate(startDates[index])} - ${formatDate(endDates[index])}</span>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400">${degrees[index]}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        container.appendChild(education);
    }
    
    // Skills with professional design
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${skills.split(',').map(skill => `
                        <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(skillsDiv);
    }
}

// PDF Generation
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const element = document.getElementById('cv-content');
    
    try {
        showNotification('Generating PDF...');
        
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('cv.pdf');
        
        showNotification('PDF downloaded successfully');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Form submission handler
document.getElementById('cv-generator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateStep(4)) {
        generateCV();
    }
});

// Test mode functionality
function enableTestMode() {
    const form = document.getElementById('cv-generator-form');
    
    // Personal Information
    form.querySelector('[name="fullName"]').value = 'John Doe';
    form.querySelector('[name="email"]').value = 'john.doe@example.com';
    form.querySelector('[name="phone"]').value = '+1 (555) 123-4567';
    form.querySelector('[name="location"]').value = 'San Francisco, CA';
    form.querySelector('[name="summary"]').value = 'Experienced software developer with 5+ years of expertise in full-stack development. Strong problem-solving skills and a passion for creating efficient, scalable solutions. Proven track record of delivering high-quality software products and leading development teams.';
    
    // Work Experience
    const workContainer = document.getElementById('work-experience-container');
    workContainer.innerHTML = ''; // Clear existing entries
    
    const workExperiences = [
        {
            company: 'Tech Solutions Inc.',
            position: 'Senior Software Engineer',
            startDate: '2020-01',
            endDate: '2023-12',
            description: 'Led development of microservices architecture. Implemented CI/CD pipelines and automated testing frameworks. Mentored junior developers and conducted code reviews. Reduced system downtime by 40% through improved monitoring and alerting.'
        },
        {
            company: 'Digital Innovations',
            position: 'Full Stack Developer',
            startDate: '2018-03',
            endDate: '2019-12',
            description: 'Developed and maintained multiple web applications using React and Node.js. Improved application performance by 40%. Implemented responsive design patterns and accessibility features. Collaborated with UX team to enhance user experience.'
        },
        {
            company: 'StartUp Ventures',
            position: 'Software Developer',
            startDate: '2017-01',
            endDate: '2018-02',
            description: 'Built and deployed cloud-native applications using AWS services. Developed RESTful APIs and microservices. Implemented automated testing and continuous integration.'
        }
    ];
    
    workExperiences.forEach(exp => {
        const template = workContainer.querySelector('.work-experience-entry').cloneNode(true);
        template.querySelector('[name="company[]"]').value = exp.company;
        template.querySelector('[name="position[]"]').value = exp.position;
        template.querySelector('[name="startDate[]"]').value = exp.startDate;
        template.querySelector('[name="endDate[]"]').value = exp.endDate;
        template.querySelector('[name="description[]"]').value = exp.description;
        workContainer.appendChild(template);
    });
    
    // Education
    const eduContainer = document.getElementById('education-container');
    eduContainer.innerHTML = ''; // Clear existing entries
    
    const education = [
        {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science in Computer Science',
            startDate: '2014-09',
            endDate: '2018-05'
        },
        {
            institution: 'Stanford University',
            degree: 'Master of Science in Software Engineering',
            startDate: '2018-09',
            endDate: '2020-05'
        }
    ];
    
    education.forEach(edu => {
        const template = eduContainer.querySelector('.education-entry').cloneNode(true);
        template.querySelector('[name="institution[]"]').value = edu.institution;
        template.querySelector('[name="degree[]"]').value = edu.degree;
        template.querySelector('[name="eduStartDate[]"]').value = edu.startDate;
        template.querySelector('[name="eduEndDate[]"]').value = edu.endDate;
        eduContainer.appendChild(template);
    });
    
    // Skills
    form.querySelector('[name="skills"]').value = 'JavaScript, Python, React, Node.js, SQL, Git, AWS, Docker, Kubernetes, Agile, Scrum, REST APIs, Microservices, TypeScript, GraphQL, CI/CD, Test-Driven Development, System Design, Cloud Architecture, Leadership, Team Management, Problem Solving, Communication';
    
    showNotification('Test mode enabled - form filled with comprehensive sample data');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLanding();
    updateDarkMode();
}); 