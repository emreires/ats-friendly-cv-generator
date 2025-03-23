// Dark mode functionality
let darkMode = localStorage.getItem('darkMode') === 'true';

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    updateDarkMode();
}

function updateDarkMode() {
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Navigation functions
function showForm() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('cv-form').classList.remove('hidden');
    document.getElementById('cv-preview').classList.add('hidden');
    showStep(1);
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
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('ring-2', 'ring-blue-500');
    });
    document.querySelector(`[data-template="${template}"]`).classList.add('ring-2', 'ring-blue-500');
    
    showNotification('Template selected: ' + template.charAt(0).toUpperCase() + template.slice(1));
}

// Step navigation functions
function showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step-${i}`).classList.add('hidden');
    }
    
    // Show current step
    document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
    
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
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        const circle = step.querySelector('.rounded-full');
        const text = step.querySelector('.text-sm');
        
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
    });
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
    // Personal Information
    const personalInfo = document.createElement('div');
    personalInfo.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${formData.get('fullName')}</h1>
            <div class="text-gray-600 dark:text-gray-400 space-x-4">
                ${formData.get('email') ? `<span>${formData.get('email')}</span>` : ''}
                ${formData.get('phone') ? `<span>${formData.get('phone')}</span>` : ''}
                ${formData.get('location') ? `<span>${formData.get('location')}</span>` : ''}
            </div>
        </div>
    `;
    container.appendChild(personalInfo);
    
    // Professional Summary
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
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">${institution}</h3>
                        <p class="text-gray-600 dark:text-gray-400">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        container.appendChild(education);
    }
    
    // Skills
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${skills.split(',').map(skill => `
                        <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(skillsDiv);
    }
}

function generateModernTemplate(formData, container) {
    // Similar to classic but with modern styling
    // Implementation will be similar but with different CSS classes and layout
    generateClassicTemplate(formData, container); // Temporary fallback
}

function generateProfessionalTemplate(formData, container) {
    // Similar to classic but with professional styling
    // Implementation will be similar but with different CSS classes and layout
    generateClassicTemplate(formData, container); // Temporary fallback
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLanding();
    updateDarkMode();
}); 