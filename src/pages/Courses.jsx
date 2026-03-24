import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { Pencil, Trash2, Plus, BookOpen, AlertCircle, Upload, FileText, X } from 'lucide-react'

export default function Courses() {
  const [courseName, setCourseName] = useState('')
  const [courseFile, setCourseFile] = useState(null)
  const [courses, setCourses] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState(null)
  const [editFile, setEditFile] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

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
    if (!courseName.trim()) {
      setError('Course name is required.')
      return
    }
    if (!courseFile) {
      setError('Please upload a file.')
      return
    }
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', courseName)
      formData.append('file', courseFile)

      await axios.post("http://localhost:5000/course", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCourseName('')
      setCourseFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError('Failed to create course.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return
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
    setEditFile(null)
    setError('')
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!courseToEdit.name.trim()) {
      setError('Course name is required.')
      return
    }
    try {
      const formData = new FormData()
      formData.append('name', courseToEdit.name)
      if (editFile) {
        formData.append('file', editFile)
      }

      await axios.put(`http://localhost:5000/course/${courseToEdit.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setIsEditing(false)
      setCourseToEdit(null)
      setEditFile(null)
      if (editFileInputRef.current) editFileInputRef.current.value = ''
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError('Failed to update course.')
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setCourseToEdit(null)
    setEditFile(null)
    setError('')
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
          {isEditing ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
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
              <label htmlFor="course-file" className="text-sm font-medium text-slate-700">
                {isEditing ? 'Replace File (optional)' : 'Upload File'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="course-file"
                  ref={isEditing ? editFileInputRef : fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    isEditing ? setEditFile(file) : setCourseFile(file)
                  }}
                />
                <button
                  type="button"
                  onClick={() => (isEditing ? editFileInputRef : fileInputRef).current?.click()}
                  className="w-full flex items-center gap-2 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-md p-2.5 text-left transition-all"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500 text-sm truncate">
                    {isEditing
                      ? (editFile ? editFile.name : 'Choose a new file...')
                      : (courseFile ? courseFile.name : 'Choose a file...')
                    }
                  </span>
                </button>
                {((isEditing && editFile) || (!isEditing && courseFile)) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setEditFile(null)
                        if (editFileInputRef.current) editFileInputRef.current.value = ''
                      } else {
                        setCourseFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isEditing && courseToEdit.filename && !editFile && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Current file: {courseToEdit.filename}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
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
                  {course.filename && (
                    <p className='text-slate-500 mt-1 text-sm flex items-center gap-1.5'>
                      <FileText className="w-4 h-4" />
                      {course.filename}
                    </p>
                  )}
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