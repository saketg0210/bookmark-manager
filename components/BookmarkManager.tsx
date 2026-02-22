// 'use client'
// import { useEffect, useState } from 'react'
// import { createClient } from '@/utils/supabase/client'

// export default function BookmarkManager({ initialBookmarks, userId }: { initialBookmarks: any[], userId: string }) {
//   const [bookmarks, setBookmarks] = useState(initialBookmarks)
//   const [title, setTitle] = useState('')
//   const [url, setUrl] = useState('')
//   const supabase = createClient()

//   useEffect(() => {
//     const channel = supabase
//       .channel('realtime_bookmarks')
//       .on('postgres_changes', { 
//         event: '*', 
//         schema: 'public', 
//         table: 'bookmarks',
//         filter: `user_id=eq.${userId}` 
//       }, (payload) => {
//         if (payload.eventType === 'INSERT') setBookmarks(prev => [payload.new, ...prev])
//         if (payload.eventType === 'DELETE') setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
//       })
//       .subscribe()

//     return () => { supabase.removeChannel(channel) }
//   }, [supabase, userId])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!url) return
//     await supabase.from('bookmarks').insert([{ title: title || url, url, user_id: userId }])
//     setTitle(''); setUrl('')
//   }

//   const deleteBtn = async (id: string) => {
//     await supabase.from('bookmarks').delete().eq('id', id)
//   }

//   return (
//     <div className="space-y-6">
//       <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-100 rounded-lg">
//         <input 
//           className="flex-1 p-2 border rounded" 
//           placeholder="Title" 
//           value={title} 
//           onChange={e => setTitle(e.target.value)} 
//         />
//         <input 
//           className="flex-1 p-2 border rounded" 
//           placeholder="URL" 
//           value={url} 
//           onChange={e => setUrl(e.target.value)} 
//           required 
//         />
//         <button className="bg-black text-white px-4 py-2 rounded">Add</button>
//       </form>

//       <div className="space-y-3">
//         {bookmarks.map((b) => (
//           <div key={b.id} className="flex justify-between p-4 border rounded hover:shadow-md transition-shadow">
//             <div>
//               <p className="font-semibold">{b.title}</p>
//               <a href={b.url} target="_blank" className="text-sm text-blue-500 truncate block max-w-xs">{b.url}</a>
//             </div>
//             <button onClick={() => deleteBtn(b.id)} className="text-red-400 hover:text-red-600">Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkManager({ initialBookmarks, userId }: { initialBookmarks: any[], userId: string }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    console.log("userId:", userId)
    console.log("Initial bookmarks:", initialBookmarks)

    const channel = supabase
      .channel('realtime_bookmarks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookmarks',
        filter: `user_id=eq.${userId}` 
      }, (payload) => {
        console.log("Real-time update received:", payload)
        if (payload.eventType === 'INSERT') {
          setBookmarks(prev => [payload.new, ...prev])
        }
        if (payload.eventType === 'DELETE') {
          setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    const { error } = await supabase.from('bookmarks').insert([{ title: title || url, url, user_id: userId }])
    if (error) console.error("Insert error:", error)
    setTitle(''); setUrl('')
  }

  const deleteBtn = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error("Delete error:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">📌 Add New Bookmark</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Title <span className="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
              </label>
              <input 
                id="title"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                placeholder="e.g., GitHub, Stack Overflow" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                URL <span className="text-red-500">*</span>
              </label>
              <input 
                id="url"
                type="url"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="https://example.com" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              ➕ Add Bookmark
            </button>
          </form>
        </div>

        {/* Bookmarks List Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              📚 Your Bookmarks
              <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-lg rounded-full">
                {bookmarks.length}
              </span>
            </h2>
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-lg text-gray-500 dark:text-gray-400">No bookmarks yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add one above to get started! 👆</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div 
                  key={b.id} 
                  className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-bold text-gray-900 dark:text-white text-base truncate">{b.title}</p>
                    <a 
                      href={b.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline truncate block max-w-md mt-1 transition-colors"
                    >
                      {b.url}
                    </a>
                  </div>
                  <button 
                    onClick={() => deleteBtn(b.id)} 
                    className="ml-4 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 font-semibold flex-shrink-0"
                    aria-label="Delete bookmark"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}