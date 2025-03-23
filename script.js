// Navigation functions
function showForm() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('cv-form').classList.remove('hidden');
    document.getElementById('cv-preview').classList.add('hidden');
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
        <h1>${formData.get('fullName')}</h1>
        <div class="text-gray-600">
            ${formData.get('email')} | ${formData.get('phone')} | ${formData.get('location')}
        </div>
    `;
    cvContent.appendChild(personalInfo);
    
    // Professional Summary
    if (formData.get('summary')) {
        const summary = document.createElement('div');
        summary.innerHTML = `
            <h2>Professional Summary</h2>
            <p>${formData.get('summary')}</p>
        `;
        cvContent.appendChild(summary);
    }
    
    // Work Experience
    const companies = formData.getAll('company[]');
    if (companies.length > 0 && companies[0] !== '') {
        const experience = document.createElement('div');
        experience.innerHTML = '<h2>Work Experience</h2>';
        
        companies.forEach((company, index) => {
            if (company) {
                const positions = formData.getAll('position[]');
                const startDates = formData.getAll('startDate[]');
                const endDates = formData.getAll('endDate[]');
                const descriptions = formData.getAll('description[]');
                
                experience.innerHTML += `
                    <div class="work-experience-entry">
                        <h3 class="font-semibold">${company}</h3>
                        <p class="text-gray-600">${positions[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                        <p>${descriptions[index]}</p>
                    </div>
                `;
            }
        });
        
        cvContent.appendChild(experience);
    }
    
    // Education
    const institutions = formData.getAll('institution[]');
    if (institutions.length > 0 && institutions[0] !== '') {
        const education = document.createElement('div');
        education.innerHTML = '<h2>Education</h2>';
        
        institutions.forEach((institution, index) => {
            if (institution) {
                const degrees = formData.getAll('degree[]');
                const startDates = formData.getAll('eduStartDate[]');
                const endDates = formData.getAll('eduEndDate[]');
                
                education.innerHTML += `
                    <div class="education-entry">
                        <h3 class="font-semibold">${institution}</h3>
                        <p class="text-gray-600">${degrees[index]} | ${formatDate(startDates[index])} - ${formatDate(endDates[index])}</p>
                    </div>
                `;
            }
        });
        
        cvContent.appendChild(education);
    }
    
    // Skills
    const skills = formData.get('skills');
    if (skills) {
        const skillsDiv = document.createElement('div');
        skillsDiv.innerHTML = `
            <h2>Skills</h2>
            <div class="skills-list">
                ${skills.split(',').map(skill => `
                    <span class="skill-tag">${skill.trim()}</span>
                `).join('')}
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
    generateCV();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here
    showLanding();
}); 