

function onLoad() {

  
  console.warn("Opening the Developer Tools can cause lag and I have no clue why! It also causes bugs because of the lag. If you refresh the page, please close the Deveolper Tools!")
  generateButtons();
  dragElement(document.getElementById("draggable_window"));
  setTimeout(function() {
    learnSkill()
    selectSkill(0)
  }, 100)
  

}

function toggle_focus_bar() {
  document.getElementById("focus_bar").classList.toggle("invisible")
}


function generateButtons() {

  wrapper = document.getElementById("skill_wrapper")

  let output = fetch('./skills.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();  
                })
                .then(data => {return data})  
                .catch(error => console.error('Failed to fetch data:', error)); 

    output.then (
      function(data) {
        data = data.skills
        for(var i = 0; i < data.length; i++) {

          wrapper.innerHTML += '<button onclick="selectSkill(' + data[i].id + ')" class="skills locked ' + data[i].type + '">'
          
          document.getElementsByClassName("skills")[i].style.right = data[i].positions[0].x
          document.getElementsByClassName("skills")[i].style.top = data[i].positions[1].y
          

        }
        document.getElementsByClassName("skills")[0].classList.remove("locked")
        lines = []
        for(var i = 0; i < data.length; i++) {
          for(var x = 0; x < data[i].connect.length; x++) {
            line =  new LeaderLine(
                      document.getElementsByClassName("skills")[i],
                      document.getElementsByClassName("skills")[data[i].connect[x]],
                      {color: "#ddcb63"}
                    )
            lines.push(line);
          }
        }
      }
    )

  
}


function selectSkill(i) {

  if(document.getElementsByClassName("skills")[i].classList.contains("locked") == false) {
      name_element = document.getElementById("skill_name")
      description_element = document.getElementById("skill_desc")
      learn_button = document.getElementById("learn_skill")

      let output = fetch('./skills.json')
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`HTTP error! Status: ${response.status}`);
                      }
                      return response.json();  
                  })
                  .then(data => {return data})  
                  .catch(error => console.error('Failed to fetch data:', error)); 

      output.then (

          function(data) {
              name_element.innerHTML = data.skills[i].name;
              name_element.setAttribute("maxlvl", data.skills[i].maxlvl)
              description_element.innerHTML = data.skills[i].description;
              learn_button.setAttribute("onclick","learnSkill(" + i + ", [" + data.skills[i].connect + "])");
                learn_button.innerHTML = "Learn Skill"
                learn_button.style.backgroundColor = "green"
                learn_button.style.cursor = "pointer"
              if(name_element.clientHeight >= 38) {
                description_element.style.minHeight = "calc(100% - (" + name_element.clientHeight + "px + 80px + 36px + 42.88px))"
              }
              
              skill_list = JSON.parse(localStorage.getItem("skill_list"))
              skill = skill_list.find(o => o.id == i)
              skill_id = skill.id
              if(skill.lvl >= 1) {
                learn_button.setAttribute("onclick", "upgradeSkill(" + i + ")")
                learn_button.innerHTML = "Upgrade Skill"
                learn_button.style.backgroundColor = "green"
                learn_button.style.cursor = "pointer"
              }
              if(skill.lvl >= skill.maxlvl) {
                learn_button.setAttribute("onclick", "")
                learn_button.innerHTML = "MAX LVL"
                learn_button.style.backgroundColor = "gray"
                learn_button.style.cursor = "default"
              }
          }

      )
    }
    
}

function learnSkill(i, connected) {
    
    name_element = document.getElementById("skill_name").innerHTML
    name_element_att = document.getElementById("skill_name").getAttribute("maxlvl")
    description_element = document.getElementById("skill_desc").innerHTML
    list_element = document.getElementById("skill_list")

    var skill_list = JSON.parse(localStorage.getItem("skill_list"))
    if(localStorage.getItem("skill_list") == null) {var skill_list = []}

    
    if(i == null || skill_list.find(o => o.id == i) != undefined){} else {
      skill_list.push({name:name_element, description:description_element, id:i, connect:connected, lvl:1, maxlvl:name_element_att})
      localStorage.setItem("skill_list", JSON.stringify(skill_list))
      selectSkill(i)
      
    }

    updateSkillList()

}

function upgradeSkill(i) {
  
  skill_list = JSON.parse(localStorage.getItem("skill_list"))
  skill = skill_list.find(o => o.id == i)
  skill_id = skill_list.findIndex(o => o.id == i)

  //find out which of the entries in skill_list is skill, so that we can replace its lvl value and save it to localStorage

  if(skill.lvl < skill.maxlvl) {
    
    skill.lvl += 1;
    skill_list[skill_id] = skill
    localStorage.setItem("skill_list", JSON.stringify(skill_list))
    updateSkillList()
    selectSkill(i)
  }
}

function updateSkillList() {
      list_element.innerHTML = ""

      var skill_list = JSON.parse(localStorage.getItem("skill_list"))
      if(localStorage.getItem("skill_list") == null) {var skill_list = []}

      for (var index = 0; index < skill_list.length; index++) {
        list_element.innerHTML += "<li onclick='selectSkill(" + skill_list[index].id + ")'>" + skill_list[index].name + " (Level: " + skill_list[index].lvl + ")" + "</li>"
        for(x=0; x < skill_list[index].connect.length; x++) {
          if(document.getElementsByClassName("skills")[skill_list[index].connect[x]].classList.contains("locked")) {
            document.getElementsByClassName("skills")[skill_list[index].connect[x]].classList.toggle("locked")
          }
        }
      }
    }

function toggleModal(id) {
  modal = document.getElementById(id)
  modal.toggleAttribute("open")

  if(id == "export_modal") {
    modal.innerHTML = localStorage.getItem("skill_list")
  }
}
function importSkillList(id) {
  modal = document.getElementById(id)
  textbox = modal.firstChild.nextElementSibling

  localStorage.removeItem("skill_list")
  localStorage.setItem("skill_list", textbox.value)
  if(textbox.value == "") {localStorage.removeItem("skill_list")}

  toggleModal(id)
  window.location.reload();
}


// Make the DIV element draggable:
function dragElement(elmnt) {

    var height = (window.innerHeight * 10)
    elmnt.style.top = (height - window.innerHeight) * -0.5
    elmnt.style.left = (height - window.innerWidth) * -0.5

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  console.log("dragElement function is being executed!")
    // move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    for(var i = 0; i < lines.length; i++) {
    lines[i].position()
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}