import axios from 'axios'
import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Users, AlertCircle } from 'lucide-react'

export default function Students() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [students, setStudents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState(null)
  const [error, setError] = useState('')

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/crud?role=STUDENT")
      setStudents(res.data.users || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load students.')
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setError('');
    try {
      await axios.post("http://localhost:5000/user/crud", {
        name,
        email,
        role: 'STUDENT'
      })
      setName('')
      setEmail('')
      fetchStudents()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create student. Email might be in use.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`http://localhost:5000/user/crud/${id}`)
      fetchStudents()
    } catch (err) {
      console.error(err)
      setError('Failed to delete student.')
    }
  }

  const handleEditClicked = (student) => {
    setIsEditing(true)
    setStudentToEdit(student)
    setError('');
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!studentToEdit.name.trim() || !studentToEdit.email.trim()) {
       setError('Name and email are required.');
       return;
    }
    try {
      await axios.put(`http://localhost:5000/user/crud/${studentToEdit.id}`, {
        name: studentToEdit.name,
        email: studentToEdit.email
      })
      setIsEditing(false)
      setStudentToEdit(null)
      fetchStudents()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update student.')
    }
  }

  return (
    <div className='max-w-5xl mx-auto pt-8'>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>Student Management</h1>
          <p className="text-slate-500">Register new students and update their profiles</p>
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
          {isEditing ? <Pencil className="w-5 h-5 text-indigo-500"/> : <Plus className="w-5 h-5 text-indigo-500"/>}
          {isEditing ? 'Edit Student' : 'Register New Student'}
        </h2>
        <form className='flex flex-col gap-4' onSubmit={isEditing ? handleEditSubmit : handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="student-name" className="text-sm font-medium text-slate-700">Full Name</label>
              <input 
                type="text" 
                id="student-name" 
                className='border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md p-2.5 outline-none transition-all' 
                placeholder="e.g. Jane Doe"
                value={isEditing ? studentToEdit.name || '' : name} 
                onChange={(e) => isEditing ? setStudentToEdit({ ...studentToEdit, name: e.target.value }) : setName(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="student-email" className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                id="student-email" 
                className='border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md p-2.5 outline-none transition-all' 
                placeholder="jane.doe@example.com"
                value={isEditing ? studentToEdit.email || '' : email} 
                onChange={(e) => isEditing ? setStudentToEdit({ ...studentToEdit, email: e.target.value }) : setEmail(e.target.value)} 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setStudentToEdit(null); setError(''); }}
                className='px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-md transition-colors'
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md transition-colors shadow-sm'
            >
              {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className='text-xl font-bold text-slate-800'>Registered Students</h2>
          <p className="text-sm text-slate-500 mt-1">Total students: {students.length}</p>
        </div>
        
        {students.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {students.map((student) => (
              <div className='p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors' key={student.id}>
                <div className="mb-4 md:mb-0">
                  <h3 className='text-lg font-semibold text-slate-800 flex items-center gap-2'>
                    {student.name || 'Unnamed Student'}
                  </h3>
                  <p className='text-slate-600 mt-1 font-mono text-sm'>{student.email}</p>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button 
                    className='flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 hover:text-indigo-600 text-slate-700 font-medium py-1.5 px-3 rounded-md transition-all'
                    onClick={() => handleEditClicked(student)}
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    className='flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-medium py-1.5 px-3 rounded-md transition-all'
                    onClick={() => handleDelete(student.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>No students registered yet.</p>
            <p className="text-sm mt-1">Start by adding a student using the form above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
