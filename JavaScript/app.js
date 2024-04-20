window.onload = function() {
    console.log("onload function")
    fetch('/users')
      .then(response => response.json())
      .then(users => {
        const userList = document.getElementById('userList');
        users.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `Email: ${user.email} - UID: ${user.uid}`;
          console.log(li);
          userList.appendChild(li);
        });
      })
      .catch(error => console.error('Error loading users:', error));
  };
  