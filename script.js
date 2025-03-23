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
            text.classList.add('text-gray-900');
        } else if (stepNumber === currentStep) {
            circle.classList.remove('bg-gray-200', 'text-gray-600', 'bg-green-500');
            circle.classList.add('bg-blue-600', 'text-white');
            text.classList.remove('text-gray-500');
            text.classList.add('text-gray-900');
        } else {
            circle.classList.remove('bg-blue-600', 'bg-green-500', 'text-white');
            circle.classList.add('bg-gray-200', 'text-gray-600');
            text.classList.remove('text-gray-900');
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
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }
    
    return isValid;
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
}

function addEducation() {
    const container = document.getElementById('education-container');
    const template = container.querySelector('.education-entry').cloneNode(true);
    
    // Clear input values
    template.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    
    container.appendChild(template);
}

// CV Generation functions
function generateCV() {
    const formData = new FormData(document.getElementById('cv-generator-form'));
    const cvContent = document.getElementById('cv-content');
    
    // Clear previous content
    cvContent.innerHTML = '';
    
    // Personal Information
    const personalInfo = document.createElement('div');
    personalInfo.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">${formData.get('fullName')}</h1>
            <div class="text-gray-600 space-x-4">
                ${formData.get('email') ? `<span>${formData.get('email')}</span>` : ''}
                ${formData.get('phone') ? `<span>${formData.get('phone')}</span>` : ''}
                ${formData.get('location') ? `<span>${formData.get('location')}</span>` : ''}
            </div>
        </div>
    `;
    cvContent.appendChild(personalInfo);
    
    // Professional Summary
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
                <p class="text-gray-700">${formData.get('summary')}</p>
            </div>
        `;
        cvContent.appendChild(summary);
    }
    
    // Work Experience
    const companies = formData.getAll('company[]');
    if (companies.length > 0 && companies[0] !== '') {
        const experience = document.createElement('div');
        experience.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
        `;
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.getAll('position[]');
                const startDates = formData.getAll('startDate[]');
                const endDates = formData.getAll('endDate[]');
                const descriptions = formData.getAll('description[]');
                
                experience.innerHTML += `
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900">${company}</h3>
                        <p class="text-gray-600 mb-2">${positions[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                        <p class="text-gray-700">${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        experience.innerHTML += '</div>';
        cvContent.appendChild(experience);
    }
    
    // Education
    const institutions = formData.getAll('institution[]');
    if (institutions.length > 0 && institutions[0] !== '') {
        const education = document.createElement('div');
        education.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Education</h2>
        `;
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.getAll('degree[]');
                const startDates = formData.getAll('eduStartDate[]');
                const endDates = formData.getAll('eduEndDate[]');
                
                education.innerHTML += `
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900">${institution}</h3>
                        <p class="text-gray-600">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        education.innerHTML += '</div>';
        cvContent.appendChild(education);
    }
    
    // Skills
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.innerHTML = `
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${skills.split(',').map(skill => `
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
        cvContent.appendChild(skillsDiv);
    }
    
    showPreview();
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// PDF Generation
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const element = document.getElementById('cv-content');
    
    try {
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
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating your PDF. Please try again.');
    }
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
}); 