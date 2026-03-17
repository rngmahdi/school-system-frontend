import axios from 'axios'
import { useEffect, useState } from 'react'
import { Plus, GraduationCap, AlertCircle, BookOpen, User } from 'lucide-react'

export default function Grades() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [gradeValue, setGradeValue] = useState('')
  
  const [recentGrades, setRecentGrades] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchData = async () => {
    try {
       // Fetch students
       const studentRes = await axios.get("http://localhost:5000/user/crud?role=STUDENT")
       setStudents(studentRes.data.users || [])
       
       // Fetch courses
       const courseRes = await axios.get("http://localhost:5000/course")
       setCourses(courseRes.data.courses || [])
    } catch (err) {
       console.error(err)
       setError('Failed to fetch required data.')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      fetchGradesForCourse(selectedCourseId)
    } else {
      setRecentGrades([])
    }
  }, [selectedCourseId])

  const fetchGradesForCourse = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:5000/grade/course/${courseId}`)
      setRecentGrades(res.data.grades || [])
    } catch(err) {
      console.error(err);
      setError('Failed to fetch grades for the selected course.');
    }
  }

  const handleAssignGrade = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!selectedStudentId || !selectedCourseId || gradeValue === '') {
      setError('Please select a student, a course, and enter a grade.')
      return;
    }

    try {
      await axios.post("http://localhost:5000/grade", {
        userId: selectedStudentId,
        courseId: selectedCourseId,
        grade: Number(gradeValue)
      })
      setSuccess('Grade assigned successfully!')
      setGradeValue('')
      
      // Refresh the list
      fetchGradesForCourse(selectedCourseId)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to assign grade.')
    }
  }

  return (
    <div className='max-w-5xl mx-auto pt-8'>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>Grades & Evaluation</h1>
          <p className="text-slate-500">Assign and review grades for students across courses</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded-md transition-all">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 flex items-center gap-2 rounded-md transition-all">
          <GraduationCap className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assingment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
               <Plus className="w-5 h-5 text-emerald-500"/> Assign Grade
            </h2>
            <form className='flex flex-col gap-4' onSubmit={handleAssignGrade}>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="student-select" className="text-sm font-medium text-slate-700 flex items-center gap-1"><User className="w-4 h-4"/> Student</label>
                <select 
                  id="student-select" 
                  className='border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md p-2.5 outline-none bg-white transition-all'
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name || s.email}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="course-select" className="text-sm font-medium text-slate-700 flex items-center gap-1"><BookOpen className="w-4 h-4"/> Course</label>
                <select 
                  id="course-select" 
                  className='border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md p-2.5 outline-none bg-white transition-all'
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="grade-value" className="text-sm font-medium text-slate-700">Grade (0-100 or 0-20)</label>
                <input 
                  type="number" 
                  id="grade-value" 
                  className='border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md p-2.5 outline-none transition-all font-mono text-lg' 
                  placeholder="e.g. 18"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className='mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-5 rounded-md transition-colors shadow-sm w-full'
              >
                Assign Grade
              </button>
            </form>
          </div>
        </div>

        {/* Grades List */}
        <div className="lg:col-span-2">
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full min-h-[400px]'>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className='text-xl font-bold text-slate-800 focus:outline-none'>
                 {selectedCourseId ? 'Grades for Selected Course' : 'Course Grades'}
              </h2>
              {selectedCourseId ? (
                 <p className="text-sm text-emerald-600 mt-1 font-medium select-none">Showing grades for: {courses.find(c => c.id === selectedCourseId)?.name}</p>
              ) : (
                 <p className="text-sm text-slate-500 mt-1">Select a course to view assigned grades.</p>
              )}
            </div>
            
            {selectedCourseId ? (
              recentGrades.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentGrades.map((gradeRecord) => (
                    <div className='p-5 flex items-center justify-between hover:bg-slate-50 transition-colors' key={gradeRecord.id}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                           {gradeRecord.user?.name ? gradeRecord.user.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h3 className='text-md font-semibold text-slate-800'>
                            {gradeRecord.user?.name || 'Unknown Student'}
                          </h3>
                          <p className='text-slate-500 text-sm font-mono'>{gradeRecord.user?.email}</p>
                        </div>
                      </div>
                      <div className='shrink-0 text-right'>
                         <span className="inline-flex items-center justify-center px-4 py-2 text-lg font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm min-w-[3.5rem]">
                            {gradeRecord.grade}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center min-h-[250px]">
                  <p>No grades assigned for this course yet.</p>
                </div>
              )
            ) : (
              <div className="p-12 text-center text-slate-400 h-full flex flex-col items-center justify-center min-h-[250px]">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Please select a course on the left to view grades.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
