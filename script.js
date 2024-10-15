// Seleciona os elementos do DOM
const patientForm = document.getElementById('patientForm');
const patientsList = document.getElementById('patientsList');
const exportButton = document.getElementById('exportButton');
const importFile = document.getElementById('importFile');

// Variável para saber se está no modo de edição e o índice do paciente sendo editado
let editMode = false;
let editIndex = null;

// Array para armazenar pacientes (carregar do localStorage se existir)
let patients = JSON.parse(localStorage.getItem('patients')) || [];

// Função para exibir os pacientes cadastrados
function displayPatients() {
    patientsList.innerHTML = ''; // Limpa a lista antes de adicionar novos elementos

    // Ordena os pacientes por nome em ordem alfabética
    patients.sort((a, b) => a.name.localeCompare(b.name));

    // Verifica se há pacientes no array e, se houver, os exibe
    if (patients.length === 0) {
        patientsList.innerHTML = '<p>Nenhum paciente cadastrado.</p>';
        return;
    }

    // Cria a exibição de cada paciente
    patients.forEach((patient, index) => {
        const patientCard = document.createElement('div');
        patientCard.classList.add('patient-card');

        patientCard.innerHTML = `
            <p><strong>Nome:</strong> ${patient.name}</p>
            <p><strong>Endereço:</strong> ${patient.address}</p>
            <p><strong>CPF:</strong> ${patient.cpf}</p>
            <p><strong>Telefone:</strong> ${patient.phone}</p>
            <p><strong>Atividades/Tratamento:</strong> ${patient.treatment}</p>
            <p><strong>Evolução:</strong> ${patient.evolution}</p>
            <button onclick="editPatient(${index})">Editar</button>
            <button onclick="deletePatient(${index})">Remover</button>
        `;

        patientsList.appendChild(patientCard);
    });
}

// Função para adicionar ou editar um paciente
patientForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Previne o recarregamento da página

    // Captura os dados do formulário
    const newPatient = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        cpf: document.getElementById('cpf').value,
        phone: document.getElementById('phone').value,
        treatment: document.getElementById('treatment').value,
        evolution: document.getElementById('evolution').value
    };

    // Verifica se estamos editando ou adicionando um novo paciente
    if (editMode) {
        // Atualiza o paciente no índice correto
        patients[editIndex] = newPatient;
        editMode = false; // Desativa o modo de edição
        editIndex = null; // Reseta o índice
        patientForm.querySelector('button').textContent = 'Cadastrar Paciente'; // Volta o texto do botão para o normal
    } else {
        // Adiciona o novo paciente à lista
        patients.push(newPatient);
    }

    // Salva os pacientes no localStorage
    localStorage.setItem('patients', JSON.stringify(patients));

    // Limpa o formulário
    patientForm.reset();

    // Atualiza a exibição dos pacientes
    displayPatients();
});

// Função para deletar um paciente
function deletePatient(index) {
    patients.splice(index, 1); // Remove o paciente da lista
    localStorage.setItem('patients', JSON.stringify(patients)); // Atualiza o localStorage
    displayPatients(); // Atualiza a exibição
}

// Função para editar um paciente
function editPatient(index) {
    // Preenche o formulário com os dados do paciente a ser editado
    document.getElementById('name').value = patients[index].name;
    document.getElementById('address').value = patients[index].address;
    document.getElementById('cpf').value = patients[index].cpf;
    document.getElementById('phone').value = patients[index].phone;
    document.getElementById('treatment').value = patients[index].treatment;
    document.getElementById('evolution').value = patients[index].evolution;

    // Ativa o modo de edição
    editMode = true;
    editIndex = index;

    // Altera o texto do botão para "Salvar Alterações"
    patientForm.querySelector('button').textContent = 'Salvar Alterações';
}

// Função para exportar pacientes para um arquivo JSON
exportButton.addEventListener('click', function() {
    const dataStr = JSON.stringify(patients);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pacientes.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Função para importar pacientes de um arquivo JSON
importFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const importedPatients = JSON.parse(e.target.result);
        patients = importedPatients; // Substitui a lista de pacientes com a importada
        localStorage.setItem('patients', JSON.stringify(patients)); // Atualiza o localStorage
        displayPatients(); // Atualiza a exibição
    };
    reader.readAsText(file);
});

// Carrega os pacientes ao iniciar a página
window.onload = displayPatients;
