import { useState } from "react";
import type { FormEvent } from "react";
// We import useState because this component needs data that changes:
// 1) the list of students
// 2) the current text in the input

type Student = {
  id: string;
  name: string;
};

type StudentListProps = {
  students: Student[];
};

function StudentList({ students }: StudentListProps) {
  // This is a separate component just for displaying the list.
  // We do this to keep the UI cleaner and split responsibilities.
  // App handles the logic, StudentList handles the rendering.

  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>{student.name}</li>
        // We use .map() to turn an array of data into JSX
        // key helps React track each item efficiently
        // student.id is better than index because it is more stable
      ))}
    </ul> 
  );
}

export default function App() {
  const [students, setStudents] = useState([
    { id: "1", name: "Jim" },
    { id: "2", name: "Bob" },
  ]);
  // students = the current list
  // setStudents = the function that updates the list
  // We store students as objects with id + name
  // so each item has a proper key

  const [inputValue, setInputValue] = useState("");
  // inputValue = what the user has typed into the box
  // setInputValue = updates the input state
  // We start with an empty string because the input is empty at first

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prevents the form from refreshing the page when submitted

    if (!inputValue.trim()) return;
    // trim() removes spaces from the start and end
    // This stops empty values like "" or "   " from being added

    const newStudent = {
      id: crypto.randomUUID(),
      // Creates a unique id for the new student
      // Good for React keys

      name: inputValue.trim(),
      // Save the cleaned version of the name
    };

    setStudents((prev) => [...prev, newStudent]);
    // Functional update:
    // prev = previous state
    // [...prev, newStudent] creates a NEW array
    // We do this because React state should be immutable
    // We do not use push() because push mutates the old array

    setInputValue("");
    // Clears the input after the student is added
  };

  return (
    <main>
      {/* Main wrapper for the page */}
      
      <section>
        <h1>Student Directory</h1>
        <StudentList students={students} />
        {/* Pass the students data down as props */}
      </section>

      <section>
        <h2>Enroll New Student</h2>

        <form onSubmit={handleSubmit}>
          {/* We use onSubmit on the form instead of onClick on the button
              because this also allows pressing Enter to submit */}

          <input
            type="text"
            placeholder="Enter name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Student Name"
          />
          {/* Controlled input:
              value comes from state
              onChange updates the state
              This means React is in control of the input */}

          <button type="submit">Add Student</button>
          {/* type="submit" triggers the form's onSubmit */}
        </form>
      </section>
    </main>
  );
}
