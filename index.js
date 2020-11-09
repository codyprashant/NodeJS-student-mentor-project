const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
let students = [
  {
    id: 1,
    name: "Prashant Gupta",
  },
  {
    id: 2,
    name: "Arpan Gupta",
    mentorId : 3
  },
  {
    id: 3,
    name: "Darpan Gupta",
    mentorId : 3
  },
];
let mentors = [
  {
    id: 1,
    name: "RV",
  },
  {
    id: 2,
    name: "Venkat",
  },
  {
    id: 3,
    name: "Arun",
    students: [3, 2]
  },
];

app.get("/", function (req, res) {
  res.json("Server is up and running. Please proceed to defined endpoints");
});

app.get("/students/:mentorId", function (req, res) {
  if (req.params.mentorId) {
    let list = [];
    students.forEach((studentId) => {
      if (studentId.mentorId) {
        if (req.params.mentorId == studentId.mentorId) {
          list.push(studentId);
        }
      }
    });
    res.json(list);
  } else {
    res.json(students);
  }
});

app.get("/unassignedstudents", function (req, res) {
     let unassignedstudents = students.filter((item) => {if(!item.mentorId || item.mentorId == ''){return item;}})
     res.json(unassignedstudents);
  });

app.post("/addStudent", function (req, res) {
    
  let temp = {
    id: students.length + 1,
    name: req.body.name,
  };
  students.push(temp);
  res.json(students);
});

app.post("/assignMentor", function (req, res) {
  let mentor = req.body.mentor;
  let inpstudents = req.body.students;

  students.forEach((studentId) => {
    if (inpstudents == studentId.id) {
      studentId.mentorId = mentor;
    }
  });

  mentors.forEach((mentorId) => {
    if (mentor == mentorId.id) {
        if(mentorId.students){
            mentorId.students.push(inpstudents);
        } else{
            mentorId.students = [inpstudents];
        }
    }
  });
  let unassignedstudents = students.filter((item) => {if(!item.mentorId || item.mentorId == ''){return item;}})
     res.json(unassignedstudents);
});

app.post("/changeMentor", function (req, res) {
    let mentorId = req.body.mentorId;
    let studentId = req.body.studentId;
    let previousMentor = '';

    students.forEach((student) => {
      if (studentId == student.id) {
        previousMentor = student.mentorId;
        mentors.forEach((delmentorId) => {
            if (student.mentorId == delmentorId.id) {
                delmentorId.students = delmentorId.students.filter((item) =>   item != studentId)
            }
          });
        student.mentorId = mentorId;
      }
    });
    mentors.forEach((mentorItem) => {
      if (mentorId == mentorItem.id) {
          if(mentorItem.students) {
            mentorItem.students.push(parseInt(studentId));
            }
          else{
            mentorItem.students = [parseInt(studentId)];
            }
      }
    });
    let list = [];
    students.forEach((studentId) => {
      if (studentId.mentorId) {
        if (previousMentor == studentId.mentorId) {
          list.push(studentId);
        }
      }
    });
    res.json(list);
  });

app.get("/mentors", function (req, res) {
  res.json(mentors);
});

app.post("/addMentor", function (req, res) {
  let temp = {
    id: mentors.length + 1,
    name: req.body.name,
  };
  mentors.push(temp);
  res.json(mentors);
});

app.get("/unassignedmentors/:studentId", function (req, res) {
    
    let studentId = req.params.studentId;
    const filtStudent = students.find( ({ id }) => id == studentId );
    const filteredMentors = mentors.filter(mentor => mentor.id != filtStudent.mentorId);
    res.json({
        mentors: filteredMentors,
        student: filtStudent
    });
  });

app.listen(3000);
