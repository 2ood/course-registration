class Course {
  constructor(department, courseName,courseCode,credit,classroom){
    this.department = department;
    this.courseName = courseName;
    this.courseCode = courseCode;
    this.credit = credit;
    this.classroom = classroom;
  }

  static fromJson(json) {
      return new Course(json.department, json.courseName,json.courseCode,json.credit,json.classroom);
  }

  toJson() {
    return {
      department : this.department,
      courseName : this.courseName,
      courseCode : this.courseCode,
      credit : this.credit,
      classroom : this.classroom
    };
  }
}

let courses = [];

window.addEventListener("load",function(){
  addEventListeners();
  loadSessionStorage();
});

function loadSessionStorage(){
  let keys = Object.keys(window.localStorage);
  keys.forEach((key)=>{
    const target_li = document.querySelector(`li[coursenum=${key}]`);
    target_li.click();
  });
}

function addEventListeners(){
  const groups = document.querySelectorAll("selectgroup li.end");
  groups.forEach(function(group_li){
    group_li.innerHTML = group_li.getAttribute("coursenum")+`<input type="checkbox">`;
    group_li.addEventListener("click",groupLiClickHandler);
    group_li.addEventListener("dblclick",groupLiDoubleClickHandler);
    group_li.addEventListener("mouseenter",groupLiMouseEneterHandler);
    group_li.addEventListener("mouseleave",groupLiMouseLeaveHandler);

    const li_input = group_li.querySelector("input");
    li_input.addEvent
  });

  const courses =document.querySelectorAll("course");
  courses.forEach(function(course){
    course.addEventListener("click",courseClickHandler);
    course.addEventListener("dblclick",courseDoubleClickHandler);
  });

  const roulette = document.getElementById("roulette");
  roulette.addEventListener("click",iAmFeelingLucky);
}

function readCourseFile(fileName){
  try{
      const excelFile = xlsx.readFile(fileName,{type:"string"});
      const sheetName = excelFile.SheetNames[0]
      const firstSheet = excelFile.Sheets[sheetName];

      const courseData = xlsx.utils.sheet_to_json(firstSheet, {defval : ""});

      return courseData;
  }catch (err) {
    console.log(err);
  }
}

function calculateCredit(){
  const num = document.getElementById("credit");
  const selected = document.querySelectorAll("li.selected");

  let sum=0;
  selected.forEach((course)=>{
      sum+=parseInt(course.getAttribute("credit"));
  });
  num.innerHTML = `credit : ${sum}`;
}

function groupLiClickHandler(evt) {
    const src= evt.srcElement;
    groupLiClickHiddenHandler(src);
}

function groupLiDoubleClickHandler(evt){
  const src= evt.srcElement;
  const src_input = src.querySelector("input");

  const siblings = [].slice.call(src.parentNode.children);
  let index = siblings.indexOf(src);
  if(index>-1){
    siblings.splice(index,1);
  }

  //reset siblings to not selected, not checked, listening click.
  siblings.forEach((li)=>{
    if(li.classList.contains("selected")) groupLiClickHiddenHandler(li);
      li.querySelector("input").checked = false;
      li.classList.remove("fixed");
      li.querySelector("input").classList.remove("selected");
      li.addEventListener("click",groupLiClickHandler);
  });

  //if this was cancelling, reset src too.
  //else, if this was changing fix,
  if(src.classList.contains("fixed")){
    //console.log("checked");
    src_input.checked=false;
    src_input.classList.remove("selected");
    src.classList.remove("fixed");
    src.addEventListener("click",groupLiClickHandler);
    groupLiClickHiddenHandler(src);
  } else {
    //console.log("not checked");
    src_input.checked =true;
    src_input.classList.add("selected");
    if(!src.classList.contains("selected"))src.click();
    src.classList.add("fixed");
    src.removeEventListener("click",groupLiClickHandler);
  }
}

function groupLiMouseEneterHandler(evt){
  const target_class = evt.srcElement.id;
  const targets = document.querySelectorAll(`course[courseid='${target_class}']`);

  targets.forEach(function(target){
    target.classList.add("hovering");
  });
}

function groupLiMouseLeaveHandler(evt){
  const target_class = evt.srcElement.id;
  const targets = document.querySelectorAll(`course[courseid='${target_class}']`);

  targets.forEach(function(target){
    target.classList.remove("hovering");
  });
}

function courseClickHandler(evt){
  let courseid = evt.srcElement.getAttribute("courseid");
  let value = document.getElementById(courseid).getAttribute("coursenum");

  navigator.clipboard.writeText(value);
  /* Alert the copied text */

  document.getElementById("copied").classList.add("show");

  setTimeout(()=>{
    document.getElementById("copied").classList.remove("show");
  },300);
}

function courseDoubleClickHandler(evt){
  let courseid = evt.srcElement.getAttribute("courseid");
  let course_li = document.getElementById(courseid);

  course_li.click();
}

function groupLiClickHiddenHandler(dom){
  dom.classList.toggle("selected");
  const target_class = dom.id;
  const targets = document.querySelectorAll(`course[courseid='${target_class}']`);

  targets.forEach(function(target){
    if(target.classList.contains("selected")){
      target.classList.remove("selected");
      window.localStorage.removeItem(dom.getAttribute("coursenum"));
    } else {
      target.classList.add("selected");
      window.localStorage.setItem(dom.getAttribute("coursenum"),"true");
    }

  });
  calculateCredit();
}

function iAmFeelingLucky(evt){
  const fixed_input = document.querySelectorAll("input.selected");
  let fixed_li =[];
  fixed_input.forEach((input)=>{
    fixed_li.push(input.parentNode);
  });

  const selected = document.querySelectorAll("course.selected");


  let flag = 0;
  //first check if fixed members dont collide.
  for(let i=0; i<selected.length;i++) {
    for(let j=i+1;j<selected.length;j++){
      const date1 = selected[i].getAttribute("date");
      const date2 = selected[j].getAttribute("date");
      const start1 = parseInt(selected[i].getAttribute("start"));
      const start2 = parseInt(selected[j].getAttribute("start"));
      const end1 = parseInt(selected[i].getAttribute("end"));
      const end2 = parseInt(selected[j].getAttribute("end"));

      if(date1==date2){
        let start_later = start1<start2?start2:start1;
        let end_first = end1<end2?end1:end2;


        if(start_later<end_first) {
          flag++; break;
        }
      }
    }
  }
  if(flag>0) {
    console.log("selected lectures collide.");
    const message = document.getElementById("copied");
    message.innerHTML = "Fixed courses collide.";
    message.classList.add("error");

    setTimeout(()=>{
      const message = document.getElementById("copied");
      message.innerHTML = "Copied!";
      message.classList.remove("error");
    },1000);
  }
  else {
    console.log("ready");

  }
  //next, step by step check if any lecture is available.

}
