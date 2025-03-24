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
    
    // Update CV preview container background
    const previewContainer = document.querySelector('#cv-preview .bg-white');
    if (previewContainer) {
        previewContainer.classList.add('dark:bg-gray-800');
    }
}

function editCV() {
    showForm();
}

// Template selection
let selectedTemplate = 'classic';

function selectTemplate(templateId) {
    // Remove active class from all template options
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('ring-2', 'ring-blue-500', 'dark:ring-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
    });
    
    // Add active class to selected template
    const selectedOption = document.querySelector(`[data-template="${templateId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('ring-2', 'ring-blue-500', 'dark:ring-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
        showNotification(`${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template selected`);
    }
    
    // Store the selected template ID
    selectedTemplate = templateId;
    
    // Show appropriate template settings
    document.querySelectorAll('.template-settings').forEach(settings => {
        settings.classList.add('hidden');
    });
    
    const settingsMap = {
        'classic': 'classicTemplateSettings',
        'modern': 'modernTemplateSettings',
        'professional': 'professionalTemplateSettings'
    };
    
    const settingsId = settingsMap[templateId];
    if (settingsId) {
        document.getElementById(settingsId).classList.remove('hidden');
    }
}

// Step navigation functions
function showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= 5; i++) {
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
    
    // Show appropriate template settings when on appearance step
    if (stepNumber === 5) {
        showTemplateSettings(selectedTemplate);
    }
}

// Navigation for form steps
function nextStep(currentStep) {
    // If current step is explicitly provided (old function call from event handlers)
    if (currentStep !== undefined) {
        if (validateStep(currentStep)) {
            showStep(currentStep + 1);
        }
    } 
    // Otherwise determine the current step automatically (new function call)
    else {
        const currentStepNumber = getCurrentStep();
        if (currentStepNumber < 5) {
            showStep(currentStepNumber + 1);
        }
    }
}

function prevStep(currentStep) {
    // If current step is explicitly provided (old function call from event handlers)
    if (currentStep !== undefined) {
        showStep(currentStep - 1);
    } 
    // Otherwise determine the current step automatically (new function call)
    else {
        const currentStepNumber = getCurrentStep();
        if (currentStepNumber > 1) {
            showStep(currentStepNumber - 1);
        }
    }
}

function updateProgress(stepNumber) {
    const progressBarInner = document.getElementById('progress-bar-inner');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Calculate progress percentage based on current step
    const totalSteps = 5; // Now we have 5 steps
    const progressPercentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    
    if (progressBarInner) {
        progressBarInner.style.width = `${progressPercentage}%`;
    }
    
    if (progressSteps) {
        progressSteps.forEach((step, index) => {
            // Add 1 to index since steps are 1-indexed
            const stepIndex = index + 1;
            const circle = step.querySelector('.w-8.h-8');
            const label = step.querySelector('.mt-2.font-medium');
            
            // Current step
            if (stepIndex === stepNumber) {
                // Update circle
                if (circle) {
                    circle.classList.remove('bg-gray-200', 'text-gray-600', 'dark:bg-gray-700', 'dark:text-gray-400', 'bg-green-500');
                    circle.classList.add('bg-blue-600', 'text-white');
                    circle.innerHTML = stepIndex; // Show number for current step
                }
                // Update label
                if (label) {
                    label.classList.remove('text-gray-500', 'dark:text-gray-400');
                    label.classList.add('text-gray-900', 'dark:text-white');
                }
            } 
            // Completed steps
            else if (stepIndex < stepNumber) {
                // Update circle
                if (circle) {
                    circle.classList.remove('bg-gray-200', 'text-gray-600', 'dark:bg-gray-700', 'dark:text-gray-400', 'bg-blue-600');
                    circle.classList.add('bg-green-500', 'text-white');
                    // Add checkmark icon for completed steps
                    circle.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>`;
                }
                // Update label
                if (label) {
                    label.classList.remove('text-gray-500', 'dark:text-gray-400');
                    label.classList.add('text-gray-900', 'dark:text-white');
                }
            } 
            // Future steps
            else {
                // Update circle
                if (circle) {
                    circle.classList.remove('bg-blue-600', 'bg-green-500', 'text-white');
                    circle.classList.add('bg-gray-200', 'text-gray-600', 'dark:bg-gray-700', 'dark:text-gray-400');
                    circle.innerHTML = stepIndex; // Show number for future steps
                }
                // Update label
                if (label) {
                    label.classList.remove('text-gray-900', 'dark:text-white');
                    label.classList.add('text-gray-500', 'dark:text-gray-400');
                }
            }
        });
    }
    
    // Update next/prev buttons
    updateNavigationButtons(stepNumber, totalSteps);
}

function validateStep(step) {
    // Simple validation for required fields
    if (step === 1) {
        const fullName = document.querySelector('input[name="fullName"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        
        if (!fullName) {
            showNotification('Please enter your full name', 'error');
            return false;
        }
        
        if (!email) {
            showNotification('Please enter your email', 'error');
            return false;
        }
    }
    
    return true;
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
    const div = document.createElement('div');
    div.className = 'space-y-6 mt-6 border-t border-gray-200 dark:border-gray-700 pt-6';
    div.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Company</label>
                <input type="text" name="company[]" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Position</label>
                <input type="text" name="position[]" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Date</label>
                <input type="date" name="startDate[]" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">End Date</label>
                <input type="date" name="endDate[]" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
        </div>
        <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea name="description[]" rows="3" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"></textarea>
        </div>
        <button type="button" class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors" onclick="this.parentElement.remove()">
            Remove
        </button>
    `;
    container.appendChild(div);
}

function addEducation() {
    const container = document.getElementById('education-container');
    const div = document.createElement('div');
    div.className = 'space-y-6 mt-6 border-t border-gray-200 dark:border-gray-700 pt-6';
    div.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Institution</label>
                <input type="text" name="institution[]" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Degree</label>
                <input type="text" name="degree[]" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Date</label>
                <input type="date" name="eduStartDate[]" required class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">End Date</label>
                <input type="date" name="eduEndDate[]" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200">
            </div>
        </div>
        <button type="button" class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors" onclick="this.parentElement.remove()">
            Remove
        </button>
    `;
    container.appendChild(div);
}

// CV Generation functions
function generateCV() {
    // Get form data
    const form = document.getElementById('cv-generator-form');
    const formData = {
        // Personal Information
        fullName: form.querySelector('[name="fullName"]').value,
        email: form.querySelector('[name="email"]').value,
        phone: form.querySelector('[name="phone"]').value,
        location: form.querySelector('[name="location"]').value,
        summary: form.querySelector('[name="summary"]').value,
        
        // Work Experience
        company: Array.from(form.querySelectorAll('[name="company[]"]')).map(input => input.value),
        position: Array.from(form.querySelectorAll('[name="position[]"]')).map(input => input.value),
        startDate: Array.from(form.querySelectorAll('[name="startDate[]"]')).map(input => input.value),
        endDate: Array.from(form.querySelectorAll('[name="endDate[]"]')).map(input => input.value),
        description: Array.from(form.querySelectorAll('[name="description[]"]')).map(input => input.value),
        
        // Education
        institution: Array.from(form.querySelectorAll('[name="institution[]"]')).map(input => input.value),
        degree: Array.from(form.querySelectorAll('[name="degree[]"]')).map(input => input.value),
        eduStartDate: Array.from(form.querySelectorAll('[name="eduStartDate[]"]')).map(input => input.value),
        eduEndDate: Array.from(form.querySelectorAll('[name="eduEndDate[]"]')).map(input => input.value),
        
        // Skills
        skills: form.querySelector('[name="skills"]').value,
        
        // Template and Appearance Settings
        template: selectedTemplate,
        accentColor: form.querySelector('[name="accentColor"]:checked')?.value || 'blue',
        
        // Classic Template Settings
        classicAlignment: form.querySelector('[name="classicAlignment"]:checked')?.value || 'left',
        classicBorder: form.querySelector('[name="classicBorder"]:checked')?.value || 'solid',
        
        // Modern Template Settings
        modernSidebar: form.querySelector('[name="modernSidebar"]:checked')?.value || 'light',
        modernSkills: form.querySelector('[name="modernSkills"]:checked')?.value || 'rounded',
        
        // Professional Template Settings
        professionalHeaders: form.querySelector('[name="professionalHeaders"]:checked')?.value || 'underline',
        professionalAvatar: form.querySelector('[name="professionalAvatar"]:checked')?.value || 'no'
    };
    
    // Generate CV content
    const cvContent = document.getElementById('cv-content');
    cvContent.innerHTML = '';
    
    // Generate template based on selection
    switch (formData.template) {
        case 'classic':
            generateClassicTemplate(formData, cvContent);
            break;
        case 'modern':
            generateModernTemplate(formData, cvContent);
            break;
        case 'professional':
            generateProfessionalTemplate(formData, cvContent);
            break;
    }
    
    // Show preview
    showPreview();
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
    const accentColor = getAccentColor(formData);
    const alignment = formData.classicAlignment || 'left';
    const borderStyle = updateBorderStyle(formData);
    
    container.className = 'cv-content bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto';
    container.style.textAlign = alignment;
    
    // Personal Information
    const personalInfo = document.createElement('div');
    personalInfo.className = `cv-section ${borderStyle} border-b-2 border-${accentColor.border}`;
    personalInfo.innerHTML = `
        <h1 class="text-3xl font-bold mb-4">${formData.fullName}</h1>
        <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                ${formData.email}
            </div>
            ${formData.phone ? `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    ${formData.phone}
                </div>
            ` : ''}
            ${formData.location ? `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    ${formData.location}
                </div>
            ` : ''}
        </div>
    `;
    container.appendChild(personalInfo);
    
    // Professional Summary
    if (formData.summary) {
        const summary = document.createElement('div');
        summary.className = `cv-section ${borderStyle} border-b-2 border-${accentColor.border}`;
        summary.innerHTML = `
            <h2 class="text-xl font-semibold mb-4">Professional Summary</h2>
            <p>${formData.summary}</p>
        `;
        container.appendChild(summary);
    }
    
    // Work Experience
    if (formData.company && formData.company.length > 0) {
        const experience = document.createElement('div');
        experience.className = `cv-section ${borderStyle} border-b-2 border-${accentColor.border}`;
        experience.innerHTML = `
            <h2 class="text-xl font-semibold mb-4">Work Experience</h2>
            ${formData.company.map((company, index) => `
                <div class="mb-6">
                    <h3 class="text-lg font-medium">${formData.position[index]}</h3>
                    <p class="text-${accentColor.text} mb-2">${company} | ${formatDate(formData.startDate[index])} - ${formData.endDate[index] ? formatDate(formData.endDate[index]) : 'Present'}</p>
                    <p>${formData.description[index]}</p>
                </div>
            `).join('')}
        `;
        container.appendChild(experience);
    }
    
    // Education
    if (formData.institution && formData.institution.length > 0) {
        const education = document.createElement('div');
        education.className = `cv-section ${borderStyle} border-b-2 border-${accentColor.border}`;
        education.innerHTML = `
            <h2 class="text-xl font-semibold mb-4">Education</h2>
            ${formData.institution.map((institution, index) => `
                <div class="mb-6">
                    <h3 class="text-lg font-medium">${formData.degree[index]}</h3>
                    <p class="text-${accentColor.text} mb-2">${institution} | ${formatDate(formData.eduStartDate[index])} - ${formData.eduEndDate[index] ? formatDate(formData.eduEndDate[index]) : 'Present'}</p>
                </div>
            `).join('')}
        `;
        container.appendChild(education);
    }
    
    // Skills
    if (formData.skills) {
        const skills = document.createElement('div');
        skills.className = `cv-section ${borderStyle} border-b-2 border-${accentColor.border}`;
        skills.innerHTML = `
            <h2 class="text-xl font-semibold mb-4">Skills</h2>
            <div class="flex flex-wrap gap-2">
                ${formData.skills.split(',').map(skill => `
                    <span class="skill-tag bg-${accentColor.bg} text-${accentColor.text}">${skill.trim()}</span>
                `).join('')}
            </div>
        `;
        container.appendChild(skills);
    }
}

function generateModernTemplate(formData, container) {
    container.className = 'cv-template-modern max-w-4xl mx-auto bg-white dark:bg-gray-800 p-0 rounded-lg shadow-lg overflow-hidden';
    
    // Get accent color
    const accentColor = getAccentColor(formData);
    
    // Get modern template settings
    const sidebarBg = formData.modernSidebar;
    const skillsStyle = formData.modernSkills;
    
    // Determine sidebar background class based on setting
    let sidebarBgClass = 'bg-gray-50 dark:bg-gray-700';
    if (sidebarBg === 'dark') {
        sidebarBgClass = 'bg-gray-700 dark:bg-gray-800 text-white';
    } else if (sidebarBg === 'accent') {
        sidebarBgClass = `${accentColor.light} text-white`;
    }
    
    // Determine skill tag style
    let skillTagStyle = 'rounded';
    if (skillsStyle === 'pill') {
        skillTagStyle = 'rounded-full';
    } else if (skillsStyle === 'square') {
        skillTagStyle = '';
    }
    
    // Create two-column layout
    const twoColumnLayout = document.createElement('div');
    twoColumnLayout.className = 'flex flex-col md:flex-row';
    
    // Right sidebar with personal information and skills (1/3 width)
    const sidebar = document.createElement('div');
    sidebar.className = `md:w-1/3 ${sidebarBgClass} p-6`;
    
    // Personal Information
    sidebar.innerHTML = `
        <div class="mb-8">
            <h1 class="text-2xl font-bold ${sidebarBg === 'light' ? 'text-gray-900 dark:text-gray-100' : 'text-white'} mb-4">${formData.fullName}</h1>
            <div class="space-y-2 ${sidebarBg === 'light' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-200'}">
                ${formData.email ? `<div class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg><span>${formData.email}</span></div>` : ''}
                ${formData.phone ? `<div class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg><span>${formData.phone}</span></div>` : ''}
                ${formData.location ? `<div class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg><span>${formData.location}</span></div>` : ''}
            </div>
        </div>
    `;
    
    // Skills in sidebar
    const skills = formData.skills;
    if (skills) {
        sidebar.innerHTML += `
            <div class="mb-8">
                <h2 class="text-xl font-semibold ${sidebarBg === 'light' ? 'text-gray-900 dark:text-gray-100' : 'text-white'} mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${skills.split(',').map(skill => `
                        <span class="px-3 py-1 ${sidebarBg === 'light' ? 'bg-white dark:bg-gray-600' : 'bg-white/10'} ${sidebarBg === 'light' ? 'text-gray-700 dark:text-gray-300' : 'text-white'} ${skillTagStyle} text-sm mb-2">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Professional Summary in sidebar
    if (formData.summary) {
        sidebar.innerHTML += `
            <div class="mb-8">
                <h2 class="text-xl font-semibold ${sidebarBg === 'light' ? 'text-gray-900 dark:text-gray-100' : 'text-white'} mb-4">Profile</h2>
                <p class="${sidebarBg === 'light' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-200'}">${formData.summary}</p>
            </div>
        `;
    }
    
    // Main content area (2/3 width)
    const mainContent = document.createElement('div');
    mainContent.className = 'md:w-2/3 p-6';
    
    // Work Experience in main content
    const companies = formData.company;
    if (companies.length > 0 && companies[0] !== '') {
        let experienceHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b ${accentColor.border} ${accentColor.darkBorder}">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.position;
                const startDates = formData.startDate;
                const endDates = formData.endDate;
                const descriptions = formData.description;
                
                experienceHTML += `
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">${company}</h3>
                        <p class="${accentColor.text} ${accentColor.darkText} mb-2">${positions[index]} | ${formatDate(startDates[index])} - ${endDates[index] ? formatDate(endDates[index]) : 'Present'}</p>
                        <p class="text-gray-700 dark:text-gray-300">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experienceHTML += '</div>';
        mainContent.innerHTML += experienceHTML;
    }
    
    // Education in main content
    const institutions = formData.institution;
    if (institutions.length > 0 && institutions[0] !== '') {
        let educationHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b ${accentColor.border} ${accentColor.darkBorder}">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.degree;
                const startDates = formData.eduStartDate;
                const endDates = formData.eduEndDate;
                
                educationHTML += `
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">${institution}</h3>
                        <p class="${accentColor.text} ${accentColor.darkText}">${degrees[index]} | ${formatDate(startDates[index])} - ${endDates[index] ? formatDate(endDates[index]) : 'Present'}</p>
                    </div>
                `;
            }
        });
        
        educationHTML += '</div>';
        mainContent.innerHTML += educationHTML;
    }
    
    // Assemble the layout
    twoColumnLayout.appendChild(sidebar);
    twoColumnLayout.appendChild(mainContent);
    container.appendChild(twoColumnLayout);
}

function generateProfessionalTemplate(formData, container) {
    container.className = 'cv-template-professional max-w-4xl mx-auto bg-white dark:bg-gray-800 p-0 rounded-lg shadow-lg overflow-hidden';
    
    // Get accent color
    const accentColor = getAccentColor(formData);
    
    // Get professional template settings
    const headerStyle = formData.professionalHeaders || 'underline';
    const showAvatar = formData.professionalAvatar || 'yes';
    
    // Determine header style class
    let headerClass = 'border-b-2';
    if (headerStyle === 'boxed') {
        headerClass = 'p-2 bg-gray-100 dark:bg-gray-700 rounded';
    } else if (headerStyle === 'plain') {
        headerClass = '';
    }
    
    // Create two-column layout
    const twoColumnLayout = document.createElement('div');
    twoColumnLayout.className = 'flex flex-col md:flex-row';
    
    // Left sidebar with personal information (1/3 width)
    const sidebar = document.createElement('div');
    sidebar.className = 'md:w-1/3 bg-gray-100 dark:bg-gray-700 p-6';
    
    // Personal Information in sidebar
    let avatarHTML = '';
    if (showAvatar === 'yes') {
        avatarHTML = `
            <div class="w-32 h-32 rounded-full ${accentColor.bg100} ${accentColor.darkBg900} mx-auto mb-4 flex items-center justify-center">
                <span class="text-4xl font-bold ${accentColor.text} dark:text-blue-300">${formData.fullName.split(' ').map(name => name[0]).join('')}</span>
            </div>
        `;
    }
    
    sidebar.innerHTML = `
        <div class="mb-8">
            ${avatarHTML}
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 ${showAvatar === 'yes' ? 'text-center' : ''}">${formData.fullName}</h1>
            <div class="space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                ${formData.email ? `<div class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg><span>${formData.email}</span></div>` : ''}
                ${formData.phone ? `<div class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg><span>${formData.phone}</span></div>` : ''}
                ${formData.location ? `<div class="flex items-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg><span>${formData.location}</span></div>` : ''}
            </div>
        </div>
    `;
    
    // Skills in sidebar
    const skills = formData.skills;
    if (skills) {
        sidebar.innerHTML += `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 ${headerClass} ${accentColor.border} ${accentColor.darkBorder}">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${skills.split(',').map(skill => `
                        <span class="px-3 py-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm mb-2">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Main content area (2/3 width)
    const mainContent = document.createElement('div');
    mainContent.className = 'md:w-2/3 p-6';
    
    // Professional Summary in main content
    if (formData.summary) {
        mainContent.innerHTML += `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 ${headerClass} ${accentColor.border} ${accentColor.darkBorder}">Professional Summary</h2>
                <p class="text-gray-700 dark:text-gray-300">${formData.summary}</p>
            </div>
        `;
    }
    
    // Work Experience in main content
    const companies = formData.company;
    if (companies.length > 0 && companies[0] !== '') {
        let experienceHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 ${headerClass} ${accentColor.border} ${accentColor.darkBorder}">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.position;
                const startDates = formData.startDate;
                const endDates = formData.endDate;
                const descriptions = formData.description;
                
                experienceHTML += `
                    <div class="mb-6">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">${company}</h3>
                            <span class="text-gray-600 dark:text-gray-300">${formatDate(startDates[index])} - ${endDates[index] ? formatDate(endDates[index]) : 'Present'}</span>
                        </div>
                        <p class="${accentColor.text} ${accentColor.darkText} mb-2">${positions[index]}</p>
                        <p class="text-gray-700 dark:text-gray-300">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experienceHTML += '</div>';
        mainContent.innerHTML += experienceHTML;
    }
    
    // Education in main content
    const institutions = formData.institution;
    if (institutions.length > 0 && institutions[0] !== '') {
        let educationHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 ${headerClass} ${accentColor.border} ${accentColor.darkBorder}">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.degree;
                const startDates = formData.eduStartDate;
                const endDates = formData.eduEndDate;
                
                educationHTML += `
                    <div class="mb-6">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">${institution}</h3>
                            <span class="text-gray-600 dark:text-gray-300">${formatDate(startDates[index])} - ${endDates[index] ? formatDate(endDates[index]) : 'Present'}</span>
                        </div>
                        <p class="${accentColor.text} ${accentColor.darkText}">${degrees[index]}</p>
                    </div>
                `;
            }
        });
        
        educationHTML += '</div>';
        mainContent.innerHTML += educationHTML;
    }
    
    // Assemble the layout
    twoColumnLayout.appendChild(sidebar);
    twoColumnLayout.appendChild(mainContent);
    container.appendChild(twoColumnLayout);
}

// PDF Generation
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const element = document.getElementById('cv-content');
    
    try {
        showNotification('Generating PDF...');
        
        // Get element dimensions
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        
        // A4 dimensions in mm
        const pageWidth = 210;
        const pageHeight = 297;
        
        // Calculate scale to fit content on one page
        const scale = Math.min(pageWidth / elementWidth, pageHeight / elementHeight);
        
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            width: elementWidth,
            height: elementHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate image dimensions to maintain aspect ratio
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
    // Fill in personal information
    document.querySelector('input[name="fullName"]').value = 'John Doe';
    document.querySelector('input[name="email"]').value = 'john.doe@example.com';
    document.querySelector('input[name="phone"]').value = '(123) 456-7890';
    document.querySelector('input[name="location"]').value = 'New York, NY';
    document.querySelector('textarea[name="summary"]').value = 'Experienced software engineer with a passion for building innovative solutions. Over 8 years of expertise in full-stack development, cloud architecture, and leading cross-functional teams.';

    // Clear existing entries
    document.getElementById('work-experience-container').innerHTML = '';
    document.getElementById('education-container').innerHTML = '';
    
    // Add work experiences
    addWorkExperience();
    const workExperiences = document.querySelectorAll('#work-experience-container > div');
    if (workExperiences.length > 0) {
        // First job
        const firstJob = workExperiences[0];
        firstJob.querySelector('input[name="company[]"]').value = 'Tech Innovations Inc.';
        firstJob.querySelector('input[name="position[]"]').value = 'Senior Software Engineer';
        firstJob.querySelector('input[name="startDate[]"]').value = '2020-01-15';
        firstJob.querySelector('input[name="endDate[]"]').value = '';
        firstJob.querySelector('textarea[name="description[]"]').value = 'Lead developer for enterprise SaaS products. Managed a team of 5 developers and implemented CI/CD pipelines that reduced deployment time by 40%.';
    }
    
    // Add second job
    addWorkExperience();
    const workExperiences2 = document.querySelectorAll('#work-experience-container > div');
    if (workExperiences2.length > 1) {
        const secondJob = workExperiences2[1];
        secondJob.querySelector('input[name="company[]"]').value = 'Digital Solutions LLC';
        secondJob.querySelector('input[name="position[]"]').value = 'Software Developer';
        secondJob.querySelector('input[name="startDate[]"]').value = '2017-03-10';
        secondJob.querySelector('input[name="endDate[]"]').value = '2019-12-20';
        secondJob.querySelector('textarea[name="description[]"]').value = 'Developed and maintained multiple web applications using React, Node.js, and MongoDB. Implemented responsive designs and optimized performance.';
    }
    
    // Add third job
    addWorkExperience();
    const workExperiences3 = document.querySelectorAll('#work-experience-container > div');
    if (workExperiences3.length > 2) {
        const thirdJob = workExperiences3[2];
        thirdJob.querySelector('input[name="company[]"]').value = 'StartUp Ventures';
        thirdJob.querySelector('input[name="position[]"]').value = 'Junior Developer';
        thirdJob.querySelector('input[name="startDate[]"]').value = '2015-06-01';
        thirdJob.querySelector('input[name="endDate[]"]').value = '2017-02-28';
        thirdJob.querySelector('textarea[name="description[]"]').value = 'Worked on front-end development using HTML, CSS, and JavaScript. Participated in Agile development processes and daily stand-ups.';
    }
    
    // Add education entries
    addEducation();
    const educations = document.querySelectorAll('#education-container > div');
    if (educations.length > 0) {
        // First education
        const firstEdu = educations[0];
        firstEdu.querySelector('input[name="institution[]"]').value = 'University of Technology';
        firstEdu.querySelector('input[name="degree[]"]').value = 'Master of Computer Science';
        firstEdu.querySelector('input[name="eduStartDate[]"]').value = '2013-09-01';
        firstEdu.querySelector('input[name="eduEndDate[]"]').value = '2015-05-30';
    }
    
    // Add second education
    addEducation();
    const educations2 = document.querySelectorAll('#education-container > div');
    if (educations2.length > 1) {
        const secondEdu = educations2[1];
        secondEdu.querySelector('input[name="institution[]"]').value = 'State University';
        secondEdu.querySelector('input[name="degree[]"]').value = 'Bachelor of Science in Computer Engineering';
        secondEdu.querySelector('input[name="eduStartDate[]"]').value = '2009-09-01';
        secondEdu.querySelector('input[name="eduEndDate[]"]').value = '2013-05-30';
    }
    
    // Fill in skills
    document.querySelector('input[name="skills"]').value = 'JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes, MongoDB, SQL, Git, CI/CD, Agile Development';
    
    // Show notification
    showNotification('Test mode enabled! Form filled with sample data.', 'success');
}

// Function to show only the relevant template settings
function showTemplateSettings(template) {
    const allSettings = document.querySelectorAll('.template-settings');
    allSettings.forEach(setting => setting.classList.add('hidden'));
    
    const activeSettings = document.getElementById(`${template}-settings`);
    if (activeSettings) {
        activeSettings.classList.remove('hidden');
    }
}

// Function to get accent color from form
function getAccentColor(formData) {
    const colorMap = {
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            border: 'border-blue-200',
            darkBg: 'dark:bg-blue-900',
            darkText: 'dark:text-blue-400',
            darkBorder: 'dark:border-blue-800'
        },
        green: {
            bg: 'bg-green-100',
            text: 'text-green-600',
            border: 'border-green-200',
            darkBg: 'dark:bg-green-900',
            darkText: 'dark:text-green-400',
            darkBorder: 'dark:border-green-800'
        },
        red: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            border: 'border-red-200',
            darkBg: 'dark:bg-red-900',
            darkText: 'dark:text-red-400',
            darkBorder: 'dark:border-red-800'
        },
        purple: {
            bg: 'bg-purple-100',
            text: 'text-purple-600',
            border: 'border-purple-200',
            darkBg: 'dark:bg-purple-900',
            darkText: 'dark:text-purple-400',
            darkBorder: 'dark:border-purple-800'
        },
        gray: {
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            border: 'border-gray-200',
            darkBg: 'dark:bg-gray-900',
            darkText: 'dark:text-gray-400',
            darkBorder: 'dark:border-gray-800'
        }
    };
    
    return colorMap[formData.accentColor] || colorMap.blue;
}

// Update navigation buttons based on current step
function updateNavigationButtons(currentStep, totalSteps) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const generateButton = document.getElementById('generate-button');
    
    if (prevButton) {
        // Hide prev on first step, show on others
        if (currentStep === 1) {
            prevButton.classList.add('hidden');
        } else {
            prevButton.classList.remove('hidden');
        }
    }
    
    if (nextButton && generateButton) {
        // On last step, hide next and show generate
        if (currentStep === totalSteps) {
            nextButton.classList.add('hidden');
            generateButton.classList.remove('hidden');
        } else {
            nextButton.classList.remove('hidden');
            generateButton.classList.add('hidden');
        }
    }
}

// Navigation for form steps
function getCurrentStep() {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step && !step.classList.contains('hidden')) {
            return i;
        }
    }
    return 1; // Default to first step if none found
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLanding();
    updateDarkMode();
});

// Update the border style function
function updateBorderStyle(formData) {
    const borderStyles = {
        'solid': 'border-solid',
        'dashed': 'border-dashed',
        'dotted': 'border-dotted',
        'double': 'border-double',
        'none': 'border-none'
    };
    
    return borderStyles[formData.classicBorder] || 'border-solid';
} 