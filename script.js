// Patient Class
class Patient {
    constructor(id, name, age, gender, contact) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.contact = contact;
    }

    static fromStorage() {
        return JSON.parse(localStorage.getItem('patients')) || [];
    }

    static saveToStorage(patients) {
        localStorage.setItem('patients', JSON.stringify(patients));
    }
}

// Doctor Class
class Doctor {
    constructor(id, name, specialization, contact) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.contact = contact;
    }

    static fromStorage() {
        return JSON.parse(localStorage.getItem('doctors')) || [];
    }

    static saveToStorage(doctors) {
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }
}
// Utility function to validate that the name contains only alphabetic characters and spaces
function validateName(name) {
    const regex = /^[A-Za-z\s]+$/; // Only allows alphabets and spaces
    return regex.test(name);
}

// Patient Form Validation
function validatePatientForm(name, age, gender, contact) {
    let isValid = true;

    // Validate name
    if (!name || name.trim() === "") {
        showErrorMessage(document.getElementById('patientName'), "Patient name is required.");
        isValid = false;
    } else if (!validateName(name)) {
        showErrorMessage(document.getElementById('patientName'), "Name must contain only alphabetic characters and spaces.");
        isValid = false;
    } else {
        clearErrorMessages(document.getElementById('patientName'));
    }

    // Validate age
    if (!age || isNaN(age) || age <= 0) {
        showErrorMessage(document.getElementById('patientAge'), "Please enter a valid age.");
        isValid = false;
    } else {
        clearErrorMessages(document.getElementById('patientAge'));
    }

    // Validate gender
    if (!gender) {
        showErrorMessage(document.querySelector('input[name="gender"]'), "Please select gender.");
        isValid = false;
    } else {
        clearErrorMessages(document.querySelector('input[name="gender"]'));
    }

    // Validate contact number
    if (!contact || !validatePhoneNumber(contact)) {
        showErrorMessage(document.getElementById('patientContact'), "Please enter a valid contact number.");
        isValid = false;
    } else {
        clearErrorMessages(document.getElementById('patientContact'));
    }

    return isValid;
}

// Doctor Form Validation
function validateDoctorForm(name, specialization, contact) {
    let isValid = true;

    // Validate name
    if (!name || name.trim() === "") {
        showErrorMessage(document.getElementById('doctorName'), "Doctor name is required.");
        isValid = false;
    } else if (!validateName(name)) {
        showErrorMessage(document.getElementById('doctorName'), "Name must contain only alphabetic characters and spaces.");
        isValid = false;
    } else {
        clearErrorMessages(document.getElementById('doctorName'));
    }

    // Validate specialization
    if (!specialization || specialization.trim() === "") {
        showErrorMessage(document.getElementById('doctorSpecialization'), "Specialization is required.");
        isValid = false;
    } else {
        clearErrorMessages(document.getElementById('doctorSpecialization'));
    }

    // Validate contact number
    if (!contact || !validatePhoneNumber(contact)) {
        showErrorMessage(document.getElementById('doctorContact'), "Please enter a valid contact number.");
        isValid = false;
    } else {
        clearErrorMessages(document.getElementById('doctorContact'));
    }

    return isValid;
}


// Appointment Class
class Appointment {
    constructor(id, patientId, doctorId, date, time) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.date = date;
        this.time = time;
    }

    static fromStorage() {
        return JSON.parse(localStorage.getItem('appointments')) || [];
    }

    static saveToStorage(appointments) {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
}

// Validation for Name (only letters and spaces allowed)
function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name);
}

// Add and display patients
function updatePatientList() {
    const patients = Patient.fromStorage();
    const patientList = document.getElementById('patientList');
    patientList.innerHTML = '';

    patients.forEach((patient) => {
        if (!validateName(patient.name)) {
            console.warn(`Patient ${patient.id} has an invalid name: "${patient.name}". Skipping this entry.`);
            return; // Skip this patient if the name is invalid
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${patient.name} - ${patient.age} years - ${patient.contact} - ${patient.gender}</span>
            <button class="edit" onclick="editPatient(${patient.id})">Edit</button>
            <button class="delete" onclick="deletePatient(${patient.id})">Delete</button>
        `;
        patientList.appendChild(li);
    });
}

// Add and display doctors
function displayDoctors() {
    const doctors = Doctor.fromStorage();
    const doctorList = document.getElementById('doctorList');
    doctorList.innerHTML = '';

    doctors.forEach((doctor) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${doctor.name} - ${doctor.specialization} - ${doctor.contact}</span>
            <button class="edit" onclick="editDoctor(${doctor.id})">Edit</button>
            <button class="delete" onclick="deleteDoctor(${doctor.id})">Delete</button>
        `;
        doctorList.appendChild(li);
    });

    populateDoctorDropdown(); // Update doctor dropdown for appointments
}

// Add and display appointments
function displayAppointments() {
    const appointments = Appointment.fromStorage();
    const appointmentList = document.getElementById('appointmentList');
    appointmentList.innerHTML = '';

    appointments.forEach((appointment) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Patient: ${appointment.patientId}, Doctor: ${appointment.doctorId}, Date: ${appointment.date}, Time: ${appointment.time}</span>
            <button class="edit" onclick="editAppointment(${appointment.id})">Edit</button>
            <button class="delete" onclick="deleteAppointment(${appointment.id})">Delete</button>
        `;
        appointmentList.appendChild(li);
    });
}

// Add Patient
document.getElementById('addPatientForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = Date.now(); // Unique ID based on timestamp
    const name = document.getElementById('patientName').value;
    const age = document.getElementById('patientAge').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const contact = document.getElementById('patientContact').value;

    if (!validateName(name)) {
        alert("Invalid name. Please enter a valid name with letters and spaces only.");
        return;
    }

    const newPatient = new Patient(id, name, age, gender, contact);
    const patients = Patient.fromStorage();
    patients.push(newPatient);
    Patient.saveToStorage(patients);

    updatePatientList(); // Re-render the list of patients
    clearPatientForm(); // Clear the form
});

// Add Doctor
document.getElementById('addDoctorForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = Date.now(); // Unique ID based on timestamp
    const name = document.getElementById('doctorName').value;
    const specialization = document.getElementById('doctorSpecialization').value;
    const contact = document.getElementById('doctorContact').value;

    const newDoctor = new Doctor(id, name, specialization, contact);
    const doctors = Doctor.fromStorage();
    doctors.push(newDoctor);
    Doctor.saveToStorage(doctors);

    displayDoctors(); // Re-render the list of doctors
    clearDoctorForm(); // Clear the form
});

// Add Appointment
document.getElementById('addAppointmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const patientId = document.getElementById('appointmentPatient').value;
    const doctorId = document.getElementById('appointmentDoctor').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;

    const newAppointment = new Appointment(Date.now(), patientId, doctorId, date, time);
    const appointments = Appointment.fromStorage();
    appointments.push(newAppointment);
    Appointment.saveToStorage(appointments);

    displayAppointments(); // Re-render the list of appointments
    clearAppointmentForm(); // Clear the form
});

// Edit Patient
function editPatient(id) {
    const patients = Patient.fromStorage();
    const patient = patients.find(patient => patient.id === id);

    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientAge').value = patient.age;
    document.querySelector(`input[name="gender"][value="${patient.gender}"]`).checked = true;
    document.getElementById('patientContact').value = patient.contact;

    // Modify the form submission to update the existing patient
    document.getElementById('addPatientForm').onsubmit = function (e) {
        e.preventDefault();

        patient.name = document.getElementById('patientName').value;
        patient.age = document.getElementById('patientAge').value;
        patient.gender = document.querySelector('input[name="gender"]:checked').value;
        patient.contact = document.getElementById('patientContact').value;

        if (!validateName(patient.name)) {
            alert("Invalid name. Please enter a valid name with letters and spaces only.");
            return;
        }

        Patient.saveToStorage(patients);
        updatePatientList();
        clearPatientForm(); // Clear the form
    };
}

// Edit Doctor
function editDoctor(id) {
    const doctors = Doctor.fromStorage();
    const doctor = doctors.find(doctor => doctor.id === id);

    document.getElementById('doctorName').value = doctor.name;
    document.getElementById('doctorSpecialization').value = doctor.specialization;
    document.getElementById('doctorContact').value = doctor.contact;

    // Modify the form submission to update the existing doctor
    document.getElementById('addDoctorForm').onsubmit = function (e) {
        e.preventDefault();

        doctor.name = document.getElementById('doctorName').value;
        doctor.specialization = document.getElementById('doctorSpecialization').value;
        doctor.contact = document.getElementById('doctorContact').value;

        Doctor.saveToStorage(doctors);
        displayDoctors();
        clearDoctorForm(); // Clear the form
    };
}

// Edit Appointment
function editAppointment(id) {
    const appointments = Appointment.fromStorage();
    const appointment = appointments.find(appointment => appointment.id === id);

    document.getElementById('appointmentPatient').value = appointment.patientId;
    document.getElementById('appointmentDoctor').value = appointment.doctorId;
    document.getElementById('appointmentDate').value = appointment.date;
    document.getElementById('appointmentTime').value = appointment.time;

    // Modify the form submission to update the existing appointment
    document.getElementById('addAppointmentForm').onsubmit = function (e) {
        e.preventDefault();

        appointment.patientId = document.getElementById('appointmentPatient').value;
        appointment.doctorId = document.getElementById('appointmentDoctor').value;
        appointment.date = document.getElementById('appointmentDate').value;
        appointment.time = document.getElementById('appointmentTime').value;

        Appointment.saveToStorage(appointments);
        displayAppointments();
        clearAppointmentForm(); // Clear the form
    };
}

// Delete Patient
function deletePatient(id) {
    let patients = Patient.fromStorage();
    patients = patients.filter(patient => patient.id !== id);
    Patient.saveToStorage(patients);
    updatePatientList(); // Re-render the patient list
}

// Delete Doctor
function deleteDoctor(id) {
    let doctors = Doctor.fromStorage();
    doctors = doctors.filter(doctor => doctor.id !== id);
    Doctor.saveToStorage(doctors);
    displayDoctors(); // Re-render the doctor list
}

// Delete Appointment
function deleteAppointment(id) {
    let appointments = Appointment.fromStorage();
    appointments = appointments.filter(appointment => appointment.id !== id);
    Appointment.saveToStorage(appointments);
    displayAppointments(); // Re-render the appointment list
}

// Clear Patient Form
function clearPatientForm() {
    document.getElementById('addPatientForm').reset();
}

// Clear Doctor Form
function clearDoctorForm() {
    document.getElementById('addDoctorForm').reset();
}

// Clear Appointment Form
function clearAppointmentForm() {
    document.getElementById('addAppointmentForm').reset();
}

// Initial Data Rendering
function init() {
    updatePatientList();
    displayDoctors();
    displayAppointments();
}

// Populate Doctor Dropdown for Appointments
function populateDoctorDropdown() {
    const doctors = Doctor.fromStorage();
    const doctorSelect = document.getElementById('appointmentDoctor');
    doctorSelect.innerHTML = '';
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
    });
}

// Populate Patient Dropdown for Appointments
function populatePatientDropdown() {
    const patients = Patient.fromStorage();
    const patientSelect = document.getElementById('appointmentPatient');
    patientSelect.innerHTML = '';
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        patientSelect.appendChild(option);
    });
}

// Initialize the system (call this when page loads)
window.onload = function() {
    init();
    populatePatientDropdown();
};
