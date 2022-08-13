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
  const groups = document.querySelectorAll("selectgroup li.end");
  groups.forEach(function(group_li){
    group_li.addEventListener("click",(evt)=>{
      evt.srcElement.classList.toggle("selected");
      const target_class = evt.srcElement.id;
      const targets = document.querySelectorAll(`course.${target_class}`);

      console.log(targets);
      targets.forEach(function(target){
        target.classList.toggle("selected");
      });
    });
  });
});

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
