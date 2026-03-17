import axios from 'axios'
import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, BookOpen, AlertCircle } from 'lucide-react'

export default function Courses() {
  const [courseName, setCourseName] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [courses, setCourses] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState(null)
  const [error, setError] = useState('')

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/course")
      setCourses(res.data.courses)
    } catch (err) {
      console.error(err)
      setError('Failed to load courses.')
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!courseName.trim() || !courseDescription.trim()) {
      setError('Course name and description are required.');
      return;
    }
    setError('');
    try {
      await axios.post("http://localhost:5000/course", {
        name: courseName,
        document: courseDescription
      })
      setCourseName('')
      setCourseDescription('')
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError('Failed to create course.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`http://localhost:5000/course/${id}`)
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError('Failed to delete course.')
    }
  }

  const handleEditClicked = (course) => {
    setIsEditing(true)
    setCourseToEdit(course)
    setError('');
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!courseToEdit.name.trim() || !courseToEdit.document.trim()) {
       setError('Course name and description are required.');
       return;
    }
    try {
      await axios.put(`http://localhost:5000/course/${courseToEdit.id}`, {
        name: courseToEdit.name,
        document: courseToEdit.document
      })
      setIsEditing(false)
      setCourseToEdit(null)
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError('Failed to update course.')
    }
  }

  return (
    <div className='max-w-5xl mx-auto pt-8'>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>Course Management</h1>
          <p className="text-slate-500">Create and manage your academic courses</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded-md">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          {isEditing ? <Pencil className="w-5 h-5 text-blue-500"/> : <Plus className="w-5 h-5 text-blue-500"/>}
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h2>
        <form className='flex flex-col gap-4' onSubmit={isEditing ? handleEditSubmit : handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="course-name" className="text-sm font-medium text-slate-700">Course Name</label>
              <input 
                type="text" 
                id="course-name" 
                className='border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md p-2.5 outline-none transition-all' 
                placeholder="e.g. Introduction to React"
                value={isEditing ? courseToEdit.name : courseName} 
                onChange={(e) => isEditing ? setCourseToEdit({ ...courseToEdit, name: e.target.value }) : setCourseName(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="course-description" className="text-sm font-medium text-slate-700">Course Description</label>
              <input 
                type="text" 
                id="course-description" 
                className='border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md p-2.5 outline-none transition-all' 
                placeholder="Brief description of the course contents"
                value={isEditing ? courseToEdit.document : courseDescription} 
                onChange={(e) => isEditing ? setCourseToEdit({ ...courseToEdit, document: e.target.value }) : setCourseDescription(e.target.value)} 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setCourseToEdit(null); setError(''); }}
                className='px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-md transition-colors'
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md transition-colors shadow-sm'
            >
              {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className='text-xl font-bold text-slate-800'>Available Courses</h2>
          <p className="text-sm text-slate-500 mt-1">Total courses: {courses.length}</p>
        </div>
        
        {courses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {courses.map((course) => (
              <div className='p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors' key={course.id}>
                <div className="mb-4 md:mb-0">
                  <h3 className='text-lg font-semibold text-slate-800 flex items-center gap-2'>
                    {course.name}
                  </h3>
                  <p className='text-slate-600 mt-1'>{course.document}</p>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button 
                    className='flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 hover:text-blue-600 text-slate-700 font-medium py-1.5 px-3 rounded-md transition-all'
                    onClick={() => handleEditClicked(course)}
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    className='flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-medium py-1.5 px-3 rounded-md transition-all'
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>No courses available right now.</p>
            <p className="text-sm mt-1">Create your first course using the form above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
