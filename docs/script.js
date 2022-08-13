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

import * as xlsx from "./node_modules/xlsx/xlsx.mjs";


//console.log(readCourseFile('/sample.xls'));

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
    group_li.innerHTML = group_li.getAttribute("coursenum");
    group_li.addEventListener("click",(evt)=>{
      const src= evt.srcElement;
      src.classList.toggle("selected");
      const target_class = src.id;
      const targets = document.querySelectorAll(`course[courseid='${target_class}']`);

      targets.forEach(function(target){
        if(target.classList.contains("selected")){
          target.classList.remove("selected");
          window.localStorage.removeItem(src.getAttribute("coursenum"));
        } else {
          target.classList.add("selected");
          window.localStorage.setItem(src.getAttribute("coursenum"),"true");
        }

      });
      calculateCredit();
    });
    group_li.addEventListener("mouseenter",(evt)=>{
      const target_class = evt.srcElement.id;
      const targets = document.querySelectorAll(`course[courseid='${target_class}']`);

      targets.forEach(function(target){
        target.classList.add("hovering");
      });
    });
    group_li.addEventListener("mouseleave",(evt)=>{
      const target_class = evt.srcElement.id;
      const targets = document.querySelectorAll(`course[courseid='${target_class}']`);

      targets.forEach(function(target){
        target.classList.remove("hovering");
      });
    });
  });

  const courses =document.querySelectorAll("course");
  courses.forEach(function(course){
    course.addEventListener("click",function(evt){
      let courseid = evt.srcElement.getAttribute("courseid");
      let value = document.getElementById(courseid).getAttribute("coursenum");

      navigator.clipboard.writeText(value);
      /* Alert the copied text */

      document.getElementById("copied").classList.add("show");

      setTimeout(()=>{
        document.getElementById("copied").classList.remove("show");
      },300);
    });
  });
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
