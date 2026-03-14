import axios from 'axios'
import { useEffect, useState } from 'react'

function App() {
  const [courseName, setCourseName] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [courses, setCourses] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post("http://localhost:5000/course", {
      name: courseName,
      document: courseDescription
    }).then((res) => {
      console.log("Response :", res.data)
      fetchCourses()
    }).catch((err) => {
      console.log("Error :", err)
    })
  }
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/course/${id}`).then((res) => {
      console.log("Response :", res.data)
      fetchCourses()
    }).catch((err) => {
      console.log("Error :", err)
    })
  }

  const handleEditClicked = (course) => {
    setIsEditing(true)
    setCourseToEdit(course)
  }

  const handleEdit = async (course) => {
    await axios.put(`http://localhost:5000/course/${course.id}`, {
      name: course.name,
      document: course.document
    }).then((res) => {
      console.log("Response :", res.data)
      setIsEditing(false)
      setCourseToEdit(null)
      fetchCourses()
    }).catch((err) => {
      console.log("Error :", err)
    })
  }

  const fetchCourses = async () => {
    await axios.get("http://localhost:5000/course").then((res) => {
      console.log("Response :", res.data)
      setCourses(res.data.courses)
    }).catch((err) => {
      console.log("Error :", err)
    })
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className='container mx-auto'>
      <h1 className='text-xl text-center'>School System</h1>
      <div>
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
          <label htmlFor="course-name">Course Name</label>
          <input type="text" id="course-name" name="course-name" className='border border-gray-300 rounded-md p-2' value={courseName} onChange={(e) => { setCourseName(e.target.value) }} />
          <label htmlFor="course-description">Course Description</label>
          <input type="text" id="course-description" name="course-description" className='border border-gray-300 rounded-md p-2' value={courseDescription} onChange={(e) => { setCourseDescription(e.target.value) }} />
          <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Create Course</button>
        </form>
      </div>
      {courses.length > 0 && (
        <div className='border border-gray-700 rounded-lg my-4 p-4'>
          <h2 className='text-xl font-bold'>Courses available</h2>
          <ul className='flex flex-col gap-2'>
            {courses.map((course) => (
              <li className='border-b p-2 flex justify-between' key={course.id}>
                {isEditing && courseToEdit.id === course.id ? (
                  <>
                    <span className='flex gap-1'>
                      <p className='text-blue-500'>Course Name:</p><input type="text" className='border border-gray-300 rounded-md p-2' defaultValue={courseToEdit.name} onChange={(e) => setCourseToEdit({ ...courseToEdit, name: e.target.value })} />
                    </span>
                    <span className='flex gap-1'>
                      <p className='text-blue-500'>Course Description:</p><input type="text" className='border border-gray-300 rounded-md p-2' defaultValue={courseToEdit.document} onChange={(e) => setCourseToEdit({ ...courseToEdit, document: e.target.value })} />
                    </span>
                    <button onClick={() => handleEdit(courseToEdit)}>Save</button>
                  </>
                ) : (
                  <>
                    <div>
                      <span className='flex gap-1'>
                        <p className='text-blue-500'>Course Name:</p>{course.name}
                      </span>
                      <span className='flex gap-1'>
                        <p className='text-blue-500'>Course Description:</p>{course.document}
                      </span>
                    </div>
                    <div className='flex gap-2'>
                      <button className='h-fit bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded'
                        onClick={() => handleEditClicked(course)}
                      >Edit</button>
                      <button className='h-fit bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded'
                        onClick={() => handleDelete(course.id)}
                      >Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
