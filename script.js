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
    
    // Add alignment controls
    const alignmentControls = document.createElement('div');
    alignmentControls.className = 'mb-4 flex justify-end space-x-2 alignment-controls';
    alignmentControls.innerHTML = `
        <button onclick="updateClassicAlignment('left')" class="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            Left
        </button>
        <button onclick="updateClassicAlignment('center')" class="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            Center
        </button>
        <button onclick="updateClassicAlignment('right')" class="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            Right
        </button>
    `;
    container.appendChild(alignmentControls);
    
    // Personal Information with alignment class
    const personalInfo = document.createElement('div');
    personalInfo.className = 'text-center mb-8 classic-alignment';
    personalInfo.innerHTML = `
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">${formData.get('fullName')}</h1>
        <div class="text-gray-600 dark:text-gray-400 space-x-6">
            ${formData.get('email') ? `<span>${formData.get('email')}</span>` : ''}
            ${formData.get('phone') ? `<span>${formData.get('phone')}</span>` : ''}
            ${formData.get('location') ? `<span>${formData.get('location')}</span>` : ''}
        </div>
    `;
    container.appendChild(personalInfo);
    
    // Professional Summary with alignment class
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.className = 'mb-8 text-center max-w-3xl mx-auto classic-alignment';
        summary.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Professional Summary</h2>
            <p class="text-gray-700 dark:text-gray-300">${formData.get('summary')}</p>
        `;
        container.appendChild(summary);
    }
    
    // Work Experience with alignment class
    const companies = formData.getAll('company[]');
    if (companies.length > 0 && companies[0] !== '') {
        const experience = document.createElement('div');
        experience.className = 'mb-8 classic-alignment';
        experience.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.getAll('position[]');
                const startDates = formData.getAll('startDate[]');
                const endDates = formData.getAll('endDate[]');
                const descriptions = formData.getAll('description[]');
                
                experience.innerHTML += `
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${company}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">${positions[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                        <p class="text-gray-700 dark:text-gray-300">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experience.innerHTML += '</div>';
        container.appendChild(experience);
    }
    
    // Education with alignment class
    const institutions = formData.getAll('institution[]');
    if (institutions.length > 0 && institutions[0] !== '') {
        const education = document.createElement('div');
        education.className = 'mb-8 classic-alignment';
        education.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.getAll('degree[]');
                const startDates = formData.getAll('eduStartDate[]');
                const endDates = formData.getAll('eduEndDate[]');
                
                education.innerHTML += `
                    <div class="mb-6">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${institution}</h3>
                        <p class="text-gray-600 dark:text-gray-400">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        container.appendChild(education);
    }
    
    // Skills with alignment class
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.className = 'mb-8 classic-alignment';
        skillsDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>
            <div class="flex flex-wrap gap-3">
                ${skills.split(',').map(skill => `
                    <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">${skill.trim()}</span>
                `).join('')}
            </div>
        `;
        container.appendChild(skillsDiv);
    }
}

// Update the alignment function to handle section titles
function updateClassicAlignment(alignment) {
    const elements = document.querySelectorAll('.classic-alignment');
    elements.forEach(element => {
        element.className = element.className.replace(/text-(left|center|right)/, '');
        element.className += ` text-${alignment}`;
        
        // Update section titles
        const titles = element.querySelectorAll('h2');
        titles.forEach(title => {
            title.className = title.className.replace(/text-(left|center|right)/, '');
            title.className += ` text-${alignment}`;
        });
    });
}

function generateModernTemplate(formData, container) {
    container.className = 'cv-template-modern max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg';
    
    // Two-column layout
    const layout = document.createElement('div');
    layout.className = 'grid grid-cols-1 md:grid-cols-3 gap-8';
    
    // Left sidebar with personal info
    const sidebar = document.createElement('div');
    sidebar.className = 'md:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg';
    
    sidebar.innerHTML = `
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${formData.get('fullName')}</h1>
            <div class="space-y-2 text-gray-600 dark:text-gray-300">
                ${formData.get('email') ? `<div>${formData.get('email')}</div>` : ''}
                ${formData.get('phone') ? `<div>${formData.get('phone')}</div>` : ''}
                ${formData.get('location') ? `<div>${formData.get('location')}</div>` : ''}
            </div>
        </div>
        
        ${formData.get('summary') ? `
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Summary</h2>
                <p class="text-gray-700 dark:text-gray-300 text-sm">${formData.get('summary')}</p>
            </div>
        ` : ''}
        
        ${formData.get('skills') ? `
            <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${formData.get('skills').split(',').map(skill => `
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-xs">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    // Main content area
    const mainContent = document.createElement('div');
    mainContent.className = 'md:col-span-2';
    
    // Work Experience
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
        mainContent.appendChild(experience);
    }
    
    // Education
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
                    <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${institution}</h3>
                        <p class="text-blue-600 dark:text-blue-400">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        mainContent.appendChild(education);
    }
    
    layout.appendChild(sidebar);
    layout.appendChild(mainContent);
    container.appendChild(layout);
}

function generateProfessionalTemplate(formData, container) {
    container.className = 'cv-template-professional max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg';
    
    // Two-column layout
    const layout = document.createElement('div');
    layout.className = 'grid grid-cols-1 md:grid-cols-3 gap-8';
    
    // Main content area (left)
    const mainContent = document.createElement('div');
    mainContent.className = 'md:col-span-2';
    
    // Professional Summary
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Summary</h2>
                <p class="text-gray-700 dark:text-gray-300">${formData.get('summary')}</p>
            </div>
        `;
        mainContent.appendChild(summary);
    }
    
    // Work Experience
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
        mainContent.appendChild(experience);
    }
    
    // Education
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
        mainContent.appendChild(education);
    }
    
    // Right sidebar with personal info and skills
    const sidebar = document.createElement('div');
    sidebar.className = 'md:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg';
    
    sidebar.innerHTML = `
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${formData.get('fullName')}</h1>
            <div class="space-y-2 text-gray-600 dark:text-gray-300">
                ${formData.get('email') ? `<div>${formData.get('email')}</div>` : ''}
                ${formData.get('phone') ? `<div>${formData.get('phone')}</div>` : ''}
                ${formData.get('location') ? `<div>${formData.get('location')}</div>` : ''}
            </div>
        </div>
        
        ${formData.get('skills') ? `
            <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${formData.get('skills').split(',').map(skill => `
                        <span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    layout.appendChild(mainContent);
    layout.appendChild(sidebar);
    container.appendChild(layout);
}

// PDF Generation
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const element = document.getElementById('cv-content');
    
    try {
        showNotification('Generating PDF...');
        
        // Get the element's dimensions
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        
        // Calculate the scale to fit on A4
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const scale = Math.min(pageWidth / elementWidth, pageHeight / elementHeight);
        
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            width: elementWidth,
            height: elementHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = elementWidth * scale;
        const imgHeight = elementHeight * scale;
        
        // Center the content on the page
        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = (pageHeight - imgHeight) / 2;
        
        doc.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
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
    
    // Create and add work experience entries
    workExperiences.forEach(exp => {
        const template = document.createElement('div');
        template.className = 'work-experience-entry space-y-4 p-4 border dark:border-gray-700 rounded-lg';
        template.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                    <input type="text" name="company[]" value="${exp.company}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                    <input type="text" name="position[]" value="${exp.position}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input type="date" name="startDate[]" value="${exp.startDate}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input type="date" name="endDate[]" value="${exp.endDate}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea name="description[]" rows="3" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">${exp.description}</textarea>
            </div>
        `;
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
    
    // Create and add education entries
    education.forEach(edu => {
        const template = document.createElement('div');
        template.className = 'education-entry space-y-4 p-4 border dark:border-gray-700 rounded-lg';
        template.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                    <input type="text" name="institution[]" value="${edu.institution}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                    <input type="text" name="degree[]" value="${edu.degree}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input type="date" name="eduStartDate[]" value="${edu.startDate}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input type="date" name="eduEndDate[]" value="${edu.endDate}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
            </div>
        `;
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