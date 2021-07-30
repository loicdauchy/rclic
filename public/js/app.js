var companyName = document.getElementById('companyName').value;
var userMenu = document.getElementById('userMenu');

function generateAvatar(
    text,
    foregroundColor = "white",
    backgroundColor = "black"
  ) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    canvas.width = 60;
    canvas.height = 60;
  
    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw text
    context.font = "bold 20px arial";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  
    return canvas.toDataURL("image/png");
  }
  var colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
  var initial = companyName.slice(0, 2);
  var avatar = document.getElementById("userMenu");
  var img = document.createElement('img');
      img.alt = "avatar de "+companyName;
      img.classList.add('rounded-circle');
      img.src = this.generateAvatar(
        initial,
        "white",
        colors[Math.floor(Math.random()*19)]
      );
      avatar.appendChild(img);



document.getElementById('burgerMenu').addEventListener('click', function(){

  document.getElementById('asideBar').classList.add('openMenu');

  document.getElementById('burgerMenu').classList.add('none');
  document.getElementById('closeBurgerMenu').classList.remove('none');

  setTimeout(() => {
    document.getElementById('sideBarLeft').classList.add('sidebarLeftBlock');
  } ,200)

})



document.getElementById('closeBurgerMenu').addEventListener('click', function(){

    document.getElementById('sideBarLeft').classList.remove('sidebarLeftBlock');

    document.getElementById('burgerMenu').classList.remove('none');
    document.getElementById('closeBurgerMenu').classList.add('none');

    setTimeout(() => {
      document.getElementById('asideBar').classList.remove('openMenu');
    } ,10)

})




  