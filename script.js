document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const profileCard = document.getElementById('profile-card');
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const savedProfilesList = document.getElementById('saved-profiles-list'); // La lista <ul>

    let currentUser = null;

    const fetchUser = async () => {
        try {
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            const user = data.results[0];
            
            currentUser = {
                name: `${user.name.first} ${user.name.last}`,
                country: user.location.country,
                picture: user.picture.large,
                email: user.email 
            };

            displayUser(currentUser);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    };

    const displayUser = (user) => {
        profileCard.innerHTML = `
            <img src="${user.picture}" alt="Foto de perfil">
            <h2>${user.name}</h2>
            <p><strong>País:</strong> ${user.country}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    };

    // --- LÓGICA PARA GUARDAR, LISTAR Y ELIMINAR PERFILES ---
    const saveUser = () => {
        if (!currentUser) return;
        let savedUsers = JSON.parse(localStorage.getItem('savedProfiles')) || [];

        if (!savedUsers.some(user => user.email === currentUser.email)) {
            savedUsers.push(currentUser);
            localStorage.setItem('savedProfiles', JSON.stringify(savedUsers));
            listSavedUsers(); // Actualizamos la lista visible
        } else {
            alert('Este perfil ya ha sido guardado.');
        }
    };

    //FUNCION PARA ELIMINAR PERFILES
    const listSavedUsers = () => {
        savedProfilesList.innerHTML = ''; // Limpiamos la lista para no duplicar
        const savedUsers = JSON.parse(localStorage.getItem('savedProfiles')) || [];

        savedUsers.forEach(user => {
            const listItem = document.createElement('li');
            // Creamos el HTML para el item, incluyendo el botón con un identificador
            listItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${user.picture}" alt="Foto de ${user.name}">
                    <span>${user.name} (${user.country})</span>
                </div>
                <button class="delete-btn" data-email="${user.email}">Eliminar</button>
            `;
            savedProfilesList.appendChild(listItem);
        });
    };

    // FUNCIÓN PARA ELIMINAR UN PERFIL ESPECÍFICO
    const deleteUser = (emailToDelete) => {
        let savedUsers = JSON.parse(localStorage.getItem('savedProfiles')) || [];
        // Creamos un nuevo array que excluye al usuario con el email a eliminar
        const updatedUsers = savedUsers.filter(user => user.email !== emailToDelete);
        // Guardamos el array actualizado en localStorage
        localStorage.setItem('savedProfiles', JSON.stringify(updatedUsers));
        // Volvemos a renderizar la lista para que el cambio sea visible
        listSavedUsers();
    };

    generateBtn.addEventListener('click', fetchUser);
    saveBtn.addEventListener('click', saveUser);

    savedProfilesList.addEventListener('click', (event) => {
        // Comprobamos si el elemento que recibió el clic es un botón de eliminar
        if (event.target.classList.contains('delete-btn')) {
            // Si lo es, obtenemos el email guardado en el atributo 'data-email'
            const emailToDelete = event.target.getAttribute('data-email');
            // Llamamos a la función para borrar ese usuario
            deleteUser(emailToDelete);
        }
    });

    // --- INICIALIZACIÓN ---
    fetchUser(); // Carga el primer perfil al abrir la página
    listSavedUsers(); // Muestra los perfiles que ya estaban guardados
});